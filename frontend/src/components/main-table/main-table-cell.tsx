import React from 'react';
import { Income } from '../../interfaces/income.interface';
import StyledTableCell from './styled-table-cell';
import { IconButton, makeStyles, MenuItem } from '@material-ui/core';
import { Expense } from '../../interfaces/expense.interface';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { createStyles, Theme } from '@material-ui/core/styles';

function calculateSum(list: Array<Income | Expense>): number {
  return list.reduce((acc, value) => (value ? acc + value.value : acc), 0);
}

type MainTableCellProps = {
  rowId: number,
  entities: Array<Income | Expense> | undefined,
  index: number,
  className: string | undefined
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      justifyContent: 'center',
      padding: 0,
      fontSize: 13
    }
  })
);

const MainTableCell: React.FC<MainTableCellProps> = ({
                                                       rowId,
                                                       entities,
                                                       index,
                                                       className
                                                     }) => {
  const [expandList, setExpandList] = React.useState(false);
  const classes = useStyles();

  const handleExpandList = () => {
    setExpandList(true);
  }

  const handleCollapseList = () => {
    setExpandList(false);
  }

  if (entities && entities.length > 0) {
    const firstEl = entities[0];
    if (entities.length === 1) {
      return (
        <StyledTableCell key={rowId + '_' + index} className={className}>
          <MenuItem key={firstEl.id} className={classes.menuItem}>
            {firstEl.value}
          </MenuItem>
        </StyledTableCell>
      )
    } else {
      return (
        <StyledTableCell key={rowId + '_' + index} className={className}>
          {expandList ?
            entities.map((inc, i) => {
                const menuItem = (
                  <MenuItem key={inc.id} className={classes.menuItem}>
                    {inc.value}
                  </MenuItem>
                )
                if (i === entities.length - 1) {
                  return (
                    <>
                      {menuItem}
                      <IconButton size="small" onClick={handleCollapseList}>
                        <ExpandLessIcon fontSize="small"/>
                      </IconButton>
                    </>
                  )
                }
                return menuItem;
              }
            ) :
            <MenuItem key={firstEl.id} onClick={handleExpandList} className={classes.menuItem}>
              {calculateSum(entities)}
            </MenuItem>
          }
        </StyledTableCell>
      )
    }
  } else {
    return <StyledTableCell key={rowId + '_' + index} className={className}/>
  }
}

export default MainTableCell;
