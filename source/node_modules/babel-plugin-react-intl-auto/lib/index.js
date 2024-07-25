"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _jsx = require("./visitors/jsx");

var _addIdToDefineMessage = require("./visitors/addIdToDefineMessage");

var _addIdToFormatMessage = require("./visitors/addIdToFormatMessage");

function _default() {
  return {
    name: 'react-intl-auto',
    visitor: {
      JSXElement: _jsx.visitJSXElement,

      CallExpression(path, state) {
        (0, _addIdToFormatMessage.addIdToFormatMessage)(path, state);
        (0, _addIdToDefineMessage.addIdToDefineMessage)(path, state);
      }

    }
  };
}