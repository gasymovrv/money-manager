import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import Login from './components/login/login';
import Home from './components/home/home';
import { getCurrentUser } from './services/api.service';
import { User } from './interfaces/user.interface';
import { AuthContext } from './interfaces/auth-context.interface';
import { IContext } from './interfaces/auth-context.interface';

type AppState = {
  user: User
  isLoading: boolean
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
  const [{user, isLoading}, setState] = useState<AppState>(
    {
      user: {
        id: '',
        name: '',
        picture: '',
        email: '',
      },
      isLoading: true
    });

  useEffect(() => {
    getCurrentUser()
      .then(
        (user) => {
          setState({user: user, isLoading: false});
        },
        (err) => {
          console.log(`Getting current user error: ${err}`)
        }
      )
  });

  if (isLoading) {
    return (<div>Loading...</div>);
  }
  const context: IContext = {user};

  return (
    <AuthContext.Provider value={context}>
      <Router>
        <Switch>
          <PrivateRoute path="/" exact isAuth={!!user.id} component={Home}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;