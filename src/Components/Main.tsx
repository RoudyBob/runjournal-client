import * as React from 'react';
import { Calendar, momentLocalizer, stringOrDate } from 'react-big-calendar'
import moment from 'moment'
import Sidebar from './Sidebar';
import CreatePlanModal from './CreatePlanModal';
import CreateWorkoutModal from './CreateWorkoutModal';
import ViewPlanModal from './ViewPlanModal';
import ViewWorkoutModal from './ViewWorkoutModal';
import ChoiceModal from './ChoiceModal';
import ImportModal from './ImportModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { APIURL } from '../Helpers/environment';

export interface MainProps {
    token: string,
    userid: string,
}
 
export interface MainState {
    viewAsUser: number,
    userSettings: userInfo,
    runnerInfo: Array<runnerInfo>,
    navigateDate: Date,
    createPlanModal: boolean,
    viewPlanModal: boolean,
    selectedPlan: planEntry,
    createWorkoutModal: boolean,
    viewWorkoutModal: boolean,
    selectedWorkout: workoutEntry,
    choiceModal: boolean,
    importModal: boolean,
    events: Array<calendarEvent>,
    selectedSlotInfo: slotInfo,
    allWorkouts: Array<workoutEntry>,
    allPlans: Array<planEntry>
}

export interface userInfo {
    userid: number,
    firstname: string,
    lastname: string,
    email: string,
    defaultUnits: string,
    weekStart: string,
    coach: boolean,
    runners?: Array<number>
}

export interface runnerInfo {
    name: string,
    id: number
}

export interface planEntry {
    id: number,
    date: stringOrDate,
    description: string,
    type: string,
    distance: number,
    units: string,
    notes: string,
    userId: number
}

export interface slotInfo {
    start: stringOrDate,
    end: stringOrDate
}

export interface workoutEntry {
    id: number,
    timestamp: stringOrDate,
    description: string,
    distance: number,
    units: string,
    movingtime: number,
    elapsedtime: number,
    elevationgain: number,
    startlocation: Array<Number>,
    endlocation: Array<Number>,
    temp: number,
    humidity: number,
    aqi: number,
    notes: string,
    sourceid: string,
    userId: number
}

export interface calendarEvent {
    start: stringOrDate | null,
    end: stringOrDate | null,
    title: string,
    type: string,
    id: number,
    allDay?: boolean,
    resource?: any
}

class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = { 
            viewAsUser: 0,
            userSettings: {
                userid: 0,
                firstname: '',
                lastname: '',
                email: '',
                defaultUnits: '',
                weekStart: '',
                coach: false,
                runners: []
            },
            runnerInfo: [],
            navigateDate: new Date(),
            createPlanModal: false,
            viewPlanModal: false,
            selectedPlan: {
                id: 0,
                date: '',
                description: '',
                type: '',
                distance: 0,
                units: '',
                notes: '',
                userId: 0
            },
            createWorkoutModal: false,
            viewWorkoutModal: false,
            selectedWorkout: {
                id: 0,
                timestamp: '',
                description: '',
                distance: 0,
                units: '',
                movingtime: 0,
                elapsedtime: 0,
                elevationgain: 0,
                startlocation: [],
                endlocation: [],
                temp: 0,
                humidity: 0,
                aqi: 0,
                notes: '',
                sourceid: '',
                userId: 0
            },
            choiceModal: false,
            importModal: false,
            events: [{
                start: null,
                end: null,
                title: '',
                type: '',
                id: 0
            }],
            allPlans: [{
                id: 0,
                date: '',
                description: '',
                type: '',
                distance: 0,
                units: '',
                notes: '',
                userId: 0
            }],
            allWorkouts: [{
                id: 0,
                timestamp: '',
                description: '',
                distance: 0,
                units: '',
                movingtime: 0,
                elapsedtime: 0,
                elevationgain: 0,
                startlocation: [],
                endlocation: [],
                temp: 0,
                humidity: 0,
                aqi: 0,
                notes: '',
                sourceid: '',
                userId: 0
            }],
            selectedSlotInfo: {
                start: new Date(),
                end: new Date()
            }
        };
    }

    createPlanToggle = () => {
        if (this.state.selectedSlotInfo.start) {
            let tmpDate = new Date(this.state.selectedSlotInfo.start);
            this.setState({
                selectedSlotInfo: {
                    start: tmpDate.toISOString(),
                    end: tmpDate.toISOString()
                }
            })
        } else {
            let tmpDate = new Date();
            this.setState({
                selectedSlotInfo: {
                    start: tmpDate.toISOString(),
                    end: tmpDate.toISOString()
                }
            })
        }

        this.setState(prevState => ({
            createPlanModal: !prevState.createPlanModal
        }));

        if (this.state.choiceModal) {
            this.setState(prevState => ({
                choiceModal: !prevState.choiceModal
            }));
        };
    }

    viewPlanToggle = () => {
        this.setState(prevState => ({
            viewPlanModal: !prevState.viewPlanModal
        }));

        if (this.state.choiceModal) {
            this.setState(prevState => ({
                choiceModal: !prevState.choiceModal
            }));
        };
    }

    fetchPlan = (id: number) => {
        fetch(`${APIURL}/plan/get/${id}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((plan) => {
            // console.log(plan)
            this.setState({ 
                selectedPlan: {
                    id: plan.id,
                    date: plan.date,
                    description: plan.description,
                    type: plan.type,
                    distance: plan.distance,
                    units: plan.units,
                    notes: plan.notes,
                    userId: plan.userId
                }
            });
        });
        this.viewPlanToggle();
    }

    createWorkoutToggle = () => {
        let tmpDate = new Date().toISOString().split("T")[0] + "T00:00";
        if (!this.state.selectedSlotInfo.start) {
        this.setState({
            selectedSlotInfo: {
                start: tmpDate,
                end: tmpDate
            }
        });
        }
        this.setState(prevState => ({
            createWorkoutModal: !prevState.createWorkoutModal
        }));
        
        if (this.state.choiceModal) {
            this.setState(prevState => ({
                choiceModal: !prevState.choiceModal
            }));
        };
    }

    viewWorkoutToggle = () => {
        this.setState(prevState => ({
            viewWorkoutModal: !prevState.viewWorkoutModal
        }));
        
        if (this.state.choiceModal) {
            this.setState(prevState => ({
                choiceModal: !prevState.choiceModal
            }));
        };
    }

    fetchWorkout = (id: number) => {
        fetch(`${APIURL}/workout/get/${id}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workout) => {
            // console.log(workout);
            // console.log(workout.timestamp);
            // console.log(workout.timestamp.replace('Z', ''))
            // console.log(new Date(new Date(workout.timestamp).toString().split('GMT')[0]+' UTC').toISOString().replace('Z', '').toString());
            this.setState({ 
                selectedWorkout: {
                    id: workout.id,
                    timestamp: workout.timestamp.replace('Z', ''), 
                    description: workout.description,
                    distance: workout.distance,
                    units: workout.units,
                    movingtime: workout.movingtime,
                    elapsedtime: workout.elapsedtime,
                    elevationgain: workout.elevationgain,
                    startlocation: workout.startlocation,
                    endlocation: workout.endlocation,
                    temp: workout.temp,
                    humidity: workout.humidity,
                    aqi: workout.aqi,
                    notes: workout.notes,
                    sourceid: workout.sourceid,
                    userId: workout.userId
                }
            });
        });
        this.viewWorkoutToggle();
    }

    newEntry = ({ start, end } : slotInfo) => {
        var tmpDate = new Date(start);
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        this.setState({
            selectedSlotInfo: {
                start: tmpDate.toISOString().split(":")[0] + ":" + tmpDate.toISOString().split(":")[1],
                end: tmpDate.toISOString().split(":")[0] + ":" + tmpDate.toISOString().split(":")[1]
            }
        });
        this.choiceToggle();
    }

    choiceToggle = () => {
        this.setState(prevState => ({
            choiceModal: !prevState.choiceModal
        }));
    }

    importToggle = () => {
        this.setState(prevState => ({
            importModal: !prevState.importModal
        }));
    }

    fetchAllPlans = () => {
        fetch(`${APIURL}/plan/${this.state.viewAsUser}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((plans) => {
            // console.log(plans);
            var tmpPlans = this.state.events;
            this.setState({ allPlans: plans });
            plans.forEach((plan: planEntry) =>{
                var tmpDate = new Date(plan.date);
                tmpDate.setHours(tmpDate.getHours() + (new Date().getTimezoneOffset() / 60));
                var newEvent = {
                    start: tmpDate.toISOString(),
                    end: tmpDate.toISOString(),
                    title: plan.description,
                    type: "plan",
                    id: plan.id
                }
                tmpPlans.push(newEvent);
            });

            this.setState({ events: tmpPlans });
        })

    };

    fetchAllWorkouts = () => {
        fetch(`${APIURL}/workout/${this.state.viewAsUser}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workouts) => {
            // console.log(workouts);
            var tmpWorkouts = this.state.events;
            this.setState({ allWorkouts: workouts })
            workouts.forEach((workout: workoutEntry) =>{
                var tmpDate = new Date(workout.timestamp);
                tmpDate.setHours(tmpDate.getHours() + (new Date().getTimezoneOffset() / 60));
                console.log(`tmpdate: ${tmpDate}`);
                console.log(`workoutdate: ${workout.timestamp}`)
                var newEvent = {
                    start: new Date(new Date(workout.timestamp).toString().split('GMT')[0]+' UTC').toISOString().replace('Z', '').toString(),
                    end: new Date(new Date(workout.timestamp).toString().split('GMT')[0]+' UTC').toISOString().replace('Z', '').toString(),
                    // start: tmpDate.toISOString(),
                    // end: tmpDate.toISOString(),
                    title: workout.description,
                    type: "workout",
                    id: workout.id
                }
                tmpWorkouts.push(newEvent);
            });
            this.setState({ events: tmpWorkouts });
        })

    };

    handleSelect = (event: calendarEvent) => {
        if (event.type === "plan") {
            this.fetchPlan(event.id);
        } else {
            this.fetchWorkout(event.id);
        }
    }

    getUserSettings = () => {
        fetch(`${APIURL}/user/${this.props.userid}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((user) => {
            // console.log(user);
            if (user.coach) {
                if (user.team.runners) {
                    // Before you begin, add current user to runnerInfo array so they can select themselves to view
                    this.setState({ runnerInfo: [...this.state.runnerInfo, { name: user.firstname + " " + user.lastname, id: parseInt(this.props.userid) }]})
                    user.team.runners.forEach((runnerid : number) => {
                        // console.log(`${APIURL}/user/${runnerid}`)
                        fetch(`${APIURL}/user/${runnerid}`, {
                            method: 'GET',
                            headers: new Headers ({
                                'Content-Type': 'application/json',
                                'Authorization': this.props.token
                            })
                        })
                        .then((response) => response.json())
                        .then((runner) => { 
                            this.setState({ runnerInfo: [...this.state.runnerInfo, { name: runner.firstname + " " + runner.lastname, id: runner.id }]})
                        })
                    })
                    this.setState({
                        userSettings: {
                            userid: user.id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            defaultUnits: user.defaultunits,
                            weekStart: user.weekstart,
                            coach: user.coach,
                            runners: user.team.runners
                        }
                    })
                }
            } else {
                this.setState({
                    userSettings: {
                        userid: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        defaultUnits: user.defaultunits,
                        weekStart: user.weekstart,
                        coach: user.coach,
                    }
                })
            }
        })
    }

    updateViewAsUser = (id: number) => {
        this.setState({ viewAsUser: id }, this.updateEvents)
    }

    componentDidMount() {
        this.setState({ viewAsUser : parseInt(this.props.userid) }, this.updateEvents);
        this.getUserSettings();
    }

    updateSelectedPlan = (updatedPlan: planEntry) => {
        this.setState({ 
            selectedPlan: {
                id: updatedPlan.id,
                date: updatedPlan.date,
                description: updatedPlan.description,
                type: updatedPlan.type,
                distance: updatedPlan.distance,
                units: updatedPlan.units,
                notes: updatedPlan.notes,
                userId: updatedPlan.userId
            }
        })
    }

    updateSelectedWorkout = (updatedWorkout: workoutEntry) => {
        var tmpDate = new Date(updatedWorkout.timestamp);
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        // console.log(updatedWorkout.timestamp);
        // console.log(tmpDate.toISOString().slice(0, -5));
        this.setState({ 
            selectedWorkout: {
                id: updatedWorkout.id,
                timestamp: tmpDate.toISOString().slice(0, -5),
                description: updatedWorkout.description,
                distance: updatedWorkout.distance,
                units: updatedWorkout.units,
                elapsedtime: updatedWorkout.elapsedtime,
                notes: updatedWorkout.notes,
                movingtime: this.state.selectedWorkout.movingtime,
                elevationgain: this.state.selectedWorkout.elevationgain,
                startlocation: this.state.selectedWorkout.startlocation,
                endlocation: this.state.selectedWorkout.endlocation,
                temp: this.state.selectedWorkout.temp,
                humidity: this.state.selectedWorkout.humidity,
                aqi: this.state.selectedWorkout.aqi,
                sourceid: this.state.selectedWorkout.sourceid,
                userId: this.state.selectedWorkout.userId
            }
        })
    }

    updateSelectedPlanSlotInfo = (slotDateTime: Date) => {
        // console.log(`Passed Value: ${slotDateTime}`);
        var tmpDate = new Date(slotDateTime);
        tmpDate.setHours(tmpDate.getHours() + (new Date().getTimezoneOffset() / 60));
        // console.log(`tmpDate: ${tmpDate}`);
        if (slotDateTime) {
            this.setState({
                selectedSlotInfo: {
                    start: tmpDate.toISOString(),
                    end: tmpDate.toISOString()
                }
            })
        };
    }

    updateSelectedWorkoutSlotInfo = (slotDateTime: stringOrDate) => {
        var tmpDate = new Date(slotDateTime);
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        this.setState({
            selectedSlotInfo: {
                start: tmpDate.toISOString().split(":")[0] + ":" + tmpDate.toISOString().split(":")[1],
                end: tmpDate.toISOString().split(":")[0] + ":" + tmpDate.toISOString().split(":")[1],
            }
        })
    }

    updateUserSettings = (newSettings: userInfo) => {
        this.setState({
            userSettings: {
                userid: newSettings.userid,
                firstname: newSettings.firstname,
                lastname: newSettings.lastname,
                email: newSettings.email,
                defaultUnits: newSettings.defaultUnits,
                weekStart: newSettings.weekStart,
                coach: newSettings.coach,
            }
        })
    }

    updateEvents = () => {
        this.setState({events: []});
        this.fetchAllPlans();
        this.fetchAllWorkouts();
    }


    componentDidUpdate(prevProps : MainProps, prevState: MainState) {
    }

    render() { 
        const localizer = momentLocalizer(moment);

        return (
            <div className="main-wrapper">
                <ImportModal token={this.props.token} importToggle={this.importToggle} importModal={this.state.importModal} updateEvents={this.updateEvents} />
                <CreatePlanModal token={this.props.token} viewAsUser={this.state.viewAsUser} userSettings={this.state.userSettings} createPlanToggle={this.createPlanToggle} createPlanModal={this.state.createPlanModal} updateSelectedSlot={this.updateSelectedPlanSlotInfo} selectedSlotInfo={this.state.selectedSlotInfo} updateEvents={this.updateEvents}/>
                <CreateWorkoutModal token={this.props.token} viewAsUser={this.state.viewAsUser} userSettings={this.state.userSettings} createWorkoutToggle={this.createWorkoutToggle} createWorkoutModal={this.state.createWorkoutModal} updateSelectedSlot={this.updateSelectedWorkoutSlotInfo} selectedSlotInfo={this.state.selectedSlotInfo} updateEvents={this.updateEvents}/>
                <ViewPlanModal token={this.props.token} viewAsUser={this.state.viewAsUser} userSettings={this.state.userSettings} viewPlanToggle={this.viewPlanToggle} viewPlanModal={this.state.viewPlanModal} selectedPlan={this.state.selectedPlan} updateSelectedPlan={this.updateSelectedPlan} updateEvents={this.updateEvents} />
                <ViewWorkoutModal token={this.props.token} viewAsUser={this.state.viewAsUser} userSettings={this.state.userSettings} viewWorkoutToggle={this.viewWorkoutToggle} viewWorkoutModal={this.state.viewWorkoutModal} selectedWorkout={this.state.selectedWorkout} updateSelectedWorkout={this.updateSelectedWorkout} updateEvents={this.updateEvents} />
                <ChoiceModal choiceToggle={this.choiceToggle} createWorkoutToggle={this.createWorkoutToggle} createPlanToggle={this.createPlanToggle} choiceModal={this.state.choiceModal} />                
                
                <div className="main-inner">
                    <div className="calendar-wrapper">
                        <Calendar
                            selectable
                            popup
                            culture='en-US'
                            localizer={localizer}
                            defaultView={'month'}
                            views={['month']}
                            toolbar={true}
                            events={this.state.events}
                            eventPropGetter={
                                event => ({
                                    className: event.type
                                })
                            }
                            startAccessor="start"
                            endAccessor="end"
                            // onSelectSlot?: (slotInfo: { start: stringOrDate, end: stringOrDate, slots: Date[] | string[], action: 'select' | 'click' | 'doubleClick' }) => void;
                            // onDoubleClickEvent?: (event: Object, e: React.SyntheticEvent<HTMLElement>) => void;
                            // onSelectEvent?: (event: Object, e: React.SyntheticEvent<HTMLElement>) => void;
                            onSelectEvent={(event) => this.handleSelect(event)}
                            onSelectSlot={({start, end}) => {this.newEntry({start, end})}}
                            onNavigate={(date, view) => {
                                this.setState({
                                    navigateDate: date
                                });
                            }}
                            style={{ height: 700 }}
                        />
                    </div>
                </div>

                <Sidebar token={this.props.token} userid={this.props.userid} navigateDate={this.state.navigateDate} updateUserSettings={this.updateUserSettings} userSettings={this.state.userSettings} runnerInfo={this.state.runnerInfo} viewAsUser={this.state.viewAsUser} updateViewAsUser={this.updateViewAsUser} importToggle={this.importToggle} importModal={this.state.importModal} createPlanToggle={this.createPlanToggle} createPlanModal={this.state.createPlanModal} createWorkoutToggle={this.createWorkoutToggle} createWorkoutModal={this.state.createWorkoutModal} allWorkouts={this.state.allWorkouts} allPlans={this.state.allPlans}/>
            </div>
        );
    }
}
 
export default Main;