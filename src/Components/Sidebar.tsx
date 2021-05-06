import * as React from 'react';
import { ProSidebar, SidebarHeader, Menu, MenuItem, SidebarContent } from 'react-pro-sidebar';
import { FaRunning, FaCalendarAlt, FaCloudDownloadAlt } from "react-icons/fa";
import './Sidebar.scss';
import { userInfo, planEntry, workoutEntry } from './Main'
import { stringOrDate } from 'react-big-calendar';

export interface SidebarProps {
    token: string,
    userid: string | null,
    createPlanToggle: Function,
    createPlanModal: boolean,
    createWorkoutToggle: Function,
    createWorkoutModal: boolean,
    userSettings: userInfo,
    allWorkouts: Array<workoutEntry>
    allPlans: Array<planEntry>
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
                            <h6>Next Race Date: {this.state.nextRaceDate.toString()}</h6>
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