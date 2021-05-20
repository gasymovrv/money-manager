import { Operation } from './operation.interface';

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

  onAction(): void
}

export interface EditDialogProps extends DialogProps {
  entity: Operation
}

export enum EntityType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}