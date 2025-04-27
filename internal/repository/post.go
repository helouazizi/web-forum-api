package repository

import (
	"database/sql"
	"net/http"
	"time"
	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

// CreatePost requires the user to be logged in (verified by token)
func (r *PostRepository) CreatePost(post models.Post) (models.Post, models.Error) {
	query := `
		INSERT INTO posts (user_id, title, content, created_at, updated_at)
		VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`
	result, err := r.db.Exec(query, post.UserID, post.Title, post.Content)
	if err != nil {
		logger.LogWithDetails(err)
		return models.Post{}, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	postID, err := result.LastInsertId()
	if err != nil {
		logger.LogWithDetails(err)
		return models.Post{}, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	return models.Post{
		ID:        int(postID),
		UserID:    post.UserID,
		Title:     post.Title,
		Content:   post.Content,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, models.Error{Message: "Post created successfully", Code: http.StatusCreated}
}
