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
    [key: string]: NotebookEntry;
  };
}

/**
 * An encrypted notebook.
 */
export interface EncryptedNotebook {
  name: string;
  description: string;
  createTime: string;
  editTime: string;
  content: string;
}

/**
 * A decrypted notebook.
 */
export interface DecryptedNotebook {
  name: string;
  description: string;
  createTime: string;
  editTime: string;
  content: NotebookContent;
}
