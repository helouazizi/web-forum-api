package repository

import (
	"database/sql"
	"fmt"
	"time"

	"web-forum/internal/models"
)

type UserMethods interface {
	CreateUser(user models.User) (models.User, error)
	// GetUserByID(id int) (model.User, error)
	// UpdateUser(user model.User) (model.User, error)
	// ListUsers() ([]model.User, error)
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user models.User) (models.User, error) {
	query := `
	INSERT INTO users (
		username, email, password_hash, role, is_active, created_at, updated_at
	) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`
	result, err := r.db.Exec(query,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.IsActive,
	)
	if err != nil {
		return models.User{}, fmt.Errorf("failed to insert user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return models.User{}, fmt.Errorf("failed to get inserted ID: %w", err)
	}

	user.ID = int(id)
	user.CreatedAt = time.Now() // or query back from DB
	user.UpdatedAt = time.Now()

	return user, nil
}

// Implement other methods...
