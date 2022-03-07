import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import { notebookConstants, formAppearance } from '../../util';

/**
 * The data passed to the edit notebook dialog.
 */
export interface EditNotebookDialogData {
  notebookName: string;
  notebookDescription: string;
  notebookKey: string;
}

/**
 * The data returned from the edit notebook dialog.
 */
export interface EditNotebookDialogReturn {
  notebookName: string;
  notebookKey: string;
}

/**
 * The edit notebook form.
 */
interface EditNotebookForm {
  notebookName: string;
  notebookDescription: string;
  oldNotebookKey: string;
  newNotebookKey: string;
  confirmNewNotebookKey: string;
}

/**
 * A dialog for editing a notebook.
 */
@Component({
  selector: 'eno-edit-notebook-dialog',
  templateUrl: './edit-notebook-dialog.component.html',
  styleUrls: ['./edit-notebook-dialog.component.scss'],
})
export class EditNotebookDialogComponent {
  public notebookName: string;
  public notebookDescription: string;
  public newNotebookName: string | undefined;
  public hideOldKey = true;
  public hideNewKey = true;
  public hideConfirmNewKey = true;
  public notebookConstants = notebookConstants;
  public formAppearance = formAppearance;

  constructor(
    private readonly dialogRef: MatDialogRef<
      EditNotebookDialogComponent,
      EditNotebookDialogReturn
    >,
    @Inject(MAT_DIALOG_DATA) public readonly data: EditNotebookDialogData,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService
  ) {
    this.notebookName = this.data.notebookName;
    this.notebookDescription = this.data.notebookDescription;
  }

  /**
   * Close the dialog.
   *
   * @param result The resulting data to be returned when the dialog closes.
   */
  public close(result?: EditNotebookDialogReturn): void {
    this.dialogRef.close(result);
  }

  /**
   * Edit the notebook.
   *
   * @param form The edit notebook form.
   */
  public async editNotebook(form: EditNotebookForm): Promise<void> {
    let notebookName = this.data.notebookName;
    let notebookKey = this.data.notebookKey;

    try {
      if (
        form.notebookName &&
        form.notebookName !== (this.newNotebookName ?? this.data.notebookName)
      ) {
        await this.notebookService.setNotebookName(
          this.data.notebookName,
          form.notebookName
        );

        notebookName = form.notebookName;
        this.newNotebookName = form.notebookName;
      }

      if (form.notebookDescription !== this.data.notebookDescription) {
        await this.notebookService.setNotebookDescription(
          this.newNotebookName ?? notebookName,
          form.notebookDescription
        );
      }

      if (
        form.oldNotebookKey ||
        form.newNotebookKey ||
        form.confirmNewNotebookKey
      ) {
        if (form.newNotebookKey !== form.confirmNewNotebookKey) {
          this.errorService.showError({ message: 'notebook keys must match' });
          return;
        }

        await this.notebookService.setNotebookKey(
          this.newNotebookName ?? notebookName,
          form.oldNotebookKey,
          form.newNotebookKey
        );

        notebookKey = form.newNotebookKey;
      }

      this.close({
        notebookName: this.newNotebookName ?? notebookName,
        notebookKey,
      });
    } catch (err) {
      this.errorService.showError({ message: String(err) });
    }
  }
}
