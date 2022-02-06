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
	"io/fs"
	"os"
	"regexp"
	"strings"
	"time"

	util "eno/src/util"
)

const notebooksDir = "build/notebooks"
const notebookFileExt = ".eno"
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
	if _, err := os.Stat(notebooksDir); errors.Is(err, fs.ErrNotExist) {
		err := os.Mkdir(notebooksDir, os.ModeDir)
		util.CheckError(err)
	}
}

// cleanFileName alters a notebook's name so it can be used for a file name.
func cleanFileName(name string) string {
	reg, err := regexp.Compile("[^a-zA-Z0-9-_]+")
	util.CheckError(err)

	return reg.ReplaceAllString(strings.ReplaceAll(name, " ", "_"), "-")
}

// readNotebook reads a notebook file into memory.
func readNotebook(name string) (*EncryptedNotebook, error) {
	ensureNotebooksDirExists()

	filename := cleanFileName(name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	if _, err := os.Stat(filepath); errors.Is(err, fs.ErrNotExist) {
		return nil, fmt.Errorf("the specified notebook does not exist")
	}

	notebookJson, err := os.ReadFile(filepath)
	util.CheckError(err)

	var notebook EncryptedNotebook
	err = json.Unmarshal(notebookJson, &notebook)
	util.CheckError(err)

	return &notebook, nil
}

// writeNotebook writes a notebook to a file.
func writeNotebook(notebook *EncryptedNotebook) {
	ensureNotebooksDirExists()

	filename := cleanFileName(notebook.Name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	notebookJson, err := json.Marshal(notebook)
	util.CheckError(err)

	err = os.WriteFile(filepath, notebookJson, 0755)
	util.CheckError(err)
}

// encryptNotebook encrypts and returns a notebook.
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

	encryptedNotebookContent := aesgcm.Seal(nonce, nonce, notebookContentJson, nil)

	return &EncryptedNotebook{
		Name: notebook.Name,
		Description: notebook.Description,
		CreateTime: notebook.CreateTime,
		EditTime: notebook.EditTime,
		Content: encryptedNotebookContent,
	}
}

// decryptNotebook decrypts and returns a notebook.
func decryptNotebook(notebook *EncryptedNotebook, key string) (*DecryptedNotebook, error) {
	keyHash := sha256.Sum256([]byte(key))

	block, err := aes.NewCipher(keyHash[:])
	util.CheckError(err)

	aesgmc, err := cipher.NewGCM(block)
	util.CheckError(err)

	nonceSize := aesgmc.NonceSize()
	nonce, encryptedContent := notebook.Content[:nonceSize], notebook.Content[nonceSize:]

	decryptedNotebookContentJson, err := aesgmc.Open(nil, nonce, encryptedContent, nil)
	if err != nil {
		return nil, err
	}

	var decryptedNotebookContent NotebookContent
	err = json.Unmarshal(decryptedNotebookContentJson, &decryptedNotebookContent)
	if err != nil {
		return nil, err
	}

	return &DecryptedNotebook{
		Name: notebook.Name,
		Description: notebook.Description,
		CreateTime: notebook.CreateTime,
		EditTime: notebook.EditTime,
		Content: decryptedNotebookContent,
	}, nil
}

/*
CreateNotebook creates a new notebook in the file system.

	name:        the name of the new notebook.
	description: the notebook's description.
	key:         the key to use to encrypt the notebook.

	returns:     the created notebook, or an error.
*/
func CreateNotebook(name string, description string, key string) (*DecryptedNotebook, error) {
	if len(name) < notebookNameMinLength || len(name) > notebookNameMaxLength {
		return nil, fmt.Errorf("notebook name must be between %d and %d characters in length", notebookNameMinLength, notebookNameMaxLength)
	}
	if len(description) < notebookDescriptionMinLength || len(description) > notebookDescriptionMaxLength {
		return nil, fmt.Errorf("notebook description must be between %d and %d characters in length", notebookDescriptionMinLength, notebookDescriptionMaxLength)
	}
	if len(key) < notebookKeyMinLength || len(key) > notebookKeyMaxLength {
		return nil, fmt.Errorf("notebook key must be between %d and %d characters in length", notebookKeyMinLength, notebookKeyMaxLength)
	}

	ensureNotebooksDirExists()

	filename := cleanFileName(name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	if _, err := os.Stat(filepath); !errors.Is(err, fs.ErrNotExist) {
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

	returns: all encrypted notebooks.
*/
func ListNotebooks() []*EncryptedNotebook {
	ensureNotebooksDirExists()

	var notebooks []*EncryptedNotebook

	files, err := os.ReadDir(notebooksDir)
	util.CheckError(err)

	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), notebookFileExt) {
			var notebook EncryptedNotebook

			notebookPath := fmt.Sprintf("%s/%s", notebooksDir, file.Name())
			notebookJson, err := os.ReadFile(notebookPath)
			util.CheckError(err)

			err = json.Unmarshal(notebookJson, &notebook)
			util.CheckError(err)

			notebooks = append(notebooks, &notebook)
		}
	}

	return notebooks
}

/*
OpenNotebook attempts to open a specified notebook.

	name:    the notebook's name.
	key:     the key to decrypt the notebook.

	returns: the decrypted notebook, or an error.
*/
func OpenNotebook(name string, key string) (*DecryptedNotebook, error) {
	encryptedNotebook, err := readNotebook(name)
	if err != nil {
		return nil, err
	}

	notebook, err := decryptNotebook(encryptedNotebook, key)
	util.CheckError(err)

	return notebook, nil
}

/*
SetNotebookName changes a notebook's name and file name.

	name:    the notebook's current name.
	newName: the notebook's new name.

	returns: an error, if one occurs.
*/
func SetNotebookName(name string, newName string) error {
	notebook, err := readNotebook(name)
	if err != nil {
		return err
	}

	oldFilename := cleanFileName(notebook.Name)
	oldFilepath := fmt.Sprintf("%s/%s%s", notebooksDir, oldFilename, notebookFileExt)
	notebook.Name = newName

	writeNotebook(notebook)

	err = os.Remove(oldFilepath)
	util.CheckError(err)

	return nil
}

/*
SetNotebookDescription changes a notebook's description.

	path:           the notebook's name.
	newDescription: the notebook's new description.

	returns:        an error, if one occurs.
*/
func SetNotebookDescription(name string, newDescription string) error {
	notebook, err := readNotebook(name)
	if err != nil {
		return err
	}

	notebook.Description = newDescription

	writeNotebook(notebook)

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
