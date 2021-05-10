import { User } from '../interfaces/user.interface';
import { AddExpenseRequest, Expense, ExpenseType } from '../interfaces/expense.interface';
import { AddIncomeRequest, Income, IncomeType } from '../interfaces/income.interface';
import {
  Accumulation,
  AccumulationResponse,
  AccumulationSearchParams,
  AccumulationSearchResult
} from '../interfaces/accumulation.interface';
import { SearchResult } from '../interfaces/common.interface';

const apiUrl = '/api/';

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export async function getCurrentUser(): Promise<User> {
  const response = handleErrors(await fetch(apiUrl + 'users/current'));
  return await response.json();
}

export async function getExpenseTypes(): Promise<Array<ExpenseType>> {
  const response = handleErrors(await fetch(apiUrl + 'expenses/types'));
  return await response.json();
}

export async function getIncomeTypes(): Promise<Array<IncomeType>> {
  const response = handleErrors(await fetch(apiUrl + 'incomes/types'));
  return await response.json();
}

export async function getIncomes(): Promise<Array<Income>> {
  const response = handleErrors(await fetch(apiUrl + 'incomes'));
  return await response.json();
}

export async function getExpenses(): Promise<Array<Expense>> {
  const response = handleErrors(await fetch(apiUrl + 'expenses'));
  return await response.json();
}

export async function getAccumulations(request: AccumulationSearchParams): Promise<SearchResult<Accumulation>> {
  return fetch(apiUrl + 'accumulations?' + request.toUrlSearchParams().toString())
    .then(handleErrors)
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

export async function addIncome(request: AddIncomeRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'incomes', {
    method: 'POST',
      headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function addExpense(request: AddExpenseRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'expenses', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}