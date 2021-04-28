import * as React from 'react';
import { ProSidebar, SidebarHeader, Menu, MenuItem, SidebarContent } from 'react-pro-sidebar';
import { FaRunning, FaCalendarAlt, FaCloudDownloadAlt } from "react-icons/fa";
import PlanModal from './PlanModal';
import './Sidebar.scss';

export interface SidebarProps {
    
}
 
export interface SidebarState {
    
}
 
class Sidebar extends React.Component<SidebarProps, SidebarState> {
    // constructor(props: SidebarProps) {
    //     // super(props);
    //     // this.state = { :  };
    // }

    handleMenuClick = () => {
        console.log('clicked');
        <PlanModal className={"planentry"} buttonLabel={"Click Me"} />
    }

    render() { 
        return (
            <div id="sidebar">
                <ProSidebar>
                    <Menu iconShape="square">
                        <MenuItem icon={<FaCalendarAlt />} onClick={this.handleMenuClick}>Create Plan Entry</MenuItem>
                        <MenuItem icon={<FaRunning />}>Record Workout</MenuItem>
                        <MenuItem icon={<FaCloudDownloadAlt />}>Import Workout</MenuItem>
                    </Menu>
                    <SidebarHeader>
                        <div className="monthlystatsheader">
                            <h5>Monthly Stats</h5>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <div className="monthlystatscontent">
                            <p>Miles: 134</p>
                            <p>Time: 6h4m</p>
                            <p>Elevation: 2600ft</p>
                        </div>
                    </SidebarContent>
                    <SidebarHeader>
                        <div className="goalheader">
                            <h5>Goal Countdown</h5>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <div className="goalcontent">
                            <p>Months: 3</p>
                            <p>Weeks: 2</p>
                            <p>Days: 5</p>
                        </div>
                    </SidebarContent>
                </ProSidebar>
            </div>
            
        );
    }
}
 
export default Sidebar;