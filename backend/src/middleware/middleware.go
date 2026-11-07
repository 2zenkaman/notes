package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Cookie, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func FilterMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var filters = make(map[string]string, 0)

		if search := ctx.Query("search"); search != "" {
			filters["title LIKE ?"] = "%" + search + "%"
		}

		if showHidden := ctx.Query("showHidden"); showHidden != "" {
			var value string
			if showHidden == "true" {
				value = "1"
			} else if showHidden == "false" {
				value = "0"
			} else {
				ctx.AbortWithError(http.StatusBadRequest, fmt.Errorf("bad showHidden format: accepts only true and false"))
			}

			filters["hidden = ?"] = value
		}

		if tagsStr := ctx.Query("tags"); tagsStr != "" {
			for _, tag := range strings.Split(tagsStr, ",") {
				filters["(SELECT note_id FROM note_tags WHERE tag_id = ?) = note_id"] = tag
			}
		}

		ctx.Set("filters", filters)
		ctx.Next()
	}
}

// func PatchMiddleware() gin.HandlerFunc {
// 	return func(ctx *gin.Context) {
// 		var patchData PatchNoteValues
// 		if err := ctx.ShouldBindJSON(&patchData); err != nil {
// 			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 			return
// 		}

// 		patches := make(map[string]any, 0)

// 		v := reflect.ValueOf(patchData)
// 		for field, value := range v.Fields() {
// 			if value.IsNil() {
// 				continue
// 			}

// 			column, ok := field.Tag.Lookup("db")
// 			if !ok {
// 				continue
// 			}

// 			patches[column] = value.String()
// 		}

// 		ctx.Set("patches", patches)
// 		ctx.Next()
// 	}
// }
