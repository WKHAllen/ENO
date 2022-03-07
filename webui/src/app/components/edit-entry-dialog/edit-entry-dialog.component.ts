import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntryService } from '../../services/entry/entry.service';
import { ErrorService } from '../../services/error/error.service';
import { notebookConstants, formAppearance } from '../../util';

/**
 * The data passed to the edit entry dialog.
 */
export interface EditEntryDialogData {
  notebookName: string;
  notebookKey: string;
  entryName: string;
}

/**
 * The data returned from the edit entry dialog.
 */
export interface EditEntryDialogReturn {
  entryName: string;
}

/**
 * The edit notebook entry form.
 */
interface EditEntryForm {
  entryName: string;
}

/**
 * A dialog for editing the entry details.
 */
@Component({
  selector: 'eno-edit-entry-dialog',
  templateUrl: './edit-entry-dialog.component.html',
  styleUrls: ['./edit-entry-dialog.component.scss'],
})
export class EditEntryDialogComponent {
  public entryName: string;
  public notebookConstants = notebookConstants;
  public formAppearance = formAppearance;

  constructor(
    private readonly dialogRef: MatDialogRef<
      EditEntryDialogComponent,
      EditEntryDialogReturn
    >,
    @Inject(MAT_DIALOG_DATA) public readonly data: EditEntryDialogData,
    private readonly entryService: EntryService,
    private readonly errorService: ErrorService
  ) {
    this.entryName = this.data.entryName;
  }

  /**
   * Close the dialog.
   *
   * @param result The resulting data to be returned when the dialog closes.
   */
  public close(result?: EditEntryDialogReturn): void {
    this.dialogRef.close(result);
  }

  /**
   * Edit the notebook entry.
   *
   * @param form The edit notebook entry form.
   */
  public async editEntry(form: EditEntryForm): Promise<void> {
    try {
      await this.entryService.setNotebookEntryName(
        this.data.notebookName,
        this.data.notebookKey,
        this.data.entryName,
        form.entryName
      );

      this.close({ entryName: form.entryName });
    } catch (err) {
      this.errorService.showError({ message: String(err) });
    }
  }
}
