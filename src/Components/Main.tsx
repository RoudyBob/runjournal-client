import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Sidebar from './Sidebar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export interface MainProps {
    token: string
}
 
export interface MainState {
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
            events: [
                {
                    start: moment().toDate(),
                    end: moment().add(1, "days").toDate(),
                    title: "Some title"
                }
            ]
        };
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
                            onSelectSlot={this.handleSelect}
                            style={{ height: 500 }}
                        />
                    </div>
                </div>
                <Sidebar />
            </div>
        );
    }
}
 
export default Main;