import { Injectable } from '@angular/core';
import { APIService } from '../api/api.service';

/**
 * Webview window service.
 */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private readonly subPath = 'window/';

  constructor(private readonly api: APIService) {
    // Look for changes in the title element.
    const titleElement = document.querySelector('title');

    const title = titleElement?.innerText;
    if (title !== undefined) {
      this.setWindowTitle(title);
    }

    const observer = new MutationObserver((mutations) => {
      const title = mutations[0].target.nodeValue;
      if (title !== null) {
        this.setWindowTitle(title);
      }
    });

    observer.observe(titleElement as Node, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }

  /**
   * Set the webview window title.
   *
   * @param title The window title.
   */
  public async setWindowTitle(title: string): Promise<void> {
    return this.api.patch(this.subPath + 'title', { title });
  }
}
