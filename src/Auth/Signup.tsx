import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Form, Label } from 'reactstrap';
import APIURL from '../Helpers/environment';

export interface SignupProps extends RouteComponentProps{
    updateToken: Function
}
 
export interface SignupState {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthdate: string,
    startOfWeek: string,
    defaultUnit: string,
    coach: boolean
}
 
class Signup extends React.Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthdate: '',
            startOfWeek: 'monday',
            defaultUnit: 'standard',
            coach: false
        };
    }

    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(this.state.startOfWeek);
        console.log(this.state.defaultUnit);
        fetch(`${APIURL}/user/signup`, {
            method: 'POST',
            body: JSON.stringify({
                user: {
                    firstname: this.state.firstName,
                    lastname: this.state.lastName,
                    email: this.state.email, 
                    password: this.state.password,
                    birthdate: this.state.birthdate,
                    weekstart: this.state.startOfWeek,
                    defaultunits: this.state.defaultUnit,
                    coach: this.state.coach
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            this.props.updateToken(data.sessionToken);
            this.props.history.push('/main');
        })
    }

    render() { 

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <Form onSubmit={this.handleSubmit}>
                        <h3>RunJournal Signup</h3>

                        <div className="form-group">
                            <Label>First name</Label>
                            <input type="text" className="form-control" placeholder="First name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ firstName: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Last name</label>
                            <input type="text" className="form-control" placeholder="Last name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ lastName: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Enter password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Birthdate</label>
                            <input type="date" className="form-control" placeholder="01/01/1900" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ birthdate: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="weekstart">Start of Week:</label>
                            <select className="form-control" id="weekstart" value={this.state.startOfWeek} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "monday") ? this.setState({ startOfWeek: "monday"}) : this.setState({ startOfWeek: "sunday" })} >
                                <option value="monday">Monday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="defaultunit">Default Unit:</label>
                            <select className="form-control" id="defaultunit" value={this.state.defaultUnit} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "standard") ? this.setState({ defaultUnit: "standard"}) : this.setState({ defaultUnit: "metric" })}>
                                <option value="standard">Standard</option>
                                <option value="metric">Metric</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="coachcheck" onChange={(e: React.ChangeEvent<HTMLInputElement>) => (e.currentTarget.checked === true) ? this.setState({ coach: true }) : this.setState({ coach: false })}/>
                                <label className="custom-control-label" htmlFor="coachcheck">Register as coach?</label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                        <p className="signup-login text-right">
                            Already registered? <a href="/login">Sign in.</a>
                        </p>
                    </Form>
                </div>
            </div>
        );
    }
}
 
export default withRouter(Signup);