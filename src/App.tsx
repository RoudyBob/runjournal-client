import React, {useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Auth from "./Auth/Auth";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Header from "./Components/Header";
import Main from "./Components/Main";

function App() {

  const [sessionToken, setSessionToken] = useState('');

  const updateToken = (newToken: any) => {
    localStorage.setItem('token', newToken);
    setSessionToken(newToken);
    console.log(newToken);
  }

  const clearToken = () => {
    localStorage.clear();
    setSessionToken('');
  }

  return (
    <Router>
      <div className="App">
        <Header />
  
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path='/' component={Login} />
              <Route path="/sign-in" component={Login} />
              <Route path="/sign-up" component={Signup} />
            </Switch>
          </div>
        </div>

      </div>
    </Router>
  );
}

export default App;
