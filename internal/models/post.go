package models

type Post struct {
	ID      int    `json:"id"`
	UserID  int    `json:"user_id"`
	Title   string `json:"tilte"`
	Content string `json:"content"`
}
