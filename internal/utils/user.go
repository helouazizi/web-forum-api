// internal/utils/sweet.go
package utils

import (
	"regexp"
	"slices"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func IsValidUsername(username string) bool {
	// Example: Allow only alphanumeric characters and underscores
	match, _ := regexp.MatchString("^[a-zA-Z0-9_]{3,50}$", username) // we can add length like {3,15} and remove the +
	return match && !isReservedUsername(username)
}

// IsValidEmail checks if an email is syntactically valid using regex.
func IsValidEmail(email string) bool {
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

func IsStrongPassword(password string) bool {

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
