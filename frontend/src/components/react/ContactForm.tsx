import { useState } from "react";

// Envío real vía FormSubmit (gratis, sin backend propio).
// El primer envío requiere activar el buzón: FormSubmit manda un email
// de confirmación a codedynamicdev@gmail.com — hay que abrirlo y clicar
// "Activate" una sola vez. A partir de ahí, todo mensaje llega directo.
const ENDPOINT = "https://formsubmit.co/ajax/codedynamicdev@gmail.com";

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

export default function ContactForm({ labels }: { labels: Labels }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `Nuevo contacto web: ${name.trim()}`,
          _template: "table",
          _honey: "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
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
