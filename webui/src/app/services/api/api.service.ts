import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * The API subpath.
 */
const apiPath = '/api/';

/**
 * Query or body parameters.
 */
interface Params {
  [param: string]: any;
}

/**
 * API HTTP Methods.
 */
type APIMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Standard response object.
 */
export interface APIResponse<T> {
  data?: T;
  error?: string;
}

/**
 * API request service.
 */
@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Make an API request.
   *
   * @param method The HTTP method.
   * @param path The URL path.
   * @param body The request body.
   * @returns The response data.
   */
  private async request<T = void>(
    method: APIMethod,
    path: string,
    body: Params = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .request<APIResponse<T>>(method, apiPath + path, { body })
        .subscribe({
          next: (res) =>
            res.data !== undefined ? resolve(res.data as T) : reject(res.error),
          error: (err) => reject(err),
        });
    });
  }

  /**
   * Make a GET request to the API.
   *
   * @param path The URL path.
   * @param body The request body.
   * @returns The response data.
   */
  public async get<T = void>(path: string, body: Params = {}): Promise<T> {
    return this.request('GET', path, body);
  }

  /**
   * Make a POST request to the API.
   *
   * @param path The URL path.
   * @param body The request body.
   * @returns The response data.
   */
  public async post<T = void>(path: string, body: Params = {}): Promise<T> {
    return this.request('POST', path, body);
  }

  /**
   * Make a PATCH request to the API.
   *
   * @param path The URL path.
   * @param body The request body.
   * @returns The response data.
   */
  public async patch<T = void>(path: string, body: Params = {}): Promise<T> {
    return this.request('PATCH', path, body);
  }

  /**
   * Make a DELETE request to the API.
   *
   * @param path The URL path.
   * @param body The request body.
   * @returns The response data.
   */
  public async delete<T = void>(path: string, body: Params = {}): Promise<T> {
    return this.request('DELETE', path, body);
  }
}
