// Package mailer envía emails vía SMTP con stdlib (net/smtp).
// Soporta modo dry-run (MAIL_DRY_RUN=true) que solo registra el mensaje,
// útil para desarrollo y CI sin credenciales.
package mailer

import (
	"fmt"
	"log"
	"net/smtp"
	"strings"
)

// Config agrupa las credenciales SMTP (vía variables de entorno).
type Config struct {
	Host   string // p. ej. smtp.gmail.com
	Port   string // p. ej. 587
	User   string // usuario SMTP (con Gmail: tu dirección)
	Pass   string // password (con Gmail: App Password, no tu clave)
	From   string // remitente visible
	To     string // destinatario (codedynamicdev@gmail.com)
	DryRun bool   // true = no envía, solo log
}

// Mailer envía correos de contacto.
type Mailer struct {
	cfg Config
}

// New valida la config mínima (salvo en dry-run) y devuelve un Mailer.
func New(cfg Config) (*Mailer, error) {
	if cfg.To == "" {
		return nil, fmt.Errorf("CONTACT_TO vacío")
	}
	if !cfg.DryRun && (cfg.Host == "" || cfg.User == "" || cfg.Pass == "") {
		return nil, fmt.Errorf("falta config SMTP (SMTP_HOST/USER/PASS) o activa MAIL_DRY_RUN=true")
	}
	return &Mailer{cfg: cfg}, nil
}

// SendContact envía un mensaje del formulario (reply-to = email del visitante).
func (m *Mailer) SendContact(name, email, message string) error {
	subject := fmt.Sprintf("Nuevo contacto web: %s", name)
	body := fmt.Sprintf("Nombre: %s\r\nEmail: %s\r\n\r\n%s\r\n", name, email, message)

	if m.cfg.DryRun {
		log.Printf("[mailer dry-run] to=%s subject=%q body=%q", m.cfg.To, subject, body)
		return nil
	}

	from := m.cfg.From
	if from == "" {
		from = m.cfg.User
	}
	headers := map[string]string{
		"From":         from,
		"To":           m.cfg.To,
		"Reply-To":     email,
		"Subject":      subject,
		"MIME-Version": "1.0",
		"Content-Type": "text/plain; charset=UTF-8",
	}
	var sb strings.Builder
	for k, v := range headers {
		fmt.Fprintf(&sb, "%s: %s\r\n", k, v)
	}
	sb.WriteString("\r\n" + body)

	addr := m.cfg.Host + ":" + m.cfg.Port
	auth := smtp.PlainAuth("", m.cfg.User, m.cfg.Pass, m.cfg.Host)
	if err := smtp.SendMail(addr, auth, from, []string{m.cfg.To}, []byte(sb.String())); err != nil {
		return fmt.Errorf("smtp: %w", err)
	}
	return nil
}
