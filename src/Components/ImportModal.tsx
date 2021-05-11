import * as React from 'react';
import { Form, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { APIURL } from '../Helpers/environment';


export interface ImportModalProps {
    token: string,
    importToggle: Function,
    importModal: boolean
}

export interface ImportModalState {
    beginningDate: Date,
    endingDate: Date,
    scope: string,
    redirectUrl: string,
}
 
class ImportModal extends React.Component<ImportModalProps, ImportModalState> {
    constructor(props: ImportModalProps) {
        super(props);
        this.state = {
            scope: 'read,activity:read_all',
            redirectUrl: 'http://localhost:3001/redirect',
            beginningDate: new Date(),
            endingDate: new Date()
        };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: ImportModalProps, prevState: ImportModalState) {

    }


    exitModal = () => {
        this.props.importToggle();
    }

    startImport = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        let tmpToken : string | null = localStorage.getItem('stravaToken')
        if (tmpToken) {
            this.getUserRuns(tmpToken);
        }

    }

    createWorkout = (workout: any, userid: number) => {
        console.log(workout.start_latlng);
        console.log(`${APIURL}/workout`);
        fetch(`${APIURL}/workout`, {
            method: 'POST',
            body: JSON.stringify({
                workout: {
                    timestamp: workout.start_date_local,
                    description: workout.name,
                    distance: (workout.distance *  0.00062137119224).toFixed(2),
                    units: "mi",
                    movingtime: workout.moving_time / 60,
                    elapsedtime: workout.elapsed_time / 60,
                    elevationgain: workout.total_elevation_gain * 3.28,
                    startlocation: workout.start_latlng,
                    endlocation: workout.end_latlng,
                    temp: 0,
                    humidity: 0,
                    aqi: 0,
                    notes: '',
                    userId: userid
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workout) => {
            if (workout.hasOwnProperty("error")) {
                console.log('error')
            } else {
                console.log(workout)
            }
        })
    };

    getUserRuns = (accessToken: string) => {
        var startEpoch = Math.floor(this.state.beginningDate.getTime()/1000.0);
        var endEpoch = Math.floor(this.state.endingDate.getTime()/1000.0);
        fetch(`https://www.strava.com/api/v3/athlete/activities?before=${endEpoch}&after=${startEpoch}&per_page=100`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${accessToken}`
            })
        })
        .then((response) => response.json())
        .then((runData) => { 
            console.log(runData)
            runData.forEach((workout: any) => { 
                let tmpUserid: string | null = localStorage.getItem('userid')
                if (workout.type === "Run") {
                    if(tmpUserid) {
                        this.createWorkout(workout, parseInt(tmpUserid.toString()))
                    }
                }
            })
        })
    };
    
    render() { 
        return (
            <div className="importmodal-div">
                <Modal isOpen={this.props.importModal} toggle={() => this.exitModal()} className="importmodal">
                <ModalHeader toggle={() => this.props.importModal}>Import Workout from Strava</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.startImport}>
                        <div className="form-group">
                            <Label>Import Runs Beginning</Label>
                            <input type="date" className="form-control" value={this.state.beginningDate.toISOString().split("T")[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ beginningDate : new Date(e.currentTarget.value) })} required />
                        </div>
                        <div className="form-group">
                            <Label>Import Runs Ending</Label>
                            <input type="date" className="form-control" value={this.state.endingDate.toISOString().split("T")[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ endingDate : new Date(e.currentTarget.value) })} required />
                        </div>
                        <ModalFooter>
                            <Button color="primary">Import from Strava</Button>
                            <Button color="secondary" onClick={() => this.props.importToggle()}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>

                </Modal>
            </div>
        );
    }
}
 
export default ImportModal;