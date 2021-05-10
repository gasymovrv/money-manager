export interface IncomeType {
  id: number,
  name: string
}

export interface Income {
  id: number,
  value: number,
  date: string,
  incomeType: IncomeType,
}

export interface AddIncomeRequest {
  value: number,
  date: string,
  description?: string,
  incomeTypeId: number,
}