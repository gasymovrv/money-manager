import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import StyledTableCell from './styled-table-cell';
import { IconButton, makeStyles, MenuItem, Tooltip } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import MainTableEditableItem from './main-table-editable-item';
import MoneyFormat from '../money-format/money-format';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

function calculateSum(list: Operation[]): number {
  return list.reduce((acc, value) => (value ? acc + value.value : acc), 0);
}

type MainTableCellProps = {
  rowId: number,
  isOverdue: boolean,
  isCurrentPeriod: boolean,
  categories: OperationCategory[],
  itemType: OperationType,
  items: Operation[] | undefined,
  index: number,
  colorClass: string | undefined
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      justifyContent: 'center',
      padding: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      fontSize: 13
    },
    secondaryColor: {
      color: theme.palette.secondary.main
    },
    paperColor: {
      color: theme.palette.background.paper
    },
    errorIcon: {
      color: theme.palette.error.main
    }
  })
);

const MainTableCell: React.FC<MainTableCellProps> = ({
                                                       rowId,
                                                       isCurrentPeriod,
                                                       isOverdue,
                                                       categories,
                                                       itemType,
                                                       items,
                                                       index,
                                                       colorClass
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
          />
        </StyledTableCell>
      )
    }

    let multiplyItemsColor = colorClass;
    const hasPlanned = items.some((i) => i.isPlanned);
    if (hasPlanned && isCurrentPeriod) {
      multiplyItemsColor = classes.paperColor;
    } else if (hasPlanned) {
      multiplyItemsColor = classes.secondaryColor;
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
                />
              )

              if (i === items.length - 1) {
                return (
                  <>
                    {menuItem}
                    <IconButton
                      size="small"
                      onClick={handleCollapseList}
                      className={isCurrentPeriod ? classes.paperColor : classes.secondaryColor}
                    >
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
            className={`${classes.menuItem} ${multiplyItemsColor}`}
          >
            <MoneyFormat value={calculateSum(items)}/>
            <IconButton
              size="small"
              className={isCurrentPeriod ? classes.paperColor : classes.secondaryColor}
            >
              <ExpandMoreIcon fontSize="small"/>
            </IconButton>
            {isOverdue &&
            <Tooltip title="Some of these operations are overdue">
                <ErrorOutlineIcon fontSize="small" className={classes.errorIcon}/>
            </Tooltip>
            }
          </MenuItem>
        }
      </StyledTableCell>
    )
  } else {
    return <StyledTableCell key={rowId + '_' + index} className={colorClass}/>
  }
}

export default MainTableCell;
