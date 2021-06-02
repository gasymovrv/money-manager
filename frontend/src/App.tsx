import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import LoginPage from './pages/login.page';
import HomePage from './pages/home.page';
import { getCurrentUser } from './services/api.service';
import { defaultUser, User } from './interfaces/user.interface';
import { AuthContext, IContext } from './interfaces/auth-context.interface';
import { CssBaseline, LinearProgress, ThemeProvider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { darkTheme, lightTheme } from './theme';
import moment from 'moment-timezone';
import WelcomePage from './pages/welcome.page';
import ProfilePage from './pages/profile.page';

moment.tz.setDefault('Etc/UTC')

type AppState = {
  user: User
}

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
  const [{user}, setUser] = useState<AppState>({user: defaultUser});
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (mounted) {
        try {
          const currentUser = await getCurrentUser();
          setUser({user: currentUser});
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
  }, []);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = prefersDarkMode ? darkTheme : lightTheme;

  if (isLoading) {
    return (<LinearProgress/>);
  }
  const context: IContext = {user};
  console.log('App rendering, user has been saved to context:', user)

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