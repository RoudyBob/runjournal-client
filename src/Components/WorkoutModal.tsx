import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export interface WorkoutModalProps {
    workoutToggle: Function,
    workoutModal: boolean
}
 
export interface WorkoutModalState {
    
}
 
class WorkoutModal extends React.Component<WorkoutModalProps, WorkoutModalState> {
    constructor(props: WorkoutModalProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
            <div>
                <Modal isOpen={this.props.workoutModal} toggle={() => this.props.workoutToggle()} className="workoutmodal">
                <ModalHeader toggle={() => this.props.workoutToggle()}>Create Workout Entry</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.workoutToggle()}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={() => this.props.workoutToggle()}>Cancel</Button>
                </ModalFooter>
                </Modal>
            </div>
        );
    }
}
 
export default WorkoutModal;