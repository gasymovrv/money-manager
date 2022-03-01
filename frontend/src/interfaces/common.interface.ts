import {
  AddOrEditOperationCategoryRequest,
  AddOrEditOperationRequest,
  Operation,
  OperationCategory,
  OperationType
} from './operation.interface';
import { Account } from './user.interface';

export interface SearchResult<T> {
  result: T[],
  totalElements: number,
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum Period {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface DialogProps {
  open: boolean,
  draft?: Operation,

  handleClose(): void
}

export interface EditOperationDialogProps extends DialogProps {
  operation: Operation
}

export interface EditOperationCategoryDialogProps extends DialogProps {
  operationCategory: OperationCategory
}

export interface EditOperationProps {
  categories: OperationCategory[],
  operationType: OperationType,

  editOperation(id: number, request: AddOrEditOperationRequest): void,

  deleteOperation(id: number): void
}

export interface AddOperationProps {
  categories: OperationCategory[],

  addOperation(request: AddOrEditOperationRequest): void
}

export interface AddOperationCategoryProps {
  addOperationCategory(request: AddOrEditOperationCategoryRequest): void
}

export interface EditOperationCategoryProps {
  editOperationCategory(id: number, request: AddOrEditOperationCategoryRequest): void,

  deleteOperationCategory(id: number): void
}

export interface AddAccountProps {
  currencies: string[],

  onAdd(): void
}

export interface DeleteAccountProps {
  account: Account,

  onDelete(): void
}