package src

import (
	"github.com/gin-gonic/gin"

	"eno/src/routes"
)

// LoadRoutes creates all routes
func LoadRoutes(router *gin.Engine, path string) {
	// Create the route group
	group := router.Group(path)

	// Load the routes
	group.GET("/hello", routes.Hello)
}
