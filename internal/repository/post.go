package repository

import (
	"database/sql"
	"net/http"

	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

type PostsMethods interface {
	CreatePost(post models.Post) models.Error
	GetUserId(token string)(int, models.Error)
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

// CreatePost requires the user to be logged in (verified by token)
func (r *PostRepository) CreatePost(post models.Post) models.Error {
	// Insert the post

	query := `
		INSERT INTO posts (user_id, title, content)
		VALUES (?, ?, ?)
		`
	res, err := r.db.Exec(query, post.UserID, post.Title, post.Content)
	if err != nil {
		logger.LogWithDetails(err)
		return models.Error{
			Message: "Internal Server Erorr",
			Code:    http.StatusInternalServerError,
		}
	}

	postID, err := res.LastInsertId()
	if err != nil {
		logger.LogWithDetails(err)
		return models.Error{
			Message: "Internal Server Erorr",
			Code:    http.StatusInternalServerError,
		}
	}

	// Insert categories
	for _, cat := range post.Categories {
		// Ensure category exists or insert it
		var categoryID int
		err := r.db.QueryRow("SELECT id FROM categories WHERE category_name = ?", cat).Scan(&categoryID)
		if err != nil {
			if err == sql.ErrNoRows {
				logger.LogWithDetails(err)
				return models.Error{
					Message: "Bad Request",
					Code:    http.StatusBadRequest,
				}
			}
			logger.LogWithDetails(err)
			return models.Error{
				Message: "Internal Server Erorr",
				Code:    http.StatusInternalServerError,
			}
		}

		// Link post and category
		_, err = r.db.Exec("INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)", postID, categoryID)
		if err != nil {
			logger.LogWithDetails(err)
			return models.Error{
				Message: "Internal Server Erorr",
				Code:    http.StatusInternalServerError,
			}
		}
	}

	// Return success message
	return models.Error{
		Message: "Post created successfully",
		Code:    http.StatusCreated,
	}
}

// CreatePost requires the user to be logged in (verified by token)
func (r *PostRepository) GetUserId(token string) (int,models.Error) {
	// Insert the post
	var userID int
	err := r.db.QueryRow("SELECT id FROM users WHERE session_token = ?", token).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			logger.LogWithDetails(err)
			return 0, models.Error{
				Message: "Bad Request",
				Code:    http.StatusBadRequest,
			}
		}
		logger.LogWithDetails(err)
		return 0, models.Error{
			Message: "Internal Server Erorr",
			Code:    http.StatusInternalServerError,
		}
	}
	// Return success message
	return userID, models.Error{
		Message: "User Id Found",
		Code:    http.StatusOK,
	}
}
