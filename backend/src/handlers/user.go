package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"notes/models"
	"notes/shared"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleLoginUser(ctx *gin.Context) {
	var req models.LoginRequest

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := req.GetUser()
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cookie, err := shared.TokenCookie(shared.GenerateAccessToken(user), "token", "/notes")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.SetCookieData(cookie)

	cookie, err = shared.TokenCookie(shared.GenerateRefreshToken(user), "refresh", "/refresh")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.SetCookieData(cookie)
	ctx.JSON(http.StatusOK, models.UserResponse{UserID: user.ID, Login: user.Login})
}

func HandleRegisterUser(ctx *gin.Context) {
	var req models.RegisterRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := req.Insert()
	if err != nil {
		if errors.Is(err, models.ErrUserConflict) {
			ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cookie, err := shared.TokenCookie(shared.GenerateAccessToken(user), "token", "/")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.SetCookieData(cookie)

	cookie, err = shared.TokenCookie(shared.GenerateRefreshToken(user), "refresh", "/refresh")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.SetCookieData(cookie)
	ctx.JSON(http.StatusCreated, models.UserResponse{UserID: user.ID, Login: user.Login})
}

func HandleLogoutUser(ctx *gin.Context) {
	cookie := &http.Cookie{
		Name:     "token",
		Value:    "null",
		Expires:  time.Now(),
		HttpOnly: true,
	}

	ctx.SetCookieData(cookie)
	ctx.Status(http.StatusOK)
}
