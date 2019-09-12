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
var React = require("react");
require("./flygame.css");
var Sea = /** @class */ (function () {
    function Sea() {
        this.geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
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
    return Sea;
}());
var Cloud = /** @class */ (function () {
    function Cloud() {
        this.mesh = new THREE.Object3D();
        this.geom = new THREE.BoxGeometry(20, 20, 20);
        this.mat = new THREE.MeshPhongMaterial({
            color: '#F8F8FF',
        });
        this.nBlocs = 3 + Math.floor(Math.random() * 3);
        for (var i = 0; i < this.nBlocs; i++) {
            // 实现位置随机，大小随机
            var m = new THREE.Mesh(this.geom, this.mat);
            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;
            var s = .1 + Math.random() * .9;
            m.scale.set(s, s, s);
            m.castShadow = true;
            m.receiveShadow = true;
            this.mesh.add(m);
        }
    }
    return Cloud;
}());
var Sky = /** @class */ (function () {
    function Sky() {
        this.mesh = new THREE.Object3D();
        this.nClouds = 20;
        this.stepAngle = Math.PI * 2 / this.nClouds;
        for (var i = 0; i < this.nClouds; i++) {
            var c = new Cloud();
            var a = this.stepAngle * i;
            var h = 750 + Math.random() * 200;
            c.mesh.position.y = Math.sin(a) * h;
            c.mesh.position.x = Math.cos(a) * h;
            c.mesh.rotation.z = -Math.PI / 2 + a;
            c.mesh.position.z = -50 - Math.random() * 400;
            var s = 1 + Math.random() * 2;
            c.mesh.scale.set(s, s, s);
            // console.log(c);
            this.mesh.add(c.mesh);
        }
    }
    return Sky;
}());
var AirPlane = /** @class */ (function () {
    function AirPlane() {
        this.mesh = new THREE.Object3D();
        this.init();
    }
    AirPlane.prototype.init = function () {
        // 这里要做的是一个驾驶舱
        var geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
        var matCockpit = new THREE.MeshPhongMaterial({ color: '#FF0000', flatShading: THREE.FlatShading });
        geomCockpit.vertices[4].y -= 10;
        geomCockpit.vertices[4].z += 20;
        geomCockpit.vertices[5].y -= 10;
        geomCockpit.vertices[5].z -= 20;
        geomCockpit.vertices[6].y += 20;
        geomCockpit.vertices[6].z += 20;
        geomCockpit.vertices[7].y += 20;
        geomCockpit.vertices[7].z -= 20;
        var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);
        // 还要有引擎盖
        var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
        var matEngine = new THREE.MeshPhongMaterial({ color: '#FFFF00', flatShading: THREE.FlatShading });
        var engine = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);
        // 做个尾巴吧
        var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        var matTailPlane = new THREE.MeshPhongMaterial({ color: '#FF0000', flatShading: THREE.FlatShading });
        var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
        tailPlane.position.set(-35, 25, 0);
        tailPlane.castShadow = true;
        tailPlane.receiveShadow = true;
        this.mesh.add(tailPlane);
        // 机翼当然少不了，用长长的矩形穿过机身，多么美妙！
        var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
        var matSideWing = new THREE.MeshPhongMaterial({ color: '#FF0000', flatShading: THREE.FlatShading });
        var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
        sideWing.castShadow = true;
        sideWing.receiveShadow = true;
        this.mesh.add(sideWing);
        // 飞机前端旋转的螺旋桨
        var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        var matPropeller = new THREE.MeshPhongMaterial({ color: '#F4A460', flatShading: THREE.FlatShading });
        this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;
        // 螺旋桨
        var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
        var matBlade = new THREE.MeshPhongMaterial({ color: '#CD853F', flatShading: THREE.FlatShading });
        var blade = new THREE.Mesh(geomBlade, matBlade);
        blade.position.set(8, 0, 0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50, 0, 0);
        this.mesh.add(this.propeller);
    };
    return AirPlane;
}());
var FlyGame = /** @class */ (function (_super) {
    __extends(FlyGame, _super);
    function FlyGame(props) {
        var _this = _super.call(this, props) || this;
        _this.clock = new THREE.Clock();
        _this.mousePos = new THREE.Vector3(0, 0, 0);
        _this.state = {};
        return _this;
        // console.log( THREE.Vector3(0, 0, 0));
    }
    FlyGame.prototype.componentDidMount = function () {
        this.init();
    };
    FlyGame.prototype.init = function () {
        var _this = this;
        this.createScene();
        this.createLights();
        this.createPlane();
        this.createSea();
        this.createSky();
        document.addEventListener('mousemove', function (event) { return _this.handleMouseMove(event); }, false);
        console.log(this.scene);
        this.renderer.render(this.scene, this.camera);
        this.animation();
    };
    FlyGame.prototype.createScene = function () {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color('#ffa100');
        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950); // 使用雾化的效果
        // const axes = new THREE.AxisHelper(200);
        // this.scene.add(axes);
        var aspectRatio = this.WIDTH / this.HEIGHT; // 宽高比设置为窗口大小，避免图案的变形
        var fieldOfView = 50;
        var nearPlane = 0.1;
        var farPlane = 10000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.camera.position.x = 0; // 相机的位置和视点将影响观察到的物体
        this.camera.position.z = 200;
        this.camera.position.y = 100; // 待优化
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // 声明一个webgl的渲染器，这个渲染器就如同html中的canvas
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement); // 将这个渲染器加到html当中
    };
    FlyGame.prototype.createLights = function () {
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
    };
    FlyGame.prototype.createPlane = function () {
        this.airplane = new AirPlane();
        this.airplane.mesh.scale.set(.25, .25, .25);
        this.airplane.mesh.position.y = 100;
        console.log(this.airplane.mesh);
        this.scene.add(this.airplane.mesh);
    };
    FlyGame.prototype.createSea = function () {
        this.sea = new Sea();
        this.sea.mesh.position.y = -600;
        this.scene.add(this.sea.mesh);
    };
    FlyGame.prototype.createSky = function () {
        this.sky = new Sky();
        this.sky.mesh.position.y = -600;
        console.log(this.sky);
        this.scene.add(this.sky.mesh);
    };
    FlyGame.prototype.handleMouseMove = function (event) {
        // 我们要把鼠标的坐标值转换成webgl系统中规格化的数值，从-1到1
        // 这种转换很简单的伙计！tx = (x-width/2)/(width/2)
        var tx = -1 + (event.clientX / this.WIDTH) * 2;
        // y轴在窗口坐标系和webg坐标系的方向是相反的，因此我们把他逆一下就可以
        var ty = 1 - (event.clientY / this.HEIGHT) * 2;
        this.mousePos = { x: tx, y: ty };
    };
    FlyGame.prototype.animation = function () {
        var _this = this;
        this.update();
        this.airplane.propeller.rotation.x += 0.3;
        this.sea.mesh.rotation.z += .005;
        this.sky.mesh.rotation.z += .01;
        // this.airplane.pilot.updateHairs();
        requestAnimationFrame(function () { return _this.animation(); });
    };
    FlyGame.prototype.update = function () {
        var delta = this.clock.getDelta();
        var targetY = 100 + this.mousePos.y * 75; // 控制飞机在y轴25到175的位置
        var targetX = this.mousePos.x * 195; // 控制飞机在x轴-195到195的位置
        // 每一帧移动飞机移动的距离，使飞机最终到达鼠标的位置，这样制造出飞机缓缓飞向指定位置的效果，而不会显得很突兀。
        this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * 0.1;
        this.airplane.mesh.position.x += (targetX - this.airplane.mesh.position.x) * 0.5;
        // 通过剩余距离的长度来计算旋转地幅度，这样飞机如果一次性移动的距离很多相应的旋转幅度就越大，与真实的情况也符合，使动画更加真实。
        this.airplane.mesh.rotation.z = (targetY - this.airplane.mesh.position.y) * 0.0256;
        this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * 0.0256;
        this.airplane.propeller.rotation.x += 0.3;
        this.renderer.render(this.scene, this.camera);
    };
    FlyGame.prototype.render = function () {
        return (React.createElement("div", null,
            "\u6C7D\u8F66\u6D4B\u8BD5",
            React.createElement("div", { id: "container", className: "pos" })));
    };
    return FlyGame;
}(React.Component));
exports.default = FlyGame;
//# sourceMappingURL=FlyGame.js.map