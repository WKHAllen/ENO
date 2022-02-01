package src

// CheckError checks if an error has occurred, and if so, panics.
func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}
