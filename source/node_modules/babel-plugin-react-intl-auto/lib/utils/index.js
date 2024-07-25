"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getObjectProperties = getObjectProperties;
exports.objectProperty = exports.dotPath = exports.createHash = void 0;

var _path = require("path");

var t = _interopRequireWildcard(require("@babel/types"));

var _murmurhash3js = _interopRequireDefault(require("murmurhash3js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const REG = new RegExp(`\\${_path.sep}`, 'gu');

const isObjectProperties = properties => properties.every(p => p.isObjectProperty());

const createHash = message => `${_murmurhash3js.default.x86.hash32(message)}`;

exports.createHash = createHash;

const dotPath = (str, separator = '.') => str.replace(REG, separator);

exports.dotPath = dotPath;

const objectProperty = (key, value) => {
  const valueNode = typeof value === 'string' ? t.stringLiteral(value) : value;
  return t.objectProperty(t.stringLiteral(key), valueNode);
};

exports.objectProperty = objectProperty;

function getObjectProperties(path) {
  if (path.isObjectExpression()) {
    const properties = path.get('properties');

    if (isObjectProperties(properties)) {
      return properties;
    }
  } else if (path.isIdentifier()) {
    const binding = path.scope.getBinding(path.node.name);

    if (!binding) {
      return null;
    }

    const init = binding.path.get('init');

    if (!Array.isArray(init) && !init.type) {
      return null;
    }

    const properties = binding.path.get('init.properties');

    if (Array.isArray(properties) && isObjectProperties(properties)) {
      return properties;
    }
  }

  return null;
}