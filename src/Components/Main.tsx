import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
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
    userid: string | null
}
 
export interface MainState {
    createPlanModal: boolean,
    viewPlanModal: boolean,
    selectedPlan: {
        id: number,
        date: string,
        description: string,
        type: string,
        distance: number,
        units: string,
        notes: string
    }
    createWorkoutModal: boolean,
    viewWorkoutModal: boolean,
    selectedWorkout: {
        id: number,
        timestamp: string,
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
    importModal: boolean,
    choiceModal: boolean,
    events: [
        {
            start: Date | null,
            end: Date | null,
            title: string,
            type: string,
            id: Number,
            allDay?: boolean,
            resource?: any
        }
    ],
    description: string
}

export interface planEvent {
    date: Date, 
    description: string,
    id: Number
}

export interface workoutEvent {
    timestamp: Date, 
    description: string,
    id: Number
}

export interface calendarEvent {
    start: Date | null,
    end: Date | null,
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
            description: ''
        };
    }

    createPlanToggle = () => {
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
                    timestamp: workout.timestamp.toString().replace('Z', ''), //HTML input requires removing Z
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

    choiceToggle = () => {
        this.setState(prevState => ({
            choiceModal: !prevState.choiceModal
        }));
    }

    fetchPlans = () => {
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
            plans.forEach((plan: planEvent) =>{
                var newEvent = {
                    start: new Date(plan.date),
                    end: new Date(plan.date),
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

    fetchWorkouts = () => {
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
            workouts.forEach((workout: workoutEvent) =>{
                var newEvent = {
                    start: new Date(workout.timestamp),
                    end: new Date(workout.timestamp),
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

    componentDidMount() {
        this.fetchPlans();
        this.fetchWorkouts();
    }

    render() { 
        const localizer = momentLocalizer(moment);

        return (
            <div className="main-wrapper">
                <CreatePlanModal token={this.props.token} createPlanToggle={this.createPlanToggle} createPlanModal={this.state.createPlanModal} />
                <CreateWorkoutModal token={this.props.token} createWorkoutToggle={this.createWorkoutToggle} createWorkoutModal={this.state.createWorkoutModal} />
                <ViewPlanModal token={this.props.token} viewPlanToggle={this.viewPlanToggle} viewPlanModal={this.state.viewPlanModal} selectedPlan={this.state.selectedPlan} />
                <ViewWorkoutModal token={this.props.token} viewWorkoutToggle={this.viewWorkoutToggle} viewWorkoutModal={this.state.viewWorkoutModal} selectedWorkout={this.state.selectedWorkout} />
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
                            onSelectEvent={(event) => this.handleSelect(event)}
                            onSelectSlot={this.choiceToggle}
                            style={{ height: 750 }}
                        />
                    </div>
                </div>

                <Sidebar createPlanToggle={this.createPlanToggle} createPlanModal={this.state.createPlanModal} createWorkoutToggle={this.createWorkoutToggle} createWorkoutModal={this.state.createWorkoutModal} />
            </div>
        );
    }
}
 
export default Main;