import * as React from 'react';

import Sidebar from './Sidebar';

export interface MainProps {
    token: string
}
 
export interface MainState {

}
 
class Main extends React.Component<MainProps, MainState> {
    // constructor(props: MainProps) {
    //     // super(props);
    //     // this.state = { token: props.token  };
    // }

    render() { 
        return (
            <div className="main-wrapper">
                <div className="main-inner">
                    <h1>Hello from Main!</h1>
                    <p>{this.props.token}</p>
                </div>
                <Sidebar />
            </div>
        );
    }
}
 
export default Main;