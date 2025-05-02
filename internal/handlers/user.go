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

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.RespondWithError(w, models.Error{Message: "Method Not Allowed", Code: http.StatusMethodNotAllowed})
		return
	}
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		logger.LogWithDetails(err)
		utils.RespondWithError(w, models.Error{Message: "Bad Request", Code: http.StatusBadRequest})
		return
	}

	// lets validate the user inputs
	userError := utils.ValidateUserInputs(user)
	if userError.HasError {
		logger.LogWithDetails(fmt.Errorf("invalid user credentials"))
		utils.RespondWithJSON(w, http.StatusBadRequest, userError)
		return
	}

	_, err := h.userService.CreateUser(user)
	if err.Code != http.StatusCreated {
		logger.LogWithDetails(fmt.Errorf(err.Message))
		utils.RespondWithError(w, err)
		return
	}

	// our response
	utils.RespondWithJSON(w, http.StatusCreated, models.SuccesMessage{Message: "Seccefully created your account"})
}

// func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		utils.RespondWithError(w, models.Error{Message: "Methos Not Allowed", Code: http.StatusMethodNotAllowed})
// 		return
// 	}
// 	var user models.User
// 	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
// 		logger.LogWithDetails(err)
// 		utils.RespondWithError(w, models.Error{Message: "Bad Request", Code: http.StatusBadRequest})
// 		return
// 	}
// 	updatedUser, err := h.userService.UpdateUser(user)
// 	if err.Code != http.StatusOK {
// 		logger.LogWithDetails(fmt.Errorf(err.Message))
// 		utils.RespondWithError(w, err)
// 		return
// 	}
// 	utils.RespondWithJSON(w, http.StatusCreated, updatedUser)
// }

// func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		utils.RespondWithError(w, models.Error{Message: "Methos Not Allowed", Code: http.StatusMethodNotAllowed})
// 		return
// 	}
// 	var user models.User
// 	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
// 		logger.LogWithDetails(err)
// 		utils.RespondWithError(w, models.Error{Message: "Bad Request", Code: http.StatusBadRequest})
// 		return
// 	}
// 	LogedUser, err := h.userService.Login(user)
// 	if err.Code != http.StatusOK {
// 		logger.LogWithDetails(fmt.Errorf(err.Message))
// 		utils.RespondWithError(w, err)
// 		return
// 	}
// 	utils.RespondWithJSON(w, http.StatusOK, LogedUser)
// }
