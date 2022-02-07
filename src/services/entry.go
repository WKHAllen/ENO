package services

import (
	"fmt"
	"time"
)

// updateNotebookEditTime updates a notebook's edited timestamp
func updateNotebookEditTime(notebook *DecryptedNotebook) {
	notebook.EditTime = time.Now()
}

/*
CreateNotebookEntry creates an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the new entry.

	returns:      the new notebook entry, or an error.
*/
func CreateNotebookEntry(notebookName string, notebookKey string, entryName string) (*NotebookEntry, error) {
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

	decryptedNotebook.Content.Entries[entryName] = newEntry
	updateNotebookEditTime(decryptedNotebook)

	encryptedNotebook = encryptNotebook(decryptedNotebook, notebookKey)
	writeNotebook(encryptedNotebook)

	return &newEntry, nil
}

/*
ListNotebookEntries lists all entries in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.

	returns:      the list of notebook entries as a mapping with entry names as keys, or an error.
*/
func ListNotebookEntries(notebookName string, notebookKey string) (map[string]NotebookEntry, error) {
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
		return &entry, nil
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
	panic("UNIMPLEMENTED")

	return nil, nil
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
	panic("UNIMPLEMENTED")

	return nil, nil
}

/*
SearchNotebookEntries searches through a notebook's entries for query matches.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	query:        the query string.
	regexSearch:  whether the search is a regex search.

	returns:      the matched notebook entries, or an error.
*/
func SearchNotebookEntries(notebookName string, notebookKey string, query string, regexSearch bool) ([]*NotebookEntry, error) {
	panic("UNIMPLEMENTED")

	return nil, nil
}

/*
DeleteNotebookEntry deletes an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the entry.

	returns:      an error, if one occurs.
*/
func DeleteNotebookEntry(notebookName string, notebookKey string, entryName string) error {
	panic("UNIMPLEMENTED")

	return nil
}
