import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React from 'react';
import { DeleteAccountProps, DialogProps } from '../../interfaces/common.interface';
import { deleteAccount } from '../../services/api.service';
import { showSuccess } from '../../actions/success.actions';
import { useDispatch } from 'react-redux';
import { showError } from '../../actions/error.actions';
import { COMMON_ERROR_MSG } from '../../constants';

const DeleteAccountDialog: React.FC<DialogProps & DeleteAccountProps> = ({
                                                                           open,
                                                                           handleClose,
                                                                           onDelete,
                                                                           account
                                                                         }) => {
  const dispatch = useDispatch();

  const handleYes = async () => {
    try {
      await deleteAccount(account.id);
      dispatch(showSuccess('Account has been successfully deleted'));
      await onDelete();
    } catch (err) {
      console.log(`Deleting account error: ${err}`)
      dispatch((showError(COMMON_ERROR_MSG)))
    }
    handleClose();
  }

  return (
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
  );
}

export default DeleteAccountDialog;
