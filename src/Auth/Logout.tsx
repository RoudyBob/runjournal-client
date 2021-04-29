import * as React from 'react';

export interface LogoutProps {
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
    }
    
    render() { 
        return (
            <div className="logoutpage">
                <h1>You have been logged out.</h1>
            </div>
        );
    }
}
 
export default Logout;