import { Component } from '@angular/core';
import { WindowService } from './services/window/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  // Inject Window Service so it can watch for title element changes
  constructor(private readonly windowService: WindowService) {}
}
