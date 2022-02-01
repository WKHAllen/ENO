package services

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
	"time"

	util "eno/src/util"
)

const notebookNameMinLength = 1
const notebookNameMaxLength = 64
const notebookDescriptionMinLength = 0
const notebookDescriptionMaxLength = 256
const notebookKeyMinLength = 8
const notebookKeyMaxLength = 256

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
		util.CheckError(err)
	}
}

// cleanFileName alters a notebook's name so it can be used for a file name.
func cleanFileName(name string) string {
	reg, err := regexp.Compile("[^a-zA-Z0-9-_]+")
	util.CheckError(err)

	return reg.ReplaceAllString(strings.ReplaceAll(name, " ", "_"), "-")
}

func encryptNotebook(notebook *DecryptedNotebook, key string) *EncryptedNotebook {
	notebookContentJson, err := json.Marshal(notebook.Content)
	util.CheckError(err)

	keyHash := sha256.Sum256([]byte(key))

	block, err := aes.NewCipher(keyHash[:])
	util.CheckError(err)

	aesgcm, err := cipher.NewGCM(block)
	util.CheckError(err)

	nonce := make([]byte, aesgcm.NonceSize())
	_, err = io.ReadFull(rand.Reader, nonce)
	util.CheckError(err)

	encryptedNotebookContent := aesgcm.Seal(nil, nonce, notebookContentJson, nil)

	return &EncryptedNotebook{
		Name: notebook.Name,
		Description: notebook.Description,
		CreateTime: notebook.CreateTime,
		EditTime: notebook.EditTime,
		Content: encryptedNotebookContent,
	}
}

/*
CreateNotebook creates a new notebook in the file system.

	name:        the name of the new notebook.
	description: the notebook's description.
	key:         the key to use to encrypt the notebook.

	returns:     the absolute path to the created notebook, or an error.
*/
func CreateNotebook(name string, description string, key string) (*DecryptedNotebook, error) {
	if len(name) < notebookNameMinLength || len(name) > notebookNameMaxLength {
		return nil, fmt.Errorf("notebook name must be between %v and %v characters in length", notebookNameMinLength, notebookNameMaxLength)
	}
	if len(description) < notebookDescriptionMinLength || len(description) > notebookDescriptionMaxLength {
		return nil, fmt.Errorf("notebook description must be between %v and %v characters in length", notebookDescriptionMinLength, notebookDescriptionMaxLength)
	}
	if len(key) < notebookKeyMinLength || len(key) > notebookKeyMaxLength {
		return nil, fmt.Errorf("notebook key must be between %v and %v characters in length", notebookKeyMinLength, notebookKeyMaxLength)
	}

	ensureNotebooksDirExists()

	filename := cleanFileName(name)
	filepath := fmt.Sprintf("build/notebooks/%v", filename)

	if _, err := os.Stat(filepath); !errors.Is(err, os.ErrNotExist) {
		return nil, fmt.Errorf("the specified notebook name is too similar to the name of another notebook")
	}

	notebook := &DecryptedNotebook{
		Name: name,
		Description: description,
		CreateTime: time.Now(),
		EditTime: time.Time{},
		Content: NotebookContent{
			Entries: []NotebookEntry{},
		},
	}

	encryptedNotebook := encryptNotebook(notebook, key)

	encryptedNotebookJson, err := json.Marshal(encryptedNotebook)
	util.CheckError(err)

	err = os.WriteFile(filepath, encryptedNotebookJson, 0755)
	util.CheckError(err)

	return notebook, nil
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

	// filename := cleanFileName(name)

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
