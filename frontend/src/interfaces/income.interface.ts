export interface IncomeType {
  id: number,
  name: string
}

export interface Income {
  id: number,
  value: number,
  date: string,
  description?: string,
  incomeType: IncomeType,
}

export interface AddOrEditIncomeRequest {
  value: number,
  date: string,
  description?: string,
  incomeTypeId: number,
}

export interface AddIncomeTypeRequest {
  name: string,
}