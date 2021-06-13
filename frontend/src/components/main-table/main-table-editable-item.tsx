import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import { makeStyles, MenuItem, Tooltip } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { EditExpenseDialog, EditIncomeDialog } from '../dialog/edit-operation.dialog';
import MoneyFormat from '../money-format/money-format';

type MainTableEditableItemProps = {
  colorClass: string | undefined,
  isCurrentPeriod: boolean,
  operation: Operation,
  operationType: OperationType,
  categories: OperationCategory[]
}

const useStyles = makeStyles((theme) =>
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

const MainTableEditableItem: React.FC<MainTableEditableItemProps> = ({
                                                                       colorClass,
                                                                       isCurrentPeriod,
                                                                       operation,
                                                                       operationType,
                                                                       categories
                                                                     }) => {
  const {id, value, isPlanned, description} = operation;
  const [openEditOperation, setOpenEditOperation] = React.useState(false);
  const classes = useStyles();

  const handleOpenEditOperation = () => {
    setOpenEditOperation(true);
  };

  const handleCloseEditOperation = () => {
    setOpenEditOperation(false);
  };

  let itemClasses = `${classes.menuItem} ${colorClass}`;
  if (isPlanned && isCurrentPeriod) {
    itemClasses= `${classes.menuItem} ${classes.plannedCell}`;
  }
  const clickableMenu = (
    <Tooltip title={description || ''}>
      <MenuItem
        key={id}
        className={itemClasses}
        onClick={handleOpenEditOperation}
      >
        <MoneyFormat value={value}/>
      </MenuItem>
    </Tooltip>
  )

  switch (operationType) {
    case OperationType.INCOME:
      return (
        <>
          {clickableMenu}
          <EditIncomeDialog
            operation={operation}
            categories={categories}
            open={openEditOperation}
            handleClose={handleCloseEditOperation}
          />
        </>
      );
    case OperationType.EXPENSE:
      return (
        <>
          {clickableMenu}
          <EditExpenseDialog
            operation={operation}
            categories={categories}
            open={openEditOperation}
            handleClose={handleCloseEditOperation}
          />
        </>
      );
  }
}

export default MainTableEditableItem;
