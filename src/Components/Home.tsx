import * as React from 'react';

export interface HomeProps {
    token: string | null
}
 
export interface HomeState {
    
}
 
class Home extends React.Component<HomeProps, HomeState> {
    // constructor(props: HomeProps) {
    //     super(props);
    //     this.state = { :  };
    // }

    render() { 
        return (
            <div className="homepage">
                <h1>This is the homepage!</h1>
            </div>
        );
    }
}
 
export default Home;