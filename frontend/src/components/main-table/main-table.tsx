import React, { useState } from 'react';
import {
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { MainTableState, PaginationParams, Row, ShowingCategoriesParams } from '../../interfaces/main-table.interface';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { AddExpenseCategoryDialog, AddIncomeCategoryDialog } from '../dialog/add-operation-category.dialog';
import StyledTableCell from './styled-table-cell';
import MainTableRow from './main-table-row';
import MainTableEditableCategory from './main-table-editable-category';
import { OperationCategory, OperationType } from '../../interfaces/operation.interface';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { useDispatch, useSelector } from 'react-redux';
import { SavingFieldToSort, SavingsFilterParams } from '../../interfaces/saving.interface';
import { changePagination } from '../../actions/pagination.actions';
import { changeShowingCategories } from '../../actions/show-categories.actions';
import { Period } from '../../interfaces/common.interface';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxHeight: '75vh'
    },
    paddings: {
      paddingLeft: 5,
      paddingRight: 5
    },
    stickyFirstCell: {
      width: 100,
      position: 'sticky',
      top: 0,
      left: 0,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 3
    },
    stickyFirstHeadRow: {
      height: 30,
      minWidth: 150,
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 2
    },
    stickyDateCell: {
      width: 100,
      position: 'sticky',
      top: 29,
      left: 0,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 3
    },
    stickySecondHeadRow: {
      position: 'sticky',
      top: 29,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 1
    },
    sumColumnsWidth: {
      minWidth: 100,
    }
  })
);

const MainTable: React.FC = () => {
  const classes = useStyles();

  const savingsFilter: SavingsFilterParams = useSelector(({savingsFilter}: any) => savingsFilter);
  const pagination: PaginationParams = useSelector(({pagination}: any) => pagination);
  const {
    showExpenseCategories,
    showIncomeCategories
  }: ShowingCategoriesParams = useSelector(({showCategories}: any) => showCategories);
  const {
    rows,
    incomeCategories,
    expenseCategories,
    totalElements
  }: MainTableState = useSelector(({mainTable}: any) => {
    return {
      rows: mainTable.rows,
      incomeCategories: mainTable.incomeCategories.filter(({isChecked}: OperationCategory) => isChecked),
      expenseCategories: mainTable.expenseCategories.filter(({isChecked}: OperationCategory) => isChecked),
      totalElements: mainTable.totalElements,
      isLoading: mainTable.isLoading
    }
  });

  const dispatch = useDispatch();
  const changePgnOptions = (pp: PaginationParams) => dispatch(changePagination(pp));
  const changeShowCatOptions = (scp: ShowingCategoriesParams) => dispatch(changeShowingCategories(scp));

  const [openAddIncomeCategory, setOpenAddIncomeCategory] = useState(false);
  const [openAddExpenseCategory, setOpenAddExpenseCategory] = useState(false);

  const handleHideIncomeCategories = () => {
    changeShowCatOptions({showExpenseCategories, showIncomeCategories: !showIncomeCategories});
  }

  const handleHideExpenseCategories = () => {
    changeShowCatOptions({showIncomeCategories, showExpenseCategories: !showExpenseCategories});
  }

  const handleOpenAddIncomeCategory = () => {
    setOpenAddIncomeCategory(true);
  }

  const handleOpenAddExpenseCategory = () => {
    setOpenAddExpenseCategory(true);
  }

  const handleCloseAddIncomeCategory = () => {
    setOpenAddIncomeCategory(false);
  }

  const handleCloseAddExpenseCategory = () => {
    setOpenAddExpenseCategory(false);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    changePgnOptions({...pagination, page: newPage})
    dispatch(fetchMainTable({page: newPage, pageSize: pagination.pageSize}, savingsFilter));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = +event.target.value;
    changePgnOptions({...pagination, pageSize: newPageSize, page: 0})
    dispatch(fetchMainTable({page: 0, pageSize: newPageSize}, savingsFilter));
  };

  return (
    <Paper>
      <TableContainer className={classes.container}>
        <Table aria-label="sticky table">

          <TableHead>
            <TableRow>
              <StyledTableCell variant="head" className={classes.stickyFirstCell}/>

              <StyledTableCell className={classes.stickyFirstHeadRow} variant="head"
                               colSpan={showIncomeCategories ? incomeCategories.length + 1 : 1}>
                <Grid justify="center" container>
                  <Grid item>Incomes</Grid>
                  <Grid item>
                    <IconButton size="small" onClick={handleHideIncomeCategories}>
                      {showIncomeCategories ?
                        <ExpandLessIcon fontSize="small"/> :
                        <ExpandMoreIcon fontSize="small"/>
                      }
                    </IconButton>
                    <Tooltip title="Add income category">
                      <IconButton size="small" onClick={handleOpenAddIncomeCategory}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                    <AddIncomeCategoryDialog
                      open={openAddIncomeCategory}
                      handleClose={handleCloseAddIncomeCategory}
                    />
                  </Grid>
                </Grid>
              </StyledTableCell>

              <StyledTableCell className={classes.stickyFirstHeadRow} variant="head"
                               colSpan={showExpenseCategories ? expenseCategories.length + 1 : 1}>
                <Grid justify="center" container>
                  <Grid item>Expenses</Grid>
                  <Grid item>
                    <IconButton size="small" onClick={handleHideExpenseCategories}>
                      {showExpenseCategories ?
                        <ExpandLessIcon fontSize="small"/> :
                        <ExpandMoreIcon fontSize="small"/>
                      }
                    </IconButton>
                    <Tooltip title="Add expense category">
                      <IconButton size="small" onClick={handleOpenAddExpenseCategory}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                    <AddExpenseCategoryDialog
                      open={openAddExpenseCategory}
                      handleClose={handleCloseAddExpenseCategory}
                    />
                  </Grid>
                </Grid>
              </StyledTableCell>

              <StyledTableCell className={classes.stickyFirstHeadRow} variant="head"/>
            </TableRow>

            <TableRow>
              <StyledTableCell className={classes.stickyDateCell} variant="head">
                Period
              </StyledTableCell>

              {showIncomeCategories && incomeCategories.map((category) =>
                <StyledTableCell
                  variant="head"
                  key={category.id}
                  className={`${classes.paddings} ${classes.stickySecondHeadRow}`}
                >
                  <MainTableEditableCategory
                    category={category}
                    operationType={OperationType.INCOME}
                  />
                </StyledTableCell>
              )}

              <StyledTableCell
                variant="head"
                className={`${classes.paddings} ${classes.stickySecondHeadRow} ${classes.sumColumnsWidth}`}
              >
                {showIncomeCategories && 'Incomes sum'}
              </StyledTableCell>

              {showExpenseCategories && expenseCategories.map((category) =>
                <StyledTableCell
                  variant="head"
                  key={category.id}
                  className={`${classes.paddings} ${classes.stickySecondHeadRow}`}
                >
                  <MainTableEditableCategory
                    category={category}
                    operationType={OperationType.EXPENSE}
                  />
                </StyledTableCell>
              )}

              <StyledTableCell
                variant="head"
                className={`${classes.paddings} ${classes.stickySecondHeadRow} ${classes.sumColumnsWidth}`}
              >
                {showExpenseCategories && 'Expenses sum'}
              </StyledTableCell>

              <StyledTableCell
                variant="head"
                className={`${classes.paddings} ${classes.stickySecondHeadRow}`}
              >
                Savings
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row: Row, i) => {
                let nextRowMonth: number | undefined;
                if (savingsFilter.groupBy === Period.DAY
                  && savingsFilter.sortBy === SavingFieldToSort.DATE
                  && rows.length > i + 1) {
                  nextRowMonth = moment(rows[i + 1].date).month();
                }

                return (
                  <MainTableRow
                    key={row.id}
                    row={row}
                    nextRowMonth={nextRowMonth}
                    incomeCategories={incomeCategories}
                    expenseCategories={expenseCategories}
                    showIncomeCategories={showIncomeCategories}
                    showExpenseCategories={showExpenseCategories}
                  />
                )
              }
            )}
          </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
        component="div"
        count={totalElements}
        rowsPerPage={pagination.pageSize}
        page={pagination.page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default MainTable;
