import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Form } from 'reactstrap';
import APIURL from '../Helpers/environment';

export interface LoginProps extends RouteComponentProps{
    updateToken: Function
}
 
export interface LoginState {
    email: string,
    password: string
}
 
class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = { 
            email: '', 
            password: ''  
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
            console.log(data);
            this.props.updateToken(data.sessionToken, data.user.id);
            this.props.history.push('/main');
        })
    }

    render() { 
        return ( 
            <div className="auth-inner">
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

                    {/* Do I want to allow remembering password?
                    <div className="form-group">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="passwordcheck" />
                            <label className="custom-control-label" htmlFor="passwordcheck">Remember me</label>
                        </div>
                    </div> */}

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