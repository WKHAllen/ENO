import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

/**
 * A service for toggling dark mode.
 */
@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  constructor(private readonly settingsService: SettingsService) {
    this.inDarkMode().then((darkMode) => this.setDarkMode(darkMode));
  }

  /**
   * Check if the app is set to dark mode.
   *
   * @returns Whether the app is set to dark mode.
   */
  public async inDarkMode(): Promise<boolean> {
    const darkModeString = await this.settingsService.getSettingsOption<string>(
      'DarkMode'
    );

    if (darkModeString === 'on' || darkModeString === 'off') {
      return darkModeString === 'on' ? true : false;
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  /**
   * Enable or disable dark mode.
   *
   * @param darkMode Whether to set the mode to dark.
   */
  public async setDarkMode(darkMode: boolean): Promise<void> {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    await this.settingsService.setSettingsOption(
      'DarkMode',
      darkMode ? 'on' : 'off'
    );
  }
}
