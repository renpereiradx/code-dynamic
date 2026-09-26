// POST /api/contact — Pages Function (Cloudflare).
//
// Protección anti-spam/DDoS básico, todo en el edge sin servidor propio:
//   1. Validación de campos + honeypot (éxito falso a bots).
//   2. Rate limit por IP en KV (Cloudflare traslada la IP real en CF-Connecting-IP).
//   3. Turnstile verificado en servidor (si TURNSTILE_SECRET está definido).
//   4. Envío por Resend (si RESEND_API_KEY está definida).
//
// Variables (dashboard Pages → Settings → Environment variables):
//   RATE_KV            binding KV (namespace code-dynamic-rate) — rate limit global
//   TURNSTILE_SECRET   secreto del widget Turnstile (Encrypted)
//   RESEND_API_KEY     API key de Resend (Encrypted)
//   CONTACT_TO         destinatario (default codedynamicdev@gmail.com)
//   RESEND_FROM        remitente (default onboarding@resend.dev — plan free sin dominio)
//   RATE_LIMIT_MAX     máx/hora por IP (default 3)
//   RATE_LIMIT_WINDOW_S ventana en segundos (default 3600)
//
// NOTA: functions/ solo se despliega con builds conectados a Git.
// Con `wrangler pages deploy` directo NO se sube: conecta el repo en el
// dashboard (Settings → Builds → Connect to Git) para activar esta ruta.

interface Env {
  RATE_KV?: KVNamespace;
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  RESEND_FROM?: string;
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW_S?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fallback en memoria por isolate si KV no está enlazado (mejor que nada).
const mem = new Map<string, { count: number; reset: number }>();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function checkRateLimit(
  kv: KVNamespace | undefined,
  ip: string,
  max: number,
  windowS: number
): Promise<{ ok: boolean; retryAfterS: number }> {
  const now = Math.floor(Date.now() / 1000);
  if (kv) {
    const key = `rl:${ip}`;
    const raw = await kv.get(key);
    if (!raw) {
      await kv.put(key, JSON.stringify({ count: 1 }), { expirationTtl: windowS });
      return { ok: true, retryAfterS: 0 };
    }
    try {
      const rec = JSON.parse(raw) as { count: number };
      if (rec.count >= max) {
        return { ok: false, retryAfterS: windowS };
      }
      await kv.put(key, JSON.stringify({ count: rec.count + 1 }), { expirationTtl: windowS });
      return { ok: true, retryAfterS: 0 };
    } catch {
      return { ok: true, retryAfterS: 0 };
    }
  }
  const rec = mem.get(ip);
  if (!rec || rec.reset <= now) {
    mem.set(ip, { count: 1, reset: now + windowS });
    return { ok: true, retryAfterS: 0 };
  }
  if (rec.count >= max) return { ok: false, retryAfterS: rec.reset - now };
  rec.count += 1;
  return { ok: true, retryAfterS: 0 };
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const max = Math.max(1, parseInt(env.RATE_LIMIT_MAX ?? "3", 10) || 3);
  const windowS = Math.max(60, parseInt(env.RATE_LIMIT_WINDOW_S ?? "3600", 10) || 3600);
  const to = env.CONTACT_TO ?? "codedynamicdev@gmail.com";

  let body: { name?: string; email?: string; message?: string; _honey?: string; token?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  // Honeypot: éxito falso, sin pistas al bot.
  if (body._honey && String(body._honey).trim() !== "") {
    return json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return json({ error: "revisa los campos marcados" }, 400);
  }

  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown";

  const rl = await checkRateLimit(env.RATE_KV, ip, max, windowS);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "demasiadas solicitudes, inténtalo más tarde" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.max(1, rl.retryAfterS)),
        },
      }
    );
  }

  // Turnstile obligatorio solo si hay secreto configurado.
  if (env.TURNSTILE_SECRET) {
    const token = String(body.token ?? "");
    if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET, token, ip))) {
      return json({ error: "verificación anti-bots fallida, inténtalo de nuevo" }, 403);
    }
  }

  if (env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM ?? "Code Dynamic <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Nuevo contacto web: ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\n${message}\n`,
      }),
    });
    if (!res.ok) {
      return json({ error: "no se pudo enviar, inténtalo más tarde" }, 502);
    }
  }

  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  return onRequestPost(context);
};
