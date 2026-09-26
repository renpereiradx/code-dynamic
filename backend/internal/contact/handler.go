// Package contact implementa el handler de POST /api/contact:
// valida, aplica rate limit por IP y envía el email.
package contact

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"codedynamic/backend/internal/mailer"
	"codedynamic/backend/internal/ratelimit"
)

var emailRe = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

// Request es el payload JSON del formulario.
type Request struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Honey   string `json:"_honey"` // honeypot: los bots lo rellenan, humanos no
}

// Handler agrupa dependencias del endpoint.
type Handler struct {
	Limiter *ratelimit.Limiter
	Mailer  *mailer.Mailer
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

// clientIP extrae la IP real tras proxies (X-Forwarded-For de Render/Fly)
// o cae a RemoteAddr. Solo confía en XFF porque el backend vive tras proxy.
func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if ip, _, _ := strings.Cut(xff, ","); ip != "" {
			return strings.TrimSpace(ip)
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// ServeHTTP implementa POST /api/contact.
func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	ip := clientIP(r)
	if ok, retry := h.Limiter.Allow(ip); !ok {
		w.Header().Set("Retry-After", strconv.Itoa(int(retry.Seconds())+1))
		writeJSON(w, http.StatusTooManyRequests, map[string]string{
			"error": fmt.Sprintf("demasiadas solicitudes, reintenta en %s", retry),
		})
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 8<<10) // 8 KB máx
	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "JSON inválido"})
		return
	}

	// Honeypot: si viene relleno es un bot → éxito falso (no le damos pistas).
	if strings.TrimSpace(req.Honey) != "" {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)

	if len(req.Name) < 2 || !emailRe.MatchString(req.Email) || len(req.Message) < 10 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "revisa los campos marcados"})
		return
	}

	if err := h.Mailer.SendContact(req.Name, req.Email, req.Message); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "no se pudo enviar, inténtalo más tarde"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}
