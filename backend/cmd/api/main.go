// Command api levanta el backend de Code Dynamic.
//
// Endpoints:
//   GET  /health       → {"status":"ok"} (para health checks del hosting)
//   POST /api/contact  → formulario de contacto con rate limit por IP
//
// Configuración (variables de entorno):
//   PORT                 puerto (default 8080)
//   ALLOWED_ORIGINS      orígenes CORS separados por coma
//                        (default https://code-dynamic.pages.dev)
//   CONTACT_TO           destinatario (default codedynamicdev@gmail.com)
//   SMTP_HOST/PORT/USER/PASS/FROM  credenciales SMTP
//                        (Gmail: smtp.gmail.com:587 + App Password)
//   MAIL_DRY_RUN         true = no envía email, solo log (default false)
//   RATE_LIMIT_MAX       máx peticiones por ventana e IP (default 3)
//   RATE_LIMIT_WINDOW    ventana (default 1h; formatos Go: 30m, 1h…)
//   MAX_BODY_BYTES       se fija en 8 KB en el handler
package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"codedynamic/backend/internal/contact"
	"codedynamic/backend/internal/mailer"
	"codedynamic/backend/internal/ratelimit"
)

func env(key, def string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return def
}

func envInt(key string, def int) int {
	if v, err := strconv.Atoi(env(key, "")); err == nil && v > 0 {
		return v
	}
	return def
}

func envDuration(key string, def time.Duration) time.Duration {
	if v, err := time.ParseDuration(env(key, "")); err == nil && v > 0 {
		return v
	}
	return def
}

// cors permite solo los orígenes configurados (el website + localhost dev).
func cors(allowed []string, next http.Handler) http.Handler {
	set := make(map[string]bool, len(allowed))
	for _, o := range allowed {
		if o = strings.TrimSpace(o); o != "" {
			set[o] = true
		}
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if set[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	limiter := ratelimit.New(
		envInt("RATE_LIMIT_MAX", 3),
		envDuration("RATE_LIMIT_WINDOW", time.Hour),
	)
	defer limiter.Close()

	m, err := mailer.New(mailer.Config{
		Host:   env("SMTP_HOST", "smtp.gmail.com"),
		Port:   env("SMTP_PORT", "587"),
		User:   env("SMTP_USER", ""),
		Pass:   env("SMTP_PASS", ""),
		From:   env("SMTP_FROM", ""),
		To:     env("CONTACT_TO", "codedynamicdev@gmail.com"),
		DryRun: strings.EqualFold(env("MAIL_DRY_RUN", "false"), "true"),
	})
	if err != nil {
		log.Fatalf("mailer: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})
	mux.Handle("/api/contact", &contact.Handler{Limiter: limiter, Mailer: m})

	allowed := strings.Split(env("ALLOWED_ORIGINS", "https://code-dynamic.pages.dev"), ",")
	port := env("PORT", "8080")
	log.Printf("codedynamic backend en :%s (orígenes: %s)", port, strings.Join(allowed, ","))
	log.Fatal(http.ListenAndServe(":"+port, cors(allowed, mux)))
}
