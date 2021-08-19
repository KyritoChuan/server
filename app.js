const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

//LOAD ROUTINGS..
const authRouters = require("./routers/auth");
const userRouters = require("./routers/user");
const menuRouters = require("./routers/menu");
const newsLetterRouters = require("./routers/newsletter");
const courseRouters = require("./routers/course");
const course = require("./models/course");

// Configurar cabeceras y cors
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configure Header HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Router BASIC
app.use(`/api/${API_VERSION}`, authRouters);
app.use(`/api/${API_VERSION}`, userRouters);
app.use(`/api/${API_VERSION}`, menuRouters);
app.use(`/api/${API_VERSION}`, newsLetterRouters);
app.use(`/api/${API_VERSION}`, courseRouters);

module.exports = app;
