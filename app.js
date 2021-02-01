// Dependencies
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const apiKey = require(__dirname + "/apiKey.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Variables
let classes = "";
let alertMessage = "";
let iconImageSrc = "";

// GET Requests to /
app.get("/", function (req, res) {
  res.render("index", {
    classes: classes,
    alertMessage: alertMessage,
    iconImageSrc: iconImageSrc,
  });
});

// POST Requests to /
app.post("/", function (req, res) {
  let city = req.body.city;
  let url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=metric";
  https.get(url, function (response) {
    if (response.statusCode === 200) {
      response.on("data", function (d) {
        let data = JSON.parse(d);
        let description = data.weather[0].description;
        let icon = data.weather[0].icon;
        iconImageSrc = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        let temp = data.main.temp;
        let windSpeed = data.wind.speed;
        let cityName = data.name;
        let country = data.sys.country;
        alertMessage =
          "The weather currently is " +
          description +
          " in " +
          cityName +
          ", " +
          country +
          ". Temperature is " +
          temp +
          " degrees Celsius and wind speed is " +
          windSpeed +
          " m/s.";
        classes = "alert alert-info";
        res.redirect("/");
      });
    } else {
      iconImageSrc = "";
      alertMessage = "Sorry, the " + city + " city could not be found!";
      classes = "alert alert-danger";
      res.redirect("/");
    }
  });
});

// Starting the Server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
