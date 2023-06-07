const dotenv = require("dotenv");
dotenv.config({ path: `.env` });

const express = require("express");
const expressApp = express();
const bodyParser = require("body-parser");

expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());



module.exports = {
    app: expressApp,
};