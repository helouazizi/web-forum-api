package handlers

import "net/http"

func Home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("PAGE NOT FOUND"))
		return
	}
	
}
