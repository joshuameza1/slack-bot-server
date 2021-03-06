const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../routes/routes.js");

//Slack Communication Server

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "The app is running..." });
});

app.use("/api", routes);

//Export Modules

module.exports = app;
