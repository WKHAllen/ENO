import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Parameters for displaying errors.
 */
interface ShowErrorParams {
  message: string;
  showDismiss?: boolean;
  duration?: number;
  actionName?: string;
  cssClass?: string;
  includeErrorPrefix?: boolean;
}

/**
 * Parameter defaults.
 */
const showDismissDefault = true;
const actionNameDefault = 'Close';
const cssClassDefault = 'snackbar';
const includeErrorPrefixDefault = true;
const errorPrefix = 'Error: ';

/**
 * Display errors.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Display an error message.
   *
   * @param params The display parameters.
   */
  public showError(params: ShowErrorParams): void {
    const includeErrorPrefix =
      params.includeErrorPrefix ?? includeErrorPrefixDefault;
    const messagePrefix = includeErrorPrefix ? errorPrefix : '';
    const message = messagePrefix + params.message;
    const showDismiss = params.showDismiss ?? showDismissDefault;
    const duration = params.duration ?? undefined;
    const actionName = showDismiss
      ? params.actionName ?? actionNameDefault
      : undefined;
    const cssClass = params.cssClass ?? cssClassDefault;

    this.snackBar.open(message, actionName, {
      duration,
      panelClass: cssClass,
    });
  }
}
