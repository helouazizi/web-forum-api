package utils

import (
	"encoding/json"
	"net/http"

	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

// Helper function to standardize error responses
func RespondWithError(w http.ResponseWriter, err models.Error) {
	response := map[string]any{
		"code":    err.Code,
		"message": err.Message,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(err.Code)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
	}
}

// Helper function to standardize JSON responses
func RespondWithJSON(w http.ResponseWriter, statusCode int, response any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		logger.LogWithDetails(err)
		RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
	}
}
