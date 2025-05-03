package routers

import (
	"net/http"

	"web-forum/internal/app"
)

func SetupRoutes(h *app.Application) *http.ServeMux {
	// the home route
	mux := http.DefaultServeMux
	mux.HandleFunc("/", h.Home.Home)
	// http.HandleFunc("/", h.Home.Home)

	// this route for user
	mux.HandleFunc("/api/v1/users/register", h.UserHandler.CreateUser)
	// http.HandleFunc("POST /users/update", h.UserHandler.UpdateUser)
	http.HandleFunc("/api/v1/users/login", h.UserHandler.Login)
	http.HandleFunc("/api/v1/users/info", h.UserHandler.GetUserInfo)
	// this routs for posts
	// http.HandleFunc("POST /posts", h.PostHandler.CreatePost)
	// http.HandleFunc("/users/update", h.UserHandler.UpdateUser)
	// http.HandleFunc("/users", h.UserHandler.ListUsers)

	// this routs for authofication
	// http.HandleFunc("/users", h.UserHandler.CreateUser)
	// http.HandleFunc("/users/update", h.UserHandler.UpdateUser)
	// http.HandleFunc("/users", h.UserHandler.ListUsers)

	return mux
}
