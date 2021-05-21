import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { AddOperationCategoryProps, DialogProps } from '../../interfaces/common.interface';
import { WithAddIncomeCategoryActions } from '../../hocs/with-add-income-category-actions';
import { WithAddExpenseCategoryActions } from '../../hocs/with-add-expense-category-actions';

const AddOperationCategoryDialog: React.FC<DialogProps & AddOperationCategoryProps> = ({
                                                                                         open,
                                                                                         onAction,
                                                                                         handleClose,
                                                                                         addOperationCategory
                                                                                       }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [alreadyExistsError, setAlreadyExistsError] = useState<boolean>(false);

  const [name, setName] = useState<string>('New category');

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSave = async () => {
    setSuccess(false);
    setError(false);
    setAlreadyExistsError(false);
    try {
      await addOperationCategory({
        name: name
      });
      setSuccess(true);
      onAction();
    } catch (error) {
      console.log(error);
      const resp = error as Response;
      if (resp.status === 400) {
        setAlreadyExistsError(true)
      } else {
        setError(true);
      }
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
          <Button disabled={!name} onClick={handleSave} color="inherit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New category has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
      {alreadyExistsError && <ErrorNotification text="You cannot create category with such name"/>}
    </>
  );
}

export const AddIncomeCategoryDialog = WithAddIncomeCategoryActions<DialogProps>(AddOperationCategoryDialog)
export const AddExpenseCategoryDialog = WithAddExpenseCategoryActions<DialogProps>(AddOperationCategoryDialog)