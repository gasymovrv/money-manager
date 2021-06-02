export interface User {
  id: string,
  name: string,
  picture: string,
  email: string,
  locale?: string,
  lastVisit?: string,
  currentAccount: Account
}

export interface Account {
  id: number,
  name: string,
  theme: AccountTheme,
  currency: string,
  isDraft: boolean
}

export enum AccountTheme {
  DARK = 'DARK',
  LIGHT = 'LIGHT'
}

export const defaultUser: User = {
  id: '',
  name: '',
  picture: '',
  email: '',
  currentAccount: {
    id: 0,
    name: '',
    currency: '',
    theme: AccountTheme.LIGHT,
    isDraft: true
  }
}

export interface AddOrEditAccountRequest {
  name: string,
  theme: AccountTheme,
  currency: string
}