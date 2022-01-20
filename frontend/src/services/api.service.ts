import { Account, AddOrEditAccountRequest, defaultUser, User } from '../interfaces/user.interface';
import {
  AddOrEditOperationCategoryRequest,
  AddOrEditOperationRequest,
  Operation
} from '../interfaces/operation.interface';
import { SavingResponse, SavingSearchRequestParams, SavingSearchResult } from '../interfaces/saving.interface';
import { buildHeaders, buildHeadersJson, downloadFile, getFileName, handleErrors } from '../helpers/api.helper';
import { ACCESS_TOKEN } from '../constants';

const apiUrl = '/api/';

export async function getVersion(): Promise<string> {
  const response = handleErrors(await fetch(apiUrl + 'version'));
  return await response.text();
}

export async function getCurrentUser(): Promise<User> {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return defaultUser;
  }
  const headers = buildHeadersJson();

  const response = handleErrors(await fetch(apiUrl + 'users/current', {headers}));
  return await response.json();
}

export async function getAllCurrencies(): Promise<string[]> {
  const headers = buildHeadersJson();

  const response = handleErrors(await fetch(apiUrl + 'accounts/currencies', {headers}));
  return await response.json();
}

export async function findAllAccounts(): Promise<Array<Account>> {
  const headers = buildHeadersJson();

  const response = handleErrors(await fetch(apiUrl + 'accounts', {headers}));
  return await response.json();
}

export async function editAccount(id: number, request: AddOrEditAccountRequest): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}accounts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function addAccount(request: AddOrEditAccountRequest): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}accounts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function deleteAccount(id: number): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}accounts/${id}`, {
    method: 'DELETE',
    headers
  }));
}

export async function changeAccount(id: number): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}accounts/change?id=${id}`, {
    method: 'POST',
    headers
  }));
}

export async function createDefaultCategories(): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}accounts/default-categories`, {
    method: 'POST',
    headers
  }));
}

export async function getSavings(request: SavingSearchRequestParams): Promise<SavingSearchResult> {
  const headers = buildHeadersJson();

  return fetch(apiUrl + 'savings?' + request.toUrlSearchParams().toString(), {headers})
    .then(handleErrors)
    .then((response) => {
      return response.json();
    })
    .then((body: SavingSearchResult): SavingSearchResult => {
      const result: SavingResponse[] = body.result.map((saving) => {
        const expMap: Map<string, Operation[]> = new Map(Object.entries(saving.expensesByCategory));
        const incMap: Map<string, Operation[]> = new Map(Object.entries(saving.incomesByCategory));

        return {
          id: saving.id,
          date: saving.date,
          period: saving.period,
          value: saving.value,
          isOverdue: saving.isOverdue,
          incomesSum: saving.incomesSum,
          expensesSum: saving.expensesSum,
          incomesByCategory: incMap,
          expensesByCategory: expMap
        };
      });
      return new SavingSearchResult(result, body.totalElements, body.incomeCategories, body.expenseCategories);
    });
}

export async function addIncome(request: AddOrEditOperationRequest): Promise<Response> {
  const headers = buildHeadersJson();
  if (request.description === '') {
    delete request.description;
  }

  return handleErrors(await fetch(apiUrl + 'incomes', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function addExpense(request: AddOrEditOperationRequest): Promise<Response> {
  const headers = buildHeadersJson();
  if (request.description === '') {
    delete request.description;
  }

  return handleErrors(await fetch(apiUrl + 'expenses', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function addIncomeCategory(request: AddOrEditOperationCategoryRequest): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(apiUrl + 'incomes/categories', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function addExpenseCategory(request: AddOrEditOperationCategoryRequest): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(apiUrl + 'expenses/categories', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function editIncome(id: number, request: AddOrEditOperationRequest): Promise<Response> {
  if (request.description === '') {
    request.description = undefined;
  }
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}incomes/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function editExpense(id: number, request: AddOrEditOperationRequest): Promise<Response> {
  if (request.description === '') {
    request.description = undefined;
  }
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}expenses/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function editIncomeCategory(id: number, request: AddOrEditOperationCategoryRequest): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}incomes/categories/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function editExpenseCategory(id: number, request: AddOrEditOperationCategoryRequest): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}expenses/categories/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(request),
  }));
}

export async function deleteIncome(id: number): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}incomes/${id}`, {
    method: 'DELETE',
    headers
  }));
}

export async function deleteExpense(id: number): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}expenses/${id}`, {
    method: 'DELETE',
    headers
  }));
}

export async function deleteIncomeCategory(id: number): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}incomes/categories/${id}`, {
    method: 'DELETE',
    headers
  }));
}

export async function deleteExpenseCategory(id: number): Promise<Response> {
  const headers = buildHeadersJson();

  return handleErrors(await fetch(`${apiUrl}expenses/categories/${id}`, {
    method: 'DELETE',
    headers
  }));
}

export async function importFromXlsxFile(file?: File): Promise<Response> {
  const data = new FormData();
  if (!file) {
    throw Error('File cannot be undefined');
  }
  data.append('file', file);
  const headers = buildHeaders();

  return handleErrors(await fetch(apiUrl + 'files/xlsx/import', {
    method: 'POST',
    headers,
    body: data,
  }));
}

export async function exportToXlsxFile(): Promise<Response> {
  let filename = 'money-manager.xlsx';
  const headers = buildHeaders();

  return fetch(apiUrl + 'files/xlsx/export', {headers})
    .then(handleErrors)
    .then((res: any) => {
      filename = getFileName(res, filename);
      return res.blob();
    })
    .then(blob => {
      downloadFile(blob, filename);
      return blob;
    });
}

export async function downloadTemplateXlsxFile(): Promise<Response> {
  let filename = 'money-manager-template.xlsx';
  const headers = buildHeaders();

  return fetch(apiUrl + 'files/xlsx/template', {headers})
    .then(handleErrors)
    .then((res: any) => {
      filename = getFileName(res, filename);
      return res.blob();
    })
    .then(blob => {
      downloadFile(blob, filename);
      return blob;
    });
}
