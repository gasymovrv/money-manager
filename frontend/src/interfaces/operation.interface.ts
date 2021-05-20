export interface OperationType {
  id: number,
  name: string
}

export interface Operation {
  id: number,
  value: number,
  date: string,
  description?: string,
  type: OperationType,
}

export interface AddOrEditOperationRequest {
  value: number,
  date: string,
  description?: string,
  typeId: number,
}

export interface AddOperationTypeRequest {
  name: string,
}