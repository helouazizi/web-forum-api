package routers

import (
	"net/http"

	middlewares "web-forum/internal/Middlewares"
	"web-forum/internal/app"
)

func SetupRoutes(h *app.Application) *http.ServeMux {

	mux := http.DefaultServeMux

	// the home route
	mux.HandleFunc("/", h.Home.Home)

	// this route for user
	mux.HandleFunc("/api/v1/users/register", h.UserHandler.CreateUser)
	// http.HandleFunc("POST /users/update", h.UserHandler.UpdateUser)
	mux.HandleFunc("/api/v1/users/login", h.UserHandler.Login)
	mux.HandleFunc("/api/v1/users/logout", h.UserHandler.Logout)
	mux.HandleFunc("/api/v1/users/info", h.UserHandler.GetUserInfo)

	// this routs for posts
	mux.Handle("/api/v1/posts/create", middlewares.AuthMiddleware(http.HandlerFunc(h.PostHandler.CreatePost), h.DB))
	// http.HandleFunc("/users/update", h.UserHandler.UpdateUser)
	// http.HandleFunc("/users", h.UserHandler.ListUsers)

	return mux
}
