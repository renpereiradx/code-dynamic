// Package ratelimit implementa un limitador de tasa por IP de ventana fija,
// solo con stdlib. Pensado para frenar spam/abusos en endpoints públicos
// como /api/contact (p. ej. 3 peticiones/hora por IP).
package ratelimit

import (
	"sync"
	"time"
)

// Limiter guarda contadores por IP con expiración por ventana.
type Limiter struct {
	mu     sync.Mutex
	hits   map[string][]time.Time
	max    int
	window time.Duration
	stop   chan struct{}
}

// New crea un Limiter que permite max peticiones por window por IP.
func New(max int, window time.Duration) *Limiter {
	if max <= 0 {
		max = 3
	}
	if window <= 0 {
		window = time.Hour
	}
	l := &Limiter{
		hits:   make(map[string][]time.Time),
		max:    max,
		window: window,
		stop:   make(chan struct{}),
	}
	go l.cleanupLoop()
	return l
}

// Allow registra una petición de ip y dice si pasa.
// Si no pasa, devuelve además cuánto debe esperar antes de reintentar.
func (l *Limiter) Allow(ip string) (bool, time.Duration) {
	now := time.Now()
	cutoff := now.Add(-l.window)

	l.mu.Lock()
	defer l.mu.Unlock()

	valid := l.hits[ip][:0]
	var oldest time.Time
	for _, t := range l.hits[ip] {
		if t.After(cutoff) {
			valid = append(valid, t)
			if oldest.IsZero() || t.Before(oldest) {
				oldest = t
			}
		}
	}
	if len(valid) >= l.max {
		return false, oldest.Add(l.window).Sub(now).Round(time.Second)
	}
	l.hits[ip] = append(valid, now)
	return true, 0
}

// Close detiene la goroutine de limpieza.
func (l *Limiter) Close() { close(l.stop) }

func (l *Limiter) cleanupLoop() {
	t := time.NewTicker(l.window)
	defer t.Stop()
	for {
		select {
		case <-t.C:
			now := time.Now()
			cutoff := now.Add(-l.window)
			l.mu.Lock()
			for ip, times := range l.hits {
				kept := times[:0]
				for _, ts := range times {
					if ts.After(cutoff) {
						kept = append(kept, ts)
					}
				}
				if len(kept) == 0 {
					delete(l.hits, ip)
				} else {
					l.hits[ip] = kept
				}
			}
			l.mu.Unlock()
		case <-l.stop:
			return
		}
	}
}
