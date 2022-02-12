package services

import (
	"github.com/webview/webview"
)

// WindowHandle holds a handle to the webview window.
var WindowHandle webview.WebView

// init Initializes the notebooks directory and settings file.
func init() {
	ensureNotebooksDirExists()
	ensureSettingsFileExists()
}
