import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { AddAccountProps, DialogProps } from '../../interfaces/common.interface';
import { AccountTheme } from '../../interfaces/user.interface';
import { addAccount } from '../../services/api.service';
import { AuthContext } from '../../interfaces/auth-context.interface';
import { useDispatch } from 'react-redux';
import { showSuccess } from '../../actions/success.actions';
import { showError } from '../../actions/error.actions';
import { COMMON_ERROR_MSG } from '../../constants';

const AddAccountDialog: React.FC<DialogProps & AddAccountProps> = ({
                                                                     open,
                                                                     handleClose,
                                                                     onAdd,
                                                                     currencies
                                                                   }) => {
  const dispatch = useDispatch();
  const {user} = useContext(AuthContext);
  const {currentAccount} = user;

  const [accountName, setAccountName] = useState<string>('New account');
  const [accountTheme, setAccountTheme] = useState<AccountTheme>(AccountTheme.LIGHT);
  const [accountCurrency, setAccountCurrency] = useState<string>(currentAccount.currency);

  const handleChangeAccountName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value)
  }

  const handleChangeAccountTheme = (event: React.ChangeEvent<any>) => {
    setAccountTheme(event.target.value)
  }

  const handleChangeAccountCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountCurrency(event.target.value)
  }

  const handleSave = async () => {
    try {
      await addAccount({
        name: accountName,
        currency: accountCurrency,
        theme: accountTheme
      });
      await onAdd();
      handleClose();
      dispatch(showSuccess('New account has been successfully added'));
    } catch (err) {
      handleClose();
      console.log(`Adding account error: ${err}`);
      dispatch(showError(COMMON_ERROR_MSG));
    }
  }

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>

      <DialogTitle>Add account</DialogTitle>

      <DialogContent>
        <TextField
          error={!accountName}
          required
          autoFocus
          color="secondary"
          margin="normal"
          label="Account name"
          type="text"
          fullWidth
          value={accountName}
          onChange={handleChangeAccountName}
        />

        <TextField
          error={!accountTheme}
          required
          autoFocus
          color="secondary"
          margin="normal"
          label="Account theme"
          select
          fullWidth
          value={accountTheme}
          onChange={handleChangeAccountTheme}
        >
          {Object.values(AccountTheme).map((value) =>
            <MenuItem key={value} value={value}>{value}</MenuItem>
          )}
        </TextField>

        <TextField
          error={!accountCurrency}
          required
          autoFocus
          color="secondary"
          margin="normal"
          label="Account currency"
          select
          fullWidth
          value={accountCurrency}
          onChange={handleChangeAccountCurrency}
        >
          {currencies.map((value) =>
            <MenuItem key={value} value={value}>{value}</MenuItem>
          )}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          disabled={!accountName || !accountTheme || !accountCurrency}
          onClick={handleSave}
          color="inherit"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddAccountDialog;
