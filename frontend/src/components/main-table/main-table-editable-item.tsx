import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import { makeStyles, MenuItem } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { EditExpenseDialog, EditIncomeDialog } from '../dialog/edit-operation.dialog';

type MainTableEditableItemProps = {
  className: string | undefined,
  operation: Operation,
  operationType: OperationType,
  categories: OperationCategory[],
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
                                                                       className,
                                                                       operation,
                                                                       operationType,
                                                                       categories,
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
      className={`${classes.menuItem} ${className}`}
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
            categories={categories}
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
            categories={categories}
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
            className={`${classes.menuItem} ${className}`}
          >
            {value}
          </MenuItem>
        </>
      );
  }
}

export default MainTableEditableItem;
