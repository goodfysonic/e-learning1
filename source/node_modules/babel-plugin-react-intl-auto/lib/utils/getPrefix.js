"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrefix = void 0;

var _path = require("path");

var _ = require(".");

const escapeRegExp = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/gu, '\\$&');
};

const dotPathReplace = (fomatted, removePrefix, separator) => {
  const exp = `^${removePrefix.replace(/\//gu, '')}\\${(0, _.dotPath)(_path.sep, separator)}?`;
  let reg; // certain separators can throw an error and need to be escaped
  // e.g. "_"

  try {
    reg = new RegExp(exp, 'u');
  } catch (error) {
    reg = new RegExp(escapeRegExp(exp), 'u');
  }

  return (0, _.dotPath)(fomatted, separator).replace(reg, '');
};

const getPrefix = ({
  file: {
    opts: {
      filename
    }
  },
  opts: {
    removePrefix,
    filebase = false,
    separator,
    relativeTo
  }
}, exportName) => {
  if (removePrefix === true) {
    return exportName === null ? '' : exportName;
  }

  const file = (0, _path.relative)(relativeTo || process.cwd(), filename);
  const fomatted = filebase ? file.replace(/\..+$/u, '') : (0, _path.dirname)(file);
  removePrefix = removePrefix === undefined || removePrefix === false ? '' : removePrefix;
  const fixed = removePrefix instanceof RegExp ? (0, _.dotPath)(fomatted.replace(removePrefix, ''), separator) : dotPathReplace(fomatted, removePrefix, separator);

  if (exportName === null) {
    return fixed;
  }

  if (fixed === '') {
    return exportName;
  }

  return `${fixed}.${exportName}`;
};

exports.getPrefix = getPrefix;