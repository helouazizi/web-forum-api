package handlers

import (
	"net/http"

	"web-forum/internal/services"
	"web-forum/internal/utils"
)

type HomeHandler struct {
	HomeService *services.HomeService
}

func NewHomeHandler(HomeService *services.HomeService) *HomeHandler {
	return &HomeHandler{HomeService: HomeService}
}

func (h *HomeHandler) Home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		// utils.RespondWithError(w, models.Error{Message: "Page Not Found", Code: http.StatusNotFound})
		return
	}
	if r.Method != http.MethodGet {
		// utils.RespondWithError(w, models.Error{Message: "Method Not Allowed", Code: http.StatusMethodNotAllowed})
		return
	}
	Posts, err := h.HomeService.Home()
	if err.Code != http.StatusOK {
		// utils.RespondWithError(w, models.Error{
		// 	Message: "Internal server error",
		// 	Code:    http.StatusInternalServerError,
		// })
	}
	utils.RespondWithJSON(w, http.StatusOK, Posts)
}
