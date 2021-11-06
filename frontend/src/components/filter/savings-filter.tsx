import React, { useState } from 'react';
import { Button, IconButton, InputAdornment, makeStyles, MenuItem, TextField, Toolbar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, Theme } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Period, SortDirection } from '../../interfaces/common.interface';
import { SavingFieldToSort, SavingsFilterParams } from '../../interfaces/saving.interface';
import { DATE_FORMAT } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { changeFilter, resetFilter } from '../../actions/savings-filter.actions';
import moment from 'moment/moment';

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

const SavingsFilter: React.FC = () => {
  const classes = useStyles();
  const savingsFilter: SavingsFilterParams = useSelector(({savingsFilter}: any) => savingsFilter);
  const dispatch = useDispatch();
  const change = (activeFilter: SavingsFilterParams) => dispatch(changeFilter(activeFilter))
  const reset = () => dispatch(resetFilter())

  const [searchText, setSearchText] = useState<string | undefined>(savingsFilter.searchText);

  const handleChangeFrom = (date: any) => {
    if (!date) {
      change({...savingsFilter, from: undefined});
    } else {
      change({...savingsFilter, from: moment(date).format(DATE_FORMAT)});
    }
  }

  const handleChangeTo = (date: any) => {
    if (!date) {
      change({...savingsFilter, to: undefined});
    } else {
      change({...savingsFilter, to: moment(date).format(DATE_FORMAT)});
    }
  }

  const handleChangeSortDirection = (event: React.ChangeEvent<any>) => {
    change({...savingsFilter, sortDirection: event.target.value});
  }

  const handleSortBy = (event: React.ChangeEvent<any>) => {
    change({...savingsFilter, sortBy: event.target.value});
  }

  const handleChangeGroupBy = (event: React.ChangeEvent<any>) => {
    change({...savingsFilter, groupBy: event.target.value});
  }

  const handleChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const handleClickOnSearch = () => {
    change({...savingsFilter, searchText: searchText});
  }

  const handlePressEnterInSearchField = (event: React.KeyboardEvent<any>) => {
    if (event.key === 'Enter') {
      change({...savingsFilter, searchText: searchText});
      event.preventDefault();
    }
  }

  return (
    <Toolbar className={classes.root}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          className={classes.inputField}
          margin="normal"
          format={DATE_FORMAT}
          value={savingsFilter.from ? savingsFilter.from : null}
          onChange={handleChangeFrom}
          label="From"
          color="secondary"
          maxDate={savingsFilter.to ? savingsFilter.to : undefined}
          clearable
        />
      </MuiPickersUtilsProvider>

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          className={classes.inputField}
          margin="normal"
          format={DATE_FORMAT}
          value={savingsFilter.to ? savingsFilter.to : null}
          onChange={handleChangeTo}
          label="To"
          color="secondary"
          minDate={savingsFilter.from ? savingsFilter.from : undefined}
          clearable
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

      <TextField
        className={classes.inputField}
        margin="normal"
        color="secondary"
        label="Search text"
        value={searchText}
        onKeyPress={handlePressEnterInSearchField}
        onChange={handleChangeSearchText}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position={'end'}
              onClick={handleClickOnSearch}
            >
              <IconButton>
                <SearchIcon/>
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Button
        variant="outlined"
        onClick={reset}
      >
        Reset
      </Button>
    </Toolbar>
  )
}

export default SavingsFilter;
