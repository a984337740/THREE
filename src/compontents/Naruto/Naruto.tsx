import * as THREE from '../../build/three.module.js';
import { CarControls } from '../../threeMaster/jsm/misc/CarControls';
import { DRACOLoader } from '../../threeMaster/jsm/loaders/DRACOLoader';
import { FBXLoader } from '../../threeMaster/jsm/loaders/FBXLoader';
import { GLTFLoader } from '../../threeMaster/jsm/loaders/GLTFLoader';
import { PMREMCubeUVPacker } from '../../threeMaster/jsm/pmrem/PMREMCubeUVPacker';
import { PMREMGenerator } from '../../threeMaster/jsm/pmrem/PMREMGenerator';
import { FormControl, FormHelperText, NativeSelect, Typography , Checkbox , Button } from '@material-ui/core';
 import * as React from 'react';
 import  './naruto.css';
 import Draggable from 'react-draggable'; 
 interface IProps {
    a: any ; 
 } 
   
 class Naruto extends React.Component<any, any> {

    private camera ;
    private scene ;
    private renderer ; 
    private WIDTH;
    private HEIGHT;
    private clock = new THREE.Clock(); 
    private container;  
    private light;
    private actions = [] ; // 所有动画数组
    private naruto;
    private mixer;

    private controls ;
    private defaultPos = new THREE.Vector2().zero;
    private dir = new THREE.Vector2();

    private  attackList = [12, 13, 14, 15, 16]; // 连招的循序
    private attackCombo = false; // 是否连招，接下一个攻击
    private attackInterval; // 当前攻击的定时器

    private playerState = {
        move: false,
        skills: 0,
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            pointPos: {
                x: 0,
                y: 0,
            }
        };
    }

    componentDidMount() {
        this.initThree();
    }

    private initThree() {
        this.initScene();
        this.initEnv();
        this.initObject();
        this.initLight();        

        this.animation();
    }

    private initScene() {

        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0xa0a0a0, 1000, 11000);

        const  aspectRatio = this.WIDTH / this.HEIGHT; // 宽高比设置为窗口大小，避免图案的变形
        const fieldOfView = 65;
        const nearPlane = 0.1;
        const farPlane = 20000;

        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio , nearPlane, farPlane);
        this.camera.position.x = 0; // 相机的位置和视点将影响观察到的物体     
        this.camera.position.y = 800; // 待优化
        this.camera.position.z = -800;
        this.camera.lookAt(new THREE.Vector3());

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // 声明一个webgl的渲染器，这个渲染器就如同html中的canvas
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement); // 将这个渲染器加到html当中

        this.controls = document.getElementById('controls');

        window.addEventListener('resize', () => this.Resize());
    }

    private Resize() {

        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private initEnv() {
        // 创建草地
        let groundTexture = new THREE.TextureLoader().load('/textures/terrain/grasslight-big.jpg');
        groundTexture.warpS = THREE.RepeatWrapping;
        groundTexture.warpT = THREE.RepeatWrapping;
        // groundTexture.repeat.set(3, 2);
        
        groundTexture.anisotropy = 16;
        let groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
        let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }
    private mixers;
    private  initObject() {
        // console.log(this.scene);
        let loader = new FBXLoader();
         loader.load('/models/Naruto.fbx' , (mesh) => {
            console.log(mesh);
            this.naruto = mesh;
            this.naruto.traverse( (child: any) => {
                if (child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            let ground =  this.naruto.getObjectByName('air_Attack_01');
            this.naruto.position.y += 140;
            // this.naruto.scale.set(3, 3, 3);
            // this.naruto.rotation.x -= Math.PI / 2;
            this.light.target =  this.naruto;
            
            console.log( this.naruto);        
            this.initAnimation();
            this.scene.add( this.naruto);
        });
    }

    private initLight() {
        this.scene.add(new THREE.AmbientLight(0x444444));
        this.light = new THREE.DirectionalLight(0xaaaaaa);
        this.light.position.set(0, 500, 100);
        this.light.lookAt(new THREE.Vector3());

        this.light.castShadow = true;
        this.light.shadow.camera.top = 180;
        this.light.shadow.camera.bottom = -180;
        this.light.shadow.camera.left = -180;
        this.light.shadow.camera.right = 180;

        // 
        this.scene.add(this.light);

    }

    private initAnimation() {
        this.mixer = new THREE.AnimationMixer( this.naruto );
        for (let i = 0 ; i <  this.naruto.animations.length ; i++) {
            this.actions[i] = this.mixer.clipAction(this.naruto.animations[i]);
        }
        this.playAnim(24);
    }

    private playAnim(i: number) {
        for (let j = 0 ; j < this.actions.length ; j++) {
            if (j === i) {
                this.actions[j].play();
                this.actions[j].loop = THREE.RepeatWrapping;
            } else {
                this.actions[j].stop();
            }
        }
    }

    private addSkills() {
       
        if (this.playerState.skills === 0) {
            // 不处于攻击状态 ，进行下一个攻击动作
            this.playerState.skills++;
            this.playAnim(this.attackList[this.playerState.skills - 1 ]);
            this.attackInterval = setInterval(() => {
                // console.log('111111111');
                if (this.attackCombo) {
                     // 如果设置了连招，上一个攻击动作完成后，进行下一个攻击动作
                     this.playerState.skills++;
                console.log('111111111');

                     // 如果整套攻击动作已经执行完成，则清除定时器
                     if (this.playerState.skills - 1 >= this.attackList.length) {
                         this.closeAttack();
                         return;
                     }

                     // 进行下一个动作
                     this.playAnim(this.attackList[this.playerState.skills - 1 ]);

                     this.attackCombo = false;
                }
            }, this.naruto.animations[this.attackList[this.playerState.skills - 1]].duration * 1000);
        } else {
            this.attackCombo = true;
        }
        console.log(this.naruto.animations[this.attackList[this.playerState.skills - 1]].duration * 1000);
    }
    private closeAttack() {
        this.playerState.skills = 0;
        // 根据状态设置是移动状态还是站立状态
        this.playerState ?  this.playAnim(3) : this.playAnim(24);
        clearInterval(this.attackInterval);
    }
    private animation() {
        this.update();        

        requestAnimationFrame(() => this.animation());
    }
    private update() {
        const delta = this.clock.getDelta();
        if ( this.mixer ) {
             this.mixer.update( delta );
        }
        if (this.dir !== new THREE.Vector2().zero && this.naruto) {
            this.characterMove(this.dir);
        }
        this.renderer.render(this.scene , this.camera);
    }

    private characterMove( v: THREE.Vector2 , speed: number = 5 ) {
        let direction = new THREE.Matrix4();
        let move = new THREE.Vector3();

        // 重置矩阵
        direction.identity();

        // 通过相机的四元数得到 相机的旋转矩阵
        let quaternion = this.camera.quaternion;
        direction.makeRotationFromQuaternion(quaternion);

        // 获取操作杆的移动方向
        move.x = v.x;
        move.y = 0;
        move.z = v.y;

        // 通过相机方向和操作杆获得最终角色的移动方向
        move.applyMatrix4(direction);
        move.normalize();

        this.naruto.rotation.y = - this.dir.angle() - Math.PI / 2;
        let position = new THREE.Vector3();
        // 获取当前位置
        position.x = -v.x * speed ;
        position.z = -v.y * speed;

        // 修改模型位置
        this.naruto.position.x += position.x;
        this.naruto.position.z += position.z;

        // 修改平衡光的位置
        this.light.position.x += position.x;
        this.light.position.z += position.z ;

        // 修改相机位置
        this.camera.position.x += position.x;
        this.camera.position.z += position.z;
    }

    handleStart(event: any , data: any) {
        const x = data.x;
        const y = data.y;
        // this.controls.style.transform = 'translate' + '(' + (-x) + ',' + (-y) + ')';
        console.log(event , data);
        this.playAnim(3);
        const {pointPos} = this.state;
        console.log(pointPos);
    }
    handleDrag(event: any , data: any) {        
        this.dir.set(data.x , data.y);
        this.dir.normalize();
    }
    handleStop(event: any , data: Object) {
        // console.log(event , data);
        this.dir.set(0 , 0);
        console.log(event);
        console.log(this.controls);
        const {pointPos} = this.state;
        console.log(pointPos);
        this.playAnim(24);

    }
    render() {
        const {pointPos} = this.state;
        return (
            <div>           
                鸣人   <Button variant="outlined" color="secondary"
                    onClick={() => this.addSkills()}>释放技能 攻击</Button>
                <div className = "controls" >
                    <Draggable
                        // axis="x"
                        // handle=".handle"
                        defaultPosition={{x: 0, y: 0}}
                        position={pointPos}
                        // grid={[25, 25]}
                        bounds= {{left: -30, top: -30, right: 30, bottom: 30}} 
                        // scale={1}
                        onStart={(event , data) => this.handleStart(event , data)}
                        onDrag={(event, data) => this.handleDrag(event, data)}
                        onStop={(event, data) => this.handleStop(event, data)} 
                        >
              <div className = "point" id = "controls">               
                  </div>
                  </Draggable>
                    </div>
                <div id = "container" className = "pos">               
                            
                </div>
                
            </div>
        );
    }
        
}

export default Naruto;