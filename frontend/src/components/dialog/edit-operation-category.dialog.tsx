import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { EditOperationCategoryDialogProps, EditOperationCategoryProps } from '../../interfaces/common.interface';
import { WithEditIncomeCategoryActions } from '../../hocs/with-edit-income-category-actions';
import { WithEditExpenseCategoryActions } from '../../hocs/with-edit-expense-category-actions';

const EditOperationCategoryDialog:
  React.FC<EditOperationCategoryDialogProps & EditOperationCategoryProps> = ({
                                                                               operationCategory,
                                                                               open,
                                                                               onAction,
                                                                               handleClose,
                                                                               editOperationCategory,
                                                                               deleteOperationCategory
                                                                             }) => {
  const [successEdit, setSuccessEdit] = useState<boolean>(false);
  const [successDelete, setSuccessDelete] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const [hasOperationsError, setHasOperationsError] = useState<boolean>(false);

  const [name, setName] = useState<string>(operationCategory.name);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleDelete = async () => {
    setSuccessDelete(false);
    setErrorDelete(false);
    setHasOperationsError(false);
    try {
      await deleteOperationCategory(operationCategory.id);
      setSuccessDelete(true);
      await onAction();
    } catch (error) {
      console.log(error);
      const resp = error as Response;
      if (resp.status === 400) {
        setHasOperationsError(true)
      } else {
        setErrorDelete(true);
      }
    }
    handleClose();
  }

  const handleSave = async () => {
    setSuccessEdit(false);
    setErrorEdit(false);
    try {
      await editOperationCategory(operationCategory.id, {
        name: name
      });
      setSuccessEdit(true);
      await onAction();
    } catch (error) {
      console.log(error);
      setErrorEdit(true);
    }
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Add category</DialogTitle>

        <DialogContent>
          <TextField
            required
            error={!name}
            color="secondary"
            margin="normal"
            id="categoryName"
            label="Category name"
            type="text"
            fullWidth
            value={name}
            onChange={handleChangeName}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="inherit">
            Delete
          </Button>
          <Button disabled={!name} onClick={handleSave} color="inherit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {successEdit && <SuccessNotification text="Category has been successfully edited"/>}
      {successDelete && <SuccessNotification text="Category has been successfully deleted"/>}
      {(errorEdit || errorDelete) && <ErrorNotification text="Something went wrong"/>}
      {hasOperationsError &&
      <ErrorNotification text="You cannot delete this category while there are operations with this category."/>
      }
    </>
  );
}

export const EditIncomeCategoryDialog
  = WithEditIncomeCategoryActions<EditOperationCategoryDialogProps>(EditOperationCategoryDialog)
export const EditExpenseCategoryDialog
  = WithEditExpenseCategoryActions<EditOperationCategoryDialogProps>(EditOperationCategoryDialog)