package services

import (
	"net/http"

	"web-forum/internal/models"
	"web-forum/internal/repository"
)

type UserService struct {
	repo repository.UserMethods
}

func NewUserService(repo repository.UserMethods) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user models.User) (models.User, models.Error) {
	User, err := s.repo.CreateUser(user)
	if err.Code != http.StatusCreated {
		return models.User{}, err
	}
	return User, err
}

//	func (s *UserService) UpdateUser(user models.User) (models.User, models.Error) {
//		User, err := s.repo.UpdateUser(user)
//		if err.Code != http.StatusOK {
//			return models.User{}, err
//		}
//		return User, models.Error{
//			Message: "seccefully updated information",
//			Code:    http.StatusOK, // 200
//		}
//	}
func (s *UserService) Login(user models.UserLogin) (models.UserLogin, models.Error) {
	User, err := s.repo.Login(user)
	if err.Code != http.StatusOK {
		return models.UserLogin{}, err
	}
	return User, err
}

// Implement other methods...
