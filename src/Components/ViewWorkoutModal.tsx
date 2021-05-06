import * as React from 'react';
import { stringOrDate } from 'react-big-calendar';
import { Form, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import APIURL from '../Helpers/environment';
import { userInfo, workoutEntry } from './Main';

export interface ViewWorkoutModalProps {
    token: string,
    viewWorkoutToggle: Function,
    viewWorkoutModal: boolean,
    selectedWorkout: workoutEntry,
    updateSelectedWorkout: Function,
    userSettings: userInfo,
    updateEvents: Function
}
 
export interface ViewWorkoutModalState {
    timestamp: stringOrDate,
    description: string,
    distance: number,
    units: string,
    movingtime: number,
    elapsedtime: number,
    elevationgain: number,
    startlocation: Array<Number>,
    endlocation: Array<Number>,
    temp: number,
    humidity: number,
    aqi: number,
    notes: string
}
 
class ViewWorkoutModal extends React.Component<ViewWorkoutModalProps, ViewWorkoutModalState> {
    constructor(props: ViewWorkoutModalProps) {
        super(props);
        this.state = {
            timestamp: '',
            description: '',
            distance: 0,
            units: '',
            movingtime: 0,
            elapsedtime: 0,
            elevationgain: 0,
            startlocation: [],
            endlocation: [],
            temp: 0,
            humidity: 0,
            aqi: 0,
            notes: ''
        };
    }

    updateWorkout = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`${APIURL}/workout/update/${this.props.selectedWorkout.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                workout: {
                    timestamp: this.props.selectedWorkout.timestamp,
                    description: this.props.selectedWorkout.description,
                    elapsedtime: this.props.selectedWorkout.elapsedtime,
                    distance: this.props.selectedWorkout.distance,
                    units: this.props.selectedWorkout.units,
                    notes: this.props.selectedWorkout.notes
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data)
            this.props.updateEvents();
            this.props.viewWorkoutToggle()
        })
    }

    deleteWorkout = () => {
        fetch(`${APIURL}/workout/${this.props.selectedWorkout.id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data)
            this.props.updateEvents();
            this.props.viewWorkoutToggle()
        })
    }

    updateTimestamp = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedWorkout = {
            id: this.props.selectedWorkout.id,
            timestamp: e.currentTarget.value,
            description: this.props.selectedWorkout.description,
            distance: this.props.selectedWorkout.distance,
            units: this.props.selectedWorkout.units,
            elapsedtime: this.props.selectedWorkout.elapsedtime,
            notes: this.props.selectedWorkout.notes
        }
        this.props.updateSelectedWorkout(updatedWorkout);
    }

    updateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedWorkout = {
            id: this.props.selectedWorkout.id,
            timestamp: this.props.selectedWorkout.timestamp,
            description: e.currentTarget.value,
            distance: this.props.selectedWorkout.distance,
            units: this.props.selectedWorkout.units,
            elapsedtime: this.props.selectedWorkout.elapsedtime,
            notes: this.props.selectedWorkout.notes
        }
        this.props.updateSelectedWorkout(updatedWorkout);
    }

    updateDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedWorkout = {
            id: this.props.selectedWorkout.id,
            timestamp: this.props.selectedWorkout.timestamp,
            description: this.props.selectedWorkout.description,
            distance: parseFloat(e.currentTarget.value),
            units: this.props.selectedWorkout.units,
            elapsedtime: this.props.selectedWorkout.elapsedtime,
            notes: this.props.selectedWorkout.notes
        }
        this.props.updateSelectedWorkout(updatedWorkout);
    }

    updateUnits = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let units: string;
        (e.currentTarget.value === "mi") ? units="mi" : units="km";
        let updatedWorkout = {
            id: this.props.selectedWorkout.id,
            timestamp: this.props.selectedWorkout.timestamp,
            description: this.props.selectedWorkout.description,
            distance: this.props.selectedWorkout.distance,
            units: units,
            elapsedtime: this.props.selectedWorkout.elapsedtime,
            notes: this.props.selectedWorkout.notes
        }
        this.props.updateSelectedWorkout(updatedWorkout);
    }

    updateElapsedTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedWorkout = {
            id: this.props.selectedWorkout.id,
            timestamp: this.props.selectedWorkout.timestamp,
            description: this.props.selectedWorkout.description,
            distance: this.props.selectedWorkout.distance,
            units: this.props.selectedWorkout.units,
            elapsedtime: e.currentTarget.value,
            notes: this.props.selectedWorkout.notes
        }
        this.props.updateSelectedWorkout(updatedWorkout);
    }
    
    updateNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedWorkout = {
            id: this.props.selectedWorkout.id,
            timestamp: this.props.selectedWorkout.timestamp,
            description: this.props.selectedWorkout.description,
            distance: this.props.selectedWorkout.distance,
            units: this.props.selectedWorkout.units,
            elapsedtime: this.props.selectedWorkout.elapsedtime,
            notes: e.currentTarget.value
        }
        this.props.updateSelectedWorkout(updatedWorkout);
    }

    componentDidUpdate(prevProps: ViewWorkoutModalProps, prevState: ViewWorkoutModalState) {
        if (prevProps.userSettings.defaultUnits !== this.props.userSettings.defaultUnits) {
            this.setState({ units: this.props.userSettings.defaultUnits });
        }

    }

    exitModal = () => {
        this.setState({ units: this.props.userSettings.defaultUnits });
        this.props.viewWorkoutToggle();
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.viewWorkoutModal} toggle={() => this.exitModal()} className="viewworkoutmodal">
                <ModalHeader toggle={() => this.exitModal()}>View or Modify a Workout Entry</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.updateWorkout}>
                        <div className="form-group">
                            <Label>Timestamp</Label>
                            <input type="datetime-local" className="form-control" value={(this.props.selectedWorkout.timestamp).toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateTimestamp(e)} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" value={this.props.selectedWorkout.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateDescription(e)} required />
                        </div>

                        <div className="form-group">
                            <label>Distance</label>
                            <input type="number" step=".01" className="form-control" value={this.props.selectedWorkout.distance.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateDistance(e)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="units">Units</label>
                            <select className="form-control" id="units" value={this.props.selectedWorkout.units} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.updateUnits(e)}>
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Time (minutes)</label>
                            <input type="number" className="form-control" value={this.props.selectedWorkout.elapsedtime.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateElapsedTime(e)} required />
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input type="text" className="form-control" value={this.props.selectedWorkout.notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateNotes(e)} />
                        </div>

                        <div className="input-button-row">
                        <Button color="primary">Save Changes</Button>
                            <Button color="danger" onClick={() => this.deleteWorkout()}>Delete Entry</Button>
                            <Button color="secondary" onClick={() => this.exitModal()}>Cancel</Button>
                        </div>
                    </Form>
                </ModalBody>
                </Modal>
            </div>
        );
    }
}
 
export default ViewWorkoutModal;