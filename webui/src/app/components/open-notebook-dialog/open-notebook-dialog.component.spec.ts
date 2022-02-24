import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNotebookDialogComponent } from './open-notebook-dialog.component';

describe('OpenNotebookDialogComponent', () => {
  let component: OpenNotebookDialogComponent;
  let fixture: ComponentFixture<OpenNotebookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenNotebookDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenNotebookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
