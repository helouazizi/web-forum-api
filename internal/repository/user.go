package repository

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"web-forum/internal/models"
	"web-forum/internal/utils"
	"web-forum/pkg/logger"

	"github.com/google/uuid"
)

type UserMethods interface {
	CreateUser(user models.User) (models.User, models.Error)
	Login(user models.UserLogin) (models.UserLogin, models.Error)
	//UpdateUser(user models.User) (models.User, models.Error)
	IsUsernameOrEmailTaken(username, email string) models.Error
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user models.User) (models.User, models.Error) {
	// Check if username or email already exists
	err1 := r.IsUsernameOrEmailTaken(user.Nickname, user.Email)
	if err1.Code != http.StatusOK {
		logger.LogWithDetails(fmt.Errorf(err1.Message))
		return models.User{}, err1
	}

	// lets hash the pass
	hashedPass, err := utils.HashPassWord(user.Password)
	if err != nil {
		return models.User{}, models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}
	// this the token
	token := uuid.New().String()

	// Proceed to insert
	query := `
	INSERT INTO users (
		nickname, age, gender, first_name, last_name, email, password_hash,session_token , created_at, updated_at ,session_expires_at
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	result, err := r.db.Exec(query,
		user.Nickname,
		user.Age,
		user.Gender,
		user.FirstName,
		user.LastName,
		user.Email,
		hashedPass,
		token,
		time.Now(),                   // created at
		time.Now(),                   // updated at
		time.Now().Add(24*time.Hour), // sesseion experition
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
	// user.SessionToken = token
	// user.CreatedAt = time.Now() // or query back from DB
	// user.UpdatedAt = time.Now()
	// user.LastLoginAt = time.Now()
	// user.SessionExpiresAt = time.Now().Add(24 * time.Hour)
	// user.PasswordHash = "******"

	return user, models.Error{
		Message: "seccefully created the user",
		Code:    http.StatusCreated,
	}
}

func (r *UserRepository) Login(user models.UserLogin) (models.UserLogin, models.Error) {
	// // check username existence
	// err := r.IsUsernameOrEmailTaken(user.Nickname, user.Email)
	// if err.Code != http.StatusOK {
	// 	logger.LogWithDetails(fmt.Errorf(err.Message))
	// 	return models.User{}, models.Error{Message: "Invalid username or password", Code: http.StatusBadRequest}
	// }
	query := `SELECT password_hash FROM users WHERE nickname = ?`
	Updatequery := `UPDATE users SET session_token = ?, session_expires_at = ? WHERE nickname = ?`
	isEmail := utils.ValidEmail(user.LoginId)
	if isEmail {
		query = fmt.Sprintf(`SELECT password_hash FROM users WHERE %s = ?`, "email")
		Updatequery = fmt.Sprintf(`UPDATE users SET session_token = ?, session_expires_at = ? WHERE %s = ?`, "email")
	}
	fmt.Println(user, isEmail)

	var hash string
	err := r.db.QueryRow(query, user.LoginId).Scan(&hash)
	if err != nil {
		return models.UserLogin{}, models.Error{Message: "invalid nickname or email"}
	}
	// check password

	errCompare := utils.ComparePass([]byte(hash), []byte(user.Password))
	if errCompare != nil {
		logger.LogWithDetails(errCompare)
		return models.UserLogin{}, models.Error{Message: "Invalid nickname or password", Code: http.StatusBadRequest}
	}

	// Generate a new token
	newToken := uuid.New().String()

	//  Update the token in database
	_, errUpdate := r.db.Exec(Updatequery, newToken, time.Now().Add(24*time.Hour), user.LoginId) // expires after 24h
	if errUpdate != nil {
		logger.LogWithDetails(errUpdate)
		return models.UserLogin{}, models.Error{Message: "Internal server error", Code: http.StatusInternalServerError}
	}

	//  Set the token into user struct
	user.SessionToken = newToken
	// user.SessionExpiresAt = time.Now().Add(24 * time.Hour)

	return user, models.Error{
		Message: "Successfully logged in",
		Code:    http.StatusOK,
	}
}

// func (r *UserRepository) Logout(userID int) models.Error {
// 	query := `UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?`
// 	_, err := r.db.Exec(query, userID)
// 	if err != nil {
// 		logger.LogWithDetails(err)
// 		return models.Error{Message: "Internal server error", Code: http.StatusInternalServerError}
// 	}
// 	return models.Error{Message: "Successfully logged out", Code: http.StatusOK}
// }

// func (r *UserRepository) UpdateUser(user models.User) (models.User, models.Error) {

// 	/////////////// have some work here we should as the user for the previouse credential
// 	query := `
// 	UPDATE users
// 	SET username = ?, email = ?, password_hash = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
// 	WHERE id = ?
// 	`
// 	_, err := r.db.Exec(query,
// 		user.Username,
// 		user.Email,
// 		user.PasswordHash,
// 		user.Bio,
// 		user.ID,
// 	)
// 	if err != nil {
// 		logger.LogWithDetails(err)
// 		return models.User{}, models.Error{
// 			Message: "Internal server error",
// 			Code:    http.StatusInternalServerError,
// 		}
// 	}
// 	return user, models.Error{
// 		Message: "seccefully updated information",
// 		Code:    http.StatusOK, // 200
// 	}
// }

func (r *UserRepository) IsUsernameOrEmailTaken(username, email string) models.Error {
	query := `
	SELECT COUNT(*) FROM users
	WHERE nickname = ? OR email = ?
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

func (r *UserRepository) SelectFromDB(clomn, table, value string) (string, models.Error) {
	query := fmt.Sprintf(`
	SELECT %s FROM %s
	WHERE nickname = ? 
	`, clomn, table)
	var res string
	err := r.db.QueryRow(query, value).Scan(&res)
	if err != nil {
		return "nil", models.Error{
			Message: "Internal server error",
			Code:    http.StatusInternalServerError,
		}
	}
	return res, models.Error{Message: "found a result", Code: http.StatusFound}
}

// func (r *UserRepository) GetUserByToken(token string) (models.User, models.Error) {
// 	query := `
// 		SELECT id, username, email, created_at, updated_at
// 		FROM users
// 		WHERE session_token = ? AND session_expires_at > CURRENT_TIMESTAMP
// 	`
// 	var user models.User
// 	err := r.db.QueryRow(query, token).Scan(&user.ID, &user.Username, &user.Email, &user.CreatedAt, &user.UpdatedAt)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			return models.User{}, models.Error{Message: "Invalid or expired session", Code: http.StatusUnauthorized}
// 		}
// 		logger.LogWithDetails(err)
// 		return models.User{}, models.Error{Message: "Internal server error", Code: http.StatusInternalServerError}
// 	}
// 	return user, models.Error{Message: "User found", Code: http.StatusOK}
// }
