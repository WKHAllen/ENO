package src

import (
	"log"
)

// CheckError checks if an error has occurred, and if so, calls log.Panic.
func CheckError(err error) {
	if err != nil {
		log.Panic(err)
	}
}
