package services

import (
	"log"
	"os"
	"regexp"
	"strings"
	"time"
)

// NotebookEntry represents a single entry within a notebook.
type NotebookEntry struct {
	Name       string    `json:"name"`
	CreateTime time.Time `json:"createTime"`
	EditTime   time.Time `json:"editTime"`
	Content    string    `json:"content"`
}

// NotebookContent represents the decrypted content of a notebook.
type NotebookContent struct {
	Entries []NotebookEntry `json:"entries"`
}

// EncryptedNotebook represents an encrypted notebook.
type EncryptedNotebook struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreateTime  time.Time `json:"createTime"`
	EditTime    time.Time `json:"editTime"`
	Content     []byte    `json:"content"`
}

// DecryptedNotebook represents a decrypted notebook.
type DecryptedNotebook struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	CreateTime  time.Time       `json:"createTime"`
	EditTime    time.Time       `json:"editTime"`
	Content     NotebookContent `json:"content"`
}

// ensureNotebooksDirExists will create the notebooks directory if it does not exist.
func ensureNotebooksDirExists() {
	path := "build/notebooks"

	if _, err := os.Stat(path); os.IsNotExist(err) {
		err := os.Mkdir(path, os.ModeDir)
		if err != nil {
			log.Fatal(err)
		}
	}
}

// cleanFileName alters a notebook's name so it can be used for a file name.
func cleanFileName(name string) string {
	reg, err := regexp.Compile("[^a-zA-Z0-9-_]+")
	if err != nil {
		log.Fatal(err)
	}

	return reg.ReplaceAllString(strings.ReplaceAll(name, " ", "_"), "-")
}

/*
CreateNotebook creates a new notebook in the file system.

	name:        the name of the new notebook.
	description: the notebook's description.
	key:         the key to use to encrypt the notebook.

	returns:     the absolute path to the created notebook, or an error.
*/
func CreateNotebook(name string, description string, key string) (*DecryptedNotebook, error) {
	ensureNotebooksDirExists()

	filename := cleanFileName(name)

	panic("UNIMPLEMENTED")

	return &DecryptedNotebook{}, nil
}

/*
ListNotebooks lists all notebooks inside the notebooks directory.

	returns: the names of all known notebooks.
*/
func ListNotebooks() []string {
	ensureNotebooksDirExists()

	panic("UNIMPLEMENTED")

	return []string{}
}

/*
OpenNotebook attempts to open a specified notebook.

	name:    the notebook's name.
	key:     the key to decrypt the notebook.

	returns: the decrypted notebook, or an error.
*/
func OpenNotebook(name string, key string) (*DecryptedNotebook, error) {
	ensureNotebooksDirExists()

	panic("UNIMPLEMENTED")

	return &DecryptedNotebook{}, nil
}

/*
SetNotebookName changes a notebook's name and file name.

	name:    the notebook's current name.
	newName: the notebook's new name.

	returns: an error, if one occurs.
*/
func SetNotebookName(name string, newName string) error {
	ensureNotebooksDirExists()

	filename := cleanFileName(name)

	panic("UNIMPLEMENTED")

	return nil
}

/*
SetNotebookDescription changes a notebook's description.

	path:           the notebook's name.
	newDescription: the notebook's new description.

	returns:        an error, if one occurs.
*/
func SetNotebookDescription(name string, newDescription string) error {
	ensureNotebooksDirExists()

	panic("UNIMPLEMENTED")

	return nil
}

/*
DeleteNotebook deletes a notebook from the file system and requires the notebook key as confirmation.

	path:    the notebook's name.
	key:     the notebook key, used as deletion confirmation.

	returns: an error, if one occurs.
*/
func DeleteNotebook(name string, key string) error {
	ensureNotebooksDirExists()

	panic("UNIMPLEMENTED")

	return nil
}
