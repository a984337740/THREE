import * as React from 'react';
import { Redirect } from 'react-router-dom';

class Login extends React.Component<any, any> {

    // async componentDidMount() {
    //     const rs = ServiceManager.getService<RemoteService>('RemoteService');
    //     const resp = await rs.login({ mobile: '18888888888', password: '679010' });
  
    // }

    // handleClick = async () => {
    //     const rs = ServiceManager.getService<RemoteService>('RemoteService');
    //     const resp = await rs.login({ mobile: '18888888888', password: '679010' });
    //     this.props.history.push('/home/');
    // }

    render() {
        return (
            // 页面跳转
            <Redirect to={`/home/`} />
        );
    }
}

export default Login;