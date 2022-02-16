import { Component } from '@angular/core';
import { DarkModeService } from '../services/dark-mode/dark-mode.service';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

/**
 * A dark mode toggle component.
 */
@Component({
  selector: 'eno-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.less'],
})
export class DarkModeToggleComponent {
  public darkMode = false;
  public icons = { faSun, faMoon };

  constructor(private readonly darkModeService: DarkModeService) {
    this.darkModeService
      .inDarkMode()
      .then((darkMode) => (this.darkMode = darkMode));
  }

  public async toggleDarkMode(): Promise<void> {
    await this.darkModeService.setDarkMode(!this.darkMode);
    this.darkMode = !this.darkMode;
  }
}
