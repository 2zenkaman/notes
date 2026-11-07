package middleware

import (
	"net/http"
	"notes/shared"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenStr, err := ctx.Cookie("token")
		if err != nil {
			ctx.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		token, err := shared.VerifyToken(tokenStr)
		if err != nil {
			ctx.AbortWithError(http.StatusUnauthorized, err)
		}

		if err != nil {
			ctx.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		ctx.Set("user_id", claims["user_id"])
		ctx.Set("login", claims["login"])
		ctx.Next()
	}
}

func TokenMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenStr, err := ctx.Cookie("token")
		if err != nil {
			ctx.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		ctx.Set("token", tokenStr)
		ctx.Next()
	}
}
