import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import StyledTableCell from './styled-table-cell';
import { Grid, makeStyles, TableRow, Tooltip, useTheme } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import MainTableCell from './main-table-cell';
import { Row } from '../../interfaces/main-table.interface';
import { isToday } from '../../helpers/date.helper';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

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
    overdueRow: {
      backgroundColor: theme.palette.warning.main
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
    },
    dateGrid: {
      alignItems: 'center'
    },
    infoIcon: {
      marginRight: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    },
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
    isOverdue,
    incomeLists,
    expenseLists,
    incomesSum,
    expensesSum,
    savings
  } = row;
  const classes = useStyles();
  const today = isToday(date);
  const isDarkTheme = useTheme().palette.type === 'dark';

  let rowClass = '';
  let incCellClass = classes.green;
  let expCellClass = classes.red;
  if (today) {
    rowClass = `${classes.todayRow} ${classes.boldFont}`;
    incCellClass = `${classes.contrastGreen} ${classes.boldFont}`;
    expCellClass = `${classes.contrastRed} ${classes.boldFont}`;
  } else if (isOverdue) {
    if (isDarkTheme) {
      rowClass = `${classes.overdueRow} ${classes.boldFont}`;
      incCellClass = `${classes.contrastGreen} ${classes.boldFont}`;
      expCellClass = `${classes.contrastRed} ${classes.boldFont}`;
    } else {
      rowClass = `${classes.overdueRow} ${classes.boldFont}`;
      incCellClass = `${classes.green} ${classes.boldFont}`;
      expCellClass = `${classes.red} ${classes.boldFont}`;
    }
  }

  return (
    <TableRow hover={!today && !isOverdue} key={id} className={rowClass}>

      <StyledTableCell className={classes.stickyDateCell} key={'date_' + id}>
        <Grid justify="center" className={classes.dateGrid} container>
          <Grid item>{date}</Grid>
          <Grid item>
            {isOverdue &&
            <Tooltip title="Planned operation is overdue. You can change it by editing operations on this line">
                <ErrorOutlineIcon fontSize="small" className={classes.infoIcon}/>
            </Tooltip>
            }
          </Grid>
        </Grid>
      </StyledTableCell>

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
