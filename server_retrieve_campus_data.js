var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
var axios = require("axios");

var { Sensor_Schema } = require("./IoT_Campus_Schema_alt.js");
var { Zone_Schema } = require("./IoT_Campus_Schema_alt.js");
var { Floor_Schema } = require("./IoT_Campus_Schema_alt.js");
var { Building_Schema } = require("./IoT_Campus_Schema_alt.js");
var { Campus_Schema } = require("./IoT_Campus_Schema_alt.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/getcampusdata", (req, res) => {
  //This link sends all the data that is
  //necessary to render the all the checkboxes
  //in the front-endd
  Campus_Schema.find((err, matchingCampuses) => {
    if (err) {
      console.log("Error is " + err);
    } else {
      var sendingdata = { campusList: matchingCampuses };
      res.json(sendingdata);
    }
  });
});

app.listen(7000, () => {
  console.log("listening at 7000");
});
