import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import NotMatch from './404';

class Layout extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <Switch>            
                <Route exact path="/" component = {Login}/>
                <Route  path="/home" component = {Home}/>
                <Route component={NotMatch} />
           </Switch>
        );
    }
}

export default Layout;