import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { default as strava, Strava } from 'strava-v3';



export interface ImportModalProps {
    token: string,
    importToggle: Function,
    importModal: boolean
}
 
export interface ImportModalState {
    scope: string,
    redirectUrl: string
}
 
class ImportModal extends React.Component<ImportModalProps, ImportModalState> {
    constructor(props: ImportModalProps) {
        super(props);
        this.state = {
            scope: 'read',
            redirectUrl: 'http://localhost:3001/redirect'
        };
    }

    componentDidMount() {
        console.log(process.env.REACT_APP_CLIENT_ID);
    }

    exitModal = () => {

        this.props.importToggle();
    }

    handleLogin = () => {
        console.log('in handleLogin');
        window.location.href = `http://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${this.state.redirectUrl}/exchange_token&approval_prompt=force&scope=${this.state.scope}`;

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