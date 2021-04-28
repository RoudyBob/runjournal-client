import * as React from 'react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
    token: string | null
}
 
export interface HeaderState {

}
 
class Header extends React.Component<HeaderProps, HeaderState> {
    // constructor(props: HeaderProps) {
    //     super(props);
    //     this.state = { :  };
    // }

    render() { 
        return (
            <div className="header">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        {this.props.token ? <Link className="navbar-brand" to={"/main"}>RunJournal.fit</Link> : <Link className="navbar-brand" to={"/"}>RunJournal.fit</Link>}
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                {this.props.token ? <Link className="nav-link" to={"/logout"}>Logout</Link> : <Link className="nav-link" to={"/login"}>Login</Link>}
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to={"/signup"}>Sign up</Link>
                            </li> */}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
 
export default Header;