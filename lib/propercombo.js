"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _combofield = require("./components/combofield");

var _combofield2 = _interopRequireDefault(_combofield);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (process.env.APP_ENV === 'browser-env') {
	require("../css/style.scss");
}

exports["default"] = _combofield2["default"];
module.exports = exports['default'];