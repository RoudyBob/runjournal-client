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

    componentDidMount() {
        console.log('mounting')
    }

    exitModal = () => {

        this.props.importToggle();
    }

    handleLogin = () => {
        console.log('in handleLogin');
    }
    
    render() { 
        return (
            <div className="importmodal-div">
                <Modal isOpen={this.props.importModal} toggle={() => this.exitModal()} className="importmodal">
                <ModalHeader toggle={() => this.props.importModal}>Import Workout from Strava</ModalHeader>
                <ModalBody>
                    <button onClick={this.handleLogin}>Connect with Strava</button>
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