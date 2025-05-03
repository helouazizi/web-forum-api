package middlewares

import (
	"database/sql"
	"fmt"
	"net/http"
	"web-forum/internal/models"
	"web-forum/internal/utils"
	"web-forum/pkg/logger"
)

func AuthMiddleware(next http.Handler, db *sql.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("Token")
		if err != nil {
			logger.LogWithDetails(fmt.Errorf("token Not Found"))
			utils.RespondWithError(w, models.Error{Message: "Token Not Found", Code: http.StatusNotFound})
			return
		}
		token := cookie.Value
		query := `
			SELECT COUNT(*) FROM users
			WHERE session_token = ? 
	    `
		var count int
		err1 := db.QueryRow(query, token).Scan(&count)
		if err1 != nil {
			logger.LogWithDetails(fmt.Errorf("dabase cant found Token"))
			utils.RespondWithError(w, models.Error{Message: "Dabase cant found Token", Code: http.StatusInternalServerError})
			return
		}

		if count == 0 {
			logger.LogWithDetails(fmt.Errorf("token Not Found"))
			utils.RespondWithError(w, models.Error{Message: "Token Not Found", Code: http.StatusNotFound})
			return
		}
		
		next.ServeHTTP(w, r)
	})
}
