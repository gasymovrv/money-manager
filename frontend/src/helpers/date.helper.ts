import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD'

export function isToday(date: any): boolean {
  return moment().format(DATE_FORMAT) === moment(date).format(DATE_FORMAT)
}