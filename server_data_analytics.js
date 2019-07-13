var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var moment = require("moment");
moment().format();
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

var { Year_Schema } = require("./IoT_Data_Schema.js");
var { Month_Schema } = require("./IoT_Data_Schema.js");
var { Day_Schema } = require("./IoT_Data_Schema.js");
var { Hour_Schema } = require("./IoT_Data_Schema.js");
var { Reading_Schema } = require("./IoT_Data_Schema.js");
var { Sensor_Attributes_Schema } = require("./Sensor_Attributes_Schema");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/getdata", (req, res) => {
  //this link fetches all the data from backend,
  //send to python script for processing, and then
  //finally send processed data back to front-end.
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var sensorList_Array = req.body.sensorList_Array;
  var frequency = req.body.frequency;

  var sensorIds = [];
  for (var i = 0; i < sensorList_Array.length; i++) {
    for (var j = 0; j < sensorList_Array[i].sensorList.length; j++) {
      sensorIds.push(sensorList_Array[i].sensorList[j]);
    }
  }

  var sensorSet = [];
  for (var i = 0; i < sensorList_Array.length; i++) {
    sensorSet.push(sensorList_Array[i].sensorList);
  }

  var sensorTypes = [];
  for (var i = 0; i < sensorList_Array.length; i++) {
    sensorTypes.push(sensorList_Array[i].sensorType);
  }

  var spawn = require("child_process").spawn;
  py = spawn("python", ["./read_data.py"]);
  dataString = "";

  py.stdout.on("data", function(data) {
    dataString += data.toString();
  });

  py.stdout.on("end", function() {
    try {
      graphData = JSON.parse(dataString);
      res.json(graphData);
    } catch (err) {
      //This "error" word is detected by frontend
      //then it asks the user to refresh the page
      //and fill the form again.
      res.end("error");
    }
  });

  async function foo() {
    //This function passes the final data to python.
    var attributesSet = [];
    for (var i = 0; i < sensorTypes.length; i++) {
      var attributes = await get_sensor_attributes(sensorTypes[i]);
      attributesSet.push(attributes);
    }
    var data = await get_sensor_data(
      sensorIds,
      new Date(startTime),
      new Date(endTime),
      frequency,
      attributesSet,
      sensorSet
    );
    py.stdin.write(JSON.stringify(data));
    py.stdin.end();
  }
  foo();
});

async function get_sensor_data(
  sensorIds,
  start_time,
  end_time,
  frequency,
  attributesSet,
  sensorSet
) {
  //This function fetches all the data based on the use query
  //from backend. All the annual, monthly, dialy and hourly
  //documents that lie in the start time and end time entered
  //by the user are fetched.

  //However, if a user asks for annual statistics and enter start
  //date as 25 june 2017. Then 25-jun will be ignored and all the
  //statistics for the full 2017 year will be calculated. For monthly
  //stats for full beginning and ending month will caculated.
  //Similar for daily and hourly also.
  var annualDataArray = [];
  var monthlyDataArray = [];
  var dailyDataArray = [];
  var hourlyDataArray = [];
  await Year_Schema.find(
    {
      sensorId: sensorIds,
      year: { $gte: start_time.getYear(), $lte: end_time.getYear() }
    },
    (err, annualDatas) => {
      if (err) {
        console.log("error in fetching annual data from mongodb");
        console.log("error is " + err);
      } else {
        for (var i = 0; i < annualDatas.length; i++) {
          var dataPushed = false;
          for (var j = 0; j < annualDataArray.length; j++) {
            if (annualDataArray[j][0].sensorId == annualDatas[i].sensorId) {
              annualDataArray[j].push(annualDatas[i]);
              dataPushed = true;
            }
          }
          if (dataPushed == false) {
            annualDataArray.push([annualDatas[i]]);
          }
        }
      }
      console.log("annual data fetched");
    }
  ).lean();
  await Month_Schema.find(
    {
      sensorId: sensorIds,
      month: { $gte: start_time.getMonth(), $lte: end_time.getMonth() },
      year: { $gte: start_time.getYear(), $lte: end_time.getYear() }
    },
    (err, monthlyDatas) => {
      if (err) {
        console.log("error in fetching monthly data from mongodb");
        console.log("error is: " + err);
      } else {
        for (var i = 0; i < monthlyDatas.length; i++) {
          var dataPushed = false;
          for (var j = 0; j < monthlyDataArray.length; j++) {
            if (monthlyDataArray[j][0].sensorId == monthlyDatas[i].sensorId) {
              monthlyDataArray[j].push(monthlyDatas[i]);
              dataPushed = true;
            }
          }
          if (dataPushed == false) {
            monthlyDataArray.push([monthlyDatas[i]]);
          }
        }
      }
      console.log("mothly data fetched");
    }
  ).lean();
  await Day_Schema.find(
    {
      sensorId: sensorIds,
      date: { $gte: start_time.getDate(), $lte: end_time.getDate() },
      month: { $gte: start_time.getMonth(), $lte: end_time.getMonth() },
      year: { $gte: start_time.getYear(), $lte: end_time.getYear() }
    },
    (err, dailyDatas) => {
      if (err) {
        console.log("error while fetching daily data from monogbd");
        console.log("error is: " + err);
      } else {
        for (var i = 0; i < dailyDatas.length; i++) {
          var dataPushed = false;
          for (var j = 0; j < dailyDataArray.length; j++) {
            if (dailyDataArray[j][0].sensorId == dailyDatas[i].sensorId) {
              dailyDataArray[j].push(dailyDatas[i]);
              dataPushed = true;
            }
          }
          if (dataPushed == false) {
            dailyDataArray.push([dailyDatas[i]]);
          }
        }
      }
      console.log("dialy data fetched");
    }
  ).lean();
  await Hour_Schema.find(
    {
      sensorId: sensorIds,
      hour: { $gte: start_time.getHours(), $lte: end_time.getHours() },
      date: { $gte: start_time.getDate(), $lte: end_time.getDate() },
      month: { $gte: start_time.getMonth(), $lte: end_time.getMonth() },
      year: { $gte: start_time.getYear(), $lte: end_time.getYear() }
    },
    (err, hourlyDatas) => {
      if (err) {
        console.log("error while fetching hourly data from mongodb");
        console.log("error is: " + err);
      } else {
        for (var i = 0; i < hourlyDatas.length; i++) {
          var dataPushed = false;
          for (var j = 0; j < hourlyDataArray.length; j++) {
            if (hourlyDataArray[j][0].sensorId == hourlyDatas[i].sensorId) {
              hourlyDataArray[j].push(hourlyDatas[i]);
              dataPushed = true;
            }
          }
          if (dataPushed == false) {
            hourlyDataArray.push([hourlyDatas[i]]);
          }
        }
      }
      console.log("houyrly data fetched");
    }
  ).lean();

  return [
    frequency,
    attributesSet,
    sensorSet,
    start_time,
    end_time,
    annualDataArray,
    monthlyDataArray,
    dailyDataArray,
    hourlyDataArray
  ];
}

async function get_sensor_attributes(sensorType) {
  //This function fetches list of attributes that will
  //be required for data processing and showing them
  //in the front-end
  var attributeArray = [];
  var dataType = "";
  await Sensor_Attributes_Schema.find(
    { type: sensorType },
    (err, sensorAttributes) => {
      if (err) {
      } else {
        for (var i = 0; i < sensorAttributes[0].attributeArray.length; i++) {
          attributeArray.push(sensorAttributes[0].attributeArray[i]);
        }
        dataType = sensorAttributes[0].dataType;
      }
    }
  );
  return {
    dataType: dataType,
    attributesArray: attributeArray
  };
}

app.listen(4000, () => {
  console.log("listening at 4000");
});
