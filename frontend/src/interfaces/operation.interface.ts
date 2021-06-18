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
  isPlanned: boolean,
  isOverdue: boolean
}

export interface AddOrEditOperationRequest {
  value: number,
  date: string,
  description?: string,
  categoryId: number,
  isPlanned: boolean
}

export interface AddOrEditOperationCategoryRequest {
  name: string,
}

export enum OperationType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}