import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Form, Alert } from 'reactstrap';
import APIURL from '../Helpers/environment';

export interface LoginProps extends RouteComponentProps{
    updateToken: Function,
}
 
export interface LoginState {
    email: string,
    password: string,
    alertVisible: boolean
}
 
class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = { 
            email: '', 
            password: '',
            alertVisible: false
        };
    }

    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`${APIURL}/user/login`, {
            method: 'POST',
            body: JSON.stringify({user: {email: this.state.email, password: this.state.password}}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.hasOwnProperty("error")) {
                this.setState({ alertVisible: true })
            } else {
                this.props.updateToken(data.sessionToken, data.user.id);
                this.props.history.push('/main');
            }
        })  
    }

    toggleAlert = () => {
        this.setState(prevState => ({
            alertVisible: !prevState.alertVisible
        }));
    }

    render() { 
        return ( 
            <div className="auth-inner">
                <div className="failedLogin">
                    <Alert color="danger" isOpen={this.state.alertVisible} toggle={this.toggleAlert}>
                        Login Failed - Try Again.
                    </Alert>
                </div>
                <Form onSubmit={this.handleSubmit}>
                    <h3>RunJournal Sign In</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: e.currentTarget.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: e.currentTarget.value })} required />
                    </div>

                    <br/>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    <p className="signup-login text-right">
                        Not registered? <a href="/signup">Sign up.</a>
                    </p>
                </Form>

            </div>
        );
    }
}
 
export default withRouter(Login);