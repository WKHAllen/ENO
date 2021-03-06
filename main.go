package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/webview/webview"

	src "eno/src"
	services "eno/src/services"
	util "eno/src/util"
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
	openErr := ""
	if len(os.Args) > 1 {
		notebookPath := os.Args[1]
		if !strings.Contains(notebookPath, "/") && !strings.Contains(notebookPath, "\\") {
			notebookPath = fmt.Sprintf("notebooks/%s", notebookPath)
		}
		if !strings.HasSuffix(notebookPath, ".eno") {
			notebookPath = fmt.Sprintf("%s.eno", notebookPath)
		}
		if _, err := os.Stat(notebookPath); !errors.Is(err, fs.ErrNotExist) {
			notebooksPath, err := filepath.Abs("notebooks")
			if err == nil {
				dirname, filename := filepath.Split(notebookPath)
				argPath, err := filepath.Abs(dirname)
				if err == nil {
					if notebooksPath == argPath {
						notebookName := strings.TrimSuffix(filename, ".eno")
						address = fmt.Sprintf("%s/notebook/%s", address, notebookName)
					} else {
						openErr = fmt.Sprintf("specified notebook is not in notebooks directory: %s", notebookPath)
					}
				} else {
					openErr = fmt.Sprintf("error getting absolute file path: %s", err.Error())
				}
			} else {
				openErr = fmt.Sprintf("error getting absolute file path: %s", err.Error())
			}
		} else {
			openErr = fmt.Sprintf("file does not exist: %s", notebookPath)
		}
	}
	if len(openErr) > 0 {
		address = fmt.Sprintf("%s?err=%s", address, openErr)
	}
	logsDir := "logs"
	logFile := fmt.Sprintf("%s/%s", logsDir, "full.log")
	os.Setenv("DEBUG", fmt.Sprint(debug))

	// Set up logging
	if _, err := os.Stat(logsDir); errors.Is(err, fs.ErrNotExist) {
		err := os.Mkdir(logsDir, os.ModeDir)
		util.CheckError(err)
	}
	f, err := os.OpenFile(logFile, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	util.CheckError(err)
	defer f.Close()
	wrt := io.MultiWriter(os.Stdout, f)
	log.SetOutput(wrt)

	// Force Gin's console colors
	gin.ForceConsoleColor()

	// Set up routing
	router := gin.Default()
	router.LoadHTMLGlob("web/index.html")
	src.LoadRoutes(router, "api")
	router.Use(static.Serve("/", static.LocalFile("web", true)))
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

	// Set up webview window
	w := webview.New(debug)
	defer w.Destroy()
	services.WindowHandle = w
	w.SetTitle("Encrypted Notebook")
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
