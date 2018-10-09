const express = require("express");
const requireDir = require("require-dir");

const routes = express.Router();
const controllers = requireDir("./controllers");

module.exports = routes;
