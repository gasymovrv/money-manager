export interface SearchResult<T> {
  result: T[],
  totalElements: number,
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface DialogProps {
  open: boolean,

  handleClose(): void

  onSave(): void
}