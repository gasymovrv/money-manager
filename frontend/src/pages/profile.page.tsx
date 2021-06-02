import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Grid, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import { changeAccount, editAccount, findAllAccounts, getAllCurrencies } from '../services/api.service';
import ErrorNotification from '../components/notification/error.notification';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Header from '../components/header/header';
import PageContainer from '../components/page-container/page-container';
import { AuthContext } from '../interfaces/auth-context.interface';
import { Account, AccountTheme } from '../interfaces/user.interface';

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
    }
  }),
);

const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const {user} = useContext(AuthContext);
  const {currentAccount} = user;

  const [error, setError] = useState<boolean>(false);
  const [account, setAccount] = useState<Account>(currentAccount);
  const [accountName, setAccountName] = useState<string>(currentAccount.name);
  const [accountTheme, setAccountTheme] = useState<AccountTheme>(currentAccount.theme);
  const [accountCurrency, setAccountCurrency] = useState<string>(currentAccount.currency);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
  const [isLoadingAccounts, setLoadingAccounts] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) {
        setError(false);
        try {
          const data = await getAllCurrencies();
          setCurrencies(data);
          setLoadingCurrencies(false);
        } catch (err) {
          console.log(`Getting currencies error: ${err}`)
          setError(true);
        }
        try {
          const data = await findAllAccounts();
          setAccounts(data);
          setLoadingAccounts(false);
        } catch (err) {
          console.log(`Getting accounts error: ${err}`)
          setError(true);
        }
      }
    })();
    return () => {
      mounted = false
    };
  }, []);

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
      //todo need to update user in context
      await editAccount(account.id, {
        name: accountName,
        currency: accountCurrency,
        theme: accountTheme
      });
      if (currentAccount.id !== account.id) {
        await changeAccount(account.id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = async () => {
    setAccount(currentAccount);
    setAccountName(currentAccount.name);
    setAccountTheme(currentAccount.theme);
    setAccountCurrency(currentAccount.currency);
  }

  return (
    <PageContainer>
      <Header isWelcome={true}/>
      <Container maxWidth="sm">
        <Paper className={classes.container}>
          <Grid container direction="column" alignItems="center" spacing={2}>

            <Grid item><Typography gutterBottom variant="h3">Profile</Typography></Grid>

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
                            variant="outlined"
                            color="inherit"
                          >
                            Add new
                          </Button>
                        </Grid>

                        <Grid item>
                          <Button
                            variant="outlined"
                            color="inherit"
                          >
                            Delete
                          </Button>
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
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Grid>

              </Grid>
            </Grid>

          </Grid>
        </Paper>
      </Container>
      {error && <ErrorNotification text="Something went wrong"/>}
    </PageContainer>
  );
}

export default ProfilePage;
