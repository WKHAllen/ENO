package routes

import (
	"github.com/gin-gonic/gin"

	"eno/src/services"
)

// Hello world
func Hello(c *gin.Context) {
	services.JSONResponse(c, "Hello, world!")
}
