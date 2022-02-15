package routes

import (
	"github.com/gin-gonic/gin"

	"eno/src/services"
)

type SetWindowTitleParams struct {
	Title string `form:"title" binding:"required"`
}

// SetWindowTitle sets the title of the webview window.
func SetWindowTitle(c *gin.Context) {
	var params SetWindowTitleParams
	if err := c.ShouldBindQuery(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.SetWindowTitle(params.Title)

	services.JSONResponse(c, nil)
}
