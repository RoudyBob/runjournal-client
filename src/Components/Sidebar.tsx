import * as React from 'react';
import { ProSidebar, SidebarHeader, Menu, MenuItem, SidebarContent } from 'react-pro-sidebar';
import { FaRunning, FaCalendarAlt, FaCloudDownloadAlt } from "react-icons/fa";
import './Sidebar.scss';
import APIURL from '../Helpers/environment';
import { userInfo } from './Main';

export interface planEntry {
    id: number,
    date: string,
    description: string,
    type: string,
    distance: number,
    units: string,
    notes: string
}

export interface workoutEntry {
    id: number,
    timestamp: string,
    description: string,
    distance: number,
    units: string,
    movingtime: number,
    elapsedtime: number,
    elevationgain: number,
    startlocation: Array<number>,
    endlocation: Array<number>,
    temp: number,
    humidity: number,
    aqi: number,
    notes: string
}

export interface SidebarProps {
    token: string,
    userid: string | null,
    createPlanToggle: Function,
    createPlanModal: boolean,
    createWorkoutToggle: Function,
    createWorkoutModal: boolean,
    userSettings: userInfo
}
 
export interface SidebarState {
    totalMiles: number,
    totalTime: number,
    totalHours: number,
    totalMinutes: number,
    totalElevation: number,
    nextRaceDate: string,
    nextRaceName: string,
    weeksUntilRace: number,
    daysUntilRace: number,
    hoursUntilRace: number
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
            hoursUntilRace: 0
        };
    }


    calculateGoalCountdown = () => {


        fetch(`${APIURL}/plan/${this.props.userid}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((plans) => {
            plans.forEach((plan: planEntry) => {
                if (plan.type === "race") {
                    if (!this.state.nextRaceDate) {
                        this.setState({ nextRaceDate: plan.date });
                        this.setState({ nextRaceName: plan.description })
                    } else {
                        if (Date.parse(plan.date) < Date.parse(this.state.nextRaceDate)) {
                            this.setState({ nextRaceDate: plan.date })
                            this.setState({ nextRaceName: plan.description })
                        }
                    }
                }
            });

            // Convert today to Unix timestamp
            let today = new Date().getTime() / 1000;

            // Get delta between Today and Next Race
            let delta = Math.abs(new Date(this.state.nextRaceDate).getTime() / 1000) - today;

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

            if (!this.state.nextRaceDate) {
                this.setState({ nextRaceName: "N/A" });
                this.setState({ nextRaceDate: "None Found" })
                this.setState({ weeksUntilRace: 0 });
                this.setState({ daysUntilRace: 0 });
                this.setState({ hoursUntilRace: 0 });
            }
        })
    };

    calculateStats = () => {
        fetch(`${APIURL}/workout/${this.props.userid}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workouts) => {   
            workouts.forEach((workout : workoutEntry) => {
                let mileageCount = this.state.totalMiles;
                let elevationCount = this.state.totalElevation
                let timeCount = this.state.totalTime

                if (workout.units === "mi") {
                    this.setState({ totalMiles: mileageCount + workout.distance });
                    this.setState({ totalElevation: elevationCount + workout.elevationgain });
                } else {
                    this.setState({ totalMiles: mileageCount + (workout.distance * .621371) });
                    this.setState({ totalElevation: elevationCount + (workout.elevationgain * 3.2808) });
                };
                this.setState({ totalTime: timeCount + workout.elapsedtime });
            });
            // calculate and subtract whole hours from Time
            let tmpTotalTime = this.state.totalTime;
            this.setState({ totalHours: Math.floor(tmpTotalTime / 60) });
            this.setState({ totalMinutes: tmpTotalTime -= this.state.totalHours * 60});
        })
    };

    componentDidMount() {
        this.calculateGoalCountdown();
        this.calculateStats();
    }

    render() { 

        return (
            <div id="sidebar">
                <ProSidebar>
                    <Menu iconShape="square">
                        <MenuItem icon={<FaCalendarAlt />} onClick={() => this.props.createPlanToggle()}>Create Plan Entry</MenuItem>
                        <MenuItem icon={<FaRunning />} onClick={() => this.props.createWorkoutToggle()}>Record Workout</MenuItem>
                        <MenuItem icon={<FaCloudDownloadAlt />}>Import Workout</MenuItem>
                    </Menu>
                    <SidebarHeader>
                        <div className="monthlystatsheader">
                            <h4>Monthly Stats</h4>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <div className="monthlystatscontent">
                            {(this.props.userSettings.defaultUnits === "mi") ? <p>Total Distance: {this.state.totalMiles.toFixed(2)}mi</p> : <p>Total Distance: {(this.state.totalMiles * 1.609344).toFixed(2)}km</p>}
                            {(this.props.userSettings.defaultUnits === "mi") ? <p>Total Elevation Gain: {this.state.totalElevation.toFixed(2)}ft</p> : <p>Total Elevation Gain: {(this.state.totalElevation / 3.2808).toFixed(2)}m</p>}
                            <p>Total Time: {this.state.totalHours}h{this.state.totalMinutes}m</p>
                        </div>
                    </SidebarContent>
                    <SidebarHeader>
                        <div className="goalheader">
                            <h4>Race Countown</h4>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <div className="goalcontent">
                            <br/>
                            <h6>Next Race: {this.state.nextRaceName}</h6>
                            <h6>Next Race Date: {this.state.nextRaceDate}</h6>
                            <br/>
                            <h6>Time Until Race: </h6>
                            Weeks: {this.state.weeksUntilRace}&nbsp;
                            Days: {this.state.daysUntilRace}&nbsp;
                            Hours: {this.state.hoursUntilRace}
                        </div>
                    </SidebarContent>
                </ProSidebar>
            </div>
            
        );
    }
}
 
export default Sidebar;