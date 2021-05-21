export interface OperationCategory {
  id: number,
  name: string
}

export interface Operation {
  id: number,
  value: number,
  date: string,
  description?: string,
  category: OperationCategory,
}

export interface AddOrEditOperationRequest {
  value: number,
  date: string,
  description?: string,
  categoryId: number,
}

export interface AddOrEditOperationCategoryRequest {
  name: string,
}

export enum OperationType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}