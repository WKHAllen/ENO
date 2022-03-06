import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotebookService } from '../../services/notebook/notebook.service';
import { EntryService } from '../../services/entry/entry.service';
import { ErrorService } from '../../services/error/error.service';
import { DialogService } from '../../services/dialog/dialog.service';
import {
  NotebookEntry,
  NotebookDetails,
  DecryptedNotebook,
} from '../../services/notebook/notebook.interface';
import {
  OpenNotebookDialogComponent,
  OpenNotebookDialogData,
  OpenNotebookDialogReturn,
} from '../open-notebook-dialog/open-notebook-dialog.component';

/**
 * View and edit a notebook entry.
 */
@Component({
  selector: 'eno-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  public loading = true;
  private notebookName = '';
  private notebookKey = '';
  private entryName = '';
  public notebookDetails: NotebookDetails | undefined;
  public notebook: DecryptedNotebook | undefined;
  public entry: NotebookEntry | undefined;
  public entryEditorContent: string | undefined;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly dialogService: DialogService,
    private readonly notebookService: NotebookService,
    private readonly entryService: EntryService,
    private readonly errorService: ErrorService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      this.notebookName = paramMap.get('notebookName') || '';
      this.entryName = paramMap.get('entryName') || '';

      try {
        this.notebookDetails = await this.notebookService.getNotebookDetails(
          this.notebookName
        );

        this.loading = false;
      } catch (err) {
        this.errorService.showError({
          message: String(err),
        });
        return;
      }

      this.activatedRoute.queryParamMap.subscribe(async (queryParamMap) => {
        this.notebookKey = queryParamMap.get('key') || '';

        if (this.notebookKey !== '') {
          await this.getEntry();
        } else {
          try {
            const result = await this.dialogService.showDialog<
              OpenNotebookDialogComponent,
              OpenNotebookDialogData,
              OpenNotebookDialogReturn
            >(OpenNotebookDialogComponent, {
              data: {
                notebookDetails: this.notebookDetails as NotebookDetails,
              },
            });

            this.notebook = result.notebook;
            this.notebookKey = result.notebookKey;

            await this.getEntry();
          } catch (_) {
            this.location.back();
          }

          this.loading = false;
        }
      });
    });
  }

  /**
   * Retrieve the notebook entry.
   */
  public async getEntry(): Promise<void> {
    this.loading = true;

    try {
      this.entry = await this.entryService.getNotebookEntry(
        this.notebookName,
        this.notebookKey,
        this.entryName
      );
      this.entryEditorContent = this.entry.content;
    } catch (err) {
      this.errorService.showError({
        message: String(err),
      });
    }

    this.loading = false;
  }

  /**
   * Open the notebook associated with the current entry.
   */
  public async openNotebook(): Promise<void> {
    await this.router.navigate(['notebook', this.notebookName], {
      queryParams: { key: this.notebookKey },
    });
  }
}
