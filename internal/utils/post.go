package utils

import (
	"strings"
	"web-forum/internal/models"
)

func ValidPostInputs(post models.Post) models.Error {
	var errors models.Error
	if len(post.Categories) == 0 {
		errors.UserErrors.HasError = true
		errors.UserErrors.Postcategories = "At least one categorie"
	}

	if post.Title == "" || len(strings.Fields(post.Title)) == 0 || len(post.Title) > 100 {
		errors.UserErrors.HasError = true
		errors.UserErrors.Postcategories = "Please enter a valid title"
	}

	if post.Content == "" || len(strings.Fields(post.Content)) == 0 || len(post.Content) > 1000 {
		errors.UserErrors.HasError = true
		errors.UserErrors.Postcategories = "Please enter a valid content"
	}

	return errors
}
