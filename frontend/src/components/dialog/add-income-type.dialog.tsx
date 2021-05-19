import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { addIncomeType } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { DialogProps } from '../../interfaces/common.interface';

const AddIncomeTypeDialog: React.FC<DialogProps> = ({
                                                      open,
                                                      onAction,
                                                      handleClose
                                                    }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [name, setName] = useState<string>('New income type');

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSaveIncomeType = async () => {
    setSuccess(false);
    setError(false);
    try {
      await addIncomeType({
        name: name
      });
      onAction();
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

        <DialogTitle>Add income type</DialogTitle>

        <DialogContent>
          <TextField
            color="secondary"
            margin="normal"
            id="incTypeName"
            label="Income type name"
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
          <Button disabled={!name} onClick={handleSaveIncomeType} color="inherit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New income type has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default AddIncomeTypeDialog;