import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { LinkComponent } from './components/link/link.component';

import { APIService } from './services/api/api.service';
import { NotebookService } from './services/notebook/notebook.service';
import { EntryService } from './services/entry/entry.service';
import { SettingsService } from './services/settings/settings.service';
import { WindowService } from './services/window/window.service';
import { DarkModeService } from './services/dark-mode/dark-mode.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DarkModeToggleComponent,
    LinkComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
  ],
  providers: [
    APIService,
    NotebookService,
    EntryService,
    SettingsService,
    WindowService,
    DarkModeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
