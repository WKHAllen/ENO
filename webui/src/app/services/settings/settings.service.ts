import { Injectable } from '@angular/core';
import { APIService } from '../api/api.service';
import { Settings } from './settings.interface';

/**
 * App settings service.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly subPath = 'settings';

  constructor(private readonly api: APIService) {}

  /**
   * Get all app settings.
   *
   * @returns The app settings.
   */
  public async getSettings(): Promise<Settings> {
    const settings = await this.api.get<Settings>(this.subPath + '/all');
    return Object.keys(settings).reduce((acc, current) => {
      acc[current] = JSON.parse(settings[current]);
      return acc;
    }, {} as Settings);
  }

  /**
   * Get an option from the settings.
   *
   * @param key The option key.
   * @returns The option value.
   */
  public async getSettingsOption<T>(key: string): Promise<T | undefined> {
    const stringValue = await this.api.get<string>(this.subPath, { key });
    return stringValue ? JSON.parse(stringValue) : undefined;
  }

  /**
   * Set an option in the settings.
   *
   * @param key The option key.
   * @param value The option value.
   */
  public async setSettingsOption<T>(key: string, value: T): Promise<void> {
    const stringValue = JSON.stringify(value);
    return this.api.patch(this.subPath, { key, value: stringValue });
  }

  /**
   * Delete an option from the settings.
   *
   * @param key The option key.
   */
  public async deleteSettingsOption(key: string): Promise<void> {
    return this.api.delete(this.subPath, { key });
  }
}
