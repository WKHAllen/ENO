import { Component } from '@angular/core';
import { DarkModeService } from '../services/dark-mode/dark-mode.service';

/**
 * A dark mode toggle component.
 */
@Component({
  selector: 'eno-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.less'],
})
export class DarkModeToggleComponent {
  constructor(private readonly darkModeService: DarkModeService) {}
}
