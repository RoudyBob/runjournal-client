import * as React from 'react';
import { Calendar, momentLocalizer, stringOrDate } from 'react-big-calendar'
import moment from 'moment'
import Sidebar from './Sidebar';
import CreatePlanModal from './CreatePlanModal';
import CreateWorkoutModal from './CreateWorkoutModal';
import ViewPlanModal from './ViewPlanModal';
import ViewWorkoutModal from './ViewWorkoutModal';
import ImportModal from './ImportModal';
import ChoiceModal from './ChoiceModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import APIURL from '../Helpers/environment';

export interface MainProps {
    token: string,
    userid: string | null,
}
 
export interface MainState {
    userSettings: userInfo,
    createPlanModal: boolean,
    viewPlanModal: boolean,
    selectedPlan: planEntry,
    createWorkoutModal: boolean,
    viewWorkoutModal: boolean,
    selectedWorkout: workoutEntry,
    importModal: boolean,
    choiceModal: boolean,
    events: Array<calendarEvent>,
    selectedSlotInfo: slotInfo
}

export interface userInfo {
    defaultUnits: string,
    weekStart: string
}

export interface planEntry {
    id: number,
    date: stringOrDate,
    description: string,
    type: string,
    distance: number,
    units: string,
    notes: string
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
    notes: string
}

export interface calendarEvent {
    start: stringOrDate | null,
    end: stringOrDate | null,
    title: string,
    type: string,
    id: Number,
    allDay?: boolean,
    resource?: any
}

class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = { 
            userSettings: {
                defaultUnits: '',
                weekStart: ''
            },
            createPlanModal: false,
            viewPlanModal: false,
            selectedPlan: {
                id: 0,
                date: '',
                description: '',
                type: '',
                distance: 0,
                units: '',
                notes: ''
            },
            createWorkoutModal: false,
            viewWorkoutModal: false,
            selectedWorkout: {
                id: 0,
                timestamp: new Date(),
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
                notes: ''
            },
            importModal: false,
            choiceModal: false,
            events: [
                {
                    start: null,
                    end: null,
                    title: '',
                    type: '',
                    id: 0
                }
            ],
            selectedSlotInfo: {
                start: new Date(),
                end: new Date()
            }
        };
    }

    createPlanToggle = () => {
        var tmpDate = new Date();
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        this.setState({
            selectedSlotInfo: {
                start: tmpDate.toISOString(),
                end: tmpDate.toISOString()
            }
        })
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

    fetchPlan = (id: Number) => {
        fetch(`${APIURL}/plan/get/${id}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((plan) => {
            console.log(plan);
            this.setState({ 
                selectedPlan: {
                    id: plan.id,
                    date: plan.date,
                    description: plan.description,
                    type: plan.type,
                    distance: plan.distance,
                    units: plan.units,
                    notes: plan.notes
                }
            });
        });
    }

    createWorkoutToggle = () => {
        var tmpDate = new Date();
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        this.setState({
            selectedSlotInfo: {
                start: tmpDate.toISOString().split(":")[0] + ":" + tmpDate.toISOString().split(":")[1],
                end: tmpDate.toISOString().split(":")[0] + ":" + tmpDate.toISOString().split(":")[1]
            }
        })
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

    fetchWorkout = (id: Number) => {
        fetch(`${APIURL}/workout/get/${id}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workout) => {
            console.log(workout);
            this.setState({ 
                selectedWorkout: {
                    id: workout.id,
                    timestamp: new Date(new Date(workout.timestamp).toString().split('GMT')[0]+' UTC').toISOString().replace('Z', '').toString(), 
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
                    notes: workout.notes
                }
            });
        });
    }

    importToggle = () => {
        this.setState(prevState => ({
            importModal: !prevState.importModal
        }));
    }

    newEntry = ({ start, end } : slotInfo) => {
        if (start) {
            var tmpDate = new Date(start);
            tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
            this.setState({
                selectedSlotInfo: {
                    start: tmpDate.toISOString(),
                    end: tmpDate.toISOString()
                }
            })
        }
        this.setState(prevState => ({
            choiceModal: !prevState.choiceModal
        }));
    }

    choiceToggle = () => {
        this.setState(prevState => ({
            choiceModal: !prevState.choiceModal
        }));
    }

    fetchAllPlans = () => {
        fetch(`${APIURL}/plan/${this.props.userid}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((plans) => {
            var tmpPlans = this.state.events;
            console.log(plans);
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
                // console.log(`${plan.id} starts on ${newEvent.start}`);
            });

            this.setState({ events: tmpPlans });
        })

    };

    fetchAllWorkouts = () => {
        fetch(`${APIURL}/workout/${this.props.userid}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((response) => response.json())
        .then((workouts) => {
            var tmpWorkouts = this.state.events;
            console.log(workouts);
            workouts.forEach((workout: workoutEntry) =>{
                var newEvent = {
                    start: new Date(new Date(workout.timestamp).toString().split('GMT')[0]+' UTC').toISOString().replace('Z', '').toString(),
                    end: new Date(new Date(workout.timestamp).toString().split('GMT')[0]+' UTC').toISOString().replace('Z', '').toString(),
                    title: workout.description,
                    type: "workout",
                    id: workout.id
                }
                tmpWorkouts.push(newEvent);
                // console.log(`${plan.id} starts on ${newEvent.start}`);
            });
            this.setState({ events: tmpWorkouts });
        })

    };

    handleSelect = (event: calendarEvent) => {
        if (event.type === "plan") {
            this.fetchPlan(event.id);
            this.viewPlanToggle();
        } else {
            this.fetchWorkout(event.id);
            this.viewWorkoutToggle();
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
            console.log(user);
            this.setState({
                userSettings: {
                    defaultUnits: user.defaultunits,
                    weekStart: user.weekstart
                }
            })
        })
    }

    componentDidMount() {
        this.fetchAllPlans();
        this.fetchAllWorkouts();
        this.getUserSettings();
        console.log(this.state.events);
        console.log(this.props.token);
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
                notes: updatedPlan.notes
            }
        })
    }

    updateSelectedWorkout = (updatedWorkout: workoutEntry) => {
        this.setState({ 
            selectedWorkout: {
                id: updatedWorkout.id,
                timestamp: updatedWorkout.timestamp,
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
                aqi: this.state.selectedWorkout.aqi
            }
        })
    }

    updateSelectedSlotInfo = (slotDateTime: stringOrDate) => {
        var tmpDate = new Date(slotDateTime);
        tmpDate.setHours(tmpDate.getHours() - (new Date().getTimezoneOffset() / 60));
        this.setState({
            selectedSlotInfo: {
                start: tmpDate.toISOString(),
                end: slotDateTime
            }
        })
    }

    render() { 
        const localizer = momentLocalizer(moment);

        return (
            <div className="main-wrapper">
                <CreatePlanModal token={this.props.token} userSettings={this.state.userSettings} createPlanToggle={this.createPlanToggle} createPlanModal={this.state.createPlanModal} updateSelectedSlot={this.updateSelectedSlotInfo} selectedSlotInfo={this.state.selectedSlotInfo} />
                <CreateWorkoutModal token={this.props.token} userSettings={this.state.userSettings} createWorkoutToggle={this.createWorkoutToggle} createWorkoutModal={this.state.createWorkoutModal} updateSelectedSlot={this.updateSelectedSlotInfo} selectedSlotInfo={this.state.selectedSlotInfo} />
                <ViewPlanModal token={this.props.token} userSettings={this.state.userSettings} viewPlanToggle={this.viewPlanToggle} viewPlanModal={this.state.viewPlanModal} selectedPlan={this.state.selectedPlan} updateSelectedPlan={this.updateSelectedPlan} />
                <ViewWorkoutModal token={this.props.token} userSettings={this.state.userSettings} viewWorkoutToggle={this.viewWorkoutToggle} viewWorkoutModal={this.state.viewWorkoutModal} selectedWorkout={this.state.selectedWorkout} updateSelectedWorkout={this.updateSelectedWorkout} />
                <ImportModal token={this.props.token} importToggle={this.importToggle} importModal={this.state.importModal} />
                <ChoiceModal choiceToggle={this.choiceToggle} createWorkoutToggle={this.createWorkoutToggle} createPlanToggle={this.createPlanToggle} choiceModal={this.state.choiceModal} />

                <div className="main-inner">
                    <div className="calendar-wrapper">
                        <Calendar
                            selectable
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
                            style={{ height: 750 }}
                        />
                    </div>
                </div>

                <Sidebar token={this.props.token} userid={this.props.userid} userSettings={this.state.userSettings} createPlanToggle={this.createPlanToggle} createPlanModal={this.state.createPlanModal} createWorkoutToggle={this.createWorkoutToggle} createWorkoutModal={this.state.createWorkoutModal} />
            </div>
        );
    }
}
 
export default Main;