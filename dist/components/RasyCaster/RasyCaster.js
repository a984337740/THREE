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
var OrbitControls_1 = require("../../threeMaster/jsm/controls/OrbitControls");
var React = require("react");
require("./rasycaster.css");
var RasyCaster = /** @class */ (function (_super) {
    __extends(RasyCaster, _super);
    function RasyCaster(props) {
        var _this = _super.call(this, props) || this;
        _this.mouse = new THREE.Vector2;
        _this.clock = new THREE.Clock();
        _this.state = {};
        return _this;
    }
    RasyCaster.prototype.componentDidMount = function () {
        this.init();
    };
    RasyCaster.prototype.init = function () {
        var _this = this;
        this.createScene();
        this.createObject();
        this.createLight();
        this.createControls();
        window.addEventListener('resize', function () { return _this.onWindowResize; }, false);
        document.addEventListener('click', function () { return _this.onMouseClick(event); }, false);
        this.animation();
    };
    RasyCaster.prototype.onWindowResize = function () {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
    };
    RasyCaster.prototype.onMouseClick = function (event) {
        // 声明 射线 和 修改 mouse 位置
        var raycaster = new THREE.Raycaster();
        // 通过 鼠标点击的位置 计算出射线所需要的点的位置 
        this.mouse.x = (event.clientX / this.WIDTH) * 2 - 1;
        this.mouse.y = -(event.clientY / this.HEIGHT) * 2 + 1;
        // 根据屏幕的二维位置 及 相机的矩阵更新射线的位置
        raycaster.setFromCamera(this.mouse, this.camera);
        // 获取射线直线和 所有模型香江的数组
        var intersects = raycaster.intersectObjects(this.scene.children, true);
        // intersects是返回的一个数组，如果当前位置没有可选中的对象，那这个数组为空，否则为多个对象组成的数组，排列顺序为距离屏幕的距离从近到远的顺序排列
        // 数组的每一个子对象内包含：
        // distance：距离屏幕的距离
        // face：与射线相交的模型的面
        // faceIndex：与射线相交的模型的面的下标
        // object：与射线相交的模型对象
        // point：射线与模型相交的点的位置坐标
        // uv：与射线相交的模型的面的uv映射位置
        console.log(intersects);
        // 将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
        /*for (var i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }*/
        // 判断当前数组是否为空,不为空则获取最近的的模型，将其颜色修改为红色
        if (intersects.length > 0) {
            intersects[0].object.material.color.set(0xff0000);
        }
    };
    RasyCaster.prototype.createScene = function () {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950); // 使用雾化的效果
        var aspectRatio = this.WIDTH / this.HEIGHT; // 宽高比设置为窗口大小，避免图案的变形
        var fieldOfView = 50;
        var nearPlane = 0.1;
        var farPlane = 1000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.camera.position.x = 0; // 相机的位置和视点将影响观察到的物体
        this.camera.position.z = 200;
        this.camera.position.y = 100; // 待优化
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // 声明一个webgl的渲染器，这个渲染器就如同html中的canvas
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement); // 将这个渲染器加到html当中
    };
    RasyCaster.prototype.randomColor = function () {
        var arrHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        var strHex = '#';
        var index = 0;
        for (var i = 0; i < 6; i++) {
            index = Math.round(Math.random() * 15);
            strHex += arrHex[index];
        }
        return strHex;
    };
    RasyCaster.prototype.createObject = function () {
        var group = new THREE.Group();
        group.name = 'group';
        var geometry = new THREE.BoxGeometry(10, 10, 10);
        for (var i = 0; i < 30; i++) {
            var material = new THREE.MeshBasicMaterial({ color: this.randomColor() });
            var mesh = new THREE.Mesh(geometry, material);
            // tslint:disable-next-line: max-line-length
            mesh.position.set(THREE.Math.randFloatSpread(200), THREE.Math.randFloatSpread(200), THREE.Math.randFloatSpread(200));
            group.add(mesh);
        }
        this.scene.add(group);
        console.log(this.scene);
    };
    RasyCaster.prototype.createLight = function () {
        var ambientLight = new THREE.AmbientLight('#111111');
        this.scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight('#ffffff');
        directionalLight.position.set(40, 60, 10);
        directionalLight.shadow.camera.near = 1; // 产生阴影的最近距离
        directionalLight.shadow.camera.far = 400; // 产生阴影的最远距离
        directionalLight.shadow.camera.left = -50; // 产生阴影距离位置的最左边位置
        directionalLight.shadow.camera.right = 50; // 最右边
        directionalLight.shadow.camera.top = 50; // 最上边
        directionalLight.shadow.camera.bottom = -50; // 最下面
        // 这两个值决定生成阴影密度 默认512
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.mapSize.width = 1024;
        // 告诉平行光需要开启阴影投射
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    };
    RasyCaster.prototype.createControls = function () {
        this.controls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = false;
        // this.controls.enabled = false;   是否启用
        // 设置目标点
        this.controls.target.set(0, 0.5, 0);
    };
    RasyCaster.prototype.animation = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function () { return _this.animation(); });
    };
    RasyCaster.prototype.update = function () {
        var delta = this.clock.getDelta();
        this.controls.update(delta);
        this.renderer.render(this.scene, this.camera);
    };
    RasyCaster.prototype.render = function () {
        return (React.createElement("div", null,
            "\u70B9\u51FB\u6A21\u578B\u529F\u80FD",
            React.createElement("div", { id: "container", className: "pos" })));
    };
    return RasyCaster;
}(React.Component));
exports.default = RasyCaster;
//# sourceMappingURL=RasyCaster.js.map