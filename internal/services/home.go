package services

import (
	"net/http"

	"web-forum/internal/models"
	"web-forum/internal/repository"
)

type HomeService struct {
	repo repository.Home
}

func NewHomeService(repo repository.Home) *HomeService {
	return &HomeService{repo: repo}
}

func (s *HomeService) Home() ([]models.Post, models.Error) {
	Posts, err := s.repo.FetchAllPosts()
	if err.Code != http.StatusOK {
		return nil, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}
	return Posts, models.Error{
		Message: "seccefully fetched data",
		Code:    http.StatusOK,
	}
}
