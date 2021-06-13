import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { DeleteAccountProps, DialogProps } from '../../interfaces/common.interface';
import { deleteAccount } from '../../services/api.service';

const DeleteAccountDialog: React.FC<DialogProps & DeleteAccountProps> = ({
                                                                           open,
                                                                           handleClose,
                                                                           onDelete,
                                                                           account
                                                                         }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleYes = async () => {
    setSuccess(false);
    setError(false);
    try {
      await deleteAccount(account.id);
      setSuccess(true);
      await onDelete();
    } catch (err) {
      console.log(`Adding account error: ${err}`)
      setError(true);
    }
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Delete account</DialogTitle>

        <DialogContent>
          <DialogContentText>
            After deleting an account named '{account.name}', all its operations and categories will be deleted.
            Are you sure?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            No
          </Button>
          <Button onClick={handleYes} color="inherit">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="Account has been successfully deleted"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}

export default DeleteAccountDialog;
