import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import StyledTableCell from './styled-table-cell';
import { IconButton, makeStyles, MenuItem } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import MainTableEditableItem from './main-table-editable-item';
import MoneyFormat from '../money-format/money-format';

function calculateSum(list: Operation[]): number {
  return list.reduce((acc, value) => (value ? acc + value.value : acc), 0);
}

type MainTableCellProps = {
  rowId: number,
  isCurrentPeriod: boolean,
  categories: OperationCategory[],
  itemType: OperationType,
  items: Operation[] | undefined,
  index: number,
  colorClass: string | undefined,
  refreshTable(): void
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      justifyContent: 'center',
      padding: 0,
      fontSize: 13
    },
    plannedCell: {
      color: theme.palette.background.paper
    }
  })
);

const MainTableCell: React.FC<MainTableCellProps> = ({
                                                       rowId,
                                                       isCurrentPeriod,
                                                       categories,
                                                       itemType,
                                                       items,
                                                       index,
                                                       colorClass,
                                                       refreshTable
                                                     }) => {
  const [expandList, setExpandList] = React.useState(false);
  const classes = useStyles();

  const handleExpandList = () => {
    setExpandList(true);
  }

  const handleCollapseList = () => {
    setExpandList(false);
  }

  if (items && items.length > 0) {
    const firstEl = items[0];

    if (items.length === 1) {
      return (
        <StyledTableCell key={rowId + '_' + index}>
          <MainTableEditableItem
            colorClass={colorClass}
            isCurrentPeriod={isCurrentPeriod}
            operation={firstEl}
            categories={categories}
            operationType={itemType}
            refreshTable={refreshTable}
          />
        </StyledTableCell>
      )
    } else {
      let menuItemClasses = `${classes.menuItem} ${colorClass}`;
      if (items.every((i) => i.isPlanned) && isCurrentPeriod) {
        menuItemClasses = `${classes.menuItem} ${classes.plannedCell}`;
      }

      return (
        <StyledTableCell key={rowId + '_' + index}>
          {expandList ?
            items.map((inc, i) => {
                const menuItem = (
                  <MainTableEditableItem
                    colorClass={colorClass}
                    isCurrentPeriod={isCurrentPeriod}
                    operation={inc}
                    categories={categories}
                    operationType={itemType}
                    refreshTable={refreshTable}
                  />
                )

                if (i === items.length - 1) {
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
            <MenuItem
              key={firstEl.id}
              onClick={handleExpandList}
              className={menuItemClasses}
            >
              <MoneyFormat value={calculateSum(items)}/>
            </MenuItem>
          }
        </StyledTableCell>
      )
    }
  } else {
    return <StyledTableCell key={rowId + '_' + index} className={colorClass}/>
  }
}

export default MainTableCell;
