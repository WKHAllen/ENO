import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

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

import { APIService } from './services/api/api.service';
import { NotebookService } from './services/notebook/notebook.service';
import { EntryService } from './services/entry/entry.service';
import { SettingsService } from './services/settings/settings.service';
import { WindowService } from './services/window/window.service';
import { ErrorService } from './services/error/error.service';

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [
    APIService,
    NotebookService,
    EntryService,
    SettingsService,
    WindowService,
    ErrorService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
