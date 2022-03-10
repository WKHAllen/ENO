import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookSearchComponent } from './notebook-search.component';

describe('NotebookSearchComponent', () => {
  let component: NotebookSearchComponent;
  let fixture: ComponentFixture<NotebookSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotebookSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
