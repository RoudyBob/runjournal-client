import * as React from 'react';
import { Component } from 'react';

export interface MainProps {
    sessionToken: any
}
 
export interface MainState {
    
}
 
class Main extends React.Component<MainProps, MainState> {
    // constructor(props: MainProps) {
    //     super(props);
    //     this.state = { :  };
    // }

    render() { 
        return (
            <div>
                <p>Hello from Main!</p>
            </div>
        );
    }
}
 
export default Main;