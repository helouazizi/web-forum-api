package repository

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"web-forum/internal/models"
	"web-forum/pkg/logger"
)

type UserMethods interface {
	CreateUser(user models.User) (models.User, models.Error)
	// GetUserByID(id int) (model.User, error)
	UpdateUser(user models.User) (models.User, models.Error)
	// IsUsernameOrEmailTaken(username, email string) (bool, models.Error)
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user models.User) (models.User, models.Error) {
	// Check if username or email already exists
	errorInfo := r.IsUsernameOrEmailTaken(user.Username, user.Email)
	if errorInfo.Code != http.StatusOK {
		logger.LogWithDetails(fmt.Errorf(errorInfo.Message))
		return models.User{}, errorInfo
	}

	// Proceed to insert
	query := `
	INSERT INTO users (
		username, email, password_hash ,updated_at
	) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
	`
	result, err := r.db.Exec(query,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.IsActive,
	)
	if err != nil {
		logger.LogWithDetails(err)
		return models.User{}, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	id, err := result.LastInsertId()
	if err != nil {
		return models.User{}, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	user.ID = int(id)
	user.CreatedAt = time.Now() // or query back from DB
	user.UpdatedAt = time.Now()

	return user, models.Error{
		Message: "seccefully created the user",
		Code:    http.StatusCreated,
	}
}

func (r *UserRepository) UpdateUser(user models.User) (models.User, models.Error) {
	query := `
	UPDATE users
	SET username = ?, email = ?, password_hash = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
	WHERE id = ?
	`

	_, err := r.db.Exec(query,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.Bio,
		user.ID,
	)
	if err != nil {
		logger.LogWithDetails(err)
		return models.User{}, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}
	return user, models.Error{
		Message: "seccefully updated information",
		Code:    http.StatusOK, // 200
	}
}

func (r *UserRepository) IsUsernameOrEmailTaken(username, email string) models.Error {
	query := `
	SELECT COUNT(*) FROM users
	WHERE username = ? OR email = ?
	`

	var count int
	err := r.db.QueryRow(query, username, email).Scan(&count)
	if err != nil {
		return models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}

	if count > 0 {
		return models.Error{
			Message: "Username or email already taken",
			Code:    http.StatusConflict, // 409 Conflict
		}
	}

	// No match found
	return models.Error{
		Message: "Username and email are available",
		Code:    http.StatusOK, // 200
	}
}
