import * as THREE from '../../build/three.module.js';
import { CarControls } from '../../threeMaster/jsm/misc/CarControls';
import { DRACOLoader } from '../../threeMaster/jsm/loaders/DRACOLoader';
import { GLTFLoader } from '../../threeMaster/jsm/loaders/GLTFLoader';
import { PMREMCubeUVPacker } from '../../threeMaster/jsm/pmrem/PMREMCubeUVPacker';
import { PMREMGenerator } from '../../threeMaster/jsm/pmrem/PMREMGenerator';
import { FormControl, FormHelperText, NativeSelect, Typography , Checkbox } from '@material-ui/core';
 import * as React from 'react';
 import  './carshow.css';
  
interface IProps {
   a: any ; 
} 
  
class CarShow extends React.Component<any, any> {

    private camera ;
    private scene ;
    private renderer ; 
    private stats ; 
    private carModel;
  
    private envMap = null;
    private clock = new THREE.Clock(); 
    private carControls = new CarControls();
    
    private carParts = {
        body: [],
        rim: [],
        glass: [], 
    };

    private damping = 5.0;  
    private distance = 5;
    private cameraTarget = new THREE.Vector3();

    private pmremGenerator;
    private pmremCubeUVPacker;
    constructor(props: IProps) {
        super(props);
        this.carControls.turningRadius = 75;
          
        this.state = {
            followCamera: false ,
            materialsLib : {
                main: [],
                glass: [],
            },
            bodySelectIndex: 0,
            rimsSelectIndex: 0,
            glassSelectIndex: 0,
        };
    }
  
    componentDidMount() {
        this.init();
       
    }
     public async init() {
        const container = document.getElementById('container');

        this.camera = new THREE.PerspectiveCamera(50 , window.innerWidth / window.innerHeight , 0.1 , 200 );
        this.camera.position.set( 3.25, 2.0, - 5 );
        this.camera.lookAt( 0 , 0.5 , 0 );

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xd7cbb1, 1 , 80 );
        console.log(this.scene);
        
        let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 20, 0 );
        // this.scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 20, 10 );
        // this.scene.add( light );

        const urls = [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ];
        let loader = new THREE.CubeTextureLoader();
        loader.setPath( './textures/cube/skyboxsun25deg/');

       await loader.load( urls,  (texture: any) =>  {
            console.log(texture);

            this.scene.background = texture;
            console.log(this.scene);
            this.pmremGenerator = new PMREMGenerator( texture );
            this.pmremGenerator.update( this.renderer );
    
            this.pmremCubeUVPacker = new PMREMCubeUVPacker( this.pmremGenerator.cubeLods );
            this.pmremCubeUVPacker.update( this.renderer );
            console.log(this.pmremCubeUVPacker.CubeUVRenderTarget.texture);
            this.envMap = this.pmremCubeUVPacker.CubeUVRenderTarget.texture;
    console.log(this.envMap);
           this.pmremGenerator.dispose();
            this.pmremCubeUVPacker.dispose();
           
            this.initCar();
            this.initMaterials();

       });
        console.log(loader);

        let grid = new THREE.GridHelper(400 , 40 , 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.depthWrite = false;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.gammaOutput = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        console.log(this.camera);
        console.log(this.renderer);
        container.appendChild( this.renderer.domElement );
        
        window.addEventListener( 'resize', this.onWindowResize , false );
        this.animation();
    }

    private onWindowResize = () => {
        this.camera.aspect = (window.innerWidth / window.innerHeight); 
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(window.innerWidth, window.innerHeight);
        console.log( document.body.clientWidth  , document.body.clientHeight);
    }

     private  initCar() {
        DRACOLoader.setDecoderPath( '/js/libs/draco/gltf/' );

        const loader = new GLTFLoader();
        loader.setDRACOLoader( new DRACOLoader() );
         loader.load( '/models/gltf/ferrari.glb', ( gltf: any ) => {
             
            console.log( gltf.scene.children[ 0 ]);
            this.carModel = gltf.scene.children[ 0 ];
        
            this.carControls.setModel(  this.carModel , null );
        
            this.carModel.traverse(  ( child: any ) => {
        
                if ( child.isMesh ) {

                    child.material.envMap =  this.envMap;        
                }
        
            } );
        
            // shadow
            const texture = new THREE.TextureLoader().load( '/models/gltf/ferrari_ao.png' );
            const shadow = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( 0.655 * 4, 1.3 * 4 ).rotateX( - Math.PI / 2 ),
                new THREE.MeshBasicMaterial( { map: texture, opacity: 0.8, transparent: true } )
            );
            shadow.renderOrder = 2;
            this.carModel.add( shadow );
        
            this.scene.add( this.carModel );
        
            // car parts for material selection
            this. carParts.body.push( this.carModel.getObjectByName( 'body' ) );
        
            this.carParts.rim.push(
                this.carModel.getObjectByName( 'rim_fl' ),
                this.carModel.getObjectByName( 'rim_fr' ),
                this.carModel.getObjectByName( 'rim_rr' ),
                this. carModel.getObjectByName( 'rim_rl' ),
                this.carModel.getObjectByName( 'trim' ),
            );
        
            this.carParts.glass.push(
                this.carModel.getObjectByName( 'glass' ),
             );
        
             this.updateMaterials();
         }) ;
}

    private initMaterials() {
        let materialsLib = {
                main: [
                new THREE.MeshStandardMaterial( { 
                                            color: 0xff4400, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'orange' } ),
                new THREE.MeshStandardMaterial( { 
                                            color: 0x001166, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'blue' } ),
                new THREE.MeshStandardMaterial( {
                                            color: 0x990000, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'red' } ),
                new THREE.MeshStandardMaterial( { 
                                            color: 0x000000, envMap: this.envMap, metalness: 0.9, roughness: 0.5, name: 'black' } ),
                new THREE.MeshStandardMaterial( { 
                                            color: 0xffffff, envMap: this.envMap, metalness: 0.9, roughness: 0.5, name: 'white' } ),
                new THREE.MeshStandardMaterial( { 
                                            color: 0x555555, envMap: this.envMap, envMapIntensity: 2.0, metalness: 1.0, 
                                            roughness: 0.2, name: 'metallic' } ),
                ],
                glass: [

                new THREE.MeshStandardMaterial( { 
                                            color: 0xffffff, envMap: this.envMap, metalness: 1, roughness: 0,
                                            // tslint:disable-next-line: max-line-length
                                            opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'clear' } ),
                new THREE.MeshStandardMaterial( { 
                                            color: 0x000000, envMap: this.envMap, metalness: 1, roughness: 0,
                                             // tslint:disable-next-line: max-line-length
                                            opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'smoked' } ),
                new THREE.MeshStandardMaterial( { 
                                            color: 0x001133, envMap: this.envMap, metalness: 1, roughness: 0,
                                            opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'blue' } ),
                ],
            };
            this.setState({
                materialsLib: materialsLib
            });                    
    }

    private updateMaterials() {
        const e1 = {target: {value: 3}};
        this.handleChange(e1);
        const e2 = {target: {value: 5}};
        this.handleRimsChange(e2);
        const e3 = {target: {value: 0}};
        this.handleGlassChange(e3);
    }
    private animation() {                 
        this.update();
        requestAnimationFrame(() => this.animation());
    }    
    
    private update() {                 
       const delta = this.clock.getDelta();
       const {followCamera} = this.state;
       if ( this.carModel ) {
        this.carControls.update(delta / 3);

           if ( this.carModel.position.length() > 200 ) {
            this.carModel.position.set(0, 0 , 0);
            this.carControls.speed = 0;
           }

           if ( followCamera ) {
            this.carModel.getWorldPosition( this.cameraTarget );
            this.cameraTarget.y = 2.5;
            this.cameraTarget.z += this.distance;

               this.camera.position.lerp( this.cameraTarget , delta * this.damping );
           } else {

               this.carModel.getWorldPosition( this.cameraTarget );
               this.cameraTarget.y += 0.5;

               this.camera.position.set( 3.25, 2.0, - 5 );

           }
           this.camera.lookAt( this.carModel.position );
       }
       this.renderer.render(this.scene , this.camera);
    }    

    handleChange(event: any) {
        console.log(event);
        const bodyMat = this.state.materialsLib.main[ event.target.value ];
        this.setState({
            bodySelectIndex: event.target.value
        });
        this.carParts.body.forEach( part => part.material = bodyMat );
    }
    // 渲染车身颜色下拉列表
    public renderBodyColor() { 
        return (
            <Typography component="span">
            车身颜色：       
            <FormControl className={' '}>
            <NativeSelect
              value={this.state.bodySelectIndex}
              onChange={(event) => this.handleChange(event)}
              name="age"
              className={''}
              inputProps={{ 'aria-label': 'age' }}
            >
                {this.state.materialsLib.main.map( (val , index) => {
                    return(
                        <option value={index} key = {index}>{val.name}</option>
                    );
                })}              
            </NativeSelect>
            <FormHelperText>Body Color</FormHelperText>
          </FormControl>
          </Typography>
        );
    }
    // 细节选择的点击事件
    handleRimsChange(event: any) {
        console.log(event);

        const bodyMat = this.state.materialsLib.main[ event.target.value ];
        this.setState({
            rimsSelectIndex: event.target.value
        });
        this.carParts.rim.forEach( part => part.material = bodyMat );
    }
    // 渲染细节颜色下拉列表
    public renderRimsColor() {
        return (
            <Typography component="span">
            细节颜色：           
            <FormControl className={' '}>
            <NativeSelect
              value={this.state.rimsSelectIndex}
              onChange={(event) => this.handleRimsChange(event)}
              name="age"
              className={''}
              inputProps={{ 'aria-label': 'age' }}
            >
                {this.state.materialsLib.main.map( (val , index) => {
                    return(
                        <option value={index} key = {index}>{val.name}</option>
                    );
                })}              
            </NativeSelect>
            <FormHelperText>Rims Color</FormHelperText>
          </FormControl>
          </Typography>
        );
    }
        // 玻璃选择的点击事件
        handleGlassChange(event: any) {
        console.log(event);

            const bodyMat = this.state.materialsLib.glass[ event.target.value ];
            this.setState({
                glassSelectIndex: event.target.value
            });
            this.carParts.glass.forEach( part => part.material = bodyMat );
        }
        // 渲染玻璃颜色下拉列表
        public renderGlassColor() {
            return (
                <Typography component="span">
                玻璃颜色：       
                <FormControl className={' '}>
                <NativeSelect
                  value={this.state.glassSelectIndex}
                  onChange={(event) => this.handleGlassChange(event)}
                  name="age"
                  className={''}
                  inputProps={{ 'aria-label': 'age' }}
                >
                    {this.state.materialsLib.glass.map( (val , index) => {
                        return(
                            <option value={index} key = {index}>{val.name}</option>
                        );
                    })}              
                </NativeSelect>
                <FormHelperText>Glass Color</FormHelperText>
              </FormControl>
              </Typography>
            );
        }

        handleCheckChange(event: any) {
            const val = !this.state.followCamera;
            this.setState({
                followCamera: val,
            });
        }
        renderCheckBox() {
            return(
                <Checkbox
                checked={this.state.followCamera}
                onChange= {(event) => this.handleCheckChange(event)}
                value="checkedA"
                inputProps={{
                  'aria-label': 'primary checkbox',
                }}
              />
            );
        }
    public render() {
        return(
            <div>           
                    汽车测试   
                 {this.renderBodyColor()}  
                 {this.renderRimsColor()}
                 {this.renderGlassColor()}
                 {this.renderCheckBox()}
                <div id = "container" className = "pos">               
                            
                            </div>
            </div>
           
        );
    }
}

export default  CarShow ;