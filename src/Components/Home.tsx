import * as React from 'react';
import IMGURL from '../Helpers/environment';


export interface HomeProps {
    token: string | null,
}
 
export interface HomeState {
    
}
 
class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }

    renderImg = (filename: string, altText: string, width: string) => {
        let url = `${IMGURL}/${filename}`
        return (
            <img src={url} alt={altText} width={width} />
        )
    }

    render() { 
        return (
            <div className="homepage">
                <div className="title">
                    <h1>Introducing...</h1>
                    {this.renderImg("runjournal.png", "Run Journal Logo", "352")}
                </div>
                <div className="content">
                    <h4>What is RunJournal?</h4>
                    <p>Most runners have heard that it's smart to have a solid plan and follow that plan as closely as then can if they want to become stronger over time and have success in any sort of competitive event. The challenge with training plans for runners is that they are complicated to build and manage. There are applications and web services like Garmin, Strava, and TrainingPeaks which deliver all sorts of functionality but which are expensive and complicated to use. Put off by this, some runners resort to paper training logs or very simple spreadsheets to track their weekly mileage goals and their workouts which is cumbersome to manage.</p>
                    <figure>
                        {this.renderImg("sheets.png", "screenshot of a running plan in Google Sheets", "400")}
                        <figcaption>Look familiar? Way too much work!</figcaption>
                    </figure>
                    {/* <p>Users of RunJournal are able to easily build a training plan of their own creation, one they borrow from a fellow runner, or even one provided to them by their coach. RunJournal will help them track their workouts and progress towards the goals they have set for themselves. </p> */}
                    <h4>The Runner</h4>
                    <p>As a runner, a user can use the app to set future goals, create training plans and keep a journal of their workouts including their own notes about the effort as well as information pulled from various sources about temperature, humidity, air quality, etc. The application will provide guidance around some basic training plan concepts like week over week volume increases and help them keep track of how much time they have until their event.</p>
                    <h4>The Coach</h4>
                    <p>As a coach, a user can use the app to request permission from a runner to view and edit their training plan. Once the runner has granted permission to the coach, that user can view that runner's plan and workouts or even create a plan for them to follow and track progress.</p>
                </div>
            </div>
        );
    }
}
 
export default Home;