import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Login from './components/login/login';
import Home from './components/home/home';
import { getCurrentUser } from './services/api.service';
import { User } from './interfaces/user.interface';
import { AuthContext, IContext } from './interfaces/auth-context.interface';
import { CssBaseline, LinearProgress, ThemeProvider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { darkTheme, lightTheme } from './theme';

type AppState = {
  user: User
}

interface PrivateRouterProps {
  component: any,
  isAuth: boolean
  path: string,
  exact: boolean
}

const PrivateRoute: React.FC<PrivateRouterProps> = (props) => {
  const {children, component: Component, isAuth} = props;

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
  const [{user}, setUser] = useState<AppState>(
    {
      user: {
        id: '',
        name: '',
        picture: '',
        email: '',
      }
    });
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then(
        (user) => {
          setUser({user});
          setLoading(false);
        },
        (err) => {
          console.log(`Getting current user error: ${err}`)
        }
      )
  }, []);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = prefersDarkMode ? darkTheme : lightTheme;

  console.log('App rendering, user:', user)
  if (isLoading) {
    return (<LinearProgress/>);
  }
  const context: IContext = {user};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthContext.Provider value={context}>
        <Router>
          <Switch>
            <PrivateRoute path="/" exact isAuth={!!user.id} component={Home}/>
            <Route path="/login" component={Login}/>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default App;