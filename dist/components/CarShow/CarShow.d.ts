import * as React from 'react';
import './carshow.css';
interface IProps {
    a: any;
}
declare class CarShow extends React.Component<any, any> {
    private camera;
    private scene;
    private renderer;
    private stats;
    private carModel;
    private envMap;
    private clock;
    private carControls;
    private carParts;
    private damping;
    private distance;
    private cameraTarget;
    private pmremGenerator;
    private pmremCubeUVPacker;
    constructor(props: IProps);
    componentDidMount(): void;
    init(): Promise<void>;
    private onWindowResize;
    private initCar;
    private initMaterials;
    private updateMaterials;
    private animation;
    private update;
    handleChange(event: any): void;
    renderBodyColor(): JSX.Element;
    handleRimsChange(event: any): void;
    renderRimsColor(): JSX.Element;
    handleGlassChange(event: any): void;
    renderGlassColor(): JSX.Element;
    handleCheckChange(event: any): void;
    renderCheckBox(): JSX.Element;
    render(): JSX.Element;
}
export default CarShow;
