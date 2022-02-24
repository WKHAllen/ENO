/**
 * An entry in a notebook.
 */
export interface NotebookEntry {
  name: string;
  createTime: string;
  editTime: string;
  content: string;
}

/**
 * The decrypted content of a notebook.
 */
export interface NotebookContent {
  entries: {
    [entryName: string]: NotebookEntry;
  };
}

/**
 * An encrypted notebook.
 */
export interface EncryptedNotebook {
  name: string;
  description: string;
  createTime: Date;
  editTime: Date;
  content: string;
}

/**
 * A decrypted notebook.
 */
export interface DecryptedNotebook {
  name: string;
  description: string;
  createTime: Date;
  editTime: Date;
  content: NotebookContent;
}

/**
 * A notebook's details.
 */
export interface NotebookDetails {
  name: string;
  description: string;
  createTime: Date;
  editTime: Date;
}
