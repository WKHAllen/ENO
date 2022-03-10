import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { EntryComponent } from './components/entry/entry.component';
import { NotebookSearchComponent } from './components/notebook-search/notebook-search.component';

/**
 * App routing configuration.
 */
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notebook/:notebookName', component: NotebookComponent },
  {
    path: 'notebook/:notebookName/entry/:entryName',
    component: EntryComponent,
  },
  { path: 'notebook/:notebookName/search', component: NotebookSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
