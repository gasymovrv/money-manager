export interface ExpenseType {
  id: number,
  name: string
}

export interface Expense {
  id: number,
  value: number,
  date: string,
  description?: string,
  expenseType: ExpenseType,
}

export interface AddOrEditExpenseRequest {
  value: number,
  date: string,
  description?: string,
  expenseTypeId: number,
}

export interface AddExpenseTypeRequest {
  name: string,
}