package src

import (
	"log"
)

// CheckError checks if an error has occurred, and if so, calls log.Fatal.
func CheckError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
