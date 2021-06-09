import moment from 'moment';
import { Period } from '../interfaces/common.interface';

export const DATE_FORMAT = 'YYYY-MM-DD'
export const MONTH_FORMAT = 'YYYY-MM'
export const YEAR_FORMAT = 'YYYY'

export function isCurrentPeriod(date: any, period: Period): boolean {
  return formatByPeriod(moment(), period) === formatByPeriod(moment(date), period);
}

export function isFuture(date: any): boolean {
  return moment(date).isAfter(moment());
}

export function formatByPeriod(date: any, period: Period): any {
  switch (period) {
    case Period.DAY:
      return date = moment(date).format(DATE_FORMAT);
    case Period.MONTH:
      return date = moment(date).format(MONTH_FORMAT);
    case Period.YEAR:
      return date = moment(date).format(YEAR_FORMAT);
  }
}