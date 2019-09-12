import * as React from 'react';
import './rasycaster.css';
interface IProps {
    a: any;
}
declare class RasyCaster extends React.Component<any, any> {
    private mouse;
    private camera;
    private scene;
    private renderer;
    private WIDTH;
    private HEIGHT;
    private clock;
    private container;
    private controls;
    constructor(props: IProps);
    componentDidMount(): void;
    init(): void;
    private onWindowResize;
    private onMouseClick;
    private createScene;
    private randomColor;
    private createObject;
    private createLight;
    private createControls;
    private animation;
    private update;
    render(): JSX.Element;
}
export default RasyCaster;
