import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Handle dates that may be null.
 */
@Pipe({
  name: 'nullableDate',
})
export class NullableDatePipe implements PipeTransform {
  private readonly nullDateString = '';

  constructor(private readonly datePipe: DatePipe) {}

  /**
   * Transform a nullable date.
   *
   * @param value The value to transform.
   * @param nullString The value to replace with when a null date is provided.
   * @param format How to format the value.
   * @returns The formatted value.
   */
  public transform(
    value: string | number | Date | null | undefined,
    nullString?: string,
    format?: string
  ): string | null {
    if (value === '' || value === null || value === undefined) {
      return nullString ?? this.nullDateString;
    }

    if (new Date(value).getUTCFullYear() === 1) {
      return nullString ?? this.nullDateString;
    }

    return this.datePipe.transform(value, format);
  }
}
