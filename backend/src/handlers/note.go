package handlers

import (
	"fmt"
	"net/http"
	"notes/models"

	"github.com/gin-gonic/gin"
)

func HandleGetAllNotes(ctx *gin.Context) {
	filters, _ := ctx.Keys["filters"].(map[string]string)

	notes, err := models.GetAllNotes(filters, ctx.Keys["user_id"].(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, notes)
}

func HandleAddNote(ctx *gin.Context) {
	var n models.CreateNoteRequest

	if err := ctx.ShouldBindJSON(&n); err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}

	note, err := n.Insert(ctx.Keys["user_id"].(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, note)
}

func HandleGetNote(ctx *gin.Context) {
	note, err := models.GetNote(ctx.Param("id"))

	if err != nil {
		ctx.Status(http.StatusNotFound)
		return
	}

	ctx.JSON(http.StatusOK, note)
}

func HandleDeleteNote(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := models.DeleteNote(id); err != nil {
		ctx.Status(http.StatusNotFound)
		fmt.Println(err)
		return
	}

	ctx.JSON(http.StatusNoContent, gin.H{"id": id})
}

// func HandleUpdateNote(ctx *gin.Context) {
// 	id := ctx.Param("id")
// 	patches, _ := ctx.Keys["patches"].(map[string]any)

// 	note, err := PatchNote(id, patches)
// 	if err != nil {
// 		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, note)
// }
