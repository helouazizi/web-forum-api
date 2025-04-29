package routers

import (
	"net/http"

	"web-forum/internal/app"
)

func SetupRoutes(h *app.Application) {
	// the home route
	http.HandleFunc("GET /", h.Home.Home)

	// this route for user
	http.HandleFunc("POST /users/register", h.UserHandler.CreateUser)
	http.HandleFunc("POST /users/update", h.UserHandler.UpdateUser)
	http.HandleFunc("POST /users/login", h.UserHandler.Login)

	// this routs for posts
	http.HandleFunc("POST /posts", h.PostHandler.CreatePost)
	// http.HandleFunc("/users/update", h.UserHandler.UpdateUser)
	// http.HandleFunc("/users", h.UserHandler.ListUsers)

	// this routs for authofication
	// http.HandleFunc("/users", h.UserHandler.CreateUser)
	// http.HandleFunc("/users/update", h.UserHandler.UpdateUser)
	// http.HandleFunc("/users", h.UserHandler.ListUsers)
}
