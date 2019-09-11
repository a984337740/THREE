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

 class Sea {
     private geom;
     private mat;
     public mesh;
     constructor() {
        this.geom = new THREE.CylinderGeometry(600, 600, 800 , 40, 10);
        this.geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        this.mat = new THREE.MeshPhongMaterial({
            color: '#0000FF',
            transparent: true,
            opacity: .6,
            flatShading: THREE.FlatShading,
        });
        this.mesh = new THREE.Mesh(this.geom, this.mat);
        this.mesh.receiveShadow = true;    
     }    
}

class Cloud {
    private geom;
    private mat;
    public mesh;
    private nBlocs;
    constructor() {
        this.mesh = new THREE.Object3D();
        this.geom = new THREE.BoxGeometry(20, 20, 20);
    
        this.mat = new THREE.MeshPhongMaterial({
            color: '#F8F8FF',
        });
        this.nBlocs = 3 + Math.floor(Math.random() * 3);
    
        for (let i = 0; i < this.nBlocs; i++) {
            // 实现位置随机，大小随机
            let m = new THREE.Mesh(this.geom, this.mat);
            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;
            let s = .1 + Math.random() * .9;
            m.scale.set(s, s, s);
    
            m.castShadow = true;
            m.receiveShadow = true;
    
            this.mesh.add(m);
        }
    }    
}

class Sky  {
    private geom;
    private mat;
    public mesh = new THREE.Object3D();
    private nBlocs;
    private nClouds = 20;
    private stepAngle = Math.PI * 2 / this.nClouds;
    constructor() {
        for (let i = 0; i < this.nClouds; i++) {
            let c = new Cloud();
            let a = this.stepAngle * i;
            let h = 750 + Math.random() * 200;
            c.mesh.position.y = Math.sin(a) * h;
            c.mesh.position.x = Math.cos(a) * h;
            c.mesh.rotation.z = - Math.PI / 2 + a;
            c.mesh.position.z = -50 - Math.random() * 400;
            let s = 1 + Math.random() * 2;
            c.mesh.scale.set(s, s, s);
            // console.log(c);
            this.mesh.add(c.mesh);
        } 
    }
}

class AirPlane {

    public mesh = new THREE.Object3D();
    private propeller;
    constructor() {
        this.init();
    }

    init() {
        // 这里要做的是一个驾驶舱
        let geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
        let matCockpit = new THREE.MeshPhongMaterial({color: '#FF0000', flatShading: THREE.FlatShading});
        geomCockpit.vertices[4].y -= 10;
        geomCockpit.vertices[4].z += 20;
        geomCockpit.vertices[5].y -= 10;
        geomCockpit.vertices[5].z -= 20;
        geomCockpit.vertices[6].y += 20;
        geomCockpit.vertices[6].z += 20;
        geomCockpit.vertices[7].y += 20;
        geomCockpit.vertices[7].z -= 20;

        let cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);

        // 还要有引擎盖
        let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
        let matEngine = new THREE.MeshPhongMaterial({color: '#FFFF00' , flatShading: THREE.FlatShading});
        let engine = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);

        // 做个尾巴吧
        let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        let matTailPlane = new THREE.MeshPhongMaterial({color: '#FF0000', flatShading: THREE.FlatShading});
        let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
        tailPlane.position.set(-35, 25, 0);
        tailPlane.castShadow = true;
        tailPlane.receiveShadow = true;
        this.mesh.add(tailPlane);

        // 机翼当然少不了，用长长的矩形穿过机身，多么美妙！
        let geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
        let matSideWing = new THREE.MeshPhongMaterial({color: '#FF0000', flatShading: THREE.FlatShading});
        let sideWing = new THREE.Mesh(geomSideWing, matSideWing);
        sideWing.castShadow = true;
        sideWing.receiveShadow = true;
        this.mesh.add(sideWing);

        // 飞机前端旋转的螺旋桨
        let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        let matPropeller = new THREE.MeshPhongMaterial({color: '#F4A460', flatShading: THREE.FlatShading});
        this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;

        // 螺旋桨
        let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
        let matBlade = new THREE.MeshPhongMaterial({color: '#CD853F', flatShading: THREE.FlatShading});

        let blade = new THREE.Mesh(geomBlade, matBlade);
        blade.position.set(8, 0, 0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50, 0, 0);
        this.mesh.add(this.propeller);
       
    }
   
}

 class FlyGame extends React.Component<any, any> {

    private camera ;
    private scene ;
    private renderer ; 
    private WIDTH;
    private HEIGHT;
    private clock = new THREE.Clock(); 
    private container;
    private hemisphereLight ; 
    private ambientLight ;
    private shadowLight;
    private sea;
    private sky;
    private airplane;
    private mousePos = new  THREE.Vector3(0 , 0, 0);

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
        // console.log( THREE.Vector3(0, 0, 0));
    }

    componentDidMount() {
        this.init();               
    }
    private init() {
        this.createScene();
        this.createLights();
        this.createPlane();
        this.createSea();
        this.createSky();

        document.addEventListener('mousemove', (event) => this.handleMouseMove(event), false);

        console.log(this.scene);
        this.renderer.render(this.scene , this.camera);
        this.animation();
    }
    private createScene() {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color('#ffa100');
        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950); // 使用雾化的效果
        // const axes = new THREE.AxisHelper(200);
        // this.scene.add(axes);
        const  aspectRatio = this.WIDTH / this.HEIGHT; // 宽高比设置为窗口大小，避免图案的变形
        const fieldOfView = 50;
        const nearPlane = 0.1;
        const farPlane = 10000;

        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio , nearPlane, farPlane);
        this.camera.position.x = 0; // 相机的位置和视点将影响观察到的物体
        this.camera.position.z = 200;
        this.camera.position.y = 100; // 待优化

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // 声明一个webgl的渲染器，这个渲染器就如同html中的canvas
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement); // 将这个渲染器加到html当中

    }
    private createLights() {
        this.hemisphereLight = new THREE.HemisphereLight(0xbbbbbb, 0x000000, .9);
        this.ambientLight = new THREE.AmbientLight('#dc8874');
        this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);
        this.shadowLight.castShadow = true;
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 1000;
        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;
       // 每次设置完灯光都需要把他添加到场景中
       this.scene.add(this.hemisphereLight);
       this.scene.add(this.shadowLight);
       this.scene.add(this.ambientLight);
 
    }
    private createPlane() {
        this.airplane = new AirPlane();
        this.airplane.mesh.scale.set(.25, .25, .25);
        this.airplane.mesh.position.y = 100;
        console.log(this.airplane.mesh);
        this.scene.add(this.airplane.mesh);
    }
    private createSea() {
        this.sea = new Sea();
        this.sea.mesh.position.y = -600;
        this.scene.add(this.sea.mesh);
    }
    private createSky() {
        this.sky = new Sky();
        this.sky.mesh.position.y = -600;
        console.log(this.sky);
        this.scene.add(this.sky.mesh);
    }

    private handleMouseMove(event: any) {
    // 我们要把鼠标的坐标值转换成webgl系统中规格化的数值，从-1到1
        // 这种转换很简单的伙计！tx = (x-width/2)/(width/2)

        let tx = -1 + (event.clientX / this.WIDTH) * 2;

        // y轴在窗口坐标系和webg坐标系的方向是相反的，因此我们把他逆一下就可以
        
        let ty = 1 - (event.clientY / this.HEIGHT) * 2;
        this.mousePos = {x: tx, y: ty};
    }
    private animation() {
        this.update();
        this.airplane.propeller.rotation.x += 0.3;
        this.sea.mesh.rotation.z += .005;
        this.sky.mesh.rotation.z += .01;

        // this.airplane.pilot.updateHairs();
        
        requestAnimationFrame(() => this.animation());
    }

    private update() {
        const delta = this.clock.getDelta();
        let targetY = 100 + this.mousePos.y * 75; // 控制飞机在y轴25到175的位置
        let targetX = this.mousePos.x * 195; // 控制飞机在x轴-195到195的位置

        // 每一帧移动飞机移动的距离，使飞机最终到达鼠标的位置，这样制造出飞机缓缓飞向指定位置的效果，而不会显得很突兀。
        this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * 0.1;
        this.airplane.mesh.position.x += (targetX - this.airplane.mesh.position.x) * 0.5;
        // 通过剩余距离的长度来计算旋转地幅度，这样飞机如果一次性移动的距离很多相应的旋转幅度就越大，与真实的情况也符合，使动画更加真实。
        this.airplane.mesh.rotation.z = (targetY - this.airplane.mesh.position.y) * 0.0256;
        this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * 0.0256;

        this.airplane.propeller.rotation.x += 0.3;

        this.renderer.render(this.scene , this.camera);
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