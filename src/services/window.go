package services

// SetWindowTitle sets the title of the webview window.
func SetWindowTitle(title string) {
	WindowHandle.SetTitle(title)
}
