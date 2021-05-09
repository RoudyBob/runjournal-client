import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface LogoutProps extends RouteComponentProps {
    clearToken: Function
}
 
export interface LogoutState {
    
}
 
class Logout extends React.Component<LogoutProps, LogoutState> {
    // constructor(props: LogoutProps) {
    //     super(props);
    //     this.state = { :  };
    // }

    componentDidMount () {
        this.props.clearToken();
        this.props.history.push('/');
    }
    
    render() { 
        return (<div></div>);
    }
}
 
export default withRouter(Logout);