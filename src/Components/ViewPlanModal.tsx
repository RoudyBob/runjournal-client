import * as React from 'react';
import { Form, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

export interface ViewPlanModalProps {
    token: string,
    viewPlanToggle: Function,
    viewPlanModal: boolean,
    selectedPlan: {
        date: string,
        description: string,
        type: string,
        distance: number,
        units: string,
        notes: string
    }
}
 
export interface ViewPlanModalState {

}
 
class ViewPlanModal extends React.Component<ViewPlanModalProps, ViewPlanModalState> {
    constructor(props: ViewPlanModalProps) {
        super(props);
        this.state = {}
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.viewPlanModal} toggle={() => this.props.viewPlanToggle()} className="viewplanmodal">
                <ModalHeader toggle={() => this.props.viewPlanToggle()}>View or Modify a Plan Entry</ModalHeader>
                <ModalBody>
                    <Form>
                        <div className="form-group">
                            <Label>Date</Label>
                            <input type="date" className="form-control" value={this.props.selectedPlan.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ date: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Entry Title</label>
                            <input type="text" className="form-control" placeholder={this.props.selectedPlan.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ description: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="plantype">Entry Type</label>
                            <select className="form-control" id="plantype" placeholder={this.props.selectedPlan.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "workout") ? this.setState({ type: "workout"}) : this.setState({ type: "race" })} >
                                <option value="workout">Workout</option>
                                <option value="race">Race</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Distance</label>
                            <input type="number" className="form-control" placeholder={this.props.selectedPlan.distance.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ distance: parseFloat(e.currentTarget.value) })} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="units">Units</label>
                            <select className="form-control" id="units" placeholder={this.props.selectedPlan.units} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (e.currentTarget.value === "mi") ? this.setState({ units: "mi"}) : this.setState({ units: "km" })}>
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input type="text" className="form-control" placeholder={this.props.selectedPlan.notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ notes: e.currentTarget.value })} />
                        </div>
                        <div className="input-button-row">
                            <Button color="primary">Save Changes</Button>
                            <Button color="danger">Delete Entry</Button>
                            <Button color="secondary" onClick={() => this.props.viewPlanToggle()}>Cancel</Button>
                        </div>
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
 
export default ViewPlanModal;