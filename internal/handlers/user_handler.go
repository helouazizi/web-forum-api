package handlers

import (
	"encoding/json"
	"net/http"

	"web-forum/internal/models"
	"web-forum/internal/services"
	"web-forum/pkg/logger"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		logger.LogWithDetails(err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	createdUser, err := h.userService.CreateUser(user)
	if err != nil {
		logger.LogWithDetails(err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdUser)
}
