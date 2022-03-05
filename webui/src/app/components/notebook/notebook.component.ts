import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
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
              this.notebookKey = result.notebookKey;
              this.sortedEntries = Object.values(this.notebook.content.entries);
              this.numEntries = Object.keys(
                this.notebook.content.entries
              ).length;
            } else {
              this.location.back();
            }

            this.loading = false;
          });
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
  public openCreateEntryDialog(): void {
    const dialog = this.dialogService.open<
      CreateEntryDialogComponent,
      CreateEntryDialogData,
      CreateEntryDialogReturn
    >(CreateEntryDialogComponent, {
      data: {
        notebookName: this.notebookName,
        notebookKey: this.notebookKey,
      },
    });

    dialog.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.openEntry(result.entry.name);
      }
    });
  }

  /**
   * Open the entry editing dialog.
   */
  public openEditNotebookDialog(): void {}

  /**
   * Open the entry deletion confirmation dialog.
   */
  public openDeleteNotebookConfirmationDialog(): void {}
}
