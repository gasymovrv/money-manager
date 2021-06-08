import React from 'react';
import {
  Grid,
  IconButton,
  LinearProgress,
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
import { MainTableProps, Row } from '../../interfaces/main-table.interface';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { AddExpenseCategoryDialog, AddIncomeCategoryDialog } from '../dialog/add-operation-category.dialog';
import StyledTableCell from './styled-table-cell';
import MainTableRow from './main-table-row';
import MainTableEditableCategory from './main-table-editable-category';
import { OperationType } from '../../interfaces/operation.interface';

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

const MainTable: React.FC<MainTableProps> = ({
                                               refreshTable,
                                               isLoading,
                                               incomeCategories,
                                               expenseCategories,
                                               rows,
                                               totalElements,
                                               page,
                                               pageSize,
                                               handleChangePage,
                                               handleChangeRowsPerPage
                                             }) => {
  const classes = useStyles();

  const [showIncomeCategories, setShowIncomeCategories] = React.useState(true);
  const [showExpenseCategories, setShowExpenseCategories] = React.useState(true);
  const [openAddIncomeCategory, setOpenAddIncomeCategory] = React.useState(false);
  const [openAddExpenseCategory, setOpenAddExpenseCategory] = React.useState(false);

  const handleHideIncomeCategories = () => {
    setShowIncomeCategories(!showIncomeCategories);
  }

  const handleHideExpenseCategories = () => {
    setShowExpenseCategories(!showExpenseCategories);
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

  return (
    isLoading ?
      <LinearProgress/> :
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
                        onAction={refreshTable}
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
                        onAction={refreshTable}
                      />
                    </Grid>
                  </Grid>
                </StyledTableCell>

                <StyledTableCell className={classes.stickyFirstHeadRow} variant="head"/>
              </TableRow>

              <TableRow>
                <StyledTableCell className={classes.stickyDateCell} variant="head">
                  Date
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
                      refreshTable={refreshTable}
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
                      refreshTable={refreshTable}
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
              {rows.map((row: Row, i) =>
                <MainTableRow
                  key={row.id}
                  row={row}
                  incomeCategories={incomeCategories}
                  expenseCategories={expenseCategories}
                  refreshTable={refreshTable}
                  showIncomeCategories={showIncomeCategories}
                  showExpenseCategories={showExpenseCategories}
                />
              )}
            </TableBody>

          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
          component="div"
          count={totalElements}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
  );
}

export default MainTable;
