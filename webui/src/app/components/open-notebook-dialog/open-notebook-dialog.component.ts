import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import {
  DecryptedNotebook,
  NotebookDetails,
} from '../../services/notebook/notebook.interface';
import { notebookConstants, formAppearance } from '../../util';

/**
 * The data passed to the open notebook dialog.
 */
export interface OpenNotebookDialogData {
  notebookDetails: NotebookDetails;
}

/**
 * The data returned from the open notebook dialog.
 */
export interface OpenNotebookDialogReturn {
  notebook: DecryptedNotebook;
  notebookKey: string;
}

/**
 * The open notebook form.
 */
interface OpenNotebookForm {
  notebookKey: string;
}

/**
 * A dialog for unlocking a notebook.
 */
@Component({
  selector: 'eno-open-notebook-dialog',
  templateUrl: './open-notebook-dialog.component.html',
  styleUrls: ['./open-notebook-dialog.component.scss'],
})
export class OpenNotebookDialogComponent {
  public hideKey = true;
  public notebookConstants = notebookConstants;
  public formAppearance = formAppearance;

  constructor(
    private readonly dialogRef: MatDialogRef<
      OpenNotebookDialogComponent,
      OpenNotebookDialogReturn
    >,
    @Inject(MAT_DIALOG_DATA) public readonly data: OpenNotebookDialogData,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService
  ) {}

  /**
   * Close the dialog.
   *
   * @param result The resulting data to be returned when the dialog closes.
   */
  public close(result?: OpenNotebookDialogReturn): void {
    this.errorService.close();
    this.dialogRef.close(result);
  }

  /**
   * Attempt to open a notebook.
   */
  public async openNotebook(form: OpenNotebookForm): Promise<void> {
    try {
      const notebook = await this.notebookService.openNotebook(
        this.data.notebookDetails.name,
        form.notebookKey
      );

      this.close({ notebook, notebookKey: form.notebookKey });
    } catch (err) {
      this.errorService.showError({
        message: String(err),
      });
    }
  }
}
