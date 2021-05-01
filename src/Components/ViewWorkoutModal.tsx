import * as React from 'react';
import { Form, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

export interface ViewWorkoutModalProps {
    token: string,
    viewWorkoutToggle: Function,
    viewWorkoutModal: boolean,
    selectedWorkout: {
        id: number,
        timestamp: string,
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
}
 
export interface ViewWorkoutModalState {

}
 
class ViewWorkoutModal extends React.Component<ViewWorkoutModalProps, ViewWorkoutModalState> {
    constructor(props: ViewWorkoutModalProps) {
        super(props);
        this.state = {};
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.viewWorkoutModal} toggle={() => this.props.viewWorkoutToggle()} className="viewworkoutmodal">
                <ModalHeader toggle={() => this.props.viewWorkoutToggle()}>View or Modify a Workout Entry</ModalHeader>
                <ModalBody>
                    <Form>
                        <div className="form-group">
                            <Label>Timestamp</Label>
                            <input type="datetime-local" className="form-control" value={this.props.selectedWorkout.timestamp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ timestamp: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" placeholder={this.props.selectedWorkout.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ description: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Distance</label>
                            <input type="number" className="form-control" placeholder={this.props.selectedWorkout.distance.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ distance: parseFloat(e.currentTarget.value) })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="units">Units</label>
                            <select className="form-control" id="units" placeholder={this.props.selectedWorkout.units} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "mi") ? this.setState({ units: "mi"}) : this.setState({ units: "km" })}>
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Time (minutes)</label>
                            <input type="number" className="form-control" placeholder={this.props.selectedWorkout.elapsedtime.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ elapsedtime: parseFloat(e.currentTarget.value) })} required />
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input type="text" className="form-control" placeholder={this.props.selectedWorkout.notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ notes: e.currentTarget.value })} />
                        </div>
                        <div className="input-button-row">
                            <Button color="primary">Save Changes</Button>
                            <Button color="danger">Delete Entry</Button>
                            <Button color="secondary" onClick={() => this.props.viewWorkoutToggle()}>Cancel</Button>
                        </div>
                    </Form>
                </ModalBody>
                {/* <ModalFooter>
                    <Button color="primary" onClick={() => this.props.workoutToggle()}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={() => this.props.workoutToggle()}>Cancel</Button>
                </ModalFooter> */}
                </Modal>
            </div>
        );
    }
}
 
export default ViewWorkoutModal;