import * as React from 'react';
import { Component } from 'react';
import { Container, Button } from 'reactstrap';

import Login from './Login';
import Signup from './Signup';

export interface AuthProps {

}
 
export interface AuthState {
    showLogin: boolean   
}
 
class Auth extends React.Component<AuthProps, AuthState> {
    constructor(props: AuthProps) {
        super(props);
        this.state = {
            showLogin: true
        };
    }

    render() { 
        return (
            <Container>
            </Container>
        );
    }
}
 
export default Auth;