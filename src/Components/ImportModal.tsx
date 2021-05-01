import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export interface ImportModalProps {
    token: string,
    importToggle: Function,
    importModal: boolean
}
 
export interface ImportModalState {
    
}
 
class ImportModal extends React.Component<ImportModalProps, ImportModalState> {
    constructor(props: ImportModalProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
            <div>
                <Modal isOpen={this.props.importModal} toggle={() => this.props.importToggle()} className="importmodal">
                <ModalHeader toggle={() => this.props.importModal}>Import Workout from Strava</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.importToggle()}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={() => this.props.importToggle()}>Cancel</Button>
                </ModalFooter>
                </Modal>
            </div>
        );
    }
}
 
export default ImportModal;