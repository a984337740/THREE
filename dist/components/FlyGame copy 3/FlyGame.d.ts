import * as React from 'react';
import './flygame.css';
interface IProps {
    a: any;
}
declare class FlyGame extends React.Component<any, any> {
    private camera;
    private scene;
    private renderer;
    private WIDTH;
    private HEIGHT;
    private clock;
    private container;
    constructor(props: IProps);
    render(): JSX.Element;
}
export default FlyGame;
