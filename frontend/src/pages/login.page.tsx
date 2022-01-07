import React, { useContext } from 'react';
import { Avatar, Grid, Link, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import PageContainer from '../components/page-container/page-container';
import googleLogo from '../img/google-logo.png';
import vkLogo from '../img/vk-logo.png';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../interfaces/auth-context.interface';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemText: {
      fontSize: 20,
    },
    googleAvatar: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    vkAvatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
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
  const googleAuthUri = `${apiHost}/oauth2/authorize/google?redirect_uri=${window.location.origin}/oauth2/redirect`;
  const vkAuthUri = `${apiHost}/oauth2/authorize/vk?redirect_uri=${window.location.origin}/oauth2/redirect`;

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
                href={googleAuthUri}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  className={classes.googleAvatar}
                  alt="Google"
                  src={googleLogo}
                />
              </ListItemAvatar>
              <ListItemText classes={{primary: classes.listItemText}} primary="Google"/>
            </ListItem>
          </Link>

          <Link color="inherit"
                href={vkAuthUri}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  className={classes.vkAvatar}
                  alt="VKontakte"
                  src={vkLogo}
                />
              </ListItemAvatar>
              <ListItemText classes={{primary: classes.listItemText}} primary="VKontakte"/>
            </ListItem>
          </Link>

        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default LoginPage;
