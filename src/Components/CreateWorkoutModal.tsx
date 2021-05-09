import * as React from 'react';
import { Alert, Form, Label, Button, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import APIURL from '../Helpers/environment';
import { slotInfo, userInfo } from './Main';

export interface CreateWorkoutModalProps {
    token: string,
    createWorkoutToggle: Function,
    createWorkoutModal: boolean,
    selectedSlotInfo: slotInfo,
    updateSelectedSlot: Function,
    userSettings: userInfo,
    updateEvents: Function,
    viewAsUser: number
}
 
export interface CreateWorkoutModalState {
    timestamp: string,
    description: string,
    distance: number,
    units: string,
    movingtime: number,
    elapsedtime: number,
    elevationgain: number,
    startlocation: Array<number>,
    endlocation: Array<number>,
    temp: number,
    humidity: number,
    aqi: number,
    notes: string,
    alertVisible: boolean
}
 
class CreateWorkoutModal extends React.Component<CreateWorkoutModalProps, CreateWorkoutModalState> {
    constructor(props: CreateWorkoutModalProps) {
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
            notes: '',
            alertVisible: false
        };
    }

    createWorkout = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        var tmpDate = new Date(this.props.selectedSlotInfo.start);
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        console.log(this.props.viewAsUser);
        fetch(`${APIURL}/workout`, {
            method: 'POST',
            body: JSON.stringify({
                workout: {
                    timestamp: this.props.selectedSlotInfo.start,
                    description: this.state.description,
                    distance: this.state.distance,
                    units: this.state.units,
                    movingtime: this.state.elapsedtime, //manual workouts should have both set to the same
                    elapsedtime: this.state.elapsedtime,
                    elevationgain: this.state.elevationgain,
                    startlocation: this.state.startlocation,
                    endlocation: this.state.endlocation,
                    temp: this.state.temp,
                    humidity: this.state.humidity,
                    aqi: this.state.aqi,
                    notes: this.state.notes,
                    userId: this.props.viewAsUser
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workout) => {
            if (workout.hasOwnProperty("error")) {
                this.setState({ alertVisible: true })
            } else {
                // console.log(workout)
                this.props.updateEvents();
                this.exitModal();
            }
        })
    };

    componentDidUpdate(prevProps: CreateWorkoutModalProps, prevState: CreateWorkoutModalState) {
        if (prevProps.userSettings.defaultUnits !== this.props.userSettings.defaultUnits) {
            this.setState({ units: this.props.userSettings.defaultUnits });
        }

    }

    toggleAlert = () => {
        this.setState(prevState => ({
            alertVisible: !prevState.alertVisible
        }));
        this.exitModal();
    }

    exitModal = () => {
        this.setState({ units: this.props.userSettings.defaultUnits });
        this.props.createWorkoutToggle();
    }

    render() { 
        return (
            <div className="createworkoutmodal-div">
                <Modal isOpen={this.props.createWorkoutModal} toggle={() => this.exitModal()} className="createworkoutmodal">
                <ModalHeader toggle={() => this.exitModal()}>Create Workout Entry</ModalHeader>
                <ModalBody>
                    <div className="operationfailed">
                            <Alert color="danger" isOpen={this.state.alertVisible} toggle={this.toggleAlert}>
                                Unable to create workouts on behalf of runners.
                            </Alert>
                    </div>
                    <Form onSubmit={this.createWorkout}>
                        <div className="form-group">
                            <Label>Timestamp</Label>
                            <input type="datetime-local" className="form-control" value={this.props.selectedSlotInfo.start.toString().split(":")[0] + ":" + this.props.selectedSlotInfo.start.toString().toString().split(":")[1]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.updateSelectedSlot(e.currentTarget.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ description: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Distance</label>
                            <input type="number" step=".01" className="form-control" placeholder="distance" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ distance: parseFloat(e.currentTarget.value) })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="units">Units</label>
                            <select className="form-control" id="units" value={this.state.units} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "mi") ? this.setState({ units: "mi"}) : this.setState({ units: "km" })}>
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Time (minutes)</label>
                            <input type="number" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ elapsedtime: parseFloat(e.currentTarget.value) })} required />
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input type="text" className="form-control" placeholder="Notes" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ notes: e.currentTarget.value })} />
                        </div>
                        <ModalFooter>
                            <Button color="primary">Save Workout Entry</Button>
                            <Button color="secondary" onClick={() => this.exitModal()}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>

                </Modal>
            </div>
        );
    }
}
 
export default CreateWorkoutModal;