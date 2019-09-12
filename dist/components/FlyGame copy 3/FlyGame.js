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
var FlyGame = /** @class */ (function (_super) {
    __extends(FlyGame, _super);
    function FlyGame(props) {
        var _this = _super.call(this, props) || this;
        _this.clock = new THREE.Clock();
        _this.state = {};
        return _this;
    }
    FlyGame.prototype.render = function () {
        return (React.createElement("div", null,
            "\u6C7D\u8F66\u6D4B\u8BD5",
            React.createElement("div", { id: "container", className: "pos" })));
    };
    return FlyGame;
}(React.Component));
exports.default = FlyGame;
//# sourceMappingURL=FlyGame.js.map