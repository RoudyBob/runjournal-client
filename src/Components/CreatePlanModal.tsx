import * as React from 'react';
import { stringOrDate } from 'react-big-calendar';
import { Form, Label, ModalFooter, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { APIURL } from '../Helpers/environment';
import { slotInfo, userInfo } from './Main';

export interface CreatePlanModalProps {
    token: string,
    createPlanToggle: Function,
    createPlanModal: boolean,
    selectedSlotInfo: slotInfo,
    updateSelectedSlot: Function
    userSettings: userInfo,
    updateEvents: Function,
    viewAsUser: number
}
 
export interface CreatePlanModalState {
    date: stringOrDate,
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
            type: 'workout',
            distance: 0,
            units: '',
            notes: ''
        };
    }

    createPlan = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(this.props.viewAsUser);
        fetch(`${APIURL}/plan`, {
            method: 'POST',
            body: JSON.stringify({
                plan: {
                    date: this.props.selectedSlotInfo.start,
                    description: this.state.description,
                    type: this.state.type, 
                    distance: this.state.distance,
                    units: this.state.units,
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
        .then((plan) => {
            // console.log(plan)
            this.props.updateEvents();
            this.exitModal();
        })

    }

    componentDidUpdate(prevProps: CreatePlanModalProps, prevState: CreatePlanModalState) {
        if (prevProps.userSettings.defaultUnits !== this.props.userSettings.defaultUnits) {
            this.setState({ units: this.props.userSettings.defaultUnits });
        }
    }

    exitModal = () => {
        this.setState({ units: this.props.userSettings.defaultUnits });
        this.props.createPlanToggle();
    }

    render() { 
        return (
            <div className="createplanmodal-div">
                <Modal isOpen={this.props.createPlanModal} toggle={() => this.exitModal()} className="createplanmodal">
                <ModalHeader toggle={() => this.exitModal()}>Create Plan Entry</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.createPlan}>
                        <div className="form-group">
                            <Label>Date</Label>
                            <input type="date" className="form-control" value={(this.props.selectedSlotInfo.start).toString().split("T")[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.updateSelectedSlot(e.currentTarget.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ description: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="plantype">Entry Type</label>
                            <select className="form-control" id="plantype" value={this.state.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "workout") ? this.setState({ type: "workout" }) : this.setState({ type: "race" })} >
                                <option value="workout">Workout</option>
                                <option value="race">Race</option>
                            </select>
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
                            <label>Notes</label>
                            <input type="text" className="form-control" placeholder="Notes" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ notes: e.currentTarget.value })} />
                        </div>
                        <ModalFooter>
                            <Button color="primary">Save Plan Entry</Button>
                            <Button color="secondary" onClick={() => this.exitModal()}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
                </Modal>
         </div>
        );
    }
}
 
export default CreatePlanModal;