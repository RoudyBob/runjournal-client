import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Header from "./Components/Header";
import Home from "./Components/Home";
import Main from "./Components/Main";
import Auth from "./Auth/Auth";
import Logout from "./Auth/Logout";

export interface AppProps {
    
}
 
export interface AppState {
    sessionToken: string | null,
    newToken: string,
    showLogin: boolean
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
      super(props);
      this.state = {
        sessionToken: '',
        newToken: '',
        showLogin: true
      };
  }

  homeView = () => {
    return (this.state.sessionToken ? <Main token={this.state.sessionToken} /> : <Home token={this.state.sessionToken}/>);
  };

  mainView = () => {
    return (this.state.sessionToken ? <Main token={this.state.sessionToken} /> : <Redirect to="/" />);
  };

  updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    this.setState({ sessionToken: newToken});
  }

  clearToken = () => {
    localStorage.clear();
    this.setState({ sessionToken: '' });
  }

  componentDidMount () {
    if (localStorage.getItem('token')) {
      this.setState({ sessionToken: localStorage.getItem('token') });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <div className="app">
            <Header token={this.state.sessionToken}/>
            <Switch>
              <Route exact path="/" component={this.homeView} />
              <Route path="/main" component={this.mainView} />
              <Route path="/login"><Auth updateToken={this.updateToken} showLogin={true} /></Route>
              <Route path="/signup"><Auth updateToken={this.updateToken} showLogin={false} /></Route>
              <Route path="/logout"><Logout clearToken={this.clearToken} /></Route>
            </Switch>
  
  
            {/* <div className="auth-wrapper">
              <div className="auth-inner">
                <Switch>
                  <Route exact path='/' component={Login} />
                  <Route path="/sign-in" component={Login} />
                  <Route path="/sign-up" component={Signup} />
                </Switch>
              </div>
            </div> */}
  
          </div>
        </Router>
  
      </React.Fragment>
    );
  }
}

export default App;
