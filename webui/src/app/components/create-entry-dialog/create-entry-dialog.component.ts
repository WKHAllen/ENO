import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntryService } from '../../services/entry/entry.service';
import { ErrorService } from '../../services/error/error.service';
import { NotebookEntry } from '../../services/notebook/notebook.interface';
import { notebookConstants, formAppearance } from '../../util';

/**
 * The data passed to the create notebook entry dialog.
 */
export interface CreateEntryDialogData {
  notebookName: string;
  notebookKey: string;
}

/**
 * The data returned from the create notebook entry dialog.
 */
export interface CreateEntryDialogReturn {
  entry: NotebookEntry;
}

/**
 * The create entry form.
 */
interface CreateEntryForm {
  entryName: string;
}

/**
 * A dialog for creating a new entry in a notebook.
 */
@Component({
  selector: 'eno-create-entry-dialog',
  templateUrl: './create-entry-dialog.component.html',
  styleUrls: ['./create-entry-dialog.component.scss'],
})
export class CreateEntryDialogComponent {
  public notebookConstants = notebookConstants;
  public formAppearance = formAppearance;

  constructor(
    private readonly dialogRef: MatDialogRef<
      CreateEntryDialogComponent,
      CreateEntryDialogReturn
    >,
    @Inject(MAT_DIALOG_DATA) public readonly data: CreateEntryDialogData,
    private readonly entryService: EntryService,
    private readonly errorService: ErrorService
  ) {}

  /**
   * Close the dialog.
   *
   * @param result The resulting data to be returned when the dialog closes.
   */
  public close(result?: CreateEntryDialogReturn): void {
    this.errorService.close();
    this.dialogRef.close(result);
  }

  /**
   * Create a new entry.
   *
   * @param form The create entry form.
   */
  public async createEntry(form: CreateEntryForm): Promise<void> {
    try {
      const entry = await this.entryService.createNotebookEntry(
        this.data.notebookName,
        this.data.notebookKey,
        form.entryName
      );

      this.close({ entry });
    } catch (err) {
      this.errorService.showError({
        message: String(err),
      });
    }
  }
}
