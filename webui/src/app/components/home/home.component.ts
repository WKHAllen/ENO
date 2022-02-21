import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { NotebookService } from '../../services/notebook/notebook.service';
import { EncryptedNotebook } from '../../services/notebook/notebook.interface';
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

  constructor(private readonly notebookService: NotebookService) {}

  public async ngOnInit(): Promise<void> {
    this.notebooks = await this.notebookService.listNotebooks();
    this.sortedNotebooks = this.notebooks.slice();
    this.loading = false;
  }

  /**
   * Sort the existing notebooks.
   *
   * @param sort The sort parameters.
   */
  public sortNotebooks(sort: Sort): void {
    this.sortedNotebooks = sortData(this.notebooks, sort);
  }
}
