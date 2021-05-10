import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface StravaRedirectProps extends RouteComponentProps{
    
}
 
export interface StravaRedirectState {
    
}
 
class StravaRedirect extends React.Component<StravaRedirectProps, StravaRedirectState> {
    constructor(props: StravaRedirectProps) {
        super(props);
        this.state = {};
    }

    testAuthGetter = async (authTok: string) => {
        try {
            const response = await fetch(
                `https://www.strava.com/api/v3/oauth/token?client_id=${REACT_APP_CLIENT_ID}&client_secret=${REACT_APP_CLIENT_SECRET}&code=${authTok}&grant_type=authorization_code`, {
                    method: 'POST'
                });
                return response
            } catch (error) {
                console.log(error);
        }
    };

    setUser = (data: any) => {
        return {
            type: "SET_USER",
            payload: data,
        };
    };

    setUserActivities = (data: any) => {
        return {
            type: "SET_USER_ACTIVITIES",
            payload: data,
        };
    };

    getUserData = async (userID: any, accessToken: any) => {
        try {
            const response = await fetch(
                `https://www.strava.com/api/v3/athletes/${userID}/stats`, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': `Bearer ${accessToken}`
                    })
            });
            return response;
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
                var tokens = await this.testAuthGetter(stravaAuthToken);
                this.setUser(tokens);
                if (tokens) {var accessToken = tokens.access_token};
                if (tokens) {var userID = tokens.athlete.id};

                // Axios request to get users info
                const user = await this.getUserData(userID, accessToken);
                this.setUserActivities(user);

                // Once complete, go to display page
                history.push("/");
            } catch (error) {
                history.push("/");
            }
        };
        authenticate();
    }

    render() { 
        return (<div>Loading</div>);
    }
}
 
export default StravaRedirect;