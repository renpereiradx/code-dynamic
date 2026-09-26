# Backend (futuro — Golang)

Stub intencional. El website v1 es 100% frontend estático.

Estructura reservada:

```
backend/
├── cmd/api/main.go   # entrypoint futuro (health check stub)
├── internal/         # (crear cuando se necesite: handlers, services)
└── go.mod
```

Cuando se active: `go run ./cmd/api` → `GET :8080/health`.
