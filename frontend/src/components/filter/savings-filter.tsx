import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  ListItemText,
  makeStyles,
  MenuItem,
  TextField,
  Toolbar
} from '@material-ui/core';
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
import { MainTableState } from '../../interfaces/main-table.interface';
import { OperationCategory } from '../../interfaces/operation.interface';
import { arrayEquals } from '../../helpers/common.helper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 80,
    },
    inputField: {
      minWidth: 100,
      marginRight: theme.spacing(3)
    },
    searchField: {
      minWidth: 150,
      maxWidth: 200,
      marginRight: theme.spacing(3)
    },
    categoriesField: {
      minWidth: 200,
      maxWidth: 300,
      marginRight: theme.spacing(3)
    }
  })
);

const SavingsFilter: React.FC = () => {
  const classes = useStyles();
  const {incomeCategories, expenseCategories}: MainTableState = useSelector(({mainTable}: any) => mainTable);
  const savingsFilter: SavingsFilterParams = useSelector(({savingsFilter}: any) => savingsFilter);

  const dispatch = useDispatch();
  const change = (activeFilter: SavingsFilterParams) => dispatch(changeFilter(activeFilter))
  const reset = () => dispatch(resetFilter())

  const [searchText, setSearchText] = useState<string | undefined>(savingsFilter.searchText);
  const [selectedIncomeCategories, setSelectedIncomeCategories] = useState<OperationCategory[]>(incomeCategories);
  const [selectedExpenseCategories, setSelectedExpenseCategories] = useState<OperationCategory[]>(expenseCategories);
  const checkedIncomeCategoryNames = selectedIncomeCategories
    .filter(({isChecked}) => isChecked)
    .map(({name}) => name);
  const checkedExpenseCategoryNames = selectedExpenseCategories
    .filter(({isChecked}) => isChecked)
    .map(({name}) => name);

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

  const handleChangeIncomeCategories = (event: React.ChangeEvent<any>) => {
    let updatedNames = event.target.value;
    setSelectedIncomeCategories(getUpdatedSelectedCategories(updatedNames, selectedIncomeCategories));
  };

  const handleChangeExpenseCategories = (event: React.ChangeEvent<any>) => {
    let updatedNames = event.target.value;
    setSelectedExpenseCategories(getUpdatedSelectedCategories(updatedNames, selectedExpenseCategories));
  };

  const handleSelectIncomeCategories = () => {
    handleSelectCategories(selectedIncomeCategories, incomeCategories, 'incomeCategoryIds');
  };

  const handleSelectExpenseCategories = () => {
    handleSelectCategories(selectedExpenseCategories, expenseCategories, 'expenseCategoryIds');
  };

  const handleSelectCategories = (selectedCategories: OperationCategory[],
                                  categories: OperationCategory[],
                                  categoriesKey: string) => {
    const checkedExpCategoryIds = selectedCategories.filter(({isChecked}) => isChecked).map(({id}) => id);
    const categoryIds = categories.map(({id}) => id);
    const filterCategoryIds = savingsFilter[categoriesKey as keyof SavingsFilterParams] as number[];

    if (arrayEquals(categoryIds, checkedExpCategoryIds)) {
      if (filterCategoryIds.length > 0) {
        change({
          ...savingsFilter,
          [categoriesKey]: []
        });
      }
    } else if (!arrayEquals(filterCategoryIds, checkedExpCategoryIds)) {
      change({
        ...savingsFilter,
        [categoriesKey]: checkedExpCategoryIds
      });
    }
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

  const getUpdatedSelectedCategories = (updatedCategoryNames: string[], categories: OperationCategory[]) => {
    return categories.map(({id, name}) => {
      return {id: id, name: name, isChecked: updatedCategoryNames.indexOf(name) > -1}
    });
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
        className={classes.categoriesField}
        margin="normal"
        select
        color="secondary"
        label="Income categories"
        SelectProps={{
          multiple: true,
          value: checkedIncomeCategoryNames,
          onChange: handleChangeIncomeCategories,
          onClose: handleSelectIncomeCategories,
          renderValue: (selected: any) => selected.join(', ')
        }}
      >
        {selectedIncomeCategories.map(({id, name, isChecked}) => (
          <MenuItem
            key={id}
            value={name}
            disabled={isChecked && checkedIncomeCategoryNames.length === 1}
          >
            <Checkbox checked={isChecked}/>
            <ListItemText primary={name}/>
          </MenuItem>
        ))}
      </TextField>

      <TextField
        className={classes.categoriesField}
        margin="normal"
        select
        color="secondary"
        label="Expense categories"
        SelectProps={{
          multiple: true,
          value: checkedExpenseCategoryNames,
          onChange: handleChangeExpenseCategories,
          onClose: handleSelectExpenseCategories,
          renderValue: (selected: any) => selected.join(', ')
        }}
      >
        {selectedExpenseCategories.map(({id, name, isChecked}) => (
          <MenuItem
            key={id}
            value={name}
            disabled={isChecked && checkedExpenseCategoryNames.length === 1}
          >
            <Checkbox checked={isChecked}/>
            <ListItemText primary={name}/>
          </MenuItem>
        ))}
      </TextField>

      <TextField
        className={classes.searchField}
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
