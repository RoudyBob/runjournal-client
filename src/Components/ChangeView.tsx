import * as React from 'react';
import { Form, Label, Col, Input, FormGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroupAddon, InputGroupText } from 'reactstrap';
import { runnerInfo, userInfo } from './Main';
import APIURL from '../Helpers/environment';

export interface ChangeViewProps {
    token: string,
    changeViewModal: boolean,
    changeViewToggle: Function,
    userSettings: userInfo,
    runnerInfo: Array<runnerInfo>
}
 
export interface ChangeViewState {
    selectedRunner : number
}
 
class ChangeView extends React.Component<ChangeViewProps, ChangeViewState> {
    constructor(props: ChangeViewProps) {
        super(props);
        this.state = {
            selectedRunner : this.props.userSettings.viewAsUser
        };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: ChangeViewProps, prevState: ChangeViewState) {
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({selectedRunner: parseInt(e.target.value)})
    }

    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(this.state.selectedRunner);
        this.props.changeViewToggle();
    }

    displayRunners = (id: number, index: number) => {
        return (
            <FormGroup check>
            <Label check>
            <Input type="radio" id={"radio-runnerid"+id} value={id} checked={this.state.selectedRunner === this.props.runnerInfo[index].id} onChange={this.handleChange} />{' '+ this.props.runnerInfo[index].name}
            </Label>
            </FormGroup>
        );
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.props.changeViewModal} toggle={() => this.props.changeViewToggle} className="changeviewmodal">
                    <ModalHeader toggle={() => this.props.changeViewToggle()}>View As Runner</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                        <FormGroup tag="fieldset" row>
                            <Col sm={12}>
                            {(this.props.userSettings.runners) ? this.props.userSettings.runners.map((runner, index) => this.displayRunners(runner, index)) : <div></div> }
                            </Col>
                        </FormGroup>
                            <Button color="primary">Save Plan Entry</Button>
                            <Button color="secondary" onClick={() => this.props.changeViewToggle()}>Cancel</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
 
export default ChangeView;