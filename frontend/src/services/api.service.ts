import { User } from '../interfaces/user.interface';
import { ExpenseType } from '../interfaces/expense.interface';
import { Expense } from '../interfaces/expense.interface';
import { IncomeType } from '../interfaces/income.interface';
import { Income } from '../interfaces/income.interface';
import { AccumulationResponse } from '../interfaces/accumulation.interface';
import { Accumulation } from '../interfaces/accumulation.interface';
import { AccumulationSearchResult } from '../interfaces/accumulation.interface';
import { SearchResult } from '../interfaces/common.interface';

const apiUrl = '/api/';

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(apiUrl + 'users/current');
  const body = await response.json();
  return body;
}

export async function getExpenseTypes(): Promise<Array<ExpenseType>> {
  const response = await fetch(apiUrl + 'expenses/types');
  const body = await response.json();
  return body;
}

export async function getIncomeTypes(): Promise<Array<IncomeType>> {
  const response = await fetch(apiUrl + 'incomes/types');
  const body = await response.json();
  return body;
}

export async function getIncomes(): Promise<Array<Income>> {
  const response = await fetch(apiUrl + 'incomes');
  const body = await response.json();
  return body;
}

export async function getExpenses(): Promise<Array<Expense>> {
  const response = await fetch(apiUrl + 'expenses');
  const body = await response.json();
  return body;
}

export async function getAccumulations(): Promise<SearchResult<Accumulation>> {
  return fetch(apiUrl + 'accumulations')
    .then((response) => {
      return response.json();
    })
    .then((body: SearchResult<AccumulationResponse>): SearchResult<Accumulation> => {
      const newResult: Accumulation[] = body.result.map((acc) => {
        const expMap: Map<string, Expense> = new Map(Object.entries(acc.expensesByType));
        const incMap: Map<string, Income> = new Map(Object.entries(acc.incomesByType));

        return new Accumulation(acc.id, acc.date, acc.value, incMap, expMap);
      });
      return new AccumulationSearchResult(newResult, body.totalElements);
    });
}
