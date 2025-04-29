package repository

import (
	"database/sql"
	"net/http"

	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

type PostsMethods interface {
	CreatePost(models.Post) models.Error
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

// CreatePost requires the user to be logged in (verified by token)
func (r *PostRepository) CreatePost(post models.Post) models.Error {
	// Validate the post fields (e.g., check for empty title/content)
	if post.Title == "" || post.Content == "" {
		return models.Error{
			Message: "Title and content cannot be empty",
			Code:    http.StatusBadRequest,
		}
	}

	// Insert the post into the database
	query := `
		INSERT INTO posts (user_id, title, content, created_at, updated_at)
		VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`
	_, err := r.db.Exec(query, post.UserID, post.Title, post.Content)
	if err != nil {
		logger.LogWithDetails(err)
		return models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	// Return success message
	return models.Error{
		Message: "Post created successfully",
		Code:    http.StatusCreated,
	}
}
