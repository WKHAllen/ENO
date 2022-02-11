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

	// Load entry routes
	entryGroup := group.Group("entry")
	entryGroup.POST(  "",        routes.CreateNotebookEntry)
	entryGroup.GET(   "all",     routes.ListNotebookEntries)
	entryGroup.GET(   "",        routes.GetNotebookEntry)
	entryGroup.PATCH( "name",    routes.SetNotebookEntryName)
	entryGroup.PATCH( "content", routes.SetNotebookEntryContent)
	entryGroup.GET(   "search",  routes.SearchNotebookEntries)
	entryGroup.DELETE("",        routes.DeleteNotebookEntry)

	// Load settings routes
	settingsGroup := group.Group("settings")
	settingsGroup.GET(   "all", routes.GetSettings)
	settingsGroup.GET(   "",    routes.GetSettingsOption)
	settingsGroup.PATCH( "",    routes.SetSettingsOption)
	settingsGroup.DELETE("",    routes.DeleteSettingsOption)
}
