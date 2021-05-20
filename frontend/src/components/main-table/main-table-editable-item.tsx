import React from 'react';
import { Operation } from '../../interfaces/operation.interface';
import { makeStyles, MenuItem } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { EntityType } from '../../interfaces/common.interface';
import EditIncomeDialog from '../dialog/edit-income.dialog';
import EditExpenseDialog from '../dialog/edit-expense.dialog';

type MainTableEditableItemProps = {
  entity: Operation,
  entityType: EntityType,
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
                                                                       entity,
                                                                       entityType,
                                                                       refreshTable
                                                                     }) => {
  const {id, value} = entity;
  const [openEditEntity, setOpenEditEntity] = React.useState(false);
  const classes = useStyles();

  const handleOpenEditEntity = () => {
    setOpenEditEntity(true);
  };

  const handleCloseEditEntity = () => {
    setOpenEditEntity(false);
  };

  const clickableMenu = (
    <MenuItem
      key={id}
      className={classes.menuItem}
      onClick={handleOpenEditEntity}
    >
      {value}
    </MenuItem>
  )

  switch (entityType) {
    case EntityType.INCOME:
      return (
        <>
          {clickableMenu}
          <EditIncomeDialog
            entity={entity}
            open={openEditEntity}
            handleClose={handleCloseEditEntity}
            onAction={refreshTable}
          />
        </>
      );
    case EntityType.EXPENSE:
      return (
        <>
          {clickableMenu}
          <EditExpenseDialog
            entity={entity}
            open={openEditEntity}
            handleClose={handleCloseEditEntity}
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
