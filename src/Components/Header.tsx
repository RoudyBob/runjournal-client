import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
    
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
            <div>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <Link className="navbar-brand" to={"/"}>RunJournal.fit</Link>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/sign-in"}>Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
 
export default Header;