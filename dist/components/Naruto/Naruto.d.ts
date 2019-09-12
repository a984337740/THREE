import * as React from 'react';
import './naruto.css';
interface IProps {
    a: any;
}
declare class Naruto extends React.Component<any, any> {
    private camera;
    private scene;
    private renderer;
    private WIDTH;
    private HEIGHT;
    private clock;
    private container;
    private light;
    private actions;
    private naruto;
    private mixer;
    private controls;
    private defaultPos;
    private dir;
    private attackList;
    private attackCombo;
    private attackInterval;
    private playerState;
    constructor(props: IProps);
    componentDidMount(): void;
    private initThree;
    private initScene;
    private Resize;
    private initEnv;
    private mixers;
    private initObject;
    private initLight;
    private initAnimation;
    private playAnim;
    private addSkills;
    private closeAttack;
    private animation;
    private update;
    private characterMove;
    handleStart(event: any, data: any): void;
    handleDrag(event: any, data: any): void;
    handleStop(event: any, data: Object): void;
    render(): JSX.Element;
}
export default Naruto;
