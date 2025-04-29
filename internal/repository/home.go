package repository

import (
	"database/sql"
	"net/http"

	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

type Home interface {
	FetchAllPosts() ([]models.Post, models.Error)
}
type HomeRepository struct {
	db *sql.DB
}

func NewHomeRepository(db *sql.DB) *HomeRepository {
	return &HomeRepository{db: db}
}

func (r *HomeRepository) FetchAllPosts() ([]models.Post, models.Error) {
	rows, err := r.db.Query(`SELECT id, user_id, title, content, created_at, updated_at, total_likes, total_dislikes, total_comments FROM posts ORDER BY created_at DESC`)
	if err != nil {
		logger.LogWithDetails(err)
		return nil, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Title,
			&post.Content,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.TotalLikes,
			&post.TotalDislikes,
			&post.TotalComments)
		if err != nil {
			logger.LogWithDetails(err)
			return nil, models.Error{
				Message: "Internal server error",
				Code:    http.StatusInternalServerError,
			}
		}
		posts = append(posts, post)
	}
	return posts, models.Error{
		Message: "seccefully fetched data",
		Code:    http.StatusOK,
	}
}
