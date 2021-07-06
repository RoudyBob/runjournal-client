import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import _ from "lodash";

export interface StravaRedirectProps extends RouteComponentProps{

}
 
export interface StravaRedirectState {
    
}
 
class StravaRedirect extends React.Component<StravaRedirectProps, StravaRedirectState> {
    constructor(props: StravaRedirectProps) {
        super(props);
        this.state = {};
    }

    authGetter = async (authTok: string) => {
        // console.log(`in testAuthGetter`)
        try {
            let response = await fetch(
            `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&code=${authTok}&grant_type=authorization_code`, {
                method: 'POST'
            });
            let tokenData = await response.json();
            // console.log(tokenData);
            return tokenData;
        } catch (error) {
            console.log(error);
        }
    };

    getUserData = async (athleteid: string, accessToken: string) => {
        // console.log(`in getUserData`)
        try {
            let response = await fetch(
                `https://www.strava.com/api/v3/athletes/${athleteid}/stats`, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': `Bearer ${accessToken}`
                    })
            });
            let userData = await response.json();
            return userData;
        } catch (error) {
            console.log(error);
        }
    };

    componentDidMount() {
        const authenticate = async () => {
            const { history, location } = this.props;
            try {
                // If not redirected to Strava, return to home
                if (_.isEmpty(location)) {
                    return history.push("/");
                }

                // Save the Auth Token to the Store (it's located under 'search' for some reason)
                var stravaAuthToken = (location.search).split("&")[1].slice(5);

                // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
                let stravaTokens = await this.authGetter(stravaAuthToken);
                // let accessToken = stravaTokens.access_token;
                // let athleteId = stravaTokens.athlete.id;


                // const stravaUser = await this.getUserData(athleteId, accessToken);
                // console.log(stravaUser);
                // this.setUserActivities(user);
                // const userRuns = await this.getUserRuns(athleteId, accessToken);
                // console.log(userRuns);
                // console.log(stravaTokens.access_token)
                // Once complete, go to display page

                localStorage.setItem('stravaToken', stravaTokens.access_token,);
                localStorage.setItem('stravaId', stravaTokens.athlete.id);
                history.push("/")
            } catch (error) {
                history.push("/");
            }
        };
        authenticate();
    }

    render() {
        return(<div></div>);
    };
}
 
export default withRouter(StravaRedirect);