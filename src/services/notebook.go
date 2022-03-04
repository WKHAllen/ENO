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
	"log"
	"os"
	"regexp"
	"strings"
	"time"

	util "eno/src/util"
)

const (
	notebooksDir = "notebooks"
	notebookFileExt = ".eno"
	notebookNameMinLength = 1
	notebookNameMaxLength = 64
	notebookDescriptionMinLength = 0
	notebookDescriptionMaxLength = 256
	notebookKeyMinLength = 8
	notebookKeyMaxLength = 256
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
	Entries map[string]*NotebookEntry `json:"entries"`
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

// NotebookDetails represents a notebook's details.
type NotebookDetails struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreateTime  time.Time `json:"createTime"`
	EditTime    time.Time `json:"editTime"`
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
	filename := cleanFileName(name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	if _, err := os.Stat(filepath); errors.Is(err, fs.ErrNotExist) {
		return nil, fmt.Errorf("the specified notebook does not exist")
	}

	notebookJson, err := os.ReadFile(filepath)
	if err != nil {
		log.Printf("Error occurred reading notebook file (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while opening the notebook, check the logs for more details")
	}

	var notebook EncryptedNotebook
	err = json.Unmarshal(notebookJson, &notebook)
	if err != nil {
		log.Printf("Error occurred parsing notebook file JSON (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while opening the notebook, check the logs for more details")
	}

	return &notebook, nil
}

// writeNotebook writes a notebook to a file.
func writeNotebook(notebook *EncryptedNotebook) error {
	filename := cleanFileName(notebook.Name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	notebookJson, err := json.Marshal(notebook)
	if err != nil {
		log.Printf("Error occurred stringifying notebook file JSON (%s): %s", filepath, err)
		return fmt.Errorf("an unexpected error occurred while saving the notebook, check the logs for more details")
	}

	err = os.WriteFile(filepath, notebookJson, 0755)
	if err != nil {
		log.Printf("Error occurred writing notebook file (%s): %s", filepath, err)
		return fmt.Errorf("an unexpected error occurred while saving the notebook, check the logs for more details")
	}

	return nil
}

// encryptNotebook encrypts and returns a notebook.
func encryptNotebook(notebook *DecryptedNotebook, key string) (*EncryptedNotebook, error) {
	filename := cleanFileName(notebook.Name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	notebookContentJson, err := json.Marshal(notebook.Content)
	if err != nil {
		log.Printf("Error occurred stringifying notebook file JSON (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while encrypting the notebook, check the logs for more details")
	}

	keyHash := sha256.Sum256([]byte(key))

	block, err := aes.NewCipher(keyHash[:])
	if err != nil {
		log.Printf("Error occurred creating AES cipher for encrypting (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while encrypting the notebook, check the logs for more details")
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		log.Printf("Error occurred wrapping AES cipher in GCM for encrypting (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while encrypting the notebook, check the logs for more details")
	}

	nonce := make([]byte, aesgcm.NonceSize())
	_, err = io.ReadFull(rand.Reader, nonce)
	if err != nil {
		log.Printf("Error occurred reading random bytes for encrypting (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while encrypting the notebook, check the logs for more details")
	}

	encryptedNotebookContent := aesgcm.Seal(nonce, nonce, notebookContentJson, nil)

	return &EncryptedNotebook{
		Name: notebook.Name,
		Description: notebook.Description,
		CreateTime: notebook.CreateTime,
		EditTime: notebook.EditTime,
		Content: encryptedNotebookContent,
	}, nil
}

// decryptNotebook decrypts and returns a notebook.
func decryptNotebook(notebook *EncryptedNotebook, key string) (*DecryptedNotebook, error) {
	filename := cleanFileName(notebook.Name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	keyHash := sha256.Sum256([]byte(key))

	block, err := aes.NewCipher(keyHash[:])
	if err != nil {
		log.Printf("Error occurred creating AES cipher for decrypting (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while decrypting the notebook, check the logs for more details")
	}

	aesgmc, err := cipher.NewGCM(block)
	if err != nil {
		log.Printf("Error occurred wrapping AES cipher in GCM for decrypting (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while decrypting the notebook, check the logs for more details")
	}

	nonceSize := aesgmc.NonceSize()
	nonce, encryptedContent := notebook.Content[:nonceSize], notebook.Content[nonceSize:]

	decryptedNotebookContentJson, err := aesgmc.Open(nil, nonce, encryptedContent, nil)
	if err != nil {
		log.Printf("Error occurred decrypting notebook (%s): %s", filepath, err)
		return nil, fmt.Errorf("incorrect notebook key")
	}

	var decryptedNotebookContent NotebookContent
	err = json.Unmarshal(decryptedNotebookContentJson, &decryptedNotebookContent)
	if err != nil {
		log.Printf("Error occurred parsing notebook file JSON after decrypting (%s): %s", filepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while decrypting the notebook, check the logs for more details")
	}

	return &DecryptedNotebook{
		Name: notebook.Name,
		Description: notebook.Description,
		CreateTime: notebook.CreateTime,
		EditTime: notebook.EditTime,
		Content: decryptedNotebookContent,
	}, nil
}

// updateNotebookEditTime updates a notebook's edited timestamp
func updateNotebookEditTime(notebook *DecryptedNotebook) {
	notebook.EditTime = time.Now()
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
			Entries: make(map[string]*NotebookEntry),
		},
	}

	encryptedNotebook, err := encryptNotebook(notebook, key)
	if err != nil {
		return nil, err
	}

	err = writeNotebook(encryptedNotebook)
	if err != nil {
		return nil, err
	}

	return notebook, nil
}

/*
ListNotebooks lists all notebooks inside the notebooks directory.

	returns: all encrypted notebooks.
*/
func ListNotebooks() ([]*EncryptedNotebook, error) {
	var notebooks []*EncryptedNotebook

	files, err := os.ReadDir(notebooksDir)
	if err != nil {
		log.Printf("Error occurred fetching list of existing notebooks: %s", err)
		return nil, fmt.Errorf("an unexpected error occurred while locating existing notebooks, check the logs for more details")
	}

	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), notebookFileExt) {
			var notebook EncryptedNotebook

			notebookPath := fmt.Sprintf("%s/%s", notebooksDir, file.Name())
			notebookJson, err := os.ReadFile(notebookPath)
			if err != nil {
				log.Printf("Error occurred reading notebook file (%s): %s", notebookPath, err)
				return nil, fmt.Errorf("an unexpected error occurred while opening the notebooks, check the logs for more details")
			}

			err = json.Unmarshal(notebookJson, &notebook)
			if err != nil {
				log.Printf("Error occurred parsing notebook file JSON (%s): %s", notebookPath, err)
				return nil, fmt.Errorf("an unexpected error occurred while opening the notebooks, check the logs for more details")
			}

			notebooks = append(notebooks, &notebook)
		}
	}

	return notebooks, nil
}

/*
GetNotebookDetails attempts to retrieve a specified notebook's details.

	name:    the notebook's name.

	returns: the notebook's details, or an error.
*/
func GetNotebookDetails(name string) (*NotebookDetails, error) {
	encryptedNotebook, err := readNotebook(name)
	if err != nil {
		return nil, err
	}

	return &NotebookDetails{
		Name: encryptedNotebook.Name,
		Description: encryptedNotebook.Description,
		CreateTime: encryptedNotebook.CreateTime,
		EditTime: encryptedNotebook.EditTime,
	}, nil
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
	if err != nil {
		return nil, err
	}

	return notebook, nil
}

/*
SetNotebookName changes a notebook's name and file name.

	name:    the notebook's current name.
	newName: the notebook's new name.

	returns: the updated notebook, or an error.
*/
func SetNotebookName(name string, newName string) (*EncryptedNotebook, error) {
	if len(newName) < notebookNameMinLength || len(newName) > notebookNameMaxLength {
		return nil, fmt.Errorf("new notebook name must be between %d and %d characters in length", notebookNameMinLength, notebookNameMaxLength)
	}

	notebook, err := readNotebook(name)
	if err != nil {
		return nil, err
	}

	oldFilename := cleanFileName(notebook.Name)
	oldFilepath := fmt.Sprintf("%s/%s%s", notebooksDir, oldFilename, notebookFileExt)
	notebook.Name = newName

	err = writeNotebook(notebook)
	if err != nil {
		return nil, err
	}

	err = os.Remove(oldFilepath)
	if err != nil {
		log.Printf("Error occurred deleting old notebook file (%s): %s", oldFilepath, err)
		return nil, fmt.Errorf("an unexpected error occurred while renaming the notebook, check the logs for more details")
	}

	return notebook, nil
}

/*
SetNotebookDescription changes a notebook's description.

	name:           the notebook's name.
	newDescription: the notebook's new description.

	returns:        the updated notebook, or an error.
*/
func SetNotebookDescription(name string, newDescription string) (*EncryptedNotebook, error) {
	if len(newDescription) < notebookDescriptionMinLength || len(newDescription) > notebookDescriptionMaxLength {
		return nil, fmt.Errorf("new notebook description must be between %d and %d characters in length", notebookDescriptionMinLength, notebookDescriptionMaxLength)
	}

	notebook, err := readNotebook(name)
	if err != nil {
		return nil, err
	}

	notebook.Description = newDescription

	err = writeNotebook(notebook)
	if err != nil {
		return nil, err
	}

	return notebook, nil
}

/*
SetNotebookKey changes a notebook's key.

	name:    the notebook's name.
	key:     the notebook key.
	newKey:  the new notebook key.

	returns: an error, if one occurs.
*/
func SetNotebookKey(name string, key string, newKey string) error {
	if len(newKey) < notebookKeyMinLength || len(newKey) > notebookKeyMaxLength {
		return fmt.Errorf("notebook key must be between %d and %d characters in length", notebookKeyMinLength, notebookKeyMaxLength)
	}

	notebook, err := OpenNotebook(name, key)
	if err != nil {
		return err
	}

	encryptedNotebook, err := encryptNotebook(notebook, newKey)
	if err != nil {
		return err
	}

	err = writeNotebook(encryptedNotebook)
	if err != nil {
		return err
	}

	return nil
}

/*
DeleteNotebook deletes a notebook from the file system and requires the notebook key as confirmation.

	name:    the notebook's name.
	key:     the notebook key, used as deletion confirmation.

	returns: an error, if one occurs.
*/
func DeleteNotebook(name string, key string) error {
	_, err := OpenNotebook(name, key)
	if err != nil {
		return err
	}

	filename := cleanFileName(name)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	err = os.Remove(filepath)
	if err != nil {
		log.Printf("Error occurred deleting the notebook file (%s): %s", filepath, err)
		return fmt.Errorf("an unexpected error occurred while deleting the notebook, check the logs for more details")
	}

	return nil
}
