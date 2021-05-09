import * as React from 'react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
    token: string | null
}
 
export interface HeaderState {

}
 
class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
        this.state = {};
    }

    render() { 
        return (
            <div className="header">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                        <div className="navbar-home">
                            {this.props.token ? <Link className="navbar-brand" to={"/main"}><img src="http://localhost:3001/runjournal.png" alt="RunJournal Logo" /></Link> : <Link className="navbar-brand" to={"/"}><img src="http://localhost:3001/runjournal.png" alt="RunJournal Logo" /></Link>}
                        </div>
                        <div className="collapse navbar-collapse" id="main-navbar">
                            <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                {this.props.token ? <Link className="nav-link" to={"/logout"}>Logout</Link> : <Link className="nav-link" to={"/login"}>Login</Link>}
                            </li>
                            </ul>
                        </div>
                </nav>
            </div>
        );
    }
}
 
export default Header;