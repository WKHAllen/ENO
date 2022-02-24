import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import {
  OpenNotebookDialogComponent,
  OpenNotebookDialogData,
  OpenNotebookDialogReturn,
} from '../open-notebook-dialog/open-notebook-dialog.component';
import {
  DecryptedNotebook,
  NotebookDetails,
} from '../../services/notebook/notebook.interface';

/**
 * View and edit a notebook.
 */
@Component({
  selector: 'eno-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss'],
})
export class NotebookComponent implements OnInit {
  private notebookName = '';
  private notebookKey = '';
  public notebookDetails: NotebookDetails | undefined;
  public notebook: DecryptedNotebook | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly dialogService: MatDialog,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      this.notebookName = paramMap.get('notebookName') || '';

      try {
        this.notebookDetails = await this.notebookService.getNotebookDetails(
          this.notebookName
        );
      } catch (err) {
        this.errorService.showError({
          message: String(err),
        });
        return;
      }

      this.activatedRoute.queryParamMap.subscribe(async (queryParamMap) => {
        this.notebookKey = queryParamMap.get('key') || '';

        if (this.notebookKey !== '') {
          try {
            this.notebook = await this.notebookService.openNotebook(
              this.notebookName,
              this.notebookKey
            );
          } catch (err) {
            this.errorService.showError({
              message: String(err),
            });
          }
        } else {
          const dialog = this.dialogService.open<
            OpenNotebookDialogComponent,
            OpenNotebookDialogData,
            OpenNotebookDialogReturn
          >(OpenNotebookDialogComponent, {
            data: {
              notebookDetails: this.notebookDetails as NotebookDetails,
            },
          });

          dialog.afterClosed().subscribe((result) => {
            if (result) {
              this.notebook = result.notebook;
            } else {
              this.location.back();
            }
          });
        }
      });
    });
  }
}
