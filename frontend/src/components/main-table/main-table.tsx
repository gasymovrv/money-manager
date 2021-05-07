import React, { useEffect, useState } from 'react';
import { Income, IncomeType } from '../../interfaces/income.interface';
import { Expense, ExpenseType } from '../../interfaces/expense.interface';
import { getAccumulations, getExpenseTypes, getIncomeTypes } from '../../services/api.service';
import { SearchResult, SortDirection } from '../../interfaces/common.interface';
import { Accumulation, AccumulationRequestParams } from '../../interfaces/accumulation.interface';
import { grey } from '@material-ui/core/colors';
import {
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

type Column = {
  id: number,
  name: string
}

type Row = {
  id: number
  date: string
  incomes: Array<Income | null | undefined>
  expenses: Array<Expense | null | undefined>
  savings: number
}

type MainTableState = {
  incomeTypes: Column[],
  expenseTypes: Column[],
  rows: Row[],
  totalElements: number
}

function stringSort(s1: string, s2: string): number {
  if (s1 > s2) {
    return 1;
  } else if (s1 === s2) {
    return 0;
  } else {
    return -1;
  }
}

function incomeTypeSort(t1: IncomeType, t2: IncomeType): number {
  return stringSort(t1.name, t2.name);
}

function expenseTypeSort(t1: ExpenseType, t2: ExpenseType): number {
  return stringSort(t1.name, t2.name);
}

async function getTable(page: number, rowsPerPage: number): Promise<MainTableState> {
  const expenseTypes = await getExpenseTypes();
  expenseTypes.sort(expenseTypeSort);
  const expColumns: Column[] = expenseTypes.map(({id, name}: ExpenseType) => {
      return {id: id, name: name}
    }
  );

  const incomeTypes = await getIncomeTypes();
  incomeTypes.sort(incomeTypeSort);
  const incColumns: Column[] = incomeTypes.map(({id, name}: IncomeType) => {
      return {id: id, name: name}
    }
  );

  const searchResult: SearchResult<Accumulation> = await getAccumulations(
    new AccumulationRequestParams(SortDirection.DESC, page, rowsPerPage)
  );
  const accumulations = searchResult.result;
  const rows: Row[] = accumulations.map(({id, date, value, expensesByType, incomesByType}: Accumulation) => {
    const expenses: Array<Expense | undefined> = [];
    const incomes: Array<Income | undefined> = [];

    expenseTypes.forEach(({name}: ExpenseType) => {
      const exp = expensesByType.get(name);
      expenses.push(exp);
    })
    incomeTypes.forEach(({name}: IncomeType) => {
      const inc = incomesByType.get(name);
      incomes.push(inc);
    });

    return {id, date, incomes, expenses, savings: value};
  });

  return {incomeTypes: incColumns, expenseTypes: expColumns, rows: rows, totalElements: searchResult.totalElements};
}

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

const MainTable: React.FC = () => {
  const classes = useStyles();

  const [{incomeTypes, expenseTypes, rows, totalElements}, setData] = useState<MainTableState>({
    incomeTypes: [],
    expenseTypes: [],
    rows: [],
    totalElements: 0
  })
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);

  const handleChangePage = (event: unknown, newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setPageSize(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getTable(page, pageSize).then((data) => {
        setData(data);
        setLoading(false)
      },
      (err) => {
        console.log(`Getting main table error: ${err}`)
      })
  }, [page, pageSize])

  console.log('Main rendering')
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
                  Incomes
                </StyledTableCell>
                <StyledTableCell className={classes.boldFont}
                                 colSpan={expenseTypes.length + 1}>
                  Expenses
                </StyledTableCell>
                <StyledTableCell className={classes.boldFont}>
                  Savings
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell className={classes.top24}/>
                {incomeTypes.map(({id, name}: Column) =>
                  <StyledTableCell key={id} className={classes.top24}>
                    {name}
                  </StyledTableCell>
                )}
                <StyledTableCell className={`${classes.top24} ${classes.boldFont}`}>Incomes sum</StyledTableCell>
                {expenseTypes.map(({id, name}: Column) =>
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
