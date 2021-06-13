import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { AddAccountProps, DialogProps } from '../../interfaces/common.interface';
import { AccountTheme } from '../../interfaces/user.interface';
import { addAccount } from '../../services/api.service';
import { AuthContext } from '../../interfaces/auth-context.interface';

const AddAccountDialog: React.FC<DialogProps & AddAccountProps> = ({
                                                                     open,
                                                                     handleClose,
                                                                     onAdd,
                                                                     currencies
                                                                   }) => {
  const {user} = useContext(AuthContext);
  const {currentAccount} = user;

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

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
    setSuccess(false);
    setError(false);
    try {
      await addAccount({
        name: accountName,
        currency: accountCurrency,
        theme: accountTheme
      });
      setSuccess(true);
      await onAdd();
    } catch (err) {
      console.log(`Adding account error: ${err}`)
      setError(true);
    }
    handleClose();
  }

  return (
    <>
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
      {success && <SuccessNotification text="New account has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}

export default AddAccountDialog;
