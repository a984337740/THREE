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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("../../build/three.module.js");
var CarControls_1 = require("../../threeMaster/jsm/misc/CarControls");
var DRACOLoader_1 = require("../../threeMaster/jsm/loaders/DRACOLoader");
var GLTFLoader_1 = require("../../threeMaster/jsm/loaders/GLTFLoader");
var PMREMCubeUVPacker_1 = require("../../threeMaster/jsm/pmrem/PMREMCubeUVPacker");
var PMREMGenerator_1 = require("../../threeMaster/jsm/pmrem/PMREMGenerator");
var core_1 = require("@material-ui/core");
var React = require("react");
require("./carshow.css");
var CarShow = /** @class */ (function (_super) {
    __extends(CarShow, _super);
    function CarShow(props) {
        var _this = _super.call(this, props) || this;
        _this.envMap = null;
        _this.clock = new THREE.Clock();
        _this.carControls = new CarControls_1.CarControls();
        _this.carParts = {
            body: [],
            rim: [],
            glass: [],
        };
        _this.damping = 5.0;
        _this.distance = 5;
        _this.cameraTarget = new THREE.Vector3();
        _this.onWindowResize = function () {
            _this.camera.aspect = (window.innerWidth / window.innerHeight);
            _this.camera.updateProjectionMatrix();
            _this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log(window.innerWidth, window.innerHeight);
            console.log(document.body.clientWidth, document.body.clientHeight);
        };
        _this.carControls.turningRadius = 75;
        _this.state = {
            followCamera: false,
            materialsLib: {
                main: [],
                glass: [],
            },
            bodySelectIndex: 0,
            rimsSelectIndex: 0,
            glassSelectIndex: 0,
        };
        return _this;
    }
    CarShow.prototype.componentDidMount = function () {
        this.init();
    };
    CarShow.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var container, light, urls, loader, grid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = document.getElementById('container');
                        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
                        this.camera.position.set(3.25, 2.0, -5);
                        this.camera.lookAt(0, 0.5, 0);
                        this.scene = new THREE.Scene();
                        this.scene.fog = new THREE.Fog(0xd7cbb1, 1, 80);
                        console.log(this.scene);
                        light = new THREE.HemisphereLight(0xffffff, 0x444444);
                        light.position.set(0, 20, 0);
                        // this.scene.add( light );
                        light = new THREE.DirectionalLight(0xffffff);
                        light.position.set(0, 20, 10);
                        urls = ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'];
                        loader = new THREE.CubeTextureLoader();
                        loader.setPath('./textures/cube/skyboxsun25deg/');
                        return [4 /*yield*/, loader.load(urls, function (texture) {
                                console.log(texture);
                                _this.scene.background = texture;
                                console.log(_this.scene);
                                _this.pmremGenerator = new PMREMGenerator_1.PMREMGenerator(texture);
                                _this.pmremGenerator.update(_this.renderer);
                                _this.pmremCubeUVPacker = new PMREMCubeUVPacker_1.PMREMCubeUVPacker(_this.pmremGenerator.cubeLods);
                                _this.pmremCubeUVPacker.update(_this.renderer);
                                console.log(_this.pmremCubeUVPacker.CubeUVRenderTarget.texture);
                                _this.envMap = _this.pmremCubeUVPacker.CubeUVRenderTarget.texture;
                                console.log(_this.envMap);
                                _this.pmremGenerator.dispose();
                                _this.pmremCubeUVPacker.dispose();
                                _this.initCar();
                                _this.initMaterials();
                            })];
                    case 1:
                        _a.sent();
                        console.log(loader);
                        grid = new THREE.GridHelper(400, 40, 0x000000, 0x000000);
                        grid.material.opacity = 0.2;
                        grid.material.depthWrite = false;
                        grid.material.transparent = true;
                        this.scene.add(grid);
                        this.renderer = new THREE.WebGLRenderer({ antialias: true });
                        this.renderer.gammaOutput = true;
                        this.renderer.setPixelRatio(window.devicePixelRatio);
                        this.renderer.setSize(window.innerWidth, window.innerHeight);
                        console.log(this.camera);
                        console.log(this.renderer);
                        container.appendChild(this.renderer.domElement);
                        window.addEventListener('resize', this.onWindowResize, false);
                        this.animation();
                        return [2 /*return*/];
                }
            });
        });
    };
    CarShow.prototype.initCar = function () {
        var _this = this;
        DRACOLoader_1.DRACOLoader.setDecoderPath('/js/libs/draco/gltf/');
        var loader = new GLTFLoader_1.GLTFLoader();
        loader.setDRACOLoader(new DRACOLoader_1.DRACOLoader());
        loader.load('/models/gltf/ferrari.glb', function (gltf) {
            console.log(gltf.scene.children[0]);
            _this.carModel = gltf.scene.children[0];
            _this.carControls.setModel(_this.carModel, null);
            _this.carModel.traverse(function (child) {
                if (child.isMesh) {
                    child.material.envMap = _this.envMap;
                }
            });
            // shadow
            var texture = new THREE.TextureLoader().load('/models/gltf/ferrari_ao.png');
            var shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.655 * 4, 1.3 * 4).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: texture, opacity: 0.8, transparent: true }));
            shadow.renderOrder = 2;
            _this.carModel.add(shadow);
            _this.scene.add(_this.carModel);
            // car parts for material selection
            _this.carParts.body.push(_this.carModel.getObjectByName('body'));
            _this.carParts.rim.push(_this.carModel.getObjectByName('rim_fl'), _this.carModel.getObjectByName('rim_fr'), _this.carModel.getObjectByName('rim_rr'), _this.carModel.getObjectByName('rim_rl'), _this.carModel.getObjectByName('trim'));
            _this.carParts.glass.push(_this.carModel.getObjectByName('glass'));
            _this.updateMaterials();
        });
    };
    CarShow.prototype.initMaterials = function () {
        var materialsLib = {
            main: [
                new THREE.MeshStandardMaterial({
                    color: 0xff4400, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'orange'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x001166, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'blue'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x990000, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'red'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x000000, envMap: this.envMap, metalness: 0.9, roughness: 0.5, name: 'black'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0xffffff, envMap: this.envMap, metalness: 0.9, roughness: 0.5, name: 'white'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x555555, envMap: this.envMap, envMapIntensity: 2.0, metalness: 1.0,
                    roughness: 0.2, name: 'metallic'
                }),
            ],
            glass: [
                new THREE.MeshStandardMaterial({
                    color: 0xffffff, envMap: this.envMap, metalness: 1, roughness: 0,
                    // tslint:disable-next-line: max-line-length
                    opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'clear'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x000000, envMap: this.envMap, metalness: 1, roughness: 0,
                    // tslint:disable-next-line: max-line-length
                    opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'smoked'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x001133, envMap: this.envMap, metalness: 1, roughness: 0,
                    opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'blue'
                }),
            ],
        };
        this.setState({
            materialsLib: materialsLib
        });
    };
    CarShow.prototype.updateMaterials = function () {
        var e1 = { target: { value: 3 } };
        this.handleChange(e1);
        var e2 = { target: { value: 5 } };
        this.handleRimsChange(e2);
        var e3 = { target: { value: 0 } };
        this.handleGlassChange(e3);
    };
    CarShow.prototype.animation = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function () { return _this.animation(); });
    };
    CarShow.prototype.update = function () {
        var delta = this.clock.getDelta();
        var followCamera = this.state.followCamera;
        if (this.carModel) {
            this.carControls.update(delta / 3);
            if (this.carModel.position.length() > 200) {
                this.carModel.position.set(0, 0, 0);
                this.carControls.speed = 0;
            }
            if (followCamera) {
                this.carModel.getWorldPosition(this.cameraTarget);
                this.cameraTarget.y = 2.5;
                this.cameraTarget.z += this.distance;
                this.camera.position.lerp(this.cameraTarget, delta * this.damping);
            }
            else {
                this.carModel.getWorldPosition(this.cameraTarget);
                this.cameraTarget.y += 0.5;
                this.camera.position.set(3.25, 2.0, -5);
            }
            this.camera.lookAt(this.carModel.position);
        }
        this.renderer.render(this.scene, this.camera);
    };
    CarShow.prototype.handleChange = function (event) {
        console.log(event);
        var bodyMat = this.state.materialsLib.main[event.target.value];
        this.setState({
            bodySelectIndex: event.target.value
        });
        this.carParts.body.forEach(function (part) { return part.material = bodyMat; });
    };
    // 渲染车身颜色下拉列表
    CarShow.prototype.renderBodyColor = function () {
        var _this = this;
        return (React.createElement(core_1.Typography, { component: "span" },
            "\u8F66\u8EAB\u989C\u8272\uFF1A",
            React.createElement(core_1.FormControl, { className: ' ' },
                React.createElement(core_1.NativeSelect, { value: this.state.bodySelectIndex, onChange: function (event) { return _this.handleChange(event); }, name: "age", className: '', inputProps: { 'aria-label': 'age' } }, this.state.materialsLib.main.map(function (val, index) {
                    return (React.createElement("option", { value: index, key: index }, val.name));
                })),
                React.createElement(core_1.FormHelperText, null, "Body Color"))));
    };
    // 细节选择的点击事件
    CarShow.prototype.handleRimsChange = function (event) {
        console.log(event);
        var bodyMat = this.state.materialsLib.main[event.target.value];
        this.setState({
            rimsSelectIndex: event.target.value
        });
        this.carParts.rim.forEach(function (part) { return part.material = bodyMat; });
    };
    // 渲染细节颜色下拉列表
    CarShow.prototype.renderRimsColor = function () {
        var _this = this;
        return (React.createElement(core_1.Typography, { component: "span" },
            "\u7EC6\u8282\u989C\u8272\uFF1A",
            React.createElement(core_1.FormControl, { className: ' ' },
                React.createElement(core_1.NativeSelect, { value: this.state.rimsSelectIndex, onChange: function (event) { return _this.handleRimsChange(event); }, name: "age", className: '', inputProps: { 'aria-label': 'age' } }, this.state.materialsLib.main.map(function (val, index) {
                    return (React.createElement("option", { value: index, key: index }, val.name));
                })),
                React.createElement(core_1.FormHelperText, null, "Rims Color"))));
    };
    // 玻璃选择的点击事件
    CarShow.prototype.handleGlassChange = function (event) {
        console.log(event);
        var bodyMat = this.state.materialsLib.glass[event.target.value];
        this.setState({
            glassSelectIndex: event.target.value
        });
        this.carParts.glass.forEach(function (part) { return part.material = bodyMat; });
    };
    // 渲染玻璃颜色下拉列表
    CarShow.prototype.renderGlassColor = function () {
        var _this = this;
        return (React.createElement(core_1.Typography, { component: "span" },
            "\u73BB\u7483\u989C\u8272\uFF1A",
            React.createElement(core_1.FormControl, { className: ' ' },
                React.createElement(core_1.NativeSelect, { value: this.state.glassSelectIndex, onChange: function (event) { return _this.handleGlassChange(event); }, name: "age", className: '', inputProps: { 'aria-label': 'age' } }, this.state.materialsLib.glass.map(function (val, index) {
                    return (React.createElement("option", { value: index, key: index }, val.name));
                })),
                React.createElement(core_1.FormHelperText, null, "Glass Color"))));
    };
    CarShow.prototype.handleCheckChange = function (event) {
        var val = !this.state.followCamera;
        this.setState({
            followCamera: val,
        });
    };
    CarShow.prototype.renderCheckBox = function () {
        var _this = this;
        return (React.createElement(core_1.Checkbox, { checked: this.state.followCamera, onChange: function (event) { return _this.handleCheckChange(event); }, value: "checkedA", inputProps: {
                'aria-label': 'primary checkbox',
            } }));
    };
    CarShow.prototype.render = function () {
        return (React.createElement("div", null,
            "\u6C7D\u8F66\u6D4B\u8BD5",
            this.renderBodyColor(),
            this.renderRimsColor(),
            this.renderGlassColor(),
            this.renderCheckBox(),
            React.createElement("div", { id: "container", className: "pos" })));
    };
    return CarShow;
}(React.Component));
exports.default = CarShow;
//# sourceMappingURL=CarShow.js.map