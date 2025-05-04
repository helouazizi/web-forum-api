package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"web-forum/internal/models"
	"web-forum/internal/services"
	"web-forum/internal/utils"
	"web-forum/pkg/logger"
)

type PostHandler struct {
	PostService *services.PostService
}

func NewPostHandler(PostService *services.PostService) *PostHandler {
	return &PostHandler{PostService: PostService}
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		// utils.RespondWithError(w, models.Error{Message: "Method Not Allowed", Code: http.StatusMethodNotAllowed})
		return
	}
	var Post models.Post
	if err := json.NewDecoder(r.Body).Decode(&Post); err != nil {
		logger.LogWithDetails(err)
		// utils.RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
		return
	}
	// lets validate the post input
	err := utils.ValidPostInputs(Post)
	if err.UserErrors.HasError {
		logger.LogWithDetails(fmt.Errorf("invalid post input"))
		// utils.RespondWithError(w, models.Error{Message: "Bad Request", Code: http.StatusBadRequest,UserErrors: err.UserErrors})
		return

	}

	err1 := h.PostService.CreatePost(Post)
	if err1.Code != http.StatusCreated {
		logger.LogWithDetails(fmt.Errorf(err.Message))
		// utils.RespondWithError(w, err)
		return
	}
	// our response
	utils.RespondWithJSON(w, http.StatusCreated, models.SuccesMessage{Message: "Post created successfully"})
}
