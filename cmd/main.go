package main

import (
	"fmt"
	"log"
	"net/http"

	"web-forum/internal/app"
	"web-forum/internal/routers"
	"web-forum/pkg/config"
	"web-forum/pkg/logger"
)

func main() {
	logger, err := logger.Create_Logger()
	if err != nil {
		log.Fatal(err)
	}
	defer logger.Close()
	configurations := config.LoadConfig()
	application := app.NewApp(configurations)
	routers.SetupRoutes(application)
	defer application.DB.Close()

	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
