import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Container, Grid, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import { changeAccount, editAccount, findAllAccounts, getAllCurrencies } from '../services/api.service';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Header from '../components/header/header';
import PageContainer from '../components/page-container/page-container';
import { AuthContext } from '../interfaces/auth-context.interface';
import { Account, AccountTheme } from '../interfaces/user.interface';
import AddAccountDialog from '../components/dialog/add-account.dialog';
import DeleteAccountDialog from '../components/dialog/delete-account.dialog';
import { useDispatch } from 'react-redux';
import { resetPagination } from '../actions/pagination.actions';
import { resetShowingCategories } from '../actions/show-categories.actions';
import { COMMON_ERROR_MSG } from '../constants';
import { showError } from '../actions/error.actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.light,
      cursor: 'pointer'
    },
    container: {
      padding: theme.spacing(3)
    },
    inputField: {
      minWidth: 200
    },
    avatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    }
  }),
);

const ProfilePage: React.FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const {user, refreshUser} = useContext(AuthContext);
  const {currentAccount} = user;

  const [account, setAccount] = useState<Account>(currentAccount);
  const [accountName, setAccountName] = useState<string>(currentAccount.name);
  const [accountTheme, setAccountTheme] = useState<AccountTheme>(currentAccount.theme);
  const [accountCurrency, setAccountCurrency] = useState<string>(currentAccount.currency);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
  const [isLoadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [openAddAccount, setOpenAddAccount] = React.useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = React.useState(false);

  const loadAccountsData = () => {
    let mounted = true;
    (async () => {
      if (mounted) {
        try {
          const data = await getAllCurrencies();
          setCurrencies(data);
          setLoadingCurrencies(false);
        } catch (err) {
          console.log(`Getting currencies error: ${err}`);
          dispatch(showError(COMMON_ERROR_MSG));
        }
        try {
          const data = await findAllAccounts();
          setAccounts(data);
          setLoadingAccounts(false);
        } catch (err) {
          console.log(`Getting accounts error: ${err}`);
          dispatch(showError(COMMON_ERROR_MSG));
        }
      }
    })();
    return () => {
      mounted = false
    };
  }

  useEffect(loadAccountsData, [dispatch]);

  const handleChangeAccountName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value)
  }

  const handleChangeAccountTheme = (event: React.ChangeEvent<any>) => {
    setAccountTheme(event.target.value)
  }

  const handleChangeAccountCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountCurrency(event.target.value)
  }

  const handleChangeAccount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const accId: number = +event.target.value;
    accounts.forEach((acc) => {
      if (acc.id === accId) {
        setAccount(acc);
        setAccountName(acc.name);
        setAccountTheme(acc.theme);
        setAccountCurrency(acc.currency);
        return;
      }
    });
  }

  const handleSave = async () => {
    try {
      await editAccount(account.id, {
        name: accountName,
        currency: accountCurrency,
        theme: accountTheme
      });
      if (currentAccount.id !== account.id) {
        await changeAccount(account.id);
        dispatch(resetPagination());
        dispatch(resetShowingCategories())
      }
      await loadAccountsData();
      refreshUser();
    } catch (error) {
      console.log(error);
      dispatch(showError(COMMON_ERROR_MSG));
    }
  }

  const reset = () => {
    setAccount(currentAccount);
    setAccountName(currentAccount.name);
    setAccountTheme(currentAccount.theme);
    setAccountCurrency(currentAccount.currency);
  }

  return (
    <PageContainer>
      <Header/>
      <Container maxWidth="sm">
        <Paper className={classes.container}>
          <Grid container direction="column" alignItems="center" spacing={5}>

            <Grid item>
              <Grid container direction="row" alignItems="center" spacing={3}>
                <Grid item><Avatar className={classes.avatar} alt="Avatar" src={user.picture}/></Grid>
                <Grid item><Typography variant="h4">{user.name}</Typography></Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container direction="row" spacing={3}>
                <Grid item>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        className={classes.inputField}
                        error={!accountName}
                        required
                        autoFocus
                        color="secondary"
                        margin="normal"
                        label="Account name"
                        type="text"
                        value={accountName}
                        onChange={handleChangeAccountName}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        className={classes.inputField}
                        error={!accountTheme}
                        required
                        autoFocus
                        color="secondary"
                        margin="normal"
                        label="Account theme"
                        select
                        value={accountTheme}
                        onChange={handleChangeAccountTheme}
                      >
                        {Object.values(AccountTheme).map((value) =>
                          <MenuItem key={value} value={value}>{value}</MenuItem>
                        )}
                      </TextField>
                    </Grid>

                    {!isLoadingCurrencies &&
                    <Grid item>
                        <TextField
                            className={classes.inputField}
                            error={!accountCurrency}
                            required
                            autoFocus
                            color="secondary"
                            margin="normal"
                            label="Account currency"
                            select
                            value={accountCurrency}
                            onChange={handleChangeAccountCurrency}
                        >
                          {currencies.map((value) =>
                            <MenuItem key={value} value={value}>{value}</MenuItem>
                          )}
                        </TextField>
                    </Grid>
                    }

                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container direction="column" spacing={2}>

                    {!isLoadingAccounts &&
                    <Grid item>
                        <TextField
                            className={classes.inputField}
                            required
                            autoFocus
                            color="secondary"
                            margin="normal"
                            label="List of accounts"
                            select
                            value={account.id}
                            onChange={handleChangeAccount}
                        >
                          {accounts.map((value) =>
                            <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                          )}
                        </TextField>
                    </Grid>
                    }

                    <Grid item>
                      <Grid container direction="row">

                        <Grid item>
                          <Button
                            disabled={isLoadingCurrencies}
                            variant="outlined"
                            color="inherit"
                            onClick={() => setOpenAddAccount(true)}
                          >
                            Add new
                          </Button>
                          {!isLoadingCurrencies &&
                          <AddAccountDialog
                              open={openAddAccount}
                              handleClose={() => setOpenAddAccount(false)}
                              onAdd={loadAccountsData}
                              currencies={currencies}
                          />
                          }
                        </Grid>

                        <Grid item>
                          <Button
                            disabled={account.id === currentAccount.id}
                            variant="outlined"
                            color="inherit"
                            onClick={() => setOpenDeleteAccount(true)}
                          >
                            Delete
                          </Button>
                          <DeleteAccountDialog
                            open={openDeleteAccount}
                            handleClose={() => setOpenDeleteAccount(false)}
                            onDelete={async () => {
                              await loadAccountsData();
                              reset();
                            }}
                            account={account}
                          />
                        </Grid>

                      </Grid>
                    </Grid>

                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container direction="row" spacing={2}>

                <Grid item>
                  <Button
                    disabled={!accountName}
                    variant="outlined"
                    color="inherit"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={reset}
                  >
                    Cancel
                  </Button>
                </Grid>

              </Grid>
            </Grid>

          </Grid>
        </Paper>
      </Container>
    </PageContainer>
  );
}

export default ProfilePage;
