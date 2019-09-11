import * as React from 'react';
import { Route } from 'react-router-dom';
import { Paper , Button } from '@material-ui/core';
import { CarShow , FlyGame , RasyCaster , Naruto } from '../compontents';
class Home extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    jumpComponent(com: string) {
        this.props.history.push('/' + com);
    }
    render() {
        return(
            <div>
                <Paper style={{
                    position: 'fixed', left: '0', bottom: '0',
                    boxShadow: '0 0 0 0', width: '100%'
                }}>
                    置放组件 固定位置 

                    <Button variant="outlined" color="secondary" 
                    onClick={ () => this.jumpComponent('home/')}>首页</Button>

                    <Button variant="outlined" color="secondary" 
                    onClick={ () => this.jumpComponent('home/carshow')}>汽车展示</Button>

                    <Button variant="outlined" color="secondary"
                    onClick={() => this.jumpComponent('home/flygame')}>飞行游戏</Button>

                    <Button variant="outlined" color="secondary"
                    onClick={() => this.jumpComponent('home/reasycaster')}>射线点击功能案例</Button>
    
                    <Button variant="outlined" color="secondary"
                    onClick={() => this.jumpComponent('home/naruto')}>鸣人控制</Button>

                </Paper>

                    <Route path="/home/carshow" component={CarShow} />
                    <Route path="/home/flygame" component={FlyGame} />
                    <Route path="/home/reasycaster" component={RasyCaster} />
                    <Route path="/home/naruto" component={Naruto} />

            </div>
        );
    }
}

export default Home;