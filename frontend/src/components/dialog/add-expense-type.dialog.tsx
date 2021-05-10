import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { addExpenseType } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';

type AddExpenseTypeDialogProps = {
  open: boolean,
  handleClose(): void
  handleSave(): void
}

const AddExpenseTypeDialog: React.FC<AddExpenseTypeDialogProps> = ({
                                                                     open,
                                                                     handleSave,
                                                                     handleClose
                                                                   }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [name, setName] = useState<string>('New expense type');

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSaveExpenseType = async () => {
    setSuccess(false);
    setError(false);
    try {
      await addExpenseType({
        name: name
      });
      handleSave();
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Add expense type</DialogTitle>

        <DialogContent>
          <TextField
            color="secondary"
            margin="normal"
            id="expTypeName"
            label="Expense type name"
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
          <Button disabled={!name} onClick={handleSaveExpenseType} color="inherit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New expense type has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default AddExpenseTypeDialog;