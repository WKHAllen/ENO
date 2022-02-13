import { NotebookEntry } from '../notebook/notebook.interface';

/**
 * A map of entries in a notebook.
 */
export interface NotebookEntryMap {
  [entryName: string]: NotebookEntry;
}
