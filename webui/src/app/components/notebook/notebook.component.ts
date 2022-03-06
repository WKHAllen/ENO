import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import { DialogService } from '../../services/dialog/dialog.service';
import {
  OpenNotebookDialogComponent,
  OpenNotebookDialogData,
  OpenNotebookDialogReturn,
} from '../open-notebook-dialog/open-notebook-dialog.component';
import {
  CreateEntryDialogComponent,
  CreateEntryDialogData,
  CreateEntryDialogReturn,
} from '../create-entry-dialog/create-entry-dialog.component';
import {
  EditNotebookDialogComponent,
  EditNotebookDialogData,
  EditNotebookDialogReturn,
} from '../edit-notebook-dialog/edit-notebook-dialog.component';
import {
  DecryptedNotebook,
  NotebookDetails,
  NotebookEntry,
} from '../../services/notebook/notebook.interface';
import { sortData } from '../../util';

/**
 * View and edit a notebook.
 */
@Component({
  selector: 'eno-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss'],
})
export class NotebookComponent implements OnInit {
  public loading = true;
  private notebookName = '';
  private notebookKey = '';
  public notebookDetails: NotebookDetails | undefined;
  public notebook: DecryptedNotebook | undefined;
  public sortedEntries: NotebookEntry[] = [];
  public numEntries = 0;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly dialogService: DialogService,
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
          await this.getNotebook();
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
            this.sortedEntries = Object.values(this.notebook.content.entries);
            this.numEntries = Object.keys(this.notebook.content.entries).length;
          } catch (_) {
            this.location.back();
          }

          this.loading = false;
        }
      });
    });
  }

  /**
   * Retrieve the notebook.
   */
  public async getNotebook(): Promise<void> {
    this.loading = true;

    try {
      this.notebook = await this.notebookService.openNotebook(
        this.notebookName,
        this.notebookKey
      );
      this.sortedEntries = Object.values(this.notebook.content.entries);
      this.numEntries = Object.keys(this.notebook.content.entries).length;
    } catch (err) {
      this.errorService.showError({
        message: String(err),
      });
    }

    this.loading = false;
  }

  /**
   * Sort the existing notebook entries.
   *
   * @param sort The sort parameters.
   */
  public sortEntries(sort: Sort): void {
    if (this.notebook) {
      this.sortedEntries = sortData(
        Object.values(this.notebook.content.entries),
        sort
      );
    }
  }

  /**
   * Open a notebook entry.
   *
   * @param entryName The name of the notebook entry.
   */
  public async openEntry(entryName: string): Promise<void> {
    await this.router.navigate([
      'notebook',
      this.notebookName,
      'entry',
      entryName,
    ]);
  }

  /**
   * Open the entry creation dialog.
   */
  public async openCreateEntryDialog(): Promise<void> {
    try {
      const result = await this.dialogService.showDialog<
        CreateEntryDialogComponent,
        CreateEntryDialogData,
        CreateEntryDialogReturn
      >(CreateEntryDialogComponent, {
        data: {
          notebookName: this.notebookName,
          notebookKey: this.notebookKey,
        },
      });

      await this.openEntry(result.entry.name);
    } catch (_) {}
  }

  /**
   * Open the entry editing dialog.
   */
  public async openEditNotebookDialog(): Promise<void> {
    try {
      const result = await this.dialogService.showDialog<
        EditNotebookDialogComponent,
        EditNotebookDialogData,
        EditNotebookDialogReturn
      >(EditNotebookDialogComponent, {
        data: {
          notebookName: this.notebookName,
          notebookDescription: (this.notebook?.description ||
            this.notebookDetails?.description) as string,
          notebookKey: this.notebookKey,
        },
      });

      this.notebookName = result.notebookName;
      this.notebookKey = result.notebookKey;
      await this.getNotebook();
    } catch (_) {}
  }

  /**
   * Open the entry deletion confirmation dialog.
   */
  public openDeleteNotebookConfirmationDialog(): void {}
}
