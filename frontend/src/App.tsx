import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { getCurrentUser } from './services/api.service';
import { User } from './interfaces/user.interface';
import Main from './components/main/main';
import Login from './components/login/login';

type AppState = {
  user: User
}

class App extends Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        id: '',
        name: '',
        picture: '',
        email: '',
      }
    }
  }

  async componentDidMount() {
    getCurrentUser()
      .then(
        (currentUser) => {
          this.setState({user: currentUser})
        },
        (err) => {
          console.log(`Getting current user error: ${err}`)
        }
      )
  }

  render() {
    console.log('From render: ', this.state.user)
    return (
      <Router>
        {/*<Route exact path="/" component={() =>*/}
        {/*  this.state.user.id !== ''*/}
        {/*    ? (<Main user={this.state.user}/>)*/}
        {/*    : (<Redirect exact to="/login"/>)*/}
        {/*}/>*/}
        <Route exact path="/" component={()=>
          <Main user={this.state.user}/>
        }/>
        <Route exact path="/login" component={Login}/>
      </Router>
    )
  }
}

export default App;