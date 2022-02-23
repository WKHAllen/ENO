import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import { notebookConstants, formAppearance } from '../../util';

/**
 * The create notebook form.
 */
interface CreateNotebookForm {
  notebookName: string;
  notebookDescription: string;
  notebookKey: string;
  notebookKeyConfirm: string;
}

/**
 * The dialog for notebook creation.
 */
@Component({
  selector: 'eno-create-notebook-dialog',
  templateUrl: './create-notebook-dialog.component.html',
  styleUrls: ['./create-notebook-dialog.component.scss'],
})
export class CreateNotebookDialogComponent {
  public hideKey = true;
  public hideConfirmKey = true;
  public notebookConstants = notebookConstants;
  public formAppearance = formAppearance;

  constructor(
    private readonly dialogRef: MatDialogRef<{}, {}>,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService
  ) {}

  /**
   * Close the dialog.
   *
   * @param result The resulting data to be returned when the dialog closes.
   */
  public close(result?: boolean): void {
    this.dialogRef.close(result);
  }

  /**
   * Create the notebook.
   */
  public async onCreateNotebook(form: CreateNotebookForm): Promise<void> {
    if (form.notebookKey !== form.notebookKeyConfirm) {
      this.errorService.showError({ message: 'notebook keys must match' });
      return;
    }

    try {
      await this.notebookService.createNotebook(
        form.notebookName,
        form.notebookDescription,
        form.notebookKey
      );

      this.close(true);
    } catch (err) {
      this.errorService.showError({
        message: String(err),
      });
    }
  }
}
