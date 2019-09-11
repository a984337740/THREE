import * as THREE from '../../build/three.module.js';
import { CarControls } from '../../threeMaster/jsm/misc/CarControls';
import { DRACOLoader } from '../../threeMaster/jsm/loaders/DRACOLoader';
import { GLTFLoader } from '../../threeMaster/jsm/loaders/GLTFLoader';
import { PMREMCubeUVPacker } from '../../threeMaster/jsm/pmrem/PMREMCubeUVPacker';
import { PMREMGenerator } from '../../threeMaster/jsm/pmrem/PMREMGenerator';
import { FormControl, FormHelperText, NativeSelect, Typography , Checkbox } from '@material-ui/core';
 import * as React from 'react';
 import  './flygame.css';

 interface IProps {
    a: any ; 
 } 
   
 class FlyGame extends React.Component<any, any> {

    private camera ;
    private scene ;
    private renderer ; 
    private WIDTH;
    private HEIGHT;
    private clock = new THREE.Clock(); 
    private container;  
    
    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div>           
                汽车测试   
                <div id = "container" className = "pos">               
                            
                </div>
            </div>
        );
    }
        
}

export default FlyGame;