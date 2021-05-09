import * as React from 'react';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';

export interface ChoiceModalProps {
    choiceToggle: Function,
    createPlanToggle: Function,
    createWorkoutToggle: Function,
    choiceModal: boolean
}
 
export interface ChoiceModalState {
    
}
 
class ChoiceModal extends React.Component<ChoiceModalProps, ChoiceModalState> {
    constructor(props: ChoiceModalProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
            <div className="choicemodal-div">
                <Modal isOpen={this.props.choiceModal} toggle={() => this.props.choiceToggle} className="choicemodal">
                    <ModalHeader toggle={() => this.props.choiceToggle()}>Plan Entry or Workout?</ModalHeader>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.props.createPlanToggle()}>Create Plan Entry</Button>
                        <Button color="warning" onClick={() => this.props.createWorkoutToggle()}>Record Workout</Button>
                        <Button color="secondary" onClick={() => this.props.choiceToggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
 
export default ChoiceModal;