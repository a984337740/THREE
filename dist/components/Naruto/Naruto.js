"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("../../build/three.module.js");
var FBXLoader_1 = require("../../threeMaster/jsm/loaders/FBXLoader");
var core_1 = require("@material-ui/core");
var React = require("react");
require("./naruto.css");
var react_draggable_1 = require("react-draggable");
var Naruto = /** @class */ (function (_super) {
    __extends(Naruto, _super);
    function Naruto(props) {
        var _this = _super.call(this, props) || this;
        _this.clock = new THREE.Clock();
        _this.actions = []; // 所有动画数组
        _this.defaultPos = new THREE.Vector2().zero;
        _this.dir = new THREE.Vector2();
        _this.attackList = [12, 13, 14, 15, 16]; // 连招的循序
        _this.attackCombo = false; // 是否连招，接下一个攻击
        _this.playerState = {
            move: false,
            skills: 0,
        };
        _this.state = {
            pointPos: {
                x: 0,
                y: 0,
            }
        };
        return _this;
    }
    Naruto.prototype.componentDidMount = function () {
        this.initThree();
    };
    Naruto.prototype.initThree = function () {
        this.initScene();
        this.initEnv();
        this.initObject();
        this.initLight();
        this.animation();
    };
    Naruto.prototype.initScene = function () {
        var _this = this;
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0xa0a0a0, 1000, 11000);
        var aspectRatio = this.WIDTH / this.HEIGHT; // 宽高比设置为窗口大小，避免图案的变形
        var fieldOfView = 65;
        var nearPlane = 0.1;
        var farPlane = 20000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
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
        window.addEventListener('resize', function () { return _this.Resize(); });
    };
    Naruto.prototype.Resize = function () {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    Naruto.prototype.initEnv = function () {
        // 创建草地
        var groundTexture = new THREE.TextureLoader().load('/textures/terrain/grasslight-big.jpg');
        groundTexture.warpS = THREE.RepeatWrapping;
        groundTexture.warpT = THREE.RepeatWrapping;
        // groundTexture.repeat.set(3, 2);
        groundTexture.anisotropy = 16;
        var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
        var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    };
    Naruto.prototype.initObject = function () {
        var _this = this;
        // console.log(this.scene);
        var loader = new FBXLoader_1.FBXLoader();
        loader.load('/models/Naruto.fbx', function (mesh) {
            console.log(mesh);
            _this.naruto = mesh;
            _this.naruto.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            var ground = _this.naruto.getObjectByName('air_Attack_01');
            _this.naruto.position.y += 140;
            // this.naruto.scale.set(3, 3, 3);
            // this.naruto.rotation.x -= Math.PI / 2;
            _this.light.target = _this.naruto;
            console.log(_this.naruto);
            _this.initAnimation();
            _this.scene.add(_this.naruto);
        });
    };
    Naruto.prototype.initLight = function () {
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
    };
    Naruto.prototype.initAnimation = function () {
        this.mixer = new THREE.AnimationMixer(this.naruto);
        for (var i = 0; i < this.naruto.animations.length; i++) {
            this.actions[i] = this.mixer.clipAction(this.naruto.animations[i]);
        }
        this.playAnim(24);
    };
    Naruto.prototype.playAnim = function (i) {
        for (var j = 0; j < this.actions.length; j++) {
            if (j === i) {
                this.actions[j].play();
                this.actions[j].loop = THREE.RepeatWrapping;
            }
            else {
                this.actions[j].stop();
            }
        }
    };
    Naruto.prototype.addSkills = function () {
        var _this = this;
        if (this.playerState.skills === 0) {
            // 不处于攻击状态 ，进行下一个攻击动作
            this.playerState.skills++;
            this.playAnim(this.attackList[this.playerState.skills - 1]);
            this.attackInterval = setInterval(function () {
                // console.log('111111111');
                if (_this.attackCombo) {
                    // 如果设置了连招，上一个攻击动作完成后，进行下一个攻击动作
                    _this.playerState.skills++;
                    console.log('111111111');
                    // 如果整套攻击动作已经执行完成，则清除定时器
                    if (_this.playerState.skills - 1 >= _this.attackList.length) {
                        _this.closeAttack();
                        return;
                    }
                    // 进行下一个动作
                    _this.playAnim(_this.attackList[_this.playerState.skills - 1]);
                    _this.attackCombo = false;
                }
            }, this.naruto.animations[this.attackList[this.playerState.skills - 1]].duration * 1000);
        }
        else {
            this.attackCombo = true;
        }
        console.log(this.naruto.animations[this.attackList[this.playerState.skills - 1]].duration * 1000);
    };
    Naruto.prototype.closeAttack = function () {
        this.playerState.skills = 0;
        // 根据状态设置是移动状态还是站立状态
        this.playerState ? this.playAnim(3) : this.playAnim(24);
        clearInterval(this.attackInterval);
    };
    Naruto.prototype.animation = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function () { return _this.animation(); });
    };
    Naruto.prototype.update = function () {
        var delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(delta);
        }
        if (this.dir !== new THREE.Vector2().zero && this.naruto) {
            this.characterMove(this.dir);
        }
        this.renderer.render(this.scene, this.camera);
    };
    Naruto.prototype.characterMove = function (v, speed) {
        if (speed === void 0) { speed = 5; }
        var direction = new THREE.Matrix4();
        var move = new THREE.Vector3();
        // 重置矩阵
        direction.identity();
        // 通过相机的四元数得到 相机的旋转矩阵
        var quaternion = this.camera.quaternion;
        direction.makeRotationFromQuaternion(quaternion);
        // 获取操作杆的移动方向
        move.x = v.x;
        move.y = 0;
        move.z = v.y;
        // 通过相机方向和操作杆获得最终角色的移动方向
        move.applyMatrix4(direction);
        move.normalize();
        this.naruto.rotation.y = -this.dir.angle() - Math.PI / 2;
        var position = new THREE.Vector3();
        // 获取当前位置
        position.x = -v.x * speed;
        position.z = -v.y * speed;
        // 修改模型位置
        this.naruto.position.x += position.x;
        this.naruto.position.z += position.z;
        // 修改平衡光的位置
        this.light.position.x += position.x;
        this.light.position.z += position.z;
        // 修改相机位置
        this.camera.position.x += position.x;
        this.camera.position.z += position.z;
    };
    Naruto.prototype.handleStart = function (event, data) {
        var x = data.x;
        var y = data.y;
        // this.controls.style.transform = 'translate' + '(' + (-x) + ',' + (-y) + ')';
        console.log(event, data);
        this.playAnim(3);
        var pointPos = this.state.pointPos;
        console.log(pointPos);
    };
    Naruto.prototype.handleDrag = function (event, data) {
        this.dir.set(data.x, data.y);
        this.dir.normalize();
    };
    Naruto.prototype.handleStop = function (event, data) {
        // console.log(event , data);
        this.dir.set(0, 0);
        console.log(event);
        console.log(this.controls);
        var pointPos = this.state.pointPos;
        console.log(pointPos);
        this.playAnim(24);
    };
    Naruto.prototype.render = function () {
        var _this = this;
        var pointPos = this.state.pointPos;
        return (React.createElement("div", null,
            "\u9E23\u4EBA   ",
            React.createElement(core_1.Button, { variant: "outlined", color: "secondary", onClick: function () { return _this.addSkills(); } }, "\u91CA\u653E\u6280\u80FD \u653B\u51FB"),
            React.createElement("div", { className: "controls" },
                React.createElement(react_draggable_1.default
                // axis="x"
                // handle=".handle"
                , { 
                    // axis="x"
                    // handle=".handle"
                    defaultPosition: { x: 0, y: 0 }, position: pointPos, 
                    // grid={[25, 25]}
                    bounds: { left: -30, top: -30, right: 30, bottom: 30 }, 
                    // scale={1}
                    onStart: function (event, data) { return _this.handleStart(event, data); }, onDrag: function (event, data) { return _this.handleDrag(event, data); }, onStop: function (event, data) { return _this.handleStop(event, data); } },
                    React.createElement("div", { className: "point", id: "controls" }))),
            React.createElement("div", { id: "container", className: "pos" })));
    };
    return Naruto;
}(React.Component));
exports.default = Naruto;
//# sourceMappingURL=Naruto.js.map