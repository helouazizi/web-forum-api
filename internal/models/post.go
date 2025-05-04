package models

import "time"

type Post struct {
	ID            int       `json:"id"`
	UserID        int       `json:"user_id"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	TotalLikes    int       `json:"total_likes"`
	TotalDislikes int       `json:"total_dislikes"`
	TotalComments int       `json:"total_comments"`
	Categories    []string  `json:"categories"`
}
