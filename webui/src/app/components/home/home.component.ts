import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '../../services/notebook/notebook.service';
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

  constructor(
    private readonly router: Router,
    private readonly createNotebookDialog: MatDialog,
    private readonly notebookService: NotebookService
  ) {}

  public async ngOnInit(): Promise<void> {
    await this.getNotebooks();
    this.loading = false;
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
  public openCreateNotebookDialog(): void {
    const dialogRef = this.createNotebookDialog.open<
      CreateNotebookDialogComponent,
      {},
      {}
    >(CreateNotebookDialogComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.getNotebooks();
      }
    });
  }

  /**
   * Sort the existing notebooks.
   *
   * @param sort The sort parameters.
   */
  public sortNotebooks(sort: Sort): void {
    this.sortedNotebooks = sortData(this.notebooks, sort);
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
