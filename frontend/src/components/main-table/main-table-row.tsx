import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import StyledTableCell from './styled-table-cell';
import { Grid, makeStyles, TableRow, Tooltip } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import MainTableCell from './main-table-cell';
import { Row } from '../../interfaces/main-table.interface';
import { isCurrentPeriod } from '../../helpers/date.helper';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import MoneyFormat from '../money-format/money-format';
import moment from 'moment';
import { grey } from '@material-ui/core/colors';
import { Period } from '../../interfaces/common.interface';

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
    currentPeriodRow: {
      backgroundColor: theme.palette.secondary.main
    },
    periodSeparatedRow: {
      borderStyle: 'solid',
      borderTopWidth: 1,
      borderRightWidth: 2,
      borderLeftWidth: 2,
      borderBottomWidth: 5,
      borderColor: grey['600'],
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
      alignItems: 'center',
      marginRight: theme.spacing(1),
    },
    errorIcon: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(0.5),
    },
  })
);

type MainTableRowProps = {
  row: Row,
  nextRowPeriod?: number,
  incomeCategories: OperationCategory[],
  expenseCategories: OperationCategory[],
  showIncomeCategories: boolean,
  showExpenseCategories: boolean
}

const MainTableRow: React.FC<MainTableRowProps> = ({
                                                     row,
                                                     nextRowPeriod,
                                                     incomeCategories,
                                                     expenseCategories,
                                                     showIncomeCategories,
                                                     showExpenseCategories
                                                   }) => {
  const {
    id,
    date,
    period,
    isOverdue,
    incomeLists,
    expenseLists,
    incomesSum,
    expensesSum,
    savings
  } = row;
  const classes = useStyles();
  const currentPeriod = isCurrentPeriod(date, period);

  let rowClass = '';
  let incCellClass = classes.green;
  let expCellClass = classes.red;
  if (currentPeriod) {
    rowClass = classes.currentPeriodRow;
    incCellClass = classes.contrastGreen;
    expCellClass = classes.contrastRed;
  }
  let periodSeparatedRow = '';
  if (nextRowPeriod !== undefined
    && ((period === Period.DAY && nextRowPeriod !== moment(date).month())
      || (period === Period.MONTH && nextRowPeriod !== moment(date).year()))) {
    periodSeparatedRow = classes.periodSeparatedRow
  }

  return (
    <TableRow hover={!currentPeriod} key={id} className={rowClass}>

      <StyledTableCell className={classes.stickyDateCell} key={'date_' + id}>
        <Grid justify="center" className={classes.dateGrid} container>
          <Grid item>{date}</Grid>
          <Grid item>
            {isOverdue &&
            <Tooltip title="Planned operation is overdue. You can change it by editing operations on this line">
                <ErrorOutlineIcon fontSize="small" className={classes.errorIcon}/>
            </Tooltip>
            }
          </Grid>
        </Grid>
      </StyledTableCell>

      {
        showIncomeCategories && incomeLists.map((incomes: Operation[] | undefined, index) => (
          <MainTableCell
            key={'inc_cell_' + index}
            isCurrentPeriod={currentPeriod}
            rowId={id}
            categories={incomeCategories}
            itemType={OperationType.INCOME}
            items={incomes}
            index={index}
            colorClass={incCellClass}
            periodSeparatorClass={periodSeparatedRow}
          />
        ))
      }

      <StyledTableCell key={'inc_sum_' + id} className={`${incCellClass} ${classes.boldFont} ${periodSeparatedRow}`}>
        <MoneyFormat value={incomesSum}/>
      </StyledTableCell>

      {
        showExpenseCategories && expenseLists.map((expenses: Operation[] | undefined, index) => (
          <MainTableCell
            key={'exp_cell_' + index}
            isCurrentPeriod={currentPeriod}
            rowId={id}
            categories={expenseCategories}
            itemType={OperationType.EXPENSE}
            items={expenses}
            index={index}
            colorClass={expCellClass}
            periodSeparatorClass={periodSeparatedRow}
          />
        ))
      }

      <StyledTableCell key={'exp_sum_' + id} className={`${expCellClass} ${classes.boldFont} ${periodSeparatedRow}`}>
        <MoneyFormat value={expensesSum}/>
      </StyledTableCell>

      <StyledTableCell
        key={'savings_' + id}
        className={savings >= 0
          ? `${incCellClass} ${classes.boldFont} ${periodSeparatedRow}`
          : `${expCellClass} ${classes.boldFont} ${periodSeparatedRow}`}
      >
        <MoneyFormat value={savings}/>
      </StyledTableCell>
    </TableRow>
  )
}

export default MainTableRow;
