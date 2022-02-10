package routes

import (
	"github.com/gin-gonic/gin"

	"eno/src/services"
)

type CreateNotebookEntryParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
	EntryName    string `json:"entryName"    binding:"required"`
}

type ListNotebookEntriesParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
}

type GetNotebookEntryParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
	EntryName    string `json:"entryName"    binding:"required"`
}

type SetNotebookEntryNameParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
	EntryName    string `json:"entryName"    binding:"required"`
	NewEntryName string `json:"newEntryName" binding:"required"`
}

type SetNotebookEntryContentParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
	EntryName    string `json:"entryName"    binding:"required"`
	NewContent   string `json:"newContent"   binding:"required"`
}

type SearchNotebookEntriesParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
	Query        string `json:"query"        binding:"required"`
	RegexSearch  *bool  `json:"regexSearch"  binding:"required"`
}

type DeleteNotebookEntryParams struct {
	NotebookName string `json:"notebookName" binding:"required"`
	NotebookKey  string `json:"notebookKey"  binding:"required"`
	EntryName    string `json:"entryName"    binding:"required"`
}

// CreateNotebookEntry creates an entry in a notebook.
func CreateNotebookEntry(c *gin.Context) {
	var params CreateNotebookEntryParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	entry, err := services.CreateNotebookEntry(params.NotebookName, params.NotebookKey, params.EntryName)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, entry)
}

// ListNotebookEntries lists all entries in a notebook.
func ListNotebookEntries(c *gin.Context) {
	var params ListNotebookEntriesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	entries, err := services.ListNotebookEntries(params.NotebookName, params.NotebookKey)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, entries)
}

// GetNotebookEntry gets an entry from the notebook.
func GetNotebookEntry(c *gin.Context) {
	var params GetNotebookEntryParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	entry, err := services.GetNotebookEntry(params.NotebookName, params.NotebookKey, params.EntryName)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, entry)
}

// SetNotebookEntryName changes the name of an entry in a notebook.
func SetNotebookEntryName(c *gin.Context) {
	var params SetNotebookEntryNameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	entry, err := services.SetNotebookEntryName(params.NotebookName, params.NotebookKey, params.EntryName, params.NewEntryName)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, entry)
}

// SetNotebookEntryContent sets the content of an entry in a notebook.
func SetNotebookEntryContent(c *gin.Context) {
	var params SetNotebookEntryContentParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	entry, err := services.SetNotebookEntryContent(params.NotebookName, params.NotebookKey, params.EntryName, params.NewContent)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, entry)
}

// SearchNotebookEntries searches through a notebook's entries for query matches.
func SearchNotebookEntries(c *gin.Context) {
	var params SearchNotebookEntriesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	entries, err := services.SearchNotebookEntries(params.NotebookName, params.NotebookKey, params.Query, *params.RegexSearch)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, entries)
}

// DeleteNotebookEntry deletes an entry in a notebook.
func DeleteNotebookEntry(c *gin.Context) {
	var params DeleteNotebookEntryParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.DeleteNotebookEntry(params.NotebookName, params.NotebookKey, params.EntryName)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}
