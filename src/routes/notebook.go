package routes

import (
	"github.com/gin-gonic/gin"

	"eno/src/services"
)

type CreateNotebookParams struct {
	Name        *string `form:"name"        binding:"required"`
	Description *string `form:"description" binding:"required"`
	Key         *string `form:"key"         binding:"required"`
}

type GetNotebookDetailsParams struct {
	Name *string `form:"name" binding:"required"`
}

type OpenNotebookParams struct {
	Name *string `form:"name" binding:"required"`
	Key  *string `form:"key"  binding:"required"`
}

type SetNotebookNameParams struct {
	Name    *string `form:"name"    binding:"required"`
	NewName *string `form:"newName" binding:"required"`
}

type SetNotebookDescriptionParams struct {
	Name           *string `form:"name"           binding:"required"`
	NewDescription *string `form:"newDescription" binding:"required"`
}

type SetNotebookKeyParams struct {
	Name   *string `form:"name"   binding:"required"`
	Key    *string `form:"key"    binding:"required"`
	NewKey *string `form:"newKey" binding:"required"`
}

type DeleteNotebookParams struct {
	Name *string `form:"name" binding:"required"`
	Key  *string `form:"key"  bindign:"required"`
}

// CreateNotebook creates a new notebook.
func CreateNotebook(c *gin.Context) {
	var params CreateNotebookParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebook, err := services.CreateNotebook(*params.Name, *params.Description, *params.Key)
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

// GetNotebookDetails gets a specified notebook's details.
func GetNotebookDetails(c *gin.Context) {
	var params GetNotebookDetailsParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebookDetails, err := services.GetNotebookDetails(*params.Name)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebookDetails)
}

// OpenNotebook opens a specified notebook.
func OpenNotebook(c *gin.Context) {
	var params OpenNotebookParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebook, err := services.OpenNotebook(*params.Name, *params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebook)
}

// SetNotebookName changes a notebook's name.
func SetNotebookName(c *gin.Context) {
	var params SetNotebookNameParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebook, err := services.SetNotebookName(*params.Name, *params.NewName)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebook)
}

// SetNotebookDescription changes a notebook's description.
func SetNotebookDescription(c *gin.Context) {
	var params SetNotebookDescriptionParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	notebook, err := services.SetNotebookDescription(*params.Name, *params.NewDescription)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, notebook)
}

// SetNotebookKey sets a notebook's key.
func SetNotebookKey(c *gin.Context) {
	var params SetNotebookKeyParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.SetNotebookKey(*params.Name, *params.Key, *params.NewKey)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}

// DeleteNotebook deletes a notebook.
func DeleteNotebook(c *gin.Context) {
	var params DeleteNotebookParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.DeleteNotebook(*params.Name, *params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}
