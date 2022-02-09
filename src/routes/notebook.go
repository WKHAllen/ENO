package routes

import (
	"github.com/gin-gonic/gin"

	"eno/src/services"
)

type CreateNotebookParams struct {
	Name        string `json:"name"        binding:"required"`
	Description string `json:"description" binding:"required"`
	Key         string `json:"key"         binding:"required"`
}

type OpenNotebookParams struct {
	Name string `json:"name" binding:"required"`
	Key  string `json:"key"  binding:"required"`
}

type SetNotebookNameParams struct {
	Name    string `json:"name"    binding:"required"`
	NewName string `json:"newName" binding:"required"`
}

type SetNotebookDescriptionParams struct {
	Name           string `json:"name"           binding:"required"`
	NewDescription string `json:"newDescription" binding:"required"`
}

type DeleteNotebookParams struct {
	Name string `json:"name" binding:"required"`
	Key  string `json:"key"  bindign:"required"`
}

// CreateNotebook creates a new notebook.
func CreateNotebook(c *gin.Context) {
	var params CreateNotebookParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebook, err := services.CreateNotebook(params.Name, params.Description, params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebook)
}

// ListNotebooks lists all notebooks.
func ListNotebooks(c *gin.Context) {
	notebooks, err := services.ListNotebooks()
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebooks)
}

// OpenNotebook opens a specified notebook.
func OpenNotebook(c *gin.Context) {
	var params OpenNotebookParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebook, err := services.OpenNotebook(params.Name, params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebook)
}

// SetNotebookName changes a notebook's name.
func SetNotebookName(c *gin.Context) {
	var params SetNotebookNameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.SetNotebookName(params.Name, params.NewName)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}

// SetNotebookDescription changes a notebook's description.
func SetNotebookDescription(c *gin.Context) {
	var params SetNotebookDescriptionParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.SetNotebookDescription(params.Name, params.NewDescription)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}

// DeleteNotebook deletes a notebook.
func DeleteNotebook(c *gin.Context) {
	var params DeleteNotebookParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.DeleteNotebook(params.Name, params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}
