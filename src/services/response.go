package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// JSONResponse sends a response in JSON format
func JSONResponse(c *gin.Context, res interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"data": res,
		"error": nil,
	})
}

// JSONError sends a generic error message in JSON format
func JSONError(c *gin.Context, err string) {
	c.JSON(http.StatusBadRequest, gin.H{
		"data": nil,
		"error": err,
	})
}

// JSONUnauthorized sends an unauthorized error message in JSON format
func JSONUnauthorized(c *gin.Context, err string) {
	c.JSON(http.StatusBadRequest, gin.H{
		"data": nil,
		"error": err,
	})
}

// JSONForbidden sends a forbidden error message in JSON format
func JSONForbidden(c *gin.Context, err string) {
	c.JSON(http.StatusForbidden, gin.H{
		"data": nil,
		"error": err,
	})
}

// JSONNotFound sends a not found error message in JSON format
func JSONNotFound(c *gin.Context, err string) {
	c.JSON(http.StatusNotFound, gin.H{
		"data": nil,
		"error": err,
	})
}
