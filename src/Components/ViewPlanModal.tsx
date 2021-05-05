import * as React from 'react';
import { stringOrDate } from 'react-big-calendar';
import { Form, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import APIURL from '../Helpers/environment';
import { planEntry, userInfo } from './Main';

export interface ViewPlanModalProps {
    token: string,
    viewPlanToggle: Function,
    viewPlanModal: boolean,
    selectedPlan: planEntry,
    updateSelectedPlan: Function,
    userSettings: userInfo
}
 
export interface ViewPlanModalState {
    date: string,
    description: string,
    type: string, 
    distance: number,
    units: string,
    notes: string
}

class ViewPlanModal extends React.Component<ViewPlanModalProps, ViewPlanModalState> {
    constructor(props: ViewPlanModalProps) {
        super(props);
        this.state = {
            date: '1900-01-01',
            description: '',
            type: '', 
            distance: 0,
            units: '',
            notes: ''
        }
    }

    updatePlan = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`${APIURL}/plan/update/${this.props.selectedPlan.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                plan: {
                    date: this.props.selectedPlan.date,
                    description: this.props.selectedPlan.description,
                    type: this.props.selectedPlan.type, 
                    distance: this.props.selectedPlan.distance,
                    units: this.props.selectedPlan.units,
                    notes: this.props.selectedPlan.notes,
                    userId: this.props.selectedPlan.userId,
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            this.props.viewPlanToggle()
        })
    }

    deletePlan = () => {
        fetch(`${APIURL}/plan/${this.props.selectedPlan.id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            this.props.viewPlanToggle()
        })
    }

    updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedPlan = {
            id: this.props.selectedPlan.id,
            date: e.currentTarget.value,
            description: this.props.selectedPlan.description,
            type: this.props.selectedPlan.type,
            distance: this.props.selectedPlan.distance,
            units: this.props.selectedPlan.units,
            notes: this.props.selectedPlan.notes,
            userId: this.props.selectedPlan.userId
        }
        this.props.updateSelectedPlan(updatedPlan);
    }

    updateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedPlan = {
            id: this.props.selectedPlan.id,
            date: this.props.selectedPlan.date,
            description: e.currentTarget.value,
            type: this.props.selectedPlan.type,
            distance: this.props.selectedPlan.distance,
            units: this.props.selectedPlan.units,
            notes: this.props.selectedPlan.notes,
            userId: this.props.selectedPlan.userId
        }
        this.props.updateSelectedPlan(updatedPlan);
    }

    updateType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let type: string;
        (e.currentTarget.value === "workout") ? type="workout" : type="race";
        let updatedPlan = {
            id: this.props.selectedPlan.id,
            date: this.props.selectedPlan.date,
            description: this.props.selectedPlan.description,
            type: type,
            distance: this.props.selectedPlan.distance,
            units: this.props.selectedPlan.units,
            notes: this.props.selectedPlan.notes,
            userId: this.props.selectedPlan.userId
        }
        this.props.updateSelectedPlan(updatedPlan);
    }

    updateDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedPlan = {
            id: this.props.selectedPlan.id,
            date: this.props.selectedPlan.date,
            description: this.props.selectedPlan.description,
            type: this.props.selectedPlan.type,
            distance: parseFloat(e.currentTarget.value),
            units: this.props.selectedPlan.units,
            notes: this.props.selectedPlan.notes,
            userId: this.props.selectedPlan.userId
        }
        this.props.updateSelectedPlan(updatedPlan);
    }

    updateUnits = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let units: string;
        (e.currentTarget.value === "mi") ? units="mi" : units="km";
        let updatedPlan = {
            id: this.props.selectedPlan.id,
            date: this.props.selectedPlan.date,
            description: this.props.selectedPlan.description,
            type: this.props.selectedPlan.type,
            distance: this.props.selectedPlan.distance,
            units: units,
            notes: this.props.selectedPlan.notes,
            userId: this.props.selectedPlan.userId
        }
        this.props.updateSelectedPlan(updatedPlan);
    }

    updateNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
        var updatedPlan = {
            id: this.props.selectedPlan.id,
            date: this.props.selectedPlan.date,
            description: this.props.selectedPlan.description,
            type: this.props.selectedPlan.type,
            distance: this.props.selectedPlan.distance,
            units: this.props.selectedPlan.units,
            notes: e.currentTarget.value,
            userId: this.props.selectedPlan.userId
        }
        this.props.updateSelectedPlan(updatedPlan);
    }

    componentDidUpdate(prevProps: ViewPlanModalProps, prevState: ViewPlanModalState) {
        if (prevProps.userSettings.defaultUnits !== this.props.userSettings.defaultUnits) {
            this.setState({ units: this.props.userSettings.defaultUnits });
        }
        if (prevProps.selectedPlan.date !== this.props.selectedPlan.date) {
            console.log(`date props updated: ${this.props.selectedPlan.date }`);
        }

    }

    exitModal = () => {
        this.setState({ units: this.props.userSettings.defaultUnits });
        this.props.viewPlanToggle();
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.viewPlanModal} toggle={() => this.exitModal()} className="viewplanmodal">
                <ModalHeader toggle={() => this.exitModal()}>View or Modify a Plan Entry</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.updatePlan}>
                        <div className="form-group">
                            <Label>Date</Label>
                            <input type="date" className="form-control" value={(this.props.selectedPlan.date).toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateDate(e)} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" value={this.props.selectedPlan.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateDescription(e)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="plantype">Entry Type</label>
                            <select className="form-control" id="plantype" value={this.props.selectedPlan.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.updateType(e)} >
                                <option value="workout">Workout</option>
                                <option value="race">Race</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Distance</label>
                            <input type="number" step=".01" className="form-control" value={this.props.selectedPlan.distance.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateDistance(e)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="units">Units</label>
                            <select className="form-control" id="units" value={this.props.selectedPlan.units} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.updateUnits(e)} >
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input type="text" className="form-control" value={this.props.selectedPlan.notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.updateNotes(e)} />
                        </div>
                        <div className="input-button-row">
                            <Button color="primary">Save Changes</Button>
                            <Button color="danger" onClick={() => this.deletePlan()}>Delete Entry</Button>
                            <Button color="secondary" onClick={() => this.exitModal()}>Cancel</Button>
                        </div>
                    </Form>
                </ModalBody>
                </Modal>
         </div>
        );
    }
}
 
export default ViewPlanModal;