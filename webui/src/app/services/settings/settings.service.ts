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
  private readonly subPath = 'settings/';

  constructor(private readonly api: APIService) {}

  /**
   * Get all app settings.
   *
   * @returns The app settings.
   */
  public getSettings(): Promise<Settings> {
    return this.api.get<Settings>(this.subPath + 'all');
  }

  /**
   * Get an option from the settings.
   *
   * @param key The option key.
   * @returns The option value.
   */
  public getSettingsOption<T>(key: string): Promise<T> {
    return this.api.get<T>(this.subPath, { key });
  }

  /**
   * Set an option in the settings.
   *
   * @param key The option key.
   * @param value The option value.
   */
  public setSettingsOption<T>(key: string, value: T): Promise<void> {
    return this.api.patch(this.subPath, { key, value });
  }

  /**
   * Delete an option from the settings.
   *
   * @param key The option key.
   */
  public deleteSettingsOption(key: string): Promise<void> {
    return this.api.delete(this.subPath, { key });
  }
}
