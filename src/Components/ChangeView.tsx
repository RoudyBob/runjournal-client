import * as React from 'react';
import { Form, Label, Col, Input, FormGroup, Button, ModalFooter, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { runnerInfo, userInfo } from './Main';

export interface ChangeViewProps {
    token: string,
    changeViewModal: boolean,
    changeViewToggle: Function,
    userSettings: userInfo,
    runnerInfo: Array<runnerInfo>,
    viewAsUser: number,
    updateViewAsUser: Function
}
 
export interface ChangeViewState {
    selectedRunner: number,
    showRunners: boolean
}
 
class ChangeView extends React.Component<ChangeViewProps, ChangeViewState> {
    constructor(props: ChangeViewProps) {
        super(props);
        this.state = {
            selectedRunner : this.props.viewAsUser,
            showRunners: false
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
        this.props.updateViewAsUser(this.state.selectedRunner);
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
            <div className="changeview-div">
                <Modal isOpen={this.props.changeViewModal} toggle={() => this.props.changeViewToggle} className="changeviewmodal">
                   <ModalHeader toggle={() => this.props.changeViewToggle()}>View As Runner</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                        <FormGroup tag="fieldset" row>
                            <Col sm={12}>
                            {(this.props.runnerInfo) ? this.props.runnerInfo.map((runner, index) => this.displayRunners(runner.id, index)) : <div></div> }
                            </Col>
                        </FormGroup>
                        <ModalFooter>
                            <Button color="primary">Switch to Runner</Button>
                            <Button color="secondary" onClick={() => this.props.changeViewToggle()}>Cancel</Button>
                        </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
 
export default ChangeView;