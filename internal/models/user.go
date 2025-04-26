package models

import "time"

type User struct {
	ID                int       `json:"id"`
	Username          string    `json:"username"`
	Email             string    `json:"email"`
	PasswordHash      string    `json:"pass"` // hide in JSON
	Bio               string    `json:"bio"`
	AvatarURL         string    `json:"avatar_url"`
	Role              string    `json:"role"`
	IsActive          bool      `json:"is_active"`
	EmailVerified     bool      `json:"email_verified"`
	VerificationToken string    `json:"verification_token,omitempty"`
	SessionToken      string    `json:"session_token,omitempty"`
	SessionExpiresAt  time.Time `json:"session_expires_at,omitempty"`
	LastLoginAt       time.Time `json:"last_login_at,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}
