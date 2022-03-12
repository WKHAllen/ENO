import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { SettingsService } from '../../services/settings/settings.service';
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
  private sort: Sort = {
    active: 'editTime',
    direction: 'desc',
  };

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly dialogService: DialogService,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService,
    private readonly settingsService: SettingsService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      this.notebookName = paramMap.get('notebookName') || '';

      try {
        this.notebookDetails = await this.notebookService.getNotebookDetails(
          this.notebookName
        );

        this.loading = false;
        this.errorService.close();
      } catch (err) {
        this.errorService.showError({
          message: String(err),
        });
        return;
      }

      this.activatedRoute.queryParamMap.subscribe(async (queryParamMap) => {
        this.notebookKey = queryParamMap.get('key') || '';

        if (this.notebookKey !== '') {
          const sort = await this.settingsService.getSettingsOption<Sort>(
            'EntrySort'
          );

          if (sort) {
            this.sort = sort;
          }

          await this.getNotebook();
          await this.sortEntries();
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

            await this.router.navigate(['notebook', this.notebookName], {
              queryParams: { key: result.notebookKey },
            });
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
      this.errorService.close();
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
  public async sortEntries(sort?: Sort): Promise<void> {
    if (this.notebook) {
      if (sort) {
        this.sort = sort;
      }

      this.sortedEntries = sortData(
        Object.values(this.notebook.content.entries),
        this.sort
      );
      await this.settingsService.setSettingsOption('EntrySort', this.sort);
    }
  }

  /**
   * Open a notebook entry.
   *
   * @param entryName The name of the notebook entry.
   */
  public async openEntry(entryName: string): Promise<void> {
    await this.router.navigate(
      ['notebook', this.notebookName, 'entry', entryName],
      { queryParams: { key: this.notebookKey } }
    );
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
   * Go to the notebook search page.
   */
  public async openSearchEntriesPage(): Promise<void> {
    await this.router.navigate(['notebook', this.notebookName, 'search'], {
      queryParams: { key: this.notebookKey },
    });
  }

  /**
   * Open the notebook editing dialog.
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

      await this.router.navigate(['notebook', result.notebookName], {
        queryParams: { key: result.notebookKey },
      });
    } catch (_) {}
  }

  /**
   * Open the notebook deletion confirmation dialog.
   */
  public async openDeleteNotebookConfirmationDialog(): Promise<void> {
    const confirmed = await this.dialogService.showConfirmationDialog({
      data: {
        title: 'Delete notebook',
        text: 'Are you sure you want to delete this notebook? This action cannot be undone.',
      },
    });

    if (confirmed) {
      try {
        await this.notebookService.deleteNotebook(
          this.notebookName,
          this.notebookKey
        );

        this.errorService.close();
        await this.router.navigate(['/']);
      } catch (err) {
        this.errorService.showError({
          message: String(err),
        });
      }
    }
  }
}
