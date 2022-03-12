import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { NotebookService } from '../../services/notebook/notebook.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { ErrorService } from '../../services/error/error.service';
import { SettingsService } from '../../services/settings/settings.service';
import { EncryptedNotebook } from '../../services/notebook/notebook.interface';
import { CreateNotebookDialogComponent } from '../create-notebook-dialog/create-notebook-dialog.component';
import { sortData } from '../../util';

/**
 * The app home page.
 */
@Component({
  selector: 'eno-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public loading = true;
  public notebooks: EncryptedNotebook[] = [];
  public sortedNotebooks: EncryptedNotebook[] = [];
  private sort: Sort = {
    active: 'editTime',
    direction: 'desc',
  };

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService,
    private readonly settingsService: SettingsService
  ) {}

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      const err = queryParamMap.get('err');

      if (err) {
        this.errorService.showError({
          message: String(err),
        });
      }
    });

    const sort = await this.settingsService.getSettingsOption<Sort>(
      'NotebookSort'
    );

    if (sort) {
      this.sort = sort;
    }

    await this.getNotebooks();
    await this.sortNotebooks();
  }

  /**
   * Get all notebooks.
   */
  public async getNotebooks(): Promise<void> {
    this.loading = true;
    this.notebooks = await this.notebookService.listNotebooks();
    this.sortedNotebooks = this.notebooks.slice();
    this.loading = false;
  }

  /**
   * Open the dialog to create a new notebook.
   */
  public async openCreateNotebookDialog(): Promise<void> {
    try {
      await this.dialogService.showDialog<
        CreateNotebookDialogComponent,
        {},
        {}
      >(CreateNotebookDialogComponent);
    } catch (_) {
      return;
    }

    await this.getNotebooks();
  }

  /**
   * Sort the existing notebooks.
   *
   * @param sort The sort parameters.
   */
  public async sortNotebooks(sort?: Sort): Promise<void> {
    if (sort) {
      this.sort = sort;
    }

    this.sortedNotebooks = sortData(this.notebooks, this.sort);
    await this.settingsService.setSettingsOption('NotebookSort', this.sort);
  }

  /**
   * Open a notebook.
   *
   * @param notebookName The name of the notebook.
   */
  public async openNotebook(notebookName: string): Promise<void> {
    await this.router.navigate(['notebook', notebookName]);
  }
}
