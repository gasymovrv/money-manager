import React from 'react';
import { OperationCategory, OperationType } from '../../interfaces/operation.interface';
import { makeStyles, MenuItem } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { EditExpenseCategoryDialog, EditIncomeCategoryDialog } from '../dialog/edit-operation-category.dialog';

type MainTableEditableCategoryProps = {
  category: OperationCategory,
  operationType: OperationType
}

const useStyles = makeStyles(() =>
  createStyles({
    menuItem: {
      justifyContent: 'center',
      padding: 0,
      fontSize: 14
    }
  })
);

const MainTableEditableCategory: React.FC<MainTableEditableCategoryProps> = ({
                                                                               category,
                                                                               operationType
                                                                             }) => {
  const {id, name} = category;
  const [openEditCategory, setOpenEditCategory] = React.useState(false);
  const classes = useStyles();

  const handleOpenEditCategory = () => {
    setOpenEditCategory(true);
  };

  const handleCloseEditCategory = () => {
    setOpenEditCategory(false);
  };

  const clickableMenu = (
    <MenuItem
      key={id}
      className={classes.menuItem}
      onClick={handleOpenEditCategory}
    >
      {name}
    </MenuItem>
  )

  switch (operationType) {
    case OperationType.INCOME:
      return (
        <>
          {clickableMenu}
          <EditIncomeCategoryDialog
            operationCategory={category}
            open={openEditCategory}
            handleClose={handleCloseEditCategory}
          />
        </>
      );
    case OperationType.EXPENSE:
      return (
        <>
          {clickableMenu}
          <EditExpenseCategoryDialog
            operationCategory={category}
            open={openEditCategory}
            handleClose={handleCloseEditCategory}
          />
        </>
      );
  }
}

export default MainTableEditableCategory;
