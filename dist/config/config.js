"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corsWhiteListProd = exports.corsWhiteListDebug = exports.databaseDebug = exports.logLevel = exports.debug = exports.jwtSecret = void 0;
var jwtSecret = "testSecret";
exports.jwtSecret = jwtSecret;
var debug = false;
exports.debug = debug;
var logLevel = 'error';
exports.logLevel = logLevel;
var databaseDebug = {
  connectionLimit: 100,
  host: 'localhost',
  user: 'digitalcv',
  password: 'MZDZABHwNA5UIPwm',
  database: 'digitalcv'
};
exports.databaseDebug = databaseDebug;
var corsWhiteListDebug = ['http://localhost:4200'];
exports.corsWhiteListDebug = corsWhiteListDebug;
var corsWhiteListProd = ['http://thedashcoder.online', 'https://thedashcoder.online', 'https://thedashcoder.online/', 'http://thedashcoder.online/', 'http://www.thedashcoder.online', 'https://www.thedashcoder.online', 'https://www.thedashcoder.online/', 'http://www.thedashcoder.online/'];
exports.corsWhiteListProd = corsWhiteListProd;
//# sourceMappingURL=config.js.map