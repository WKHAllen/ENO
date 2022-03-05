import { Sort } from '@angular/material/sort';
import { MatFormFieldAppearance } from '@angular/material/form-field';

/**
 * The appearance of form elements.
 */
export const formAppearance: MatFormFieldAppearance = 'fill';

/**
 * Constants related to notebooks.
 */
export const notebookConstants = {
  notebookNameMinLength: 1,
  notebookNameMaxLength: 64,
  notebookDescriptionMinLength: 0,
  notebookDescriptionMaxLength: 256,
  notebookKeyMinLength: 8,
  notebookKeyMaxLength: 256,
  entryNameMinLength: 1,
  entryNameMaxLength: 256,
  entryContentMinLength: 0,
  entryContentMaxLength: 65536,
  entryQueryMinLength: 0,
  entryQueryMaxLength: 1024,
};

/**
 * Compare two values.
 *
 * @param a The first value.
 * @param b The second value.
 * @param isAsc Whether to sort ascending.
 * @returns The comparison result.
 */
function sortCompare(a: any, b: any, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

/**
 * Sort a set of data.
 *
 * @param currentData The data.
 * @param sort The sort parameters.
 * @returns The sorted data.
 */
export function sortData<T>(currentData: T[], sort: Sort): T[] {
  const data = currentData.slice();

  if (!sort.active || sort.direction === '') {
    return data;
  } else {
    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return sortCompare(
        (a as any)[sort.active],
        (b as any)[sort.active],
        isAsc
      );
    });
  }
}
