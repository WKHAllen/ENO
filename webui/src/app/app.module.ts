import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { APIService } from './services/api/api.service';
import { NotebookService } from './services/notebook/notebook.service';
import { WindowService } from './services/window/window.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [APIService, NotebookService, WindowService],
  bootstrap: [AppComponent],
})
export class AppModule {}
