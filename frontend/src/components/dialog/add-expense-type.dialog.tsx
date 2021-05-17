import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { addExpenseType } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { DialogProps } from '../../interfaces/common.interface';

const AddExpenseTypeDialog: React.FC<DialogProps> = ({
                                                       open,
                                                       onSave,
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
      onSave();
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
          <Button disabled={!name} onClick={handleSaveExpenseType} color="inherit">
            Save
          </Button>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New expense type has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default AddExpenseTypeDialog;