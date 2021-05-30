import { User } from '../interfaces/user.interface';
import {
  AddOrEditOperationCategoryRequest,
  AddOrEditOperationRequest,
  Operation,
  OperationCategory
} from '../interfaces/operation.interface';
import { SavingResponse, SavingSearchParams, SavingSearchResult } from '../interfaces/saving.interface';
import { SearchResult } from '../interfaces/common.interface';

const apiUrl = '/api/';

function handleErrors(response: Response) {
  if (!response.ok) {
    throw response;
  }
  return response;
}

export async function getCurrentUser(): Promise<User> {
  const response = handleErrors(await fetch(apiUrl + 'users/current'));
  return await response.json();
}

export async function getExpenseCategories(): Promise<Array<OperationCategory>> {
  const response = handleErrors(await fetch(apiUrl + 'expenses/categories'));
  return await response.json();
}

export async function getIncomeCategories(): Promise<Array<OperationCategory>> {
  const response = handleErrors(await fetch(apiUrl + 'incomes/categories'));
  return await response.json();
}

export async function getSavings(request: SavingSearchParams): Promise<SearchResult<SavingResponse>> {
  return fetch(apiUrl + 'savings?' + request.toUrlSearchParams().toString())
    .then(handleErrors)
    .then((response) => {
      return response.json();
    })
    .then((body: SearchResult<SavingResponse>): SearchResult<SavingResponse> => {
      const result: SavingResponse[] = body.result.map((saving) => {
        const expMap: Map<string, Operation[]> = new Map(Object.entries(saving.expensesByCategory));
        const incMap: Map<string, Operation[]> = new Map(Object.entries(saving.incomesByCategory));

        return {
          id: saving.id,
          date: saving.date,
          value: saving.value,
          isOverdue: saving.isOverdue,
          incomesSum: saving.incomesSum,
          expensesSum: saving.expensesSum,
          incomesByCategory: incMap,
          expensesByCategory: expMap
        };
      });
      return new SavingSearchResult(result, body.totalElements);
    });
}

export async function addIncome(request: AddOrEditOperationRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'incomes', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function addExpense(request: AddOrEditOperationRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'expenses', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function addIncomeCategory(request: AddOrEditOperationCategoryRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'incomes/categories', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function addExpenseCategory(request: AddOrEditOperationCategoryRequest): Promise<Response> {
  return handleErrors(await fetch(apiUrl + 'expenses/categories', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function editIncome(id: number, request: AddOrEditOperationRequest): Promise<Response> {
  if (request.description === '') {
    request.description = undefined;
  }
  return handleErrors(await fetch(`${apiUrl}incomes/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function editExpense(id: number, request: AddOrEditOperationRequest): Promise<Response> {
  if (request.description === '') {
    request.description = undefined;
  }
  return handleErrors(await fetch(`${apiUrl}expenses/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function editIncomeCategory(id: number, request: AddOrEditOperationCategoryRequest): Promise<Response> {
  return handleErrors(await fetch(`${apiUrl}incomes/categories/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function editExpenseCategory(id: number, request: AddOrEditOperationCategoryRequest): Promise<Response> {
  return handleErrors(await fetch(`${apiUrl}expenses/categories/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  }));
}

export async function deleteIncome(id: number): Promise<Response> {
  return handleErrors(await fetch(`${apiUrl}incomes/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  }));
}

export async function deleteExpense(id: number): Promise<Response> {
  return handleErrors(await fetch(`${apiUrl}expenses/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  }));
}

export async function deleteIncomeCategory(id: number): Promise<Response> {
  return handleErrors(await fetch(`${apiUrl}incomes/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  }));
}

export async function deleteExpenseCategory(id: number): Promise<Response> {
  return handleErrors(await fetch(`${apiUrl}expenses/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
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