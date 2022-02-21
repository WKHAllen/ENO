import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { InfoComponent } from './components/info/info.component';

import { APIService } from './services/api/api.service';
import { NotebookService } from './services/notebook/notebook.service';
import { EntryService } from './services/entry/entry.service';
import { SettingsService } from './services/settings/settings.service';
import { WindowService } from './services/window/window.service';
import { ActionCardComponent } from './components/action-card/action-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SpinnerComponent,
    InfoComponent,
    ActionCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
