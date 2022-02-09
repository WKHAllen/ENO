package src

import (
	"github.com/gin-gonic/gin"

	"eno/src/routes"
)

// LoadRoutes creates all routes
func LoadRoutes(router *gin.Engine, path string) {
	// Create the route group
	group := router.Group(path)

	// Load notebook routes
	notebookGroup := group.Group("notebook")
	notebookGroup.POST(  "",            routes.CreateNotebook)
	notebookGroup.GET(   "all",         routes.ListNotebooks)
	notebookGroup.GET(   "",            routes.OpenNotebook)
	notebookGroup.PATCH( "name",        routes.SetNotebookName)
	notebookGroup.PATCH( "description", routes.SetNotebookDescription)
	notebookGroup.DELETE("",            routes.DeleteNotebook)
}
