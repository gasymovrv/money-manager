export interface ExpenseType {
  id: number,
  name: string
}

export interface Expense {
  id: number,
  value: number,
  date: string,
  expenseType: ExpenseType,
}

export interface AddExpenseRequest {
  value: number,
  date: string,
  description?: string,
  expenseTypeId: number,
}