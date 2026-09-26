# Backend — Code Dynamic (Golang, stdlib)

API del formulario de contacto con **rate limiting por IP** (anti-spam/DDoS básico),
validación, honeypot y envío por SMTP.

```
backend/
├── cmd/api/main.go            # entrypoint: /health, /api/contact, CORS
├── internal/
│   ├── contact/handler.go     # validación + rate limit + envío
│   ├── ratelimit/limiter.go   # ventana fija por IP (stdlib)
│   └── mailer/mailer.go       # SMTP + dry-run
└── go.mod                     # sin dependencias externas
```

## Desarrollo local

```bash
cd backend
MAIL_DRY_RUN=true ALLOWED_ORIGINS=http://localhost:4321 go run ./cmd/api
# otro terminal:
curl localhost:8080/health
curl -X POST localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@empresa.com","message":"Hola, quiero un proyecto"}'
```

## Variables de entorno

| Var | Default | Nota |
|---|---|---|
| `PORT` | `8080` | El hosting (Render/Fly) inyecta el suyo |
| `ALLOWED_ORIGINS` | `https://code-dynamic.pages.dev` | Añade `http://localhost:4321` en dev |
| `CONTACT_TO` | `codedynamicdev@gmail.com` | Destinatario |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.gmail.com` / `587` | — |
| `SMTP_USER` / `SMTP_PASS` | — | Gmail: tu dirección + **App Password** (no tu clave) |
| `SMTP_FROM` | = `SMTP_USER` | Remitente visible |
| `MAIL_DRY_RUN` | `false` | `true` = loguea sin enviar |
| `RATE_LIMIT_MAX` | `3` | Peticiones por ventana e IP |
| `RATE_LIMIT_WINDOW` | `1h` | Formatos Go (`30m`, `1h`) |

### Gmail App Password (2 min)

1. Activa verificación en 2 pasos en tu cuenta Google.
2. https://myaccount.google.com/apppasswords → crea una para "Correo".
3. Usa esos 16 caracteres como `SMTP_PASS`.

## Rate limiting

Ventana fija en memoria: `RATE_LIMIT_MAX` peticiones por `RATE_LIMIT_WINDOW`
por IP (respeta `X-Forwarded-For` tras proxy). Excedido → `429 + Retry-After`.
El honeypot (`_honey`) devuelve éxito falso a bots sin revelar nada.
