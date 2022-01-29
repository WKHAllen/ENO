package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/webview/webview"

	"eno/src"
)

func main() {
	// Config
	debug := true
	protocol := "http"
	if !debug {
		protocol = "https"
	}
	host := "localhost"
	port := 42607
	address := fmt.Sprintf("%s://%s:%d", protocol, host, port)
	os.Setenv("DEBUG", fmt.Sprint(debug))

	// Force Gin's console colors
	gin.ForceConsoleColor()

	// Set up routing
	router := gin.Default()
	router.LoadHTMLGlob("build/web/index.html")
	src.LoadRoutes(router, "/api")
	router.Use(static.Serve("/", static.LocalFile("build/web", true)))
	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	// Set up HTTP server
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: src.ForceSSL(router),
	}

	// Start HTTP server
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()

	// Set up Webview window
	w := webview.New(debug)
	defer w.Destroy()
	w.SetTitle("Minimal webview example")
	w.SetSize(800, 600, webview.HintNone)
	w.Navigate(address)
	w.Run()

	// Kill HTTP server
	ctx, cancel := context.WithTimeout(context.Background(), 5 * time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		panic(err)
	}
}
