package services

/*
CreateNotebookEntry creates an entry in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the new entry.

	returns:      the new notebook entry, or an error.
*/
func CreateNotebookEntry(notebookName string, notebookKey string, entryName string) (*NotebookEntry, error) {
	panic("UNIMPLEMENTED")

	return nil, nil
}

/*
ListNotebookEntries lists all entries in a notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.

	returns:      the list of notebook entries, or an error.
*/
func ListNotebookEntries(notebookName string, notebookKey string) ([]*NotebookEntry, error) {
	panic("UNIMPLEMENTED")

	return nil, nil
}

/*
GetNotebookEntry gets an entry from the notebook.

	notebookName: the notebook's name.
	notebookKey:  key to encrypt/decrypt the notebook.
	entryName:    the name of the entry.

	returns:      the notebook entry, or an error.
*/
func GetNotebookEntry(notebookName string, notebookKey string, entryName string) (*NotebookEntry, error) {
	panic("UNIMPLEMENTED")

	return nil, nil
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
