import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../components/confirmation-dialog/confirmation-dialog.component';

/**
 * Open dialogs and pass data to them.
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  /**
   * Open a dialog.
   *
   * @param component The dialog component.
   * @param config The dialog configuration.
   * @returns The data returned from the dialog.
   */
  public async showDialog<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const dialog = this.dialog.open<T, D, R>(component, config);

      dialog.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          resolve(result);
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Open a confirmation dialog.
   *
   * @param config The dialog configuration.
   * @returns Whether the action was confirmed.
   */
  public async showConfirmationDialog(
    config: MatDialogConfig<ConfirmationDialogData>
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const dialog = this.dialog.open<
        ConfirmationDialogComponent,
        ConfirmationDialogData,
        boolean
      >(ConfirmationDialogComponent, config);

      dialog
        .afterClosed()
        .subscribe((confirmed) => resolve(confirmed ?? false));
    });
  }
}
