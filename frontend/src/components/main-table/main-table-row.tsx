import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import StyledTableCell from './styled-table-cell';
import { makeStyles, TableRow } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import MainTableCell from './main-table-cell';
import { Row } from '../../interfaces/main-table.interface';
import { isToday } from '../../helpers/date.helper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    green: {
      color: theme.palette.greenText.main
    },
    red: {
      color: theme.palette.redText.main
    },
    contrastGreen: {
      color: theme.palette.greenText.contrastText
    },
    contrastRed: {
      color: theme.palette.redText.contrastText
    },
    todayRow: {
      backgroundColor: theme.palette.secondary.main
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
  incomeCategories: OperationCategory[],
  expenseCategories: OperationCategory[],
  showIncomeCategories: boolean,
  showExpenseCategories: boolean,
  refreshTable(): void
}

const MainTableRow: React.FC<MainTableRowProps> = ({
                                                     row,
                                                     incomeCategories,
                                                     expenseCategories,
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
  const today = isToday(date);
  const rowClass = today ? `${classes.todayRow} ${classes.boldFont}` : '';
  const incCellClass = today ? `${classes.contrastGreen} ${classes.boldFont}` : classes.green;
  const expCellClass = today ? classes.contrastRed : classes.red;

  return (
    <TableRow hover={!today} key={id} className={rowClass}>

      <StyledTableCell className={classes.stickyDateCell} key={'date_' + id}>{date}</StyledTableCell>

      {
        showIncomeCategories && incomeLists.map((incomes: Operation[] | undefined, index) => (
          <MainTableCell
            key={'inc_cell_' + index}
            rowId={id}
            categories={incomeCategories}
            itemType={OperationType.INCOME}
            items={incomes}
            index={index}
            className={incCellClass}
            refreshTable={refreshTable}
          />
        ))
      }

      <StyledTableCell key={'inc_sum_' + id} className={`${incCellClass} ${classes.boldFont}`}>
        {incomesSum}
      </StyledTableCell>

      {
        showExpenseCategories && expenseLists.map((expenses: Operation[] | undefined, index) => (
          <MainTableCell
            key={'exp_cell_' + index}
            rowId={id}
            categories={expenseCategories}
            itemType={OperationType.EXPENSE}
            items={expenses}
            index={index}
            className={expCellClass}
            refreshTable={refreshTable}
          />
        ))
      }

      <StyledTableCell key={'exp_sum_' + id} className={`${expCellClass} ${classes.boldFont}`}>
        {expensesSum}
      </StyledTableCell>

      <StyledTableCell
        key={'savings_' + id}
        className={savings >= 0 ? `${incCellClass} ${classes.boldFont}` : `${expCellClass} ${classes.boldFont}`}
      >
        {savings}
      </StyledTableCell>
    </TableRow>
  )
}

export default MainTableRow;
