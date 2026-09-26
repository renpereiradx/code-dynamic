import type { Dict } from "./es";

export const en: Dict = {
  lang: "en" as const,
  nav: {
    services: "Services",
    process: "Process",
    stack: "Stack",
    work: "Work",
    contact: "Contact",
    cta: "Let's talk",
  },
  hero: {
    badge: "New · AI applied to product",
    titleA: "Software that feels",
    titleAccent: "as good as it looks.",
    sub: "Code Dynamic designs and builds web apps, mobile apps and AI-powered systems. Apple-grade minimalism, engineering precision, and a friendly touch of Google.",
    primary: "Start a project",
    secondary: "See services",
    note: "Reply within < 24 h · No commitment",
    stats: [
      { value: "10+", label: "years shipping software" },
      { value: "40+", label: "products launched" },
      { value: "<200ms", label: "interactions by default" },
    ],
    techLabel: "The stack we work with",
  },
  logos: ["Astro", "React", "TypeScript", "Tailwind", "Node.js", "Go", "PostgreSQL", "Docker"],
  services: {
    eyebrow: "Services",
    title: "Everything your product needs.",
    sub: "Six capabilities, one team. Demo content — we'll refine it with your real copy.",
    items: [
      {
        title: "Web applications",
        desc: "Fast platforms with Astro + React. SEO, i18n and green Core Web Vitals from day one.",
        tag: "Web",
        span: "large",
      },
      {
        title: "Mobile apps",
        desc: "Native and cross-platform experiences at a smooth 60 fps.",
        tag: "Mobile",
        span: "medium",
      },
      {
        title: "APIs & Cloud",
        desc: "Go backends, containerized infra and reproducible deploys.",
        tag: "Backend",
        span: "medium",
      },
      {
        title: "AI & Automation",
        desc: "Assistants, RAG, pipelines and agents that save real ops hours.",
        tag: "AI",
        span: "small",
      },
      {
        title: "UI / UX",
        desc: "Design systems, prototypes and motion with purpose.",
        tag: "Design",
        span: "small",
      },
      {
        title: "Support & Growth",
        desc: "Maintenance, observability and continuous improvement, no drama.",
        tag: "Care",
        span: "small",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "Simple, predictable, no smoke.",
    steps: [
      { n: "01", title: "Discover", desc: "One week to understand the problem, users and success metrics." },
      { n: "02", title: "Design", desc: "Clickable prototype and design system before serious code." },
      { n: "03", title: "Build", desc: "Weekly sprints with real demos and continuous releases." },
      { n: "04", title: "Scale", desc: "We measure, optimize and document everything for your team." },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "Modern where it matters, boring where it pays.",
    items: ["Astro", "React", "TypeScript", "Tailwind CSS", "Go", "PostgreSQL", "Docker", "Cloudflare"],
  },
  work: {
    eyebrow: "Work",
    title: "Outcomes before promises.",
    note: "Demo case studies — replaced by your real projects.",
    items: [
      { title: "B2B SaaS dashboard", desc: "Astro Islands migration: LCP −45%, INP < 150 ms.", tag: "SaaS" },
      { title: "Booking app", desc: "3-tap booking, +22% mobile conversion.", tag: "Mobile" },
      { title: "AI assistant", desc: "RAG over internal docs, −30 h/week of support.", tag: "AI" },
    ],
  },
  quotes: {
    eyebrow: "Quotes",
    title: "What they say when we ship.",
    note: "Demo testimonials.",
    items: [
      { quote: "They shipped in six weeks what others estimated in six months.", author: "CEO, fictional SaaS" },
      { quote: "The site loads instantly and feels premium in every detail.", author: "Founder, fictional startup" },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us what you want to build.",
    sub: "Write to codedynamicdev@gmail.com or leave a message (demo: not sent anywhere in v1).",
    email: "codedynamicdev@gmail.com",
    form: {
      name: "Name",
      email: "Email",
      message: "Tell us about the project…",
      send: "Send message",
      sending: "Sending…",
      ok: "Received! We'll reply within 24 h. (local demo)",
      error: "Please check the highlighted fields.",
    },
  },
  footer: {
    tagline: "Software development studio. Apple design, Google friendliness.",
    sections: "Sections",
    contactTitle: "Contact",
    demo: "v1 demo site · ES/EN · Dark-first",
    rights: "© 2026 Code Dynamic. All rights reserved.",
  },
};
