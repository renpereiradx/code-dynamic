import { useEffect, useRef, useState } from "react";

// Ruta de envío:
//   1. /api/contact (Pages Function en nuestro dominio: rate limit + Turnstile + Resend).
//      Requiere builds conectados a Git; con deploy directo manual devuelve 404.
//   2. Fallback temporal: FormSubmit directo (quitar cuando la Function esté verificada).
const BACKEND_URL = "/api/contact";
const FALLBACK_URL = "https://formsubmit.co/ajax/codedynamicdev@gmail.com";

const SITEKEY = (import.meta.env as unknown as Record<string, string | undefined>)
  .PUBLIC_TURNSTILE_SITEKEY;

type Labels = {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  ok: string;
  error: string;
  sendError: string;
};

type Status = "idle" | "sending" | "ok" | "error" | "sendError";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => void;
    };
  }
}

function TurnstileWidget({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!SITEKEY) return;
    const render = () => {
      if (!window.turnstile || !ref.current || ref.current.dataset.done) return;
      ref.current.dataset.done = "1";
      window.turnstile.render(ref.current, {
        sitekey: SITEKEY,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    if (window.turnstile) {
      render();
    } else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    }
  }, [onToken]);
  if (!SITEKEY) return null;
  return <div ref={ref} className="mt-1" />;
}

async function postJSON(url: string, payload: Record<string, string>): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
}

export default function ContactForm({ labels }: { labels: Labels }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid =
      name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      message.trim().length >= 10;
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      _honey: "",
      token,
    };
    // 1) Backend propio (rate limit + Turnstile + Resend).
    try {
      const res = await postJSON(BACKEND_URL, payload);
      if (res.ok) {
        setStatus("ok");
        setName("");
        setEmail("");
        setMessage("");
        setToken("");
        return;
      }
      // 404 = Function aún no desplegada (falta conectar Git) → fallback.
      // 400/403/429/5xx = respuesta real del backend, no reintentar por otro lado.
      if (res.status !== 404) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        void data;
        setStatus(res.status === 400 ? "error" : "sendError");
        return;
      }
    } catch {
      // Sin red / backend caído → fallback.
    }
    // 2) Fallback temporal FormSubmit.
    try {
      const res = await postJSON(FALLBACK_URL, {
        ...payload,
        _subject: `Nuevo contacto web: ${name.trim()}`,
        _template: "table",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      setToken("");
    } catch {
      setStatus("sendError");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="surface grid gap-4 rounded-3xl p-6 sm:p-8">
      <div>
        <label htmlFor="cd-name" className="mb-1.5 block text-sm font-medium">
          {labels.name}
        </label>
        <input
          id="cd-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          style={{ borderColor: "var(--line)" }}
          placeholder="Ada Lovelace"
        />
      </div>
      <div>
        <label htmlFor="cd-email" className="mb-1.5 block text-sm font-medium">
          {labels.email}
        </label>
        <input
          id="cd-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          style={{ borderColor: "var(--line)" }}
          placeholder="ada@empresa.com"
        />
      </div>
      <div>
        <label htmlFor="cd-msg" className="mb-1.5 block text-sm font-medium">
          {labels.message}
        </label>
        <textarea
          id="cd-msg"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-xl border bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>
      {/* Honeypot anti-spam: invisible para humanos */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        defaultValue=""
      />
      <TurnstileWidget onToken={setToken} />
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-[#FF9F0A]">
          {labels.error}
        </p>
      )}
      {status === "sendError" && (
        <p role="alert" className="text-sm font-medium text-[#FF9F0A]">
          {labels.sendError}
        </p>
      )}
      {status === "ok" && (
        <p role="status" className="text-sm font-medium text-[#34C759]">
          {labels.ok}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[.98] disabled:opacity-60"
        style={{ background: "var(--accent)" }}
      >
        {status === "sending" ? labels.sending : labels.send}
      </button>
    </form>
  );
}
