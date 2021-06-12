import React from 'react';
import { Button, makeStyles, MenuItem, TextField, Toolbar } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Period, SortDirection } from '../../interfaces/common.interface';
import { SavingFieldToSort } from '../../interfaces/saving.interface';
import { DATE_FORMAT } from '../../constants';
import { SavingsFilterProps } from '../../interfaces/actions.interface';

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
                                                       savingsFilter,
                                                       changeFilter,
                                                       resetFilter
                                                     }) => {
  const classes = useStyles();

  const handleChangeFrom = (date: any, value: any) => {
    changeFilter({...savingsFilter, from: value});
  }

  const handleChangeTo = (date: any, value: any) => {
    changeFilter({...savingsFilter, to: value});
  }

  const handleChangeSortDirection = (event: React.ChangeEvent<any>) => {
    changeFilter({...savingsFilter, sortDirection: event.target.value});
  }

  const handleSortBy = (event: React.ChangeEvent<any>) => {
    changeFilter({...savingsFilter, sortBy: event.target.value});
  }

  const handleChangeGroupBy = (event: React.ChangeEvent<any>) => {
    changeFilter({...savingsFilter, groupBy: event.target.value});
  }

  return (
    <Toolbar className={classes.root}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          className={classes.inputField}
          margin="normal"
          format={DATE_FORMAT}
          value={savingsFilter.from ? savingsFilter.from : null}
          inputValue={savingsFilter.from}
          onChange={handleChangeFrom}
          label="From"
          color="secondary"
          maxDate={savingsFilter.to ? savingsFilter.to : undefined}
        />
      </MuiPickersUtilsProvider>

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          className={classes.inputField}
          margin="normal"
          format={DATE_FORMAT}
          value={savingsFilter.to ? savingsFilter.to : null}
          inputValue={savingsFilter.to}
          onChange={handleChangeTo}
          label="To"
          color="secondary"
          minDate={savingsFilter.from ? savingsFilter.from : undefined}
        />
      </MuiPickersUtilsProvider>

      <TextField
        className={classes.inputField}
        margin="normal"
        select
        color="secondary"
        label="Sort direction"
        value={savingsFilter.sortDirection}
        onChange={handleChangeSortDirection}
      >
        {Object.values(SortDirection).map((value) =>
          <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>
        )}
      </TextField>

      <TextField
        className={classes.inputField}
        margin="normal"
        select
        color="secondary"
        label="Sort by"
        value={savingsFilter.sortBy}
        onChange={handleSortBy}
      >
        {Object.values(SavingFieldToSort).map((value) =>
          <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>
        )}
      </TextField>

      <TextField
        className={classes.inputField}
        margin="normal"
        select
        color="secondary"
        label="Group by"
        value={savingsFilter.groupBy}
        onChange={handleChangeGroupBy}
      >
        {Object.values(Period).map((value) =>
          <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>
        )}
      </TextField>

      <Button
        variant="outlined"
        onClick={resetFilter}
      >
        Reset
      </Button>
    </Toolbar>
  )
}

export default SavingsFilter;