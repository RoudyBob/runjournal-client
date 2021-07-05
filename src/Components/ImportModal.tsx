import * as React from 'react';
import { Form, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress } from 'reactstrap';
import { APIURL } from '../Helpers/environment';
import { workoutEntry } from './Main';


export interface ImportModalProps {
    token: string,
    importToggle: Function,
    importModal: boolean,
    updateEvents: Function
}

export interface ImportModalState {
    beginningDate: Date,
    endingDate: Date,
    scope: string,
    redirectUrl: string,
    progressIndicator: number,
    progressStatus: string
}
 
class ImportModal extends React.Component<ImportModalProps, ImportModalState> {
    constructor(props: ImportModalProps) {
        super(props);
        this.state = {
            scope: 'read,activity:read_all',
            redirectUrl: 'http://localhost:3001/redirect',
            beginningDate: new Date((new Date()).valueOf() - 1000*60*60*24),
            endingDate: new Date(),
            progressIndicator: 0,
            progressStatus: 'Not Started',
        };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: ImportModalProps, prevState: ImportModalState) {
    }


    exitModal = () => {
        this.setState({ 
            progressIndicator: 0,
            progressStatus: "Not Started",
            beginningDate: new Date((new Date()).valueOf() - 1000*60*60*24),
            endingDate: new Date()
        });
        this.props.importToggle();
    }

    startImport = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.setState({ progressIndicator: 25 })
        this.setState({ progressStatus: "Starting Import" });
        let tmpToken : string | null = localStorage.getItem('stravaToken')
        if (tmpToken) {
            this.getUserRuns(tmpToken);
        }

    }

    createWorkout = (workout: any, userid: number) => {
        fetch(`${APIURL}/workout/import`, {
            method: 'POST',
            body: JSON.stringify({
                workout: {
                    timestamp: workout.start_date_local,
                    description: workout.name,
                    distance: (workout.distance *  0.00062137119224).toFixed(2),
                    units: "mi",
                    movingtime: Math.round(workout.moving_time / 60),
                    elapsedtime: Math.round(workout.elapsed_time / 60),
                    elevationgain: (workout.total_elevation_gain * 3.28).toFixed(2),
                    startlocation: workout.start_latlng,
                    endlocation: workout.end_latlng,
                    temp: 0,
                    humidity: 0,
                    aqi: 0,
                    notes: '',
                    sourceid: workout.id,
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
                // console.log(workout);
            }
        })
    };

    paginated_fetch = async (accessToken: string, url : string, page : number, previousRunData : Array<workoutEntry>): Promise<any> => {
        try {
            let response = await fetch(`${url}&page=${page}&per_page=30`, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': `Bearer ${accessToken}`
                })
            })
            let newRunData = await response.json();
            const runData = [...previousRunData, ...newRunData];
            if (newRunData.length !== 0) {
                page++;
                return this.paginated_fetch(accessToken, url, page, runData)
            }
            return runData;

        } catch (error) {
            console.log(error);
        }
    }

    getUserRuns = (accessToken: string) => {
        this.setState({ progressIndicator: 50 })
        this.setState({ progressStatus: "Connecting to Strava" });
        var startEpoch : number = Math.floor(this.state.beginningDate.getTime()/1000.0);
        var endEpoch : number = Math.floor(this.state.endingDate.getTime()/1000.0);
        
        this.paginated_fetch(accessToken, `https://www.strava.com/api/v3/athlete/activities?before=${endEpoch}&after=${startEpoch}`, 1, [])
        .then((runData) => {
            var totalEntries = runData.length;
            let currentEntry = 0;
            runData.forEach((workout: any) => {
                this.setState({ progressStatus: "Processing Workouts" })
                ++currentEntry;
                let percentComplete = currentEntry / totalEntries;
                this.setState({ progressIndicator: parseInt((percentComplete * 100).toFixed(0)) });
                let tmpUserid: string | null = localStorage.getItem('userid')
                if (workout.type === "Run") {
                    if(tmpUserid) {
                        this.createWorkout(workout, parseInt(tmpUserid.toString()))
                    }
                }
            })
            this.setState({ progressStatus: "Complete"});
            this.props.updateEvents();
        })
    };
    
    render() { 
        return (
            <div className="importmodal-div">
                <Modal isOpen={this.props.importModal} toggle={() => this.exitModal()} className="importmodal">
                <ModalHeader toggle={() => this.exitModal()}>Import Workout from Strava</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.startImport}>
                        <div className="import-progress">
                            <Label>Progess - {this.state.progressStatus}</Label>
                            
                            {/* <div className="text-center">{this.state.progressIndicator}%</div> */}
                            <Progress value={this.state.progressIndicator} />
                        </div>
                        <div className="form-group">
                            <Label>Import Runs Beginning</Label>
                            <input type="date" className="form-control" value={this.state.beginningDate.toISOString().split("T")[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ beginningDate : new Date(e.currentTarget.value) })} required />
                        </div>
                        <div className="form-group">
                            <Label>Import Runs Ending</Label>
                            <input type="date" className="form-control" value={this.state.endingDate.toISOString().split("T")[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ endingDate : new Date(e.currentTarget.value) })} required />
                        </div>
                        <ModalFooter>
                            {(this.state.progressIndicator === 0) ? <Button color="primary">Import from Strava</Button> : null}
                            {(this.state.progressIndicator === 100) ? <Button color="secondary" onClick={() => this.exitModal()}>Close</Button> : <Button color="secondary" onClick={() => this.exitModal()}>Cancel</Button>}
                        </ModalFooter>
                    </Form>
                </ModalBody>

                </Modal>
            </div>
        );
    }
}
 
export default ImportModal;