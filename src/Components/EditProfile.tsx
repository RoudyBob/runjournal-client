import * as React from 'react';
import { Button, FormGroup, Form, Col, Label, Input, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import APIURL from '../Helpers/environment';
import { userInfo } from './Main';

export interface EditProfileProps {
    token: string,
    userid: string,
    userSettings: userInfo,
    updateUserSettings: Function,
    editProfileModal: boolean,
    editProfileToggle: Function
}
 
export interface coachInfo {
    userId: number,
    firstname: string,
    lastname: string,
    runners: Array<number>,
    checked?: boolean | undefined,
}

export interface EditProfileState {
    coaches: Array<coachInfo>
    counter: number,
    originalCoachSetting : boolean
}
 
class EditProfile extends React.Component<EditProfileProps, EditProfileState> {
    constructor(props: EditProfileProps) {
        super(props);
        this.state = {
            coaches: [],
            counter: 0,
            originalCoachSetting: false
        };
    }

    exitModal = () => {
        this.props.editProfileToggle();
    }

    fetchCoaches = () => {
        fetch(`${APIURL}/team`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((teams) => {
            teams.forEach((coach: coachInfo) => {
                if (coach.runners.includes(parseInt(this.props.userid))) {
                    this.setState({
                        coaches: [...this.state.coaches, {
                            userId: coach.userId,
                            firstname: coach.firstname,
                            lastname: coach.lastname,
                            runners: coach.runners,
                            checked: true
                        }] 
                    });
                } else {
                    this.setState({
                        coaches: [...this.state.coaches, {
                            userId: coach.userId,
                            firstname: coach.firstname,
                            lastname: coach.lastname,
                            runners: coach.runners,
                            checked: false
                        }] 
                    });
                }
            });
        })
    }

    updateSettings = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(this.props.userSettings);
        fetch(`${APIURL}/user/${this.props.userid}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((user) => {
            if (user.coach === this.props.userSettings.coach) {
                // Coach Setting Didn't Change - No Need to Worry About Teams
                fetch(`${APIURL}/user/${this.props.userid}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        user: {
                            firstname: this.props.userSettings.firstname,
                            lastname: this.props.userSettings.lastname,
                            email: this.props.userSettings.email,
                            weekstart: this.props.userSettings.weekStart,
                            defaultunits: this.props.userSettings.defaultUnits,
                            coach: this.props.userSettings.coach,
                        }
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': this.props.token
                    })
                })
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                    this.props.editProfileToggle();
                })
            } else {
                // Coach Settings Changed - Need to Handle Teams
                if (user.coach === false) {
                    // This person became a coach - need to create a team
                    fetch(`${APIURL}/team`, {
                        method: 'POST',
                        body: JSON.stringify({
                            team: {
                                firstname: this.props.userSettings.firstname,
                                lastname: this.props.userSettings.lastname,
                                runners: [],
                            }
                        }),
                        headers: new Headers({
                            'Content-Type': 'application/json',
                            'Authorization': this.props.token
                        })
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // console.log(data);
                    })
                } else {
                    // This person is no longer a coach - need to delete team
                    fetch(`${APIURL}/team`, {
                        method: 'DELETE',
                        headers: new Headers({
                            'Content-Type': 'application/json',
                            'Authorization': this.props.token
                        })
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // console.log(data);
                    })
                };
                fetch(`${APIURL}/user/${this.props.userid}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        user: {
                            firstname: this.props.userSettings.firstname,
                            lastname: this.props.userSettings.lastname,
                            email: this.props.userSettings.email,
                            weekstart: this.props.userSettings.weekStart,
                            defaultunits: this.props.userSettings.defaultUnits,
                            coach: this.props.userSettings.coach
                        }
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': this.props.token
                    })
                })
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                    this.props.editProfileToggle();
                })
            };
        });
        this.state.coaches.forEach((coach) => {
            if (coach.checked && !coach.runners.includes(parseInt(this.props.userid))) {
                fetch(`${APIURL}/team/join/${coach.userId}`, {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': this.props.token
                    })
                })
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                })
            } else if (!coach.checked) {
                fetch(`${APIURL}/team/leave/${coach.userId}`, {
                    method: 'PUT',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': this.props.token
                    })
                })
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                })
            }
        })
    }

    updateFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedSettings = {
            id: this.props.userSettings.userid,
            firstname: e.currentTarget.value,
            lastname: this.props.userSettings.lastname,
            email: this.props.userSettings.email,
            defaultUnits: this.props.userSettings.defaultUnits,
            weekStart: this.props.userSettings.weekStart,
            coach: this.props.userSettings.coach,
        }
        this.props.updateUserSettings(updatedSettings);
    }

    updateLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedSettings = {
            id: this.props.userSettings.userid,
            firstname: this.props.userSettings.firstname,
            lastname: e.currentTarget.value,
            email: this.props.userSettings.email,
            defaultUnits: this.props.userSettings.defaultUnits,
            weekStart: this.props.userSettings.weekStart,
            coach: this.props.userSettings.coach,
        }
        this.props.updateUserSettings(updatedSettings);
    }

    updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedSettings = {
            id: this.props.userSettings.userid,
            firstname: this.props.userSettings.firstname,
            lastname: this.props.userSettings.lastname,
            email: e.currentTarget.value,
            defaultUnits: this.props.userSettings.defaultUnits,
            weekStart: this.props.userSettings.weekStart,
            coach: this.props.userSettings.coach,
        }
        this.props.updateUserSettings(updatedSettings);
    }


    updateDefaultUnits = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let units: string;
        (e.currentTarget.value === "mi") ? units="mi" : units="km";
        let updatedSettings = {
            id: this.props.userSettings.userid,
            firstname: this.props.userSettings.firstname,
            lastname: this.props.userSettings.lastname,
            email: this.props.userSettings.email,
            defaultUnits: units,
            weekStart: this.props.userSettings.weekStart,
            coach: this.props.userSettings.coach,
        }
        this.props.updateUserSettings(updatedSettings);
    }

    updateWeekStart = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let start: string;
        (e.currentTarget.value === "monday") ? start="monday" : start="sunday";
        let updatedSettings = {
            id: this.props.userSettings.userid,
            firstname: this.props.userSettings.firstname,
            lastname: this.props.userSettings.lastname,
            email: this.props.userSettings.email,
            defaultUnits: this.props.userSettings.defaultUnits,
            weekStart: start,
            coach: this.props.userSettings.coach,
        }
        this.props.updateUserSettings(updatedSettings);
    }

    updateCoach = (e: React.ChangeEvent<HTMLInputElement>) => {
        let coach: boolean;
        (e.currentTarget.checked === true) ? coach = true : coach = false;
        let updatedSettings = {
            id: this.props.userSettings.userid,
            firstname: this.props.userSettings.firstname,
            lastname: this.props.userSettings.lastname,
            email: this.props.userSettings.email,
            defaultUnits: this.props.userSettings.defaultUnits,
            weekStart: this.props.userSettings.weekStart,
            coach: coach
        }
        this.props.updateUserSettings(updatedSettings);
    }

    componentDidMount() {
        this.fetchCoaches();
        // console.log(this.props.userSettings);
    }

    componentDidUpdate(prevProps: EditProfileProps, prevState: EditProfileState) {

    }

    handleChecks = (e: React.ChangeEvent<HTMLInputElement>) => {
        var tmpCoaches: Array<coachInfo> = [];
        this.state.coaches.forEach((coach) => {
            if (coach.userId === parseInt(e.currentTarget.id)) {
                let coachClicked: boolean = e.currentTarget.checked
                tmpCoaches.push({
                    firstname: coach.firstname,
                    lastname: coach.lastname,
                    userId: coach.userId,
                    runners: coach.runners,
                    checked: coachClicked
                })
            } else {
                tmpCoaches.push({
                    firstname: coach.firstname,
                    lastname: coach.lastname,
                    userId: coach.userId,
                    runners: coach.runners,
                    checked: coach.checked
                })
            }
        })
        this.setState({ coaches: tmpCoaches })
    }

    displayCoaches = (coach: coachInfo, index: number) => {
        return (
            <FormGroup check>
            <Label check>
                <Input type="checkbox" checked={coach.checked} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChecks(e)} id={coach.userId.toString()} />{' ' + coach.firstname + " " + coach.lastname}
            </Label>
            </FormGroup>
        );
    }

    render() { 
        return (
            <div className="editprofile-div">
                <Modal isOpen={this.props.editProfileModal} toggle={() => this.exitModal()} className="editprofilemodal">
                    <ModalHeader toggle={() => this.exitModal()}>Edit Profile</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.updateSettings}>
                            <div className="form-group">
                                <Label>First name</Label>
                                <input type="text" className="form-control" value={this.props.userSettings.firstname} placeholder="First name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateFirstname(e)}/>
                            </div>

                            <div className="form-group">
                                <label>Last name</label>
                                <input type="text" className="form-control" value={this.props.userSettings.lastname} placeholder="Last name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateLastname(e)} />
                            </div>

                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" className="form-control" value={this.props.userSettings.email} placeholder="Enter email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateEmail(e)} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="weekstart">Start of week</label>
                                <select className="form-control" id="weekstart" value={this.props.userSettings.weekStart} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.updateWeekStart(e)} >
                                    <option value="monday">Monday</option>
                                    <option value="sunday">Sunday</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="defaultunit">Default unit</label>
                                <select className="form-control" id="defaultunit" value={this.props.userSettings.defaultUnits} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.updateDefaultUnits(e)}>
                                    <option value="mi">mi</option>
                                    <option value="km">km</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="coachcheck" checked={(this.props.userSettings.coach) ? true : false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateCoach(e)} />
                                    <label className="custom-control-label" htmlFor="coachcheck">Register as coach?</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="defaultunit">Approved Coaches</Label>
                                <FormGroup className="coacheslist">
                                    <Col sm={{ size: 20 }}>
                                    {(this.state.coaches) ? this.state.coaches.map((coach, index) => this.displayCoaches(coach, index)) : <div></div> }
                                    </Col>
                                </FormGroup>
                            </div>
                            <ModalFooter>
                                <Button color="primary" type="submit">Save Profile Changes</Button>
                                <Button color="secondary" onClick={() => this.exitModal()}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>

                </Modal>

            </div>
        );
    }
}
 
export default EditProfile;