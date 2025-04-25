package services

import (
	"web-forum/internal/models"
	"web-forum/internal/repository"
)

type UserService struct {
	repo repository.UserMethods
}

func NewUserService(repo repository.UserMethods) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user models.User) (models.User, error) {
	return s.repo.CreateUser(user)
}

// Implement other methods...
