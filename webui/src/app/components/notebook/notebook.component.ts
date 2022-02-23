import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotebookService } from '../../services/notebook/notebook.service';
import { ErrorService } from '../../services/error/error.service';
import { DecryptedNotebook } from '../../services/notebook/notebook.interface';

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
  public notebook: DecryptedNotebook | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly notebookService: NotebookService,
    private readonly errorService: ErrorService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.notebookName = paramMap.get('notebookName') || '';

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
          // TODO: open 'enter notebook key' dialog
        }
      });
    });
  }
}
