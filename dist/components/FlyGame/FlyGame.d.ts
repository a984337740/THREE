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
    private hemisphereLight;
    private ambientLight;
    private shadowLight;
    private sea;
    private sky;
    private airplane;
    private mousePos;
    constructor(props: IProps);
    componentDidMount(): void;
    private init;
    private createScene;
    private createLights;
    private createPlane;
    private createSea;
    private createSky;
    private handleMouseMove;
    private animation;
    private update;
    render(): JSX.Element;
}
export default FlyGame;
