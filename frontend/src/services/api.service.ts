import { User } from '../interfaces/user.interface';
import { AddExpenseRequest, AddExpenseTypeRequest, Expense, ExpenseType } from '../interfaces/expense.interface';
import { AddIncomeRequest, AddIncomeTypeRequest, Income, IncomeType } from '../interfaces/income.interface';
import { Saving, SavingResponse, SavingSearchParams, SavingSearchResult } from '../interfaces/saving.interface';
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

export async function getSavings(request: SavingSearchParams): Promise<SearchResult<Saving>> {
  return fetch(apiUrl + 'savings?' + request.toUrlSearchParams().toString())
    .then(handleErrors)
    .then((response) => {
      return response.json();
    })
    .then((body: SearchResult<SavingResponse>): SearchResult<Saving> => {
      const newResult: Saving[] = body.result.map((acc) => {
        const expMap: Map<string, Expense> = new Map(Object.entries(acc.expensesByType));
        const incMap: Map<string, Income> = new Map(Object.entries(acc.incomesByType));

        return new Saving(acc.id, acc.date, acc.value, incMap, expMap);
      });
      return new SavingSearchResult(newResult, body.totalElements);
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

export async function addIncomeType(request: AddIncomeTypeRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'incomes/types', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function addExpenseType(request: AddExpenseTypeRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'expenses/types', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}