package routes

import (
	"github.com/gin-gonic/gin"

	"eno/src/services"
)

type GetSettingsOptionParams struct {
	Key string `json:"key" binding:"required"`
}

type SetSettingsOptionParams struct {
	Key   string      `json:"key"   binding:"required"`
	Value interface{} `json:"value" binding:"required"`
}

type DeleteSettingsOptionParams struct {
	Key string `json:"key" binding:"required"`
}

// GetSettings gets all settings.
func GetSettings(c *gin.Context) {
	settings, err := services.GetSettings()
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, settings)
}

// GetSettingsOption gets an option from the settings.
func GetSettingsOption(c *gin.Context) {
	var params GetSettingsOptionParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	option, err := services.GetSettingsOption(params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, option)
}

// SetSettingsOption sets an option in the settings.
func SetSettingsOption(c *gin.Context) {
	var params SetSettingsOptionParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.SetSettingsOption(params.Key, params.Value)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}

// DeleteSettingsOption deletes an option from the settings.
func DeleteSettingsOption(c *gin.Context) {
	var params DeleteSettingsOptionParams
	if err := c.ShouldBindJSON(&params); err != nil {
		services.JSONError(c, err.Error())
		return
	}

	err := services.DeleteSettingsOption(params.Key)
	if err != nil {
		services.JSONError(c, err.Error())
		return
	}

	services.JSONResponse(c, nil)
}
