import { Injectable } from '@angular/core';
import { APIService } from '../api/api.service';
import {
  DecryptedNotebook,
  EncryptedNotebook,
  NotebookDetails,
} from './notebook.interface';

/**
 * Notebook service.
 */
@Injectable({
  providedIn: 'root',
})
export class NotebookService {
  private readonly subPath = 'notebook';

  constructor(private readonly api: APIService) {}

  /**
   * Create a new notebook.
   *
   * @param name The name of the new notebook.
   * @param description The notebook's description.
   * @param key The key to use to encrypt the notebook.
   * @returns The created notebook.
   */
  public async createNotebook(
    name: string,
    description: string,
    key: string
  ): Promise<DecryptedNotebook> {
    return this.api.post<DecryptedNotebook>(this.subPath, {
      name,
      description,
      key,
    });
  }

  /**
   * List all notebooks.
   *
   * @returns All encrypted notebooks.
   */
  public async listNotebooks(): Promise<EncryptedNotebook[]> {
    return this.api.get<EncryptedNotebook[]>(this.subPath + '/all');
  }

  /**
   * Get a notebook's details.
   *
   * @param name The notebook's name.
   * @returns The notebook's details.
   */
  public async getNotebookDetails(name: string): Promise<NotebookDetails> {
    return this.api.get<NotebookDetails>(this.subPath + '/details', { name });
  }

  /**
   * Open a specified notebook.
   *
   * @param name The notebook's name.
   * @param key The key to decrypt the notebook.
   * @returns The decrypted notebook.
   */
  public async openNotebook(
    name: string,
    key: string
  ): Promise<DecryptedNotebook> {
    return this.api.get<DecryptedNotebook>(this.subPath, { name, key });
  }

  /**
   * Set a notebook's name.
   *
   * @param name The notebook's current name.
   * @param newName The notebook's new name.
   * @returns The updated notebook.
   */
  public async setNotebookName(
    name: string,
    newName: string
  ): Promise<EncryptedNotebook> {
    return this.api.patch<EncryptedNotebook>(this.subPath + '/name', {
      name,
      newName,
    });
  }

  /**
   * Set a notebook's description.
   *
   * @param name The notebook's name.
   * @param newDescription The notebook's new description.
   * @returns The updated notebook.
   */
  public async setNotebookDescription(
    name: string,
    newDescription: string
  ): Promise<EncryptedNotebook> {
    return this.api.patch<EncryptedNotebook>(this.subPath + '/description', {
      name,
      newDescription,
    });
  }

  /**
   * Delete a notebook.
   *
   * @param name The notebook's name.
   * @param key The notebook key, used as deletion confirmation.
   */
  public async deleteNotebook(name: string, key: string): Promise<void> {
    return this.api.delete(this.subPath, { name, key });
  }
}
