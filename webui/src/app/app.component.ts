import { Component } from '@angular/core';
import { WindowService } from './services/window/window.service';
import { DarkModeService } from './services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  // Inject Window Service so it can watch for title element changes
  // Inject Dark Mode Service so it can initialize based on settings or OS preferences
  constructor(
    private readonly windowService: WindowService,
    private readonly darkModeService: DarkModeService
  ) {}
}
