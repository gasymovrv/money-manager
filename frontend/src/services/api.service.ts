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
      const newResult: Saving[] = body.result.map((saving) => {
        const expMap: Map<string, Expense[]> = new Map(Object.entries(saving.expensesByType));
        const incMap: Map<string, Income[]> = new Map(Object.entries(saving.incomesByType));

        return {
          id: saving.id,
          date: saving.date,
          value: saving.value,
          incomesSum: saving.incomesSum,
          expensesSum: saving.expensesSum,
          incomesByType: incMap,
          expensesByType: expMap
        };
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

export async function importFromXlsxFile(file?: File): Promise<Response> {
  const data = new FormData();
  if (!file) {
    throw Error('File cannot be undefined');
  }
  data.append('file', file);
  return handleErrors(await fetch(apiUrl + 'files/xlsx/import', {
    method: 'POST',
    body: data,
  }));
}

export async function exportToXlsxFile(): Promise<Response> {
  return fetch(apiUrl + 'files/xlsx/export', {
    method: 'GET'
  })
    .then(handleErrors)
    .then((res: any) => {
      return res.blob();
    })
    .then(blob => {
      downloadFile(blob, 'money-manager.xlsx');
      return blob;
    });
}

export async function downloadTemplateXlsxFile(): Promise<Response> {
  return fetch(apiUrl + 'files/xlsx/template', {
    method: 'GET'
  })
    .then(handleErrors)
    .then((res: any) => {
      return res.blob();
    })
    .then(blob => {
      downloadFile(blob, 'money-manager-template.xlsx');
      return blob;
    });
}

function downloadFile(blob: Blob, fileName: string) {
  const href = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}