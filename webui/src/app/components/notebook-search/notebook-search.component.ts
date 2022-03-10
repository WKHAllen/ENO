import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { NotebookService } from '../../services/notebook/notebook.service';
import { EntryService } from '../../services/entry/entry.service';
import { ErrorService } from '../../services/error/error.service';
import { DialogService } from '../../services/dialog/dialog.service';
import {
  OpenNotebookDialogComponent,
  OpenNotebookDialogData,
  OpenNotebookDialogReturn,
} from '../open-notebook-dialog/open-notebook-dialog.component';
import {
  DecryptedNotebook,
  NotebookDetails,
  NotebookEntry,
} from '../../services/notebook/notebook.interface';
import { NotebookEntryMap } from '../../services/entry/entry.interface';
import { sortData, notebookConstants, formAppearance } from '../../util';

/**
 * The notebook search form.
 */
interface NotebookSearchForm {
  query: string;
  regexSearch: boolean;
}

/**
 * Search through a notebook's entries.
 */
@Component({
  selector: 'eno-notebook-search',
  templateUrl: './notebook-search.component.html',
  styleUrls: ['./notebook-search.component.scss'],
})
export class NotebookSearchComponent implements OnInit {
  public loading = true;
  private notebookName = '';
  private notebookKey = '';
  public notebookDetails: NotebookDetails | undefined;
  public notebook: DecryptedNotebook | undefined;
  public searchResults: NotebookEntryMap = {};
  public sortedSearchResults: NotebookEntry[] = [];
  public numResults = 0;
  public searched = false;
  public notebookConstants = notebookConstants;
  public formAppearance = formAppearance;

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

            await this.router.navigate(
              ['notebook', this.notebookName, 'search'],
              {
                queryParams: { key: result.notebookKey },
              }
            );
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
    if (this.numResults > 0) {
      this.sortedSearchResults = sortData(
        Object.values(this.searchResults),
        sort
      );
    }
  }

  /**
   * Return to the notebook.
   */
  public async openNotebook(): Promise<void> {
    await this.router.navigate(['notebook', this.notebookName], {
      queryParams: { key: this.notebookKey },
    });
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
   * Search the entries for a given query string.
   *
   * @param form The notebook search form.
   */
  public async searchEntries(form: NotebookSearchForm): Promise<void> {
    if (form.query.length > 0) {
      try {
        this.searchResults = await this.entryService.searchNotebookEntries(
          this.notebookName,
          this.notebookKey,
          form.query,
          form.regexSearch
        );
        this.sortedSearchResults = Object.values(this.searchResults);
        this.numResults = Object.keys(this.searchResults).length;
        this.searched = true;
      } catch (err) {
        this.errorService.showError({
          message: String(err),
        });
      }
    } else {
      this.searchResults = {};
      this.sortedSearchResults = [];
      this.numResults = 0;
      this.searched = false;
    }
  }
}
