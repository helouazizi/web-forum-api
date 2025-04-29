package services

import (
	"web-forum/internal/models"
	"web-forum/internal/repository"
)

type PostService struct {
	repo repository.PostsMethods
}

func NewPostService(repo repository.PostsMethods) *PostService {
	return &PostService{repo: repo}
}

func (s *PostService) CreatePost(post models.Post) models.Error {
	
	return  s.repo.CreatePost(post)
}
