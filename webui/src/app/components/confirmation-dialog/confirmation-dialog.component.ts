import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * The data passed to the confirmation dialog.
 */
export interface ConfirmationDialogData {
  title: string;
  text: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

/**
 * A generic confirmation dialog.
 */
@Component({
  selector: 'eno-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<
      ConfirmationDialogComponent,
      boolean
    >,
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmationDialogData
  ) {}

  /**
   * Close the confirmation dialog.
   *
   * @param confirmed Whether the action was confirmed.
   */
  public close(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
