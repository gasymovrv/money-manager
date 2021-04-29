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