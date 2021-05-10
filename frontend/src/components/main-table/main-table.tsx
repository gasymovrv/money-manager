import React from 'react';
import { Income } from '../../interfaces/income.interface';
import { Expense } from '../../interfaces/expense.interface';
import { grey } from '@material-ui/core/colors';
import {
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles
} from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { MainTableProps, Row } from '../../interfaces/main-table.interface';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddIncomeTypeDialog from '../dialog/add-income-type.dialog';
import AddExpenseTypeDialog from '../dialog/add-expense-type.dialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 800,
      height: '80vh',
      maxHeight: 650,
    },
    green: {
      color: theme.palette.greenText.main
    },
    red: {
      color: theme.palette.redText.main
    },
    top24: {
      top: 24
    },
    boldFont: {
      fontSize: 14,
      fontWeight: 'bold'
    }
  })
);

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      borderBottom: 0,
      backgroundColor: theme.palette.primary.dark,
      fontSize: 14
    },
    root: {
      borderRightWidth: 2,
      borderRightColor: grey['600'],
      borderRightStyle: 'solid',
      textAlign: 'center',
      padding: 0,
      fontSize: 13,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const MainTable: React.FC<MainTableProps> = ({
                                               refreshTable,
                                               isLoading,
                                               incomeTypes,
                                               expenseTypes,
                                               rows,
                                               totalElements,
                                               page,
                                               pageSize,
                                               handleChangePage,
                                               handleChangeRowsPerPage
                                             }) => {
  const classes = useStyles();

  const [openAddIncomeType, setOpenAddIncomeType] = React.useState(false);
  const [openAddExpenseType, setOpenAddExpenseType] = React.useState(false);

  const handleHideIncomeTypes = (event: React.MouseEvent<HTMLButtonElement>) => {

  }

  const handleHideExpenseTypes = (event: React.MouseEvent<HTMLButtonElement>) => {

  }

  const handleOpenAddIncomeType = () => {
    setOpenAddIncomeType(true);
  }

  const handleOpenAddExpenseType = () => {
    setOpenAddExpenseType(true);
  }

  const handleCloseAddIncomeType = () => {
    setOpenAddIncomeType(false);
  }

  const handleCloseAddExpenseType = () => {
    setOpenAddExpenseType(false);
  }

  console.log('Main Table rendering')
  return (
    isLoading ? <LinearProgress/> :
      <Paper>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">

            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.boldFont}>
                  Date
                </StyledTableCell>

                <StyledTableCell className={classes.boldFont}
                                 colSpan={incomeTypes.length + 1}>
                  <Grid container xs={12}>
                    <Grid item xs={8}>Incomes</Grid>
                    <Grid item xs={4}>
                      <IconButton size="small" onClick={handleHideIncomeTypes}>
                        <ArrowDropDownIcon fontSize="small"/>
                      </IconButton>
                      <IconButton size="small" onClick={handleOpenAddIncomeType}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                      <AddIncomeTypeDialog
                        open={openAddIncomeType}
                        handleClose={handleCloseAddIncomeType}
                        handleSave={refreshTable}
                      />
                    </Grid>
                  </Grid>
                </StyledTableCell>

                <StyledTableCell className={classes.boldFont}
                                 colSpan={expenseTypes.length + 1}>
                  <Grid container xs={12}>
                    <Grid item xs={8}>Expenses</Grid>
                    <Grid item xs={4}>
                      <IconButton size="small" onClick={handleHideExpenseTypes}>
                        <ArrowDropDownIcon fontSize="small"/>
                      </IconButton>
                      <IconButton size="small" onClick={handleOpenAddExpenseType}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                      <AddExpenseTypeDialog
                        open={openAddExpenseType}
                        handleClose={handleCloseAddExpenseType}
                        handleSave={refreshTable}
                      />
                    </Grid>
                  </Grid>
                </StyledTableCell>

                <StyledTableCell className={classes.boldFont}>
                  Savings
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell className={classes.top24}/>

                {incomeTypes.map(({id, name}) =>
                  <StyledTableCell key={id} className={classes.top24}>
                    {name}
                  </StyledTableCell>
                )}

                <StyledTableCell className={`${classes.top24} ${classes.boldFont}`}>Incomes sum</StyledTableCell>

                {expenseTypes.map(({id, name}) =>
                  <StyledTableCell key={id} className={classes.top24}>
                    {name}
                  </StyledTableCell>
                )}

                <StyledTableCell className={`${classes.top24} ${classes.boldFont}`}>Expenses sum</StyledTableCell>

                <StyledTableCell className={classes.top24}/>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map(({id, date, incomes, expenses, savings}: Row) =>
                <StyledTableRow key={id}>

                  <StyledTableCell key={'date_' + id}>{date}</StyledTableCell>
                  {incomes.map((inc: Income | null | undefined, index) =>
                    inc ?
                      <StyledTableCell key={id + '_' + inc.id} className={classes.green}>
                        {inc.value}
                      </StyledTableCell> :
                      <StyledTableCell key={id + index}/>
                  )}

                  <StyledTableCell key={'inc_sum_' + id} className={`${classes.green} ${classes.boldFont}`}>
                    {incomes.reduce((acc, value) => (value ? acc + value.value : acc), 0)}
                  </StyledTableCell>

                  {expenses.map((exp: Expense | null | undefined, index) =>
                    exp ?
                      <StyledTableCell key={id + '_' + exp.id} className={classes.red}>
                        {exp.value}
                      </StyledTableCell> :
                      <StyledTableCell key={id + index}/>
                  )}

                  <StyledTableCell key={'exp_sum_' + id} className={`${classes.red} ${classes.boldFont}`}>
                    {expenses.reduce((acc, value) => (value ? acc + value.value : acc), 0)}
                  </StyledTableCell>

                  <StyledTableCell
                    key={'savings_' + id}
                    className={savings >= 0 ? `${classes.green} ${classes.boldFont}` : `${classes.red} ${classes.boldFont}`}>
                    {savings}
                  </StyledTableCell>
                </StyledTableRow>
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
