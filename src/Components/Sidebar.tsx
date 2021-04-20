import * as React from 'react';
import { Component } from 'react';

export interface SidebarProps {
    
}
 
export interface SidebarState {
    
}
 
class Sidebar extends React.Component<SidebarProps, SidebarState> {
    // constructor(props: SidebarProps) {
    //     // super(props);
    //     // this.state = { :  };
    // }

    render() { 
        return (
            <div>Hello from Sidebar</div>
        );
    }
}
 
export default Sidebar;