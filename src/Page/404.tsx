import * as React from 'react';
import { Router } from 'react-router-dom';

class NoMatch extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div>
                404
            </div>
        );
    }
}

export default NoMatch;