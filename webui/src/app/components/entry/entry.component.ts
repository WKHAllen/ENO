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
import {
  EditEntryDialogComponent,
  EditEntryDialogData,
  EditEntryDialogReturn,
} from '../edit-entry-dialog/edit-entry-dialog.component';

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
   * Called when the content changes.
   *
   * @param content The new content.
   */
  public onContentChange(content: string): void {
    this.entryEditorContent = content;
  }

  /**
   * Open the notebook associated with the current entry.
   */
  public async openNotebook(): Promise<void> {
    await this.router.navigate(['notebook', this.notebookName], {
      queryParams: { key: this.notebookKey },
    });
  }

  /**
   * Return to the notebook and confirm that the entry gets saved.
   */
  public async backToNotebook(): Promise<void> {
    if (this.entry?.content !== this.entryEditorContent) {
      const saveEdits = await this.dialogService.showConfirmationDialog({
        data: {
          title: 'Save on close',
          text: 'You have unsaved edits to this entry. Would you like to save them before leaving?',
          cancelLabel: 'No',
          confirmLabel: 'Yes',
        },
      });

      if (saveEdits) {
        await this.saveEntry();
      }
    }

    await this.openNotebook();
  }

  /**
   * Refresh the entry.
   */
  public async refreshEntry(): Promise<void> {
    if (this.entry?.content !== this.entryEditorContent) {
      const saveEdits = await this.dialogService.showConfirmationDialog({
        data: {
          title: 'Save on refresh',
          text: 'You have unsaved edits to this entry. Would you like to save them before refreshing?',
          cancelLabel: 'No',
          confirmLabel: 'Yes',
        },
      });

      if (saveEdits) {
        await this.saveEntry();
      }
    }

    await this.getEntry();
  }

  /**
   * Save the entry content.
   */
  public async saveEntry(): Promise<void> {
    try {
      this.entry = await this.entryService.setNotebookEntryContent(
        this.notebookName,
        this.notebookKey,
        this.entryName,
        this.entryEditorContent ?? ''
      );
    } catch (err) {
      this.errorService.showError({
        message: String(err),
      });
    }
  }

  /**
   * Open the entry edit dialog.
   */
  public async openEditEntryDialog(): Promise<void> {
    try {
      const result = await this.dialogService.showDialog<
        EditEntryDialogComponent,
        EditEntryDialogData,
        EditEntryDialogReturn
      >(EditEntryDialogComponent, {
        data: {
          notebookName: this.notebookName,
          notebookKey: this.notebookKey,
          entryName: this.entryName,
        },
      });

      await this.router.navigate(
        ['notebook', this.notebookName, 'entry', result.entryName],
        { queryParams: { key: this.notebookKey } }
      );
    } catch (_) {}
  }

  /**
   * Open the entry deletion confirmation dialog.
   */
  public async openDeleteEntryConfirmationDialog(): Promise<void> {
    const confirmed = await this.dialogService.showConfirmationDialog({
      data: {
        title: 'Delete notebook entry',
        text: 'Are you sure you want to delete this notebook entry? This action cannot be undone.',
      },
    });

    if (confirmed) {
      try {
        await this.entryService.deleteNotebookEntry(
          this.notebookName,
          this.notebookKey,
          this.entryName
        );

        await this.openNotebook();
      } catch (err) {
        this.errorService.showError({
          message: String(err),
        });
      }
    }
  }
}
