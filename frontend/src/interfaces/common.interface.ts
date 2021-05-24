import {
  AddOrEditOperationCategoryRequest,
  AddOrEditOperationRequest,
  Operation,
  OperationCategory
} from './operation.interface';

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

export interface EditOperationDialogProps extends DialogProps {
  categories: OperationCategory[]
  operation: Operation
}

export interface EditOperationCategoryDialogProps extends DialogProps {
  operationCategory: OperationCategory
}

export interface EditOperationProps {
  editOperation(id: number, request: AddOrEditOperationRequest): void,

  deleteOperation(id: number): void
}

export interface AddOperationProps {
  getCategories(): Promise<OperationCategory[]>

  addOperation(request: AddOrEditOperationRequest): void
}

export interface AddOperationCategoryProps {
  addOperationCategory(request: AddOrEditOperationCategoryRequest): void
}

export interface EditOperationCategoryProps {
  editOperationCategory(id: number, request: AddOrEditOperationCategoryRequest): void,

  deleteOperationCategory(id: number): void
}