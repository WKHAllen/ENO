import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { InfoComponent } from './components/info/info.component';
import { ActionCardComponent } from './components/action-card/action-card.component';
import { CreateNotebookDialogComponent } from './components/create-notebook-dialog/create-notebook-dialog.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { OpenNotebookDialogComponent } from './components/open-notebook-dialog/open-notebook-dialog.component';
import { CreateEntryDialogComponent } from './components/create-entry-dialog/create-entry-dialog.component';
import { EditNotebookDialogComponent } from './components/edit-notebook-dialog/edit-notebook-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EntryComponent } from './components/entry/entry.component';
import { MarkdownEditorComponent } from './components/markdown-editor/markdown-editor.component';
import { EditEntryDialogComponent } from './components/edit-entry-dialog/edit-entry-dialog.component';
import { NotebookSearchComponent } from './components/notebook-search/notebook-search.component';

import { APIService } from './services/api/api.service';
import { NotebookService } from './services/notebook/notebook.service';
import { EntryService } from './services/entry/entry.service';
import { SettingsService } from './services/settings/settings.service';
import { WindowService } from './services/window/window.service';
import { ErrorService } from './services/error/error.service';
import { DialogService } from './services/dialog/dialog.service';

import { NullableDatePipe } from './pipes/nullable-date/nullable-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SpinnerComponent,
    InfoComponent,
    ActionCardComponent,
    CreateNotebookDialogComponent,
    NotebookComponent,
    OpenNotebookDialogComponent,
    CreateEntryDialogComponent,
    EditNotebookDialogComponent,
    ConfirmationDialogComponent,
    EntryComponent,
    MarkdownEditorComponent,
    EditEntryDialogComponent,
    NullableDatePipe,
    NotebookSearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    DatePipe,
    APIService,
    NotebookService,
    EntryService,
    SettingsService,
    WindowService,
    ErrorService,
    DialogService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
