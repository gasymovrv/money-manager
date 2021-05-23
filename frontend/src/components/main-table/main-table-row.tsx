import React from 'react';
import { Operation, OperationType } from '../../interfaces/operation.interface';
import StyledTableCell from './styled-table-cell';
import { makeStyles, TableRow } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
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
    },
    stickyDateCell: {
      minWidth: 100,
      position: 'sticky',
      left: 0,
      backgroundColor: theme.palette.primary.dark,
      zIndex: 1
    }
  })
);

type MainTableRowProps = {
  row: Row,
  showIncomeCategories: boolean,
  showExpenseCategories: boolean,
  refreshTable(): void
}

const MainTableRow: React.FC<MainTableRowProps> = ({
                                                     row,
                                                     showIncomeCategories,
                                                     showExpenseCategories,
                                                     refreshTable
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

      <StyledTableCell className={classes.stickyDateCell} key={'date_' + id}>{date}</StyledTableCell>

      {
        showIncomeCategories && incomeLists.map((incomes: Operation[] | undefined, index) => (
          <MainTableCell
            key={'inc_cell_' + index}
            rowId={id}
            itemType={OperationType.INCOME}
            items={incomes}
            index={index}
            className={classes.green}
            refreshTable={refreshTable}
          />
        ))
      }

      <StyledTableCell key={'inc_sum_' + id} className={`${classes.green} ${classes.boldFont}`}>
        {incomesSum}
      </StyledTableCell>

      {
        showExpenseCategories && expenseLists.map((expenses: Operation[] | undefined, index) => (
          <MainTableCell
            key={'exp_cell_' + index}
            rowId={id}
            itemType={OperationType.EXPENSE}
            items={expenses}
            index={index}
            className={classes.red}
            refreshTable={refreshTable}
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
