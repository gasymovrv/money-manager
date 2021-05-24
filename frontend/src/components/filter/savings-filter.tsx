import React from 'react';
import { makeStyles, MenuItem, TextField, Toolbar } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Moment } from 'moment';
import { SortDirection } from '../../interfaces/common.interface';
import { SavingFieldToSort } from '../../interfaces/saving.interface';
import { DATE_FORMAT } from '../../helpers/date.helper';

type SavingsFilterProps = {
  selectedFrom: Moment | null,
  inputFromValue?: string,
  selectedTo?: Moment | null,
  inputToValue?: string,
  sortDirection?: SortDirection,
  sortBy?: SavingFieldToSort,

  handleChangeFrom(date: any, value: any): void
  handleChangeTo(date: any, value: any): void
  handleChangeSortDirection(event: React.ChangeEvent<any>): void
  handleChangeSortBy(event: React.ChangeEvent<any>): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 30
    },
    inputField: {
      minWidth: 100,
      marginRight: theme.spacing(3)
    }
  })
);

const SavingsFilter: React.FC<SavingsFilterProps> = ({
                                                       selectedFrom,
                                                       inputFromValue,
                                                       selectedTo,
                                                       inputToValue,
                                                       sortDirection,
                                                       sortBy,
                                                       handleChangeFrom,
                                                       handleChangeTo,
                                                       handleChangeSortDirection,
                                                       handleChangeSortBy
                                                     }) => {
  const classes = useStyles();
  return (
    <Toolbar className={classes.root}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          className={classes.inputField}
          margin="normal"
          format={DATE_FORMAT}
          value={selectedFrom}
          inputValue={inputFromValue}
          onChange={handleChangeFrom}
          label="From"
          color="secondary"
          maxDate={selectedTo ? selectedTo : undefined}
        />
      </MuiPickersUtilsProvider>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          className={classes.inputField}
          margin="normal"
          format={DATE_FORMAT}
          value={selectedTo}
          inputValue={inputToValue}
          onChange={handleChangeTo}
          label="To"
          color="secondary"
          minDate={selectedFrom ? selectedFrom : undefined}
        />
      </MuiPickersUtilsProvider>
      <TextField
        className={classes.inputField}
        margin="normal"
        select
        color="secondary"
        label="Sort direction"
        value={sortDirection}
        onChange={handleChangeSortDirection}
      >
        {Object.values(SortDirection).map((value) =>
          <MenuItem key={value} value={value}>{value}</MenuItem>
        )}
      </TextField>
      <TextField
        className={classes.inputField}
        margin="normal"
        select
        color="secondary"
        label="Sort by"
        value={sortBy}
        onChange={handleChangeSortBy}
      >
        {Object.values(SavingFieldToSort).map((value) =>
          <MenuItem key={value} value={value}>{value}</MenuItem>
        )}
      </TextField>
    </Toolbar>
  )
}

export default SavingsFilter;