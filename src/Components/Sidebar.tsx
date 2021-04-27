import * as React from 'react';

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
            <div className="sidebar-wrapper">
                <h2>Hello from Sidebar</h2>
            </div>
        );
    }
}
 
export default Sidebar;