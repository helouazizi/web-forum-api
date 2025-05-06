package repository

import (
	"database/sql"
	"fmt"
	"net/http"

	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

type PostsMethods interface {
	CreatePost(post models.Post) models.Error
	GetUserId(token string) (int, models.Error)
	ReactToPost(token string, post models.PostReaction) models.Error
	AddComment(token string, reaction models.PostReaction) models.Error
	GetCommentsByPostID(postId int) ([]models.PostComments, models.Error)
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
func (r *PostRepository) GetUserId(token string) (int, models.Error) {
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

// CreatePost requires the user to be logged in (verified by token)
func (r *PostRepository) ReactToPost(token string, reaction models.PostReaction) models.Error {
	userId, err1 := r.GetUserId(token)
	if err1.Code != http.StatusOK {
		logger.LogWithDetails(fmt.Errorf(err1.Message))
		return models.Error{Message: "no user found", Code: http.StatusInternalServerError}
	}
	var existingReaction string
	err := r.db.QueryRow(`
		SELECT reaction FROM post_reactions 
		WHERE user_id = ? AND post_id = ?
	`, userId, reaction.PostID).Scan(&existingReaction)

	if err == sql.ErrNoRows {
		// INSERT new reaction
		_, err := r.db.Exec(`
			INSERT INTO post_reactions (user_id, post_id, reaction)
			VALUES (?, ?, ?)
		`, userId, reaction.PostID, reaction.Reaction)
		if err != nil {
			logger.LogWithDetails(err)
			return models.Error{Message: "Could not add reaction", Code: http.StatusInternalServerError}
		}
	} else if err == nil {
		if existingReaction == reaction.Reaction {
			// User clicked same reaction again → REMOVE reaction
			_, err := r.db.Exec(`
				DELETE FROM post_reactions WHERE user_id = ? AND post_id = ?
			`, userId, reaction.PostID)
			if err != nil {
				logger.LogWithDetails(err)
				return models.Error{Message: "Could not remove reaction", Code: http.StatusInternalServerError}
			}
		} else {
			// UPDATE reaction
			_, err := r.db.Exec(`
				UPDATE post_reactions 
				SET reaction = ?
				WHERE user_id = ? AND post_id = ?
			`, reaction.Reaction, userId, reaction.PostID)
			if err != nil {
				logger.LogWithDetails(err)
				return models.Error{Message: "Could not update reaction", Code: http.StatusInternalServerError}
			}
		}
	} else {
		logger.LogWithDetails(err)
		return models.Error{Message: "DB error", Code: http.StatusInternalServerError}
	}

	// Triggers will automatically update total_likes/dislikes
	return models.Error{Message: "Reaction updated", Code: http.StatusOK}
}

func (r *PostRepository) AddComment(token string, reaction models.PostReaction) models.Error {
	// Get user ID from token
	userId, err1 := r.GetUserId(token)
	if err1.Code != http.StatusOK {
		logger.LogWithDetails(fmt.Errorf("failed to get user from token: %s", err1.Message))
		return models.Error{Message: "No user found", Code: http.StatusUnauthorized}
	}

	// Prepare SQL INSERT query
	query := `INSERT INTO post_comments (post_id, user_id, comment) VALUES (?, ?, ?)`
	_, err := r.db.Exec(query, reaction.PostID, userId, reaction.Comment)
	if err != nil {
		logger.LogWithDetails(fmt.Errorf("failed to insert comment: %v", err))
		return models.Error{Message: "Failed to add comment", Code: http.StatusInternalServerError}
	}

	query1 := `UPDATE posts SET total_comments = total_comments + 1 WHERE id = ?`
	_, err = r.db.Exec(query1, reaction.PostID)
	if err != nil {
		logger.LogWithDetails(fmt.Errorf("failed to insert comment: %v", err))
		return models.Error{Message: "Failed to add comment", Code: http.StatusInternalServerError}
	}
	return models.Error{Message: "Comment added successfully", Code: http.StatusOK}
}

func (r *PostRepository) GetCommentsByPostID(postId int) ([]models.PostComments, models.Error) {
	query := `SELECT c.id, c.comment, c.created_at, u.nickname
			  FROM post_comments c
			  JOIN users u ON c.user_id = u.id
			  WHERE c.post_id = ?
			  ORDER BY c.created_at ASC`

	rows, err := r.db.Query(query, postId)
	if err != nil {
		logger.LogWithDetails(fmt.Errorf("failed to query comments: %v", err))
		return []models.PostComments{}, models.Error{Message: "Failed to fetch comments", Code: http.StatusInternalServerError}
	}
	defer rows.Close()

	var comments []models.PostComments
	for rows.Next() {
		var comment models.PostComments
		err := rows.Scan(&comment.Id, &comment.Content, &comment.CreatedAt, &comment.Creator)
		if err != nil {
			logger.LogWithDetails(fmt.Errorf("failed to scan comment: %v", err))
			return []models.PostComments{}, models.Error{Message: "Failed to read comments", Code: http.StatusInternalServerError}
		}
		comments = append(comments, comment)
	}

	return comments, models.Error{Code: http.StatusOK}
}
