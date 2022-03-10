package services

import (
	"fmt"
	"log"
	"regexp"
	"strings"
	"time"
)

const (
	entryNameMinLength = 1
	entryNameMaxLength = 256
	entryContentMinLength = 0
	entryContentMaxLength = 65536
	entryQueryMinLength = 0
	entryQueryMaxLength = 1024
)

// updateNotebookEntryEditTime updates a notebook entry's edited timestamp
func updateNotebookEntryEditTime(notebook *DecryptedNotebook, entryName string) {
	notebook.Content.Entries[entryName].EditTime = time.Now()
	updateNotebookEditTime(notebook)
}

/*
CreateNotebookEntry creates an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the new entry.

	returns:      the new notebook entry, or an error.
*/
func CreateNotebookEntry(notebookName string, notebookKey string, entryName string) (*NotebookEntry, error) {
	if len(entryName) < entryNameMinLength || len(entryName) > entryNameMaxLength {
		return nil, fmt.Errorf("notebook entry name must be between %d and %d characters in length", entryNameMinLength, entryNameMaxLength)
	}

	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return nil, err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	newEntry := NotebookEntry{
		Name: entryName,
		CreateTime: time.Now(),
		EditTime: time.Time{},
		Content: "",
	}

	if _, ok := decryptedNotebook.Content.Entries[entryName]; ok {
		return nil, fmt.Errorf("an entry with the specified name already exists in this notebook")
	}

	decryptedNotebook.Content.Entries[entryName] = &newEntry
	updateNotebookEditTime(decryptedNotebook)

	encryptedNotebook, err = encryptNotebook(decryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	err = writeNotebook(encryptedNotebook)
	if err != nil {
		return nil, err
	}

	return &newEntry, nil
}

/*
ListNotebookEntries lists all entries in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.

	returns:      the list of notebook entries as a mapping with entry names as keys, or an error.
*/
func ListNotebookEntries(notebookName string, notebookKey string) (map[string]*NotebookEntry, error) {
	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return nil, err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	return decryptedNotebook.Content.Entries, nil
}

/*
GetNotebookEntry gets an entry from the notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the entry.

	returns:      the notebook entry, or an error.
*/
func GetNotebookEntry(notebookName string, notebookKey string, entryName string) (*NotebookEntry, error) {
	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return nil, err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	if entry, ok := decryptedNotebook.Content.Entries[entryName]; ok {
		return entry, nil
	} else {
		return nil, fmt.Errorf("an entry with the specified name does not exist in this notebook")
	}
}

/*
SetNotebookEntryName changes the name of an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the entry.
	newEntryName: the new name of the entry.

	returns:      the notebook entry, or an error.
*/
func SetNotebookEntryName(notebookName string, notebookKey string, entryName string, newEntryName string) (*NotebookEntry, error) {
	if len(newEntryName) < entryNameMinLength || len(newEntryName) > entryNameMaxLength {
		return nil, fmt.Errorf("new notebook entry name must be between %d and %d characters in length", entryNameMinLength, entryNameMaxLength)
	}

	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return nil, err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	if _, ok := decryptedNotebook.Content.Entries[entryName]; !ok {
		return nil, fmt.Errorf("an entry with the specified name does not exist in this notebook")
	}

	if _, ok := decryptedNotebook.Content.Entries[newEntryName]; ok {
		return nil, fmt.Errorf("an entry with the specified new name already exists in this notebook")
	}

	entry := decryptedNotebook.Content.Entries[entryName]
	entry.Name = newEntryName
	delete(decryptedNotebook.Content.Entries, entryName)
	decryptedNotebook.Content.Entries[newEntryName] = entry
	updateNotebookEntryEditTime(decryptedNotebook, newEntryName)

	encryptedNotebook, err = encryptNotebook(decryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	err = writeNotebook(encryptedNotebook)
	if err != nil {
		return nil, err
	}

	return entry, nil
}

/*
SetNotebookEntryContent sets the content of an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the entry.
	newContent:   the new entry content.

	returns:      the notebook entry, or an error.
*/
func SetNotebookEntryContent(notebookName string, notebookKey string, entryName string, newContent string) (*NotebookEntry, error) {
	if len(newContent) < entryContentMinLength || len(newContent) > entryContentMaxLength {
		return nil, fmt.Errorf("new notebook entry content must be between %d and %d characters in length", entryContentMinLength, entryContentMaxLength)
	}

	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return nil, err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	if _, ok := decryptedNotebook.Content.Entries[entryName]; !ok {
		return nil, fmt.Errorf("an entry with the specified name does not exist in this notebook")
	}

	decryptedNotebook.Content.Entries[entryName].Content = newContent
	updateNotebookEntryEditTime(decryptedNotebook, entryName)

	encryptedNotebook, err = encryptNotebook(decryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	err = writeNotebook(encryptedNotebook)
	if err != nil {
		return nil, err
	}

	return decryptedNotebook.Content.Entries[entryName], nil
}

/*
SearchNotebookEntries searches through a notebook's entries for query matches.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	query:        the query string.
	regexSearch:  whether the search is a regex search.

	returns:      the matched notebook entries as a mapping with entry names as keys, or an error.
*/
func SearchNotebookEntries(notebookName string, notebookKey string, query string, regexSearch bool) (map[string]*NotebookEntry, error) {
	if len(query) < entryQueryMinLength || len(query) > entryQueryMaxLength {
		return nil, fmt.Errorf("notebook entry query must be between %d and %d characters in length", entryQueryMinLength, entryQueryMaxLength)
	}

	filename := cleanFileName(notebookName)
	filepath := fmt.Sprintf("%s/%s%s", notebooksDir, filename, notebookFileExt)

	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return nil, err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return nil, err
	}

	matches := make(map[string]*NotebookEntry)

	if query == "" {
		return matches, nil
	}

	for entryName, entry := range decryptedNotebook.Content.Entries {
		if !regexSearch {
			entryNameLower := strings.ToLower(entryName)
			entryContentLower := strings.ToLower(entry.Content)
			queryLower := strings.ToLower(query)

			if strings.Contains(entryNameLower, queryLower) || strings.Contains(entryContentLower, queryLower) {
				matches[entryName] = entry
			}
		} else {
			nameMatch, err := regexp.MatchString(query, entryName)
			if err != nil {
				log.Printf("Error occurred performing notebook entry name regex search (%s): %s", filepath, err)
				return nil, fmt.Errorf("%s", err)
			}

			contentMatch, err := regexp.MatchString(query, entry.Content)
			if err != nil {
				log.Printf("Error occurred performing notebook entry content regex search (%s): %s", filepath, err)
				return nil, fmt.Errorf("%s", err)
			}

			if nameMatch || contentMatch {
				matches[entryName] = entry
			}
		}
	}

	return matches, nil
}

/*
DeleteNotebookEntry deletes an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the entry.

	returns:      an error, if one occurs.
*/
func DeleteNotebookEntry(notebookName string, notebookKey string, entryName string) error {
	encryptedNotebook, err := readNotebook(notebookName)
	if err != nil {
		return err
	}

	decryptedNotebook, err := decryptNotebook(encryptedNotebook, notebookKey)
	if err != nil {
		return err
	}

	if _, ok := decryptedNotebook.Content.Entries[entryName]; !ok {
		return fmt.Errorf("an entry with the specified name does not exist in this notebook")
	}

	delete(decryptedNotebook.Content.Entries, entryName)
	updateNotebookEditTime(decryptedNotebook)

	encryptedNotebook, err = encryptNotebook(decryptedNotebook, notebookKey)
	if err != nil {
		return err
	}

	err = writeNotebook(encryptedNotebook)
	if err != nil {
		return err
	}

	return nil
}
