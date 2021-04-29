import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export interface PlanModalProps {
    planToggle: Function,
    planModal: boolean,
}
 
export interface PlanModalState {

}

 
class PlanModal extends React.Component<PlanModalProps, PlanModalState> {
    constructor(props: PlanModalProps) {
        super(props);
        this.state = {};
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.planModal} toggle={() => this.props.planToggle()} className="planmodal">
                <ModalHeader toggle={() => this.props.planToggle()}>Create Plan Entry</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.planToggle()}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={() => this.props.planToggle()}>Cancel</Button>
                </ModalFooter>
                </Modal>
         </div>
        );
    }
}
 
export default PlanModal;