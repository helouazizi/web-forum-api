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
		utils.RespondWithJSON(w, http.StatusMethodNotAllowed, models.Error{Message: "Methos Not Allowed", Code: http.StatusMethodNotAllowed})
		return
	}
	var Post models.Post
	if err := json.NewDecoder(r.Body).Decode(&Post); err != nil {
		logger.LogWithDetails(err)
		utils.RespondWithJSON(w, http.StatusBadRequest, models.Error{Message: "Bad Request", Code: http.StatusBadRequest})
		return
	}
	// lets validate the post input
	err := utils.ValidPostInputs(Post)
	if err.UserErrors.HasError {
		logger.LogWithDetails(fmt.Errorf("invalid post input"))
		utils.RespondWithJSON(w, http.StatusBadRequest, err)
		return
	}

	// lets get the user id
	token, err := utils.GetToken(r, "Token")
	if err.Code != http.StatusOK {
		utils.RespondWithJSON(w, err.Code, err)
		return
	}

	userId, err := h.PostService.GetUserID(token)
	if err.Code != http.StatusOK {
		logger.LogWithDetails(fmt.Errorf(err.Message))
		utils.RespondWithJSON(w, err.Code, err)
		return
	}
	Post.UserID = userId
	
	err1 := h.PostService.CreatePost(Post)
	if err1.Code != http.StatusCreated {
		logger.LogWithDetails(fmt.Errorf(err.Message))
		// utils.RespondWithError(w, err)
		return
	}
	// our response
	utils.RespondWithJSON(w, http.StatusCreated, models.SuccesMessage{Message: "Post created successfully"})
}
