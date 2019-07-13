var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var axios = require("axios");

var { Year_Schema } = require("./IoT_Data_Schema.js");
var { Month_Schema } = require("./IoT_Data_Schema.js");
var { Day_Schema } = require("./IoT_Data_Schema.js");
var { Hour_Schema } = require("./IoT_Data_Schema.js");
var { Reading_Schema } = require("./IoT_Data_Schema.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

simulate_copy_copy();

// app.use('/test', (req, res) => {
function simulate() {
  let i = 0;
  var dt = new Date(Date.now());
  // dt.setHours( dt.getHours() + 9);
  var createObjs = setInterval(function() {
    dt.setMinutes(dt.getMinutes() + 15);
    var sensorIdToPass = 1; /*+ i%2*/
    var humidityToPass = Math.floor(Math.random() * 3) + 78;
    var temperatureToPass = Math.floor(Math.random() * 13) + 21;
    var luminosityToPass = Math.floor(Math.random() * 23001) + 78;

    var link =
      "http://localhost:3000/storereading?" +
      "sensorId=" +
      sensorIdToPass +
      "&temperature=" +
      temperatureToPass +
      "&luminosity=" +
      luminosityToPass +
      "&humidity=" +
      humidityToPass +
      "&i=" +
      i +
      "&timeStamp=" +
      dt;

    //  console.log(i + 'timestamp: ' + dt)
    axios.post(link).then(res => {
      console.log(i + "timestamp: " + dt);
      console.log("link: " + link);
    });

    i = i + 1;
    if (i == 100) {
      // res.send('***simulation finished.***');
      clearInterval(createObjs);
      return;
    }
  }, 1000);
}
// });

function simulate_copy() {
  var i = 0;
  var dt = new Date(Date.now());
  // dt.setHours(17);
  // dt.setMonth(11);
  // dt.setDate(31);
  // dt.setHours(dt.getHours() + 3);
  var createObjs = setInterval(function() {
    dt.setMinutes(dt.getMinutes() + 30);
    var sensorIdToPass = 2;
    var humidityToPass = Math.floor(Math.random() * 30) + 50;
    var temperatureToPass =
      sensorIdToPass == 3 ? null : Math.floor(Math.random() * 40) + 7;
    var luminosityToPass = Math.floor(Math.random() * 23001);

    // if (!(i > 30 && i < 50))
    {
      var link =
        "http://localhost:3000/storereading?" +
        "sensorId=" +
        sensorIdToPass +
        "&temperature=" +
        temperatureToPass +
        "&luminosity=" +
        luminosityToPass +
        "&humidity=" +
        humidityToPass +
        "&i=" +
        i +
        "&timeStamp=" +
        dt;

      //  console.log(i + 'timestamp: ' + dt)
      axios.post(link).then(res => {
        console.log(i + "timestamp: " + dt);
        console.log("link: " + link);
      });
    }
    i = i + 1;
    if (i == 90 * 24) {
      clearInterval(createObjs);
    }
  }, 5000);
}
app.listen(5000, () => {
  console.log("listening at 5000");
});

function simulate_copy_copy() {
  var i = 0;
  var dt = new Date(Date.now());
  // dt.setHours(17);
  // dt.setMonth(11);
  // dt.setDate(1);
  // dt.setHours(dt.getHours() + 3);
  var createObjs = setInterval(function() {
    dt.setMinutes(dt.getMinutes() + 30);
    var sensorIdToPass = 11;
    var parkingOccupancy = Math.floor(Math.random() * 2);
    var humanOccupancy = Math.floor(Math.random() * 2);

    // if (!(i > 30 && i < 50))
    {
      var link =
        "http://localhost:2000/storereading?" +
        "sensorId=" +
        sensorIdToPass +
        "&parkingOccupancy=" +
        parkingOccupancy +
        "&humanOccupancy=" +
        humanOccupancy +
        "&i=" +
        i +
        "&timeStamp=" +
        dt;

      //  console.log(i + 'timestamp: ' + dt)
      axios.post(link).then(res => {
        console.log(i + "timestamp: " + dt);
        console.log("link: " + link);
      });
    }
    i = i + 1;
    if (i == 90 * 24) {
      clearInterval(createObjs);
    }
  }, 2500);
}
app.listen(process.env.PORT, () => {
  console.log("listening at " + JSON.stringify(process.env.PORT));
});
