// internal/utils/sweet.go
package utils

import (
	"fmt"
	"net/http"
	"regexp"
	"slices"
	"strings"
	"web-forum/internal/models"

	"golang.org/x/crypto/bcrypt"
)

func ValidUsername(username string) bool {
	// Example: Allow only alphanumeric characters and underscores
	match, _ := regexp.MatchString("^[a-zA-Z0-9_]{3,50}$", username) // we can add length like {3,15} and remove the +
	return match && !isReservedUsername(username)
}

// IsValidEmail checks if an email is syntactically valid using regex.
func ValidEmail(email string) bool {
	email = strings.TrimSpace(email)
	if email == "" {
		return false
	}
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// Function to check if a username is reserved
func isReservedUsername(username string) bool {
	reservedWords := []string{"admin", "root", "system", "superuser"}
	return slices.Contains(reservedWords, strings.ToLower(username))
}

func StrongPassword(password string) bool {

	hasLower := false
	hasUpper := false
	hasDigit := false

	// Loop through the password to check for lowercase letters and digits
	for _, char := range password {
		if char >= 'a' && char <= 'z' {
			hasLower = true
		}
		if char >= 'A' && char <= 'Z' {
			hasUpper = true
		}
		if char >= '0' && char <= '9' {
			hasDigit = true
		}
	}

	// Password is strong if it contains at least one lowercase letter and one digit
	return hasLower && hasDigit && hasUpper
}

func HashPassWord(pass string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	return string(bytes), err
}

func ComparePass(hashed, pass []byte) error {
	return bcrypt.CompareHashAndPassword(hashed, pass)
}

// this function validate the user inputs

func ValidateUserInputs(user models.User) models.UserInputErrors {
	var userErrors models.UserInputErrors
	// lets check the nickname first
	if !ValidUsername(user.Nickname) {
		userErrors.HasError = true
		userErrors.Nickname = "Invalid Nickname"
	}
	// lets check the email
	if !ValidEmail(user.Email) {
		userErrors.HasError = true
		userErrors.Email = "Invalid Email"
	}

	// lets check the pass
	if !StrongPassword(user.Password) {
		userErrors.HasError = true
		userErrors.Pass = "Password is too weak"
	}

	// check the age
	if user.Age < 1 || user.Age > 100 {
		userErrors.HasError = true
		userErrors.Age = "Invalid Age"
	}

	// check the gender
	if user.Gender != "male" && user.Gender != "female" {
		userErrors.HasError = true
		userErrors.Gender = "Invalid Gender"
	}

	// check the last and first names
	if user.LastName == "" {
		userErrors.HasError = true
		userErrors.LastName = "Invalid Lastname"
	}
	if user.FirstName == "" {
		userErrors.HasError = true
		userErrors.FirstName = "Invalid Firstname"
	}

	return userErrors
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// No cookie found — unauthorized
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		// Other error
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	token := cookie.Value
	// Now you can use the token (e.g., validate it)
	fmt.Fprintf(w, "Your session token is: %s", token)
}
