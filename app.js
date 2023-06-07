const dotenv = require("dotenv");
dotenv.config({ path: `.env` });

const express = require("express");
const expressApp = express();
const bodyParser = require("body-parser");
const {apiRouters} = require("./routes/identify");

expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());
expressApp.use("/api", apiRouters);



module.exports = {
    app: expressApp,
};