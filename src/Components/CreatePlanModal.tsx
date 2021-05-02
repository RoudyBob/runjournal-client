import * as React from 'react';
import { Form, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import APIURL from '../Helpers/environment';

export interface CreatePlanModalProps {
    token: string,
    createPlanToggle: Function,
    createPlanModal: boolean,
}
 
export interface CreatePlanModalState {
    date: string,
    description: string,
    type: string,
    distance: number,
    units: string,
    notes: string
}

 
class CreatePlanModal extends React.Component<CreatePlanModalProps, CreatePlanModalState> {
    constructor(props: CreatePlanModalProps) {
        super(props);
        this.state = {
            date: '',
            description: '',
            type: '',
            distance: 0,
            units: '',
            notes: ''
        };
    }

    createPlan = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`${APIURL}/plan`, {
            method: 'POST',
            body: JSON.stringify({
                plan: {
                    date: this.state.date,
                    description: this.state.description,
                    type: this.state.type, 
                    distance: this.state.distance,
                    units: this.state.units,
                    notes: this.state.notes
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((plan) => {
            console.log(plan)
            this.props.createPlanToggle()
        })
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.createPlanModal} toggle={() => this.props.createPlanToggle()} className="createplanmodal">
                <ModalHeader toggle={() => this.props.createPlanToggle()}>Create Plan Entry</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.createPlan}>
                        <div className="form-group">
                            <Label>Date</Label>
                            <input type="date" className="form-control" placeholder="01/01/1900" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ date: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ description: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="plantype">Entry Type</label>
                            <select className="form-control" id="plantype" value={this.state.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "workout") ? this.setState({ type: "workout"}) : this.setState({ type: "race" })} >
                                <option value="workout">Workout</option>
                                <option value="race">Race</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Distance</label>
                            <input type="number" className="form-control" placeholder="distance" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ distance: parseFloat(e.currentTarget.value) })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="units">Units</label>
                            <select className="form-control" id="units" value={this.state.units} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "mi") ? this.setState({ units: "mi"}) : this.setState({ units: "km" })}>
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input type="text" className="form-control" placeholder="Notes" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ notes: e.currentTarget.value })} />
                        </div>
                        <Button color="primary">Save Plan Entry</Button>
                        <Button color="secondary" onClick={() => this.props.createPlanToggle()}>Cancel</Button>
                    </Form>
                </ModalBody>
                {/* <ModalFooter>
                    <Button color="primary">Save Plan Entry</Button>
                    <Button color="secondary" onClick={() => this.props.planToggle()}>Cancel</Button>
                </ModalFooter> */}
                </Modal>
         </div>
        );
    }
}
 
export default CreatePlanModal;