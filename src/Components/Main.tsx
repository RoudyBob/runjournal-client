import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Sidebar from './Sidebar';
import PlanModal from './PlanModal';
import WorkoutModal from './WorkoutModal';
import ImportModal from './ImportModal';
import ChoiceModal from './ChoiceModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export interface MainProps {
    token: string,

}
 
export interface MainState {
    planModal: boolean,
    workoutModal: boolean,
    importModal: boolean,
    choiceModal: boolean,
    events: [
        {
            start: Date,
            end: Date,
            title: string
        }
    ]
}
 
class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = { 
            planModal: false,
            workoutModal: false,
            importModal: false,
            choiceModal: false,
            events: [
                {
                    start: moment().toDate(),
                    end: moment().add(1, "days").toDate(),
                    title: "Some title"
                }
            ]
        };
    }

    planToggle = () => {
        console.log('In Plan Toggle');
        this.setState(prevState => ({
            planModal: !prevState.planModal
        }));

        if (this.state.choiceModal) {
            this.setState(prevState => ({
                choiceModal: !prevState.choiceModal
            }));
        };
    }

    workoutToggle = () => {
        console.log('In Workout Toggle');
        this.setState(prevState => ({
            workoutModal: !prevState.workoutModal
        }));
        
        if (this.state.choiceModal) {
            this.setState(prevState => ({
                choiceModal: !prevState.choiceModal
            }));
        };
    }

    importToggle = () => {
        console.log('In Import Toggle');
        this.setState(prevState => ({
            importModal: !prevState.importModal
        }));
    }

    choiceToggle = () => {
        console.log('In Choice Toggle');
        this.setState(prevState => ({
            choiceModal: !prevState.choiceModal
        }));
    }

    handleSelect = ({ start, end } : { start: any, end: any }) => {
        const title = window.prompt('New Event Name');
        console.log(title);
        if (title) {
            var tmpArray = this.state.events;
            tmpArray.push({ start, end, title });
            this.setState({ events: tmpArray });
            console.log(this.state.events);
        }
    }


    render() { 
        const localizer = momentLocalizer(moment);

        return (
            <div className="main-wrapper">
                <PlanModal planToggle={this.planToggle} planModal={this.state.planModal} />
                <WorkoutModal workoutToggle={this.workoutToggle} workoutModal={this.state.workoutModal} />
                <ImportModal importToggle={this.importToggle} importModal={this.state.importModal} />
                <ChoiceModal choiceToggle={this.choiceToggle} workoutToggle={this.workoutToggle} planToggle={this.planToggle} choiceModal={this.state.choiceModal} />


                <div className="main-inner">
                    <h1>Hello from Main!</h1>
                    <p>{this.props.token}</p>
                    <div className="calendar-wrapper">
                        <Calendar
                            selectable
                            localizer={localizer}
                            defaultView={'month'}
                            events={this.state.events}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={event => alert(event.title)}
                            onSelectSlot={this.choiceToggle}
                            style={{ height: 500 }}
                        />
                    </div>
                </div>
                <Sidebar planToggle={this.planToggle} planModal={this.state.planModal} workoutToggle={this.workoutToggle} workoutModal={this.state.workoutModal} />
            </div>
        );
    }
}
 
export default Main;