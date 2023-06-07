const express = require('express');
const identificationController = require("../controllers/identify");
const apiRouters = express.Router();

apiRouters.post('/identify', identificationController.handleInput)
module.exports = {apiRouters};