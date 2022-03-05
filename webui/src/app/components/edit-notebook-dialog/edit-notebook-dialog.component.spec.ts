import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotebookDialogComponent } from './edit-notebook-dialog.component';

describe('EditNotebookDialogComponent', () => {
  let component: EditNotebookDialogComponent;
  let fixture: ComponentFixture<EditNotebookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNotebookDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotebookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
