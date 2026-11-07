package main

import (
	"log"
	"net/http"
	"notes/handlers"
	"notes/middleware"
	"notes/models"
	"notes/shared"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := models.OpenDB(); err != nil {
		log.Fatalln(err)
	}

	if err := godotenv.Load(".env"); err != nil {
		log.Fatalln(err)
	}

	if err := shared.LoadJWTKey("JWT_TOKEN"); err != nil {
		log.Fatalln(err)
	}

	engine := gin.Default()
	engine.Use(middleware.CORSMiddleware())

	{
		notes := engine.Group("/notes", middleware.AuthMiddleware())
		notes.GET("", middleware.FilterMiddleware(), handlers.HandleGetAllNotes)
		notes.POST("", handlers.HandleAddNote)
		notes.GET(":id", handlers.HandleGetNote)
		notes.DELETE(":id", handlers.HandleDeleteNote)
		// notes.PATCH(":id", PatchMiddleware(), HandleUpdateNote)
	}

	engine.GET("/user", middleware.AuthMiddleware(), func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, models.UserResponse{UserID: ctx.Keys["user_id"].(string), Login: ctx.Keys["login"].(string)})
	})

	engine.GET("/login", handlers.HandleLoginUser)
	engine.GET("/logout", handlers.HandleLogoutUser)
	engine.POST("/register", handlers.HandleRegisterUser)

	engine.Run(":8080")
}
