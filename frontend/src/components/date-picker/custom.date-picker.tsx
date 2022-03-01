import React, { ReactElement, useContext, useEffect } from 'react'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import { AuthContext } from '../../interfaces/auth-context.interface';
import 'moment/locale/fr';
import 'moment/locale/ru';

moment.locale("en"); // it is required to select default locale manually

const localeMap = {
  en: "en",
  fr: "fr",
  ru: "ru",
};

export const CustomDatePicker: React.FC<DatePickerProps> = (props): ReactElement => {
  const {user} = useContext(AuthContext);

  let locale = localeMap.en;
  if (user.locale) {
    const userLocale = Object.keys(localeMap).filter(localeItem => localeItem === user.locale)[0]
    if (userLocale) {
      locale = userLocale
    }
  }

  useEffect(() => {
    moment.updateLocale(locale, {week: {dow: 1}})
  }, [locale])

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
      <DatePicker {...props}/>
    </MuiPickersUtilsProvider>
  )
}