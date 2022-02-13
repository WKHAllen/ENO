import { Injectable } from '@angular/core';
import { APIService } from '../api/api.service';
import { NotebookEntryMap } from './entry.interface';
import { NotebookEntry } from '../notebook/notebook.interface';

/**
 * Notebook entry service.
 */
@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private readonly subPath = 'entry/';

  constructor(private readonly api: APIService) {}

  /**
   * Create an entry in a notebook.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to decrypt/encrypt the notebook.
   * @param entryName The name of the new entry.
   * @returns The new notebook entry.
   */
  public async createNotebookEntry(
    notebookName: string,
    notebookKey: string,
    entryName: string
  ): Promise<NotebookEntry> {
    return this.api.post<NotebookEntry>(this.subPath, {
      notebookName,
      notebookKey,
      entryName,
    });
  }

  /**
   * List all entries in a notebook.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to encrypt/decrypt the notebook.
   * @returns The list of notebook entries as a mapping with entry names as keys.
   */
  public async listNotebookEntries(
    notebookName: string,
    notebookKey: string
  ): Promise<NotebookEntryMap> {
    return this.api.get<NotebookEntryMap>(this.subPath + 'all', {
      notebookName,
      notebookKey,
    });
  }

  /**
   * Get an entry from the notebook.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to encrypt/decrypt the notebook.
   * @param entryName The name of the entry.
   * @returns The notebook entry.
   */
  public async getNotebookEntry(
    notebookName: string,
    notebookKey: string,
    entryName: string
  ): Promise<NotebookEntry> {
    return this.api.get<NotebookEntry>(this.subPath, {
      notebookName,
      notebookKey,
      entryName,
    });
  }

  /**
   * Set the name of an entry in a notebook.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to encrypt/decrypt the notebook.
   * @param entryName The name of the entry.
   * @param newEntryName The new name of the entry.
   * @returns The updated notebook entry.
   */
  public async setNotebookEntryName(
    notebookName: string,
    notebookKey: string,
    entryName: string,
    newEntryName: string
  ): Promise<NotebookEntry> {
    return this.api.patch<NotebookEntry>(this.subPath + 'name', {
      notebookName,
      notebookKey,
      entryName,
      newEntryName,
    });
  }

  /**
   * Set the content of an entry in a notebook.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to encrypt/decrypt the notebook.
   * @param entryName The name of the entry.
   * @param newContent The new entry content.
   * @returns The updated entry.
   */
  public async setNotebookEntryContent(
    notebookName: string,
    notebookKey: string,
    entryName: string,
    newContent: string
  ): Promise<NotebookEntry> {
    return this.api.patch<NotebookEntry>(this.subPath + 'content', {
      notebookName,
      notebookKey,
      entryName,
      newContent,
    });
  }

  /**
   * Search through a notebook's entries for query matches.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to encrypt/decrypt the notebook.
   * @param query The query string.
   * @param regexSearch Whether the search is a regex search.
   * @returns The matched notebook entries as a mapping with entry names as keys.
   */
  public async searchNotebookEntries(
    notebookName: string,
    notebookKey: string,
    query: string,
    regexSearch: boolean
  ): Promise<NotebookEntryMap> {
    return this.api.get<NotebookEntryMap>(this.subPath + 'search', {
      notebookName,
      notebookKey,
      query,
      regexSearch,
    });
  }

  /**
   * Delete an entry in a notebook.
   *
   * @param notebookName The notebook's name.
   * @param notebookKey The key to encrypt/decrypt the notebook.
   * @param entryName The name of the entry.
   */
  public async deleteNotebookEntry(
    notebookName: string,
    notebookKey: string,
    entryName: string
  ): Promise<void> {
    return this.api.delete(this.subPath, {
      notebookName,
      notebookKey,
      entryName,
    });
  }
}
