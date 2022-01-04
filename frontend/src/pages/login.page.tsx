import React, { useContext } from 'react';
import { Avatar, Grid, Link, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import PageContainer from '../components/page-container/page-container';
import googleLogo from '../img/google-logo.png';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../interfaces/auth-context.interface';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemText: {
      fontSize: 20,
    },
    avatar: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    }
  }),
);

const LoginPage: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const {isAuthenticated} = useContext(AuthContext);

  if (isAuthenticated) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: {from: location}
        }}
      />
    );
  }
  const apiHost = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';
  const authUri = `${apiHost}/oauth2/authorize/google?redirect_uri=${window.location.origin}/oauth2/redirect`;

  return (
    <PageContainer>
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: '90vh'}}
      >
        <Grid item>
          <Typography variant="h4">
            Log in with:
          </Typography>
        </Grid>
        <Grid item>
          <Link color="inherit"
                href={authUri}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  className={classes.avatar}
                  alt="Google"
                  src={googleLogo}
                />
              </ListItemAvatar>
              <ListItemText classes={{primary: classes.listItemText}} primary="Google"/>
            </ListItem>
          </Link>

        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default LoginPage;
