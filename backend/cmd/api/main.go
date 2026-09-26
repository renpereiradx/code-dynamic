// Placeholder backend Code Dynamic (Golang).
// En v1 el site es solo frontend. Este stub reserva la estructura
// para una futura API (contacto, blog, auth, etc.).
package main

import (
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok","service":"codedynamic-backend-stub"}`))
	})
	log.Println("codedynamic backend stub en :8080 (no usado en v1)")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
