import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';

import { APIService } from './services/api/api.service';
import { NotebookService } from './services/notebook/notebook.service';
import { EntryService } from './services/entry/entry.service';
import { SettingsService } from './services/settings/settings.service';
import { WindowService } from './services/window/window.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
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
