import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import LoginPage from './pages/login.page';
import HomePage from './pages/home.page';
import { getCurrentUser } from './services/api.service';
import { AccountTheme, defaultUser, User } from './interfaces/user.interface';
import { AuthContext, IContext } from './interfaces/auth-context.interface';
import { CssBaseline, LinearProgress, ThemeProvider } from '@material-ui/core';
import { darkTheme, lightTheme } from './theme';
import moment from 'moment-timezone';
import WelcomePage from './pages/welcome.page';
import ProfilePage from './pages/profile.page';
import { Theme } from '@material-ui/core/styles';

moment.tz.setDefault('Etc/UTC')

interface PrivateRouterProps {
  isAuth: boolean,
  component: React.ComponentType<any>
}

const PrivateRoute: React.FC<PrivateRouterProps & RouteProps> = (props) => {
  const {isAuth, component: Component, children} = props;

  return (
    <Route
      {...children}
      render={(props) =>
        isAuth
          ? <Component {...props} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}
    />
  )
}

const App: React.FC = () => {
  const [user, setUser] = useState<User>(defaultUser);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [isLoading, setLoading] = useState<boolean>(true);

  const loadUser = () => {
    let mounted = true;

    (async () => {
      if (mounted) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          const accountTheme = currentUser.currentAccount.theme;
          if (accountTheme === AccountTheme.LIGHT) {
            setTheme(lightTheme);
          } else if (accountTheme === AccountTheme.DARK) {
            setTheme(darkTheme);
          }
          setLoading(false);
        } catch (err) {
          console.log(`Getting current user error: ${err.text}`)
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false
    };
  }

  useEffect(loadUser, []);

  if (isLoading) {
    return (<LinearProgress/>);
  }
  const context: IContext = {user, updateUser: loadUser};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthContext.Provider value={context}>
        <Router>
          <Switch>
            <PrivateRoute path="/" exact isAuth={!!user.id} component={
              (props: any) => {
                if (user.currentAccount.isDraft) {
                  return <Redirect to="/welcome"/>;
                } else {
                  return <HomePage {...props}/>;
                }
              }}/>
            <PrivateRoute path="/welcome" exact isAuth={!!user.id} component={
              (props: any) => {
                if (user.currentAccount.isDraft) {
                  return <WelcomePage {...props}/>;
                } else {
                  return <Redirect to="/"/>;
                }
              }}/>
            <PrivateRoute path="/profile" exact isAuth={!!user.id} component={ProfilePage}/>
            <Route path="/login" component={LoginPage}/>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default App;