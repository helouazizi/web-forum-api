package routers

import (
	"net/http"

	"web-forum/internal/app"
)

func SetupRoutes(h *app.Application) *http.ServeMux {

	mux := http.DefaultServeMux

	// the home route
	mux.HandleFunc("/", h.Home.Home)

	// this route for user
	mux.HandleFunc("/api/v1/users/register", h.UserHandler.CreateUser)
	// http.HandleFunc("POST /users/update", h.UserHandler.UpdateUser)
	http.HandleFunc("/api/v1/users/login", h.UserHandler.Login)
	http.HandleFunc("/api/v1/users/logout", h.UserHandler.Logout)
	http.HandleFunc("/api/v1/users/info", h.UserHandler.GetUserInfo)

	// this routs for posts
	http.HandleFunc("/api/v1/posts/create", h.PostHandler.CreatePost)
	// http.HandleFunc("/users/update", h.UserHandler.UpdateUser)
	// http.HandleFunc("/users", h.UserHandler.ListUsers)

	return mux
}
