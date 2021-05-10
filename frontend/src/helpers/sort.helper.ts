import { IncomeType } from '../interfaces/income.interface';
import { ExpenseType } from '../interfaces/expense.interface';

export function stringSort(s1: string, s2: string): number {
  if (s1 > s2) {
    return 1;
  } else if (s1 === s2) {
    return 0;
  } else {
    return -1;
  }
}

export function incomeTypeSort(t1: IncomeType, t2: IncomeType): number {
  return stringSort(t1.name, t2.name);
}

export function expenseTypeSort(t1: ExpenseType, t2: ExpenseType): number {
  return stringSort(t1.name, t2.name);
}