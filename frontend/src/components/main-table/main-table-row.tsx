import React from 'react';
import { Income } from '../../interfaces/income.interface';
import StyledTableCell from './styled-table-cell';
import { makeStyles, TableRow } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Expense } from '../../interfaces/expense.interface';
import MainTableCell from './main-table-cell';
import { Row } from '../../interfaces/main-table.interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    green: {
      color: theme.palette.greenText.main
    },
    red: {
      color: theme.palette.redText.main
    },
    boldFont: {
      fontSize: 14,
      fontWeight: 'bold'
    }
  })
);

type MainTableRowProps = {
  row: Row,
  showIncomeTypes: boolean,
  showExpenseTypes: boolean
}

const MainTableRow: React.FC<MainTableRowProps> = ({
                                                     row,
                                                     showIncomeTypes,
                                                     showExpenseTypes
                                                   }) => {
  const {
    id,
    date,
    incomeLists,
    expenseLists,
    incomesSum,
    expensesSum,
    savings
  } = row;
  const classes = useStyles();

  return (
    <TableRow hover key={id}>

      <StyledTableCell key={'date_' + id}>{date}</StyledTableCell>

      {
        showIncomeTypes && incomeLists.map((incomes: Income[] | undefined, index) => (
          <MainTableCell
            key={'inc_cell_' + index}
            rowId={id}
            entities={incomes}
            index={index}
            className={classes.green}
          />
        ))
      }

      <StyledTableCell key={'inc_sum_' + id} className={`${classes.green} ${classes.boldFont}`}>
        {incomesSum}
      </StyledTableCell>

      {
        showExpenseTypes && expenseLists.map((expenses: Expense[] | undefined, index) => (
          <MainTableCell
            key={'exp_cell_' + index}
            rowId={id}
            entities={expenses}
            index={index}
            className={classes.red}
          />
        ))
      }

      <StyledTableCell key={'exp_sum_' + id} className={`${classes.red} ${classes.boldFont}`}>
        {expensesSum}
      </StyledTableCell>

      <StyledTableCell
        key={'savings_' + id}
        className={savings >= 0 ? `${classes.green} ${classes.boldFont}` : `${classes.red} ${classes.boldFont}`}
      >
        {savings}
      </StyledTableCell>
    </TableRow>
  )
}

export default MainTableRow;
