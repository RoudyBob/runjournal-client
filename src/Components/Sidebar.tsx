import * as React from 'react';
import { ProSidebar, SidebarHeader, Menu, MenuItem, SidebarContent } from 'react-pro-sidebar';
import { FaRunning, FaCalendarAlt, FaCloudDownloadAlt, FaUserCircle, FaChartLine, FaAward, FaEdit } from "react-icons/fa";
import './Sidebar.scss';
import { userInfo, planEntry, workoutEntry, runnerInfo } from './Main'
import { stringOrDate } from 'react-big-calendar';
import { APIURL } from '../Helpers/environment';
import ChangeView from './ChangeView';
import EditProfile from './EditProfile';
import ImportModal from './ImportModal';

export interface SidebarProps {
    token: string,
    userid: string,
    createPlanToggle: Function,
    createPlanModal: boolean,
    createWorkoutToggle: Function,
    createWorkoutModal: boolean,
    userSettings: userInfo,
    updateUserSettings: Function,
    allWorkouts: Array<workoutEntry>
    allPlans: Array<planEntry>,
    runnerInfo: Array<runnerInfo>,
    updateViewAsUser: Function,
    viewAsUser: number
}
 
export interface SidebarState {
    totalMiles: number,
    totalTime: number,
    totalHours: number,
    totalMinutes: number,
    totalElevation: number,
    nextRaceDate: stringOrDate,
    nextRaceName: stringOrDate,
    weeksUntilRace: number,
    daysUntilRace: number,
    hoursUntilRace: number,
    runnerInfo: RunnerData,
    changeViewModal: boolean,
    editProfileModal: boolean,
    importModal: boolean,
    scope: string,
    redirectUrl: string,
}

export interface RunnerData {
    firstname: string,
    lastname: string,
    runnerid: number

}
 
class Sidebar extends React.Component<SidebarProps, SidebarState> {
    constructor(props: SidebarProps) {
        super(props);
        this.state = {
            totalMiles: 0,
            totalTime: 0,
            totalHours: 0,
            totalMinutes: 0,
            totalElevation: 0,
            nextRaceDate: '',
            nextRaceName: '',
            weeksUntilRace: 0,
            daysUntilRace: 0,
            hoursUntilRace: 0,
            runnerInfo: {
                firstname: '',
                lastname: '',
                runnerid: 0,
            },
            changeViewModal: false,
            editProfileModal: false,
            importModal: false,
            scope: 'read,activity:read_all',
            redirectUrl: 'http://localhost:3001/redirect'
        };
    }

    calculateGoalCountdown = () => {
        var raceDateHolder : stringOrDate = new Date('2100-01-01');
        var raceNameHolder : string = '';
        var raceFound : boolean = false;
        this.props.allPlans.forEach((plan: planEntry) => {
            // var raceDate : stringOrDate = '';
            if (plan.type === "race") {
                if(Date.parse(plan.date.toString()) < Date.parse(raceDateHolder.toString())) {
                    raceFound = true;
                    raceDateHolder = plan.date;
                    raceNameHolder = plan.description;
                }
            }

        });

        if (!raceFound) {
            this.setState({ nextRaceName: "N/A" });
            this.setState({ nextRaceDate: "None Found" })
            this.setState({ weeksUntilRace: 0 });
            this.setState({ daysUntilRace: 0 });
            this.setState({ hoursUntilRace: 0 });
        } else {
            this.setState({
                nextRaceDate: raceDateHolder,
                nextRaceName: raceNameHolder
            })
            // Convert today to Unix timestamp
            let today = new Date().getTime() / 1000;

            // Get delta between Today and Next Race
            let delta = Math.abs(new Date(raceDateHolder).getTime() / 1000) - today;

            // calculate and subtrace whole weeks
            let weeks = Math.floor(delta / 604800);
            this.setState({ weeksUntilRace: weeks });
            delta -= weeks * 604800;

            // calculate and subtract whole days
            let days = Math.floor(delta / 86400);
            this.setState({ daysUntilRace: days });
            delta -= days * 86400;

            // caleculate and subtract whole hours
            let hours = Math.floor(delta / 3600) % 24;
            this.setState({ hoursUntilRace: hours });
            delta -= hours * 3600;
        }
    };

    calculateStats = () => {
        var mileageCount = 0;
        var elevationCount = 0;
        var timeCount = 0;
        this.props.allWorkouts.forEach((workout : workoutEntry) => {
            if (workout.units === "mi") {
                mileageCount = mileageCount + workout.distance;
                elevationCount = elevationCount + workout.elevationgain;

            } else {
                mileageCount = mileageCount + (workout.distance * .621371);
                elevationCount = elevationCount + (workout.elevationgain * 3.2808);
            };
            timeCount = timeCount + workout.elapsedtime;
        });
        this.setState ({
            totalMiles: mileageCount,
            totalElevation: elevationCount,
            totalHours: Math.floor(timeCount / 60),
            totalMinutes: timeCount -= Math.floor(timeCount / 60) * 60
        })
    };
    
    getRunnerForCoach= () => {
        fetch(`${APIURL}/user/${this.props.viewAsUser}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((runner) => {
            this.setState({
                runnerInfo: {
                    firstname: runner.firstname,
                    lastname: runner.lastname,
                    runnerid: runner.id
                }
            })
        })
    }

    changeViewToggle = () => {
        this.setState(prevState => ({
            changeViewModal: !prevState.changeViewModal
        }));
    }

    componentDidMount() {
        this.calculateGoalCountdown();
    }

    componentDidUpdate(prevProps: SidebarProps, prevState: SidebarState) {
        if (prevProps.allWorkouts !== this.props.allWorkouts) {
            this.calculateStats();
        }
        if (prevProps.allPlans !== this.props.allPlans) {
            this.calculateGoalCountdown();
        }
        if (prevProps.viewAsUser !== this.props.viewAsUser) {
            this.getRunnerForCoach();
        }
    }

    editProfileToggle = () => {
        this.setState(prevState => ({
            editProfileModal: !prevState.editProfileModal
        }));
    }

    importToggle = () => {
        this.setState(prevState => ({
            importModal: !prevState.importModal
        }));
    }

    stravaLogin = () => {
        window.location.href = `http://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${this.state.redirectUrl}/exchange_token&approval_prompt=force&scope=${this.state.scope}`;
    }

    render() { 

        return (
            // <div className="sidebar">
                <ProSidebar>
                    <ImportModal token={this.props.token} importToggle={this.importToggle} importModal={this.state.importModal} />
                    <ChangeView token={this.props.token} userSettings={this.props.userSettings} runnerInfo={this.props.runnerInfo} updateViewAsUser={this.props.updateViewAsUser} viewAsUser={this.props.viewAsUser} changeViewModal={this.state.changeViewModal} changeViewToggle={this.changeViewToggle} />
                    <EditProfile token={this.props.token} userid={this.props.userid} updateUserSettings={this.props.updateUserSettings} userSettings={this.props.userSettings} editProfileModal={this.state.editProfileModal} editProfileToggle={this.editProfileToggle}/>
                    <SidebarHeader>
                        <h4><FaUserCircle />{this.props.userSettings.firstname} {this.props.userSettings.lastname} </h4>
                        <Menu iconShape="square">
                            {(this.props.userSettings.coach === true) ? <MenuItem onClick={() => this.changeViewToggle()} >Viewing: {this.state.runnerInfo.firstname} {this.state.runnerInfo.lastname}</MenuItem> : null}
                            {/* {(this.props.userSettings.coach === true && this.props.viewAsUser === this.props.userSettings.userid) ? <MenuItem icon={<FaEye />} onClick={() => this.changeViewToggle()} >Viewing: You</MenuItem> : null} */}
                        </Menu>
                    </SidebarHeader>
                    <Menu iconShape="square">
                        <MenuItem icon={<FaCalendarAlt />} onClick={() => this.props.createPlanToggle()}>Create Plan Entry</MenuItem>
                        <MenuItem icon={<FaRunning />} onClick={() => this.props.createWorkoutToggle()}>Record Workout</MenuItem>
                        {(localStorage.getItem('stravaToken')) ? <MenuItem icon={<FaCloudDownloadAlt />} onClick={() => this.importToggle()}>Import Workout</MenuItem> : <MenuItem icon={<FaCloudDownloadAlt />} onClick={() => this.stravaLogin()}>Connect with Strava</MenuItem>}
                        <MenuItem icon={<FaEdit />} onClick={() => this.editProfileToggle()}>Edit Profile</MenuItem>
                    </Menu>
                    <SidebarHeader>
                        <h4><FaChartLine />Monthly Stats</h4>
                    </SidebarHeader>
                    <SidebarContent>
                        <h6>Total Distance: </h6>
                        {(this.props.userSettings.defaultUnits === "mi") ? <p>{this.state.totalMiles.toFixed(2)}mi</p> : <p>{(this.state.totalMiles * 1.609344).toFixed(2)}km</p>}
                        <h6>Total Elevation Gain: </h6>
                        {(this.props.userSettings.defaultUnits === "mi") ? <p>{this.state.totalElevation.toFixed(2)}ft</p> : <p>{(this.state.totalElevation / 3.2808).toFixed(2)}m</p>}
                        <h6>Total Time:</h6>
                        <p>{this.state.totalHours}h{this.state.totalMinutes}m</p>
                    </SidebarContent>
                    <SidebarHeader>
                        <h4><FaAward />Race Countown</h4>
                    </SidebarHeader>
                    <SidebarContent>
                        <h6>Next Race: {this.state.nextRaceName}</h6>
                        <h6>Next Race Date: {this.state.nextRaceDate.toString()}</h6>
                        <br/>
                        <h6>Time Until Race: </h6>
                        Weeks: {this.state.weeksUntilRace}&nbsp;
                        Days: {this.state.daysUntilRace}&nbsp;
                        Hours: {this.state.hoursUntilRace}
                    </SidebarContent>
                </ProSidebar>
            // </div>
            
        );
    }
}
 
export default Sidebar;