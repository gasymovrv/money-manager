import React from 'react';
import { Operation, OperationType } from '../../interfaces/operation.interface';
import { makeStyles, MenuItem } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { EditExpenseDialog, EditIncomeDialog } from '../dialog/edit-operation.dialog';

type MainTableEditableItemProps = {
  operation: Operation,
  operationType: OperationType,
  refreshTable(): void
}

const useStyles = makeStyles(() =>
  createStyles({
    menuItem: {
      justifyContent: 'center',
      padding: 0,
      fontSize: 13
    }
  })
);

const MainTableEditableItem: React.FC<MainTableEditableItemProps> = ({
                                                                       operation,
                                                                       operationType,
                                                                       refreshTable
                                                                     }) => {
  const {id, value} = operation;
  const [openEditOperation, setOpenEditOperation] = React.useState(false);
  const classes = useStyles();

  const handleOpenEditOperation = () => {
    setOpenEditOperation(true);
  };

  const handleCloseEditOperation = () => {
    setOpenEditOperation(false);
  };

  const clickableMenu = (
    <MenuItem
      key={id}
      className={classes.menuItem}
      onClick={handleOpenEditOperation}
    >
      {value}
    </MenuItem>
  )

  switch (operationType) {
    case OperationType.INCOME:
      return (
        <>
          {clickableMenu}
          <EditIncomeDialog
            operation={operation}
            open={openEditOperation}
            handleClose={handleCloseEditOperation}
            onAction={refreshTable}
          />
        </>
      );
    case OperationType.EXPENSE:
      return (
        <>
          {clickableMenu}
          <EditExpenseDialog
            operation={operation}
            open={openEditOperation}
            handleClose={handleCloseEditOperation}
            onAction={refreshTable}
          />
        </>
      );
    default:
      return (
        <>
          <MenuItem
            key={id}
            className={classes.menuItem}
          >
            {value}
          </MenuItem>
        </>
      );
  }
}

export default MainTableEditableItem;
