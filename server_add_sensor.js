var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var axios = require('axios')

var {Sensor_Schema} = require('./IoT_Campus_Schema_alt');
var {Zone_Schema} = require('./IoT_Campus_Schema_alt');
var {Floor_Schema} = require('./IoT_Campus_Schema_alt');
var {Building_Schema} = require('./IoT_Campus_Schema_alt');
var {Campus_Schema} = require('./IoT_Campus_Schema_alt');


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/getlabels', (req, res) => {
    //This part stores the suggestions that appear while filling the form to add a sensor.
    labels = [];

    Campus_Schema.find((err, campus_objects) => {
        console.log('cmaps objects are ' + JSON.stringify(campus_objects))
        var Labels = [];
        var sensorTypeLabels = [];
        for (var campus=0;campus<campus_objects.length;campus++)
        {
            // console.log('campsu name is ' + campus_objects[campus].campus)
            Labels.push({label: campus_objects[campus].campus})
            sensorTypeLabels = sensorTypeLabels.concat(campus_objects[campus].sensorTypesAvailable)
            // console.log('lables array is ' + JSON.stringify(labels))
            for (var building=0;building<campus_objects[campus].buildingArray.length;building++)
            {
                // console.log('building name is' + campus_objects[campus].buildingArray[building].building)
                Labels.push({label: campus_objects[campus].buildingArray[building].building})
                // labels[campus].buildingArray[building] = {
                //             building: campus_objects[campus].buildingArray[building].building,
                //             floorArray: []};

                for (var floor=0;floor<campus_objects[campus].buildingArray[building].floorArray.length;floor++)
                {
                    Labels.push({label: JSON.stringify(campus_objects[campus].buildingArray[building].floorArray[floor].floor)})
                    // labels[campus].buildingArray[building].floorArray[floor] = {
                    //         floor: campus_objects[campus].buildingArray[building].floorArray[floor].floor,
                    //         zoneArray: []};

                        for (var zone=0;zone<campus_objects[campus].buildingArray[building].floorArray[floor].zoneArray.length;zone++)
                        {
                            Labels.push({label: campus_objects[campus].buildingArray[building].floorArray[floor].zoneArray[zone].zone})
                            // labels[campus].buildingArray[building].floorArray[floor].zoneArray[zone] = 
                            // {
                            //     zone: campus_objects[campus].buildingArray[building].floorArray[floor].zoneArray[zone].zone,
                            //     sensorArray: []
                            // }

                            // for (var sensor=0;sensor<campus_objects[campus].buildingArray[building].floorArray[floor].zoneArray[zone].sensorArray.length;sensor++)
                            // {
                            //     labels[campus].buildingArray[building].floorArray[floor].zoneArray[zone].sensorArray[sensor] = 
                            //     campus_objects[campus].buildingArray[building].floorArray[floor].zoneArray[zone].sensorArray[sensor].sensorId
                            // }
                        }
                }
            }
        }
        //All labels are pushed at the same hierarchy to reduce computational strain.
        // var labels = {campusLabels: campusLabels, buildingLabels: buildingLabels, floorLabels: floorLabels, zoneLabels: zoneLabels, sensorTypeLabels: sensorTypeLabels}
        
//      console.log('labels array is ' + JSON.stringify(Labels))
        var finalLabels = {locationLabels: Labels, sensorTypeLabels: sensorTypeLabels}//add qual and quant later**************************************
        res.json(finalLabels)
        //sends the finalLabels object for processing
    })

})

app.use('/storesensor', (req, res) => {
    // This is the part which allows users to add a new sensor to the database.
    console.log('query: ' + JSON.stringify(req.query));
    // receives attributes requested by the user as a query
    res.send('request received');
    //creates a new object of the Campus Schema with all attributes received from query.
    //only the part of the sensor location which does not already exist will be added.
    var sensorinfo= new Campus_Schema(
        {
            campus: req.query.campus,
            sensorTypesAvailable: [],
            buildingArray: [
                {
                    campus: req.query.campus,
                    building: req.query.building,
                    sensorTypesAvailable: [],
                    floorArray:
                    [
                        {
                            campus: req.query.campus,
                            building: req.query.building,
                            floor: req.query.floor,
                            sensorTypesAvailable: [],
                            zoneArray:[
                            {
                                campus: req.query.campus,
                                building: req.query.building,
                                floor: req.query.floor,
                                zone: req.query.zone,
                                sensorTypesAvailable: [],
                                sensorArray:
                                [
                                    {
                                        campus: req.query.campus,
                                        building: req.query.building,
                                        floor: req.query.floor,
                                        zone: req.query.zone,
                                        sensorId: req.query.sensorId,
                                        type: req.query.sensorType,
                                        datatype: req.query.sensorDataType
                                        // longitude: req.query.longitude
                                        // latitude: {type: String},
                                    }
                                ]
                            }] 
                        }
                    ]
                }
            ]
        }

    ); // creates a complete object, then later decides which parts to save
    sensorinfo.sensorTypesAvailable.push(req.query.sensorType);
    sensorinfo.buildingArray[0].sensorTypesAvailable.push(req.query.sensorType);
    sensorinfo.buildingArray[0].floorArray[0].sensorTypesAvailable.push(
        req.query.sensorType);
    sensorinfo.buildingArray[0].floorArray[0].zoneArray[0].sensorTypesAvailable.push(
        req.query.sensorType);
    // The sensor types available at each level of hierarchy must have at least
    // the sensor type of the one sensor being added.

    Campus_Schema.findOne({campus: req.query.campus}, (err,campusObj) =>
        {
            if (err || campusObj==null) // If no such object is found in the schema
            {
                sensorinfo.save(err =>
                    {
                        if (err)
                        {
                            console.log("Error is "+err);
                            // Logs the error for debugging
                        }
                        else
                        {
                            console.log("Object saved successfully");
                        }
                    }
                )
            }
            else
            {
                console.log(req.query.campus + " campus exists")
                //Indicates that a new campus object is not being created.

                var buildingObj=null;
                // Represents the building object with the same building name as that of the query
                var existsSensorType=false;
                for (var i=0; i<campusObj.sensorTypesAvailable.length; i++)
                {
                    if (campusObj.sensorTypesAvailable[i]==req.query.sensorType)
                    {
                        existsSensorType=true;
                        break;
                    }
                }
                if (false==existsSensorType)
                {
                    campusObj.sensorTypesAvailable.push(req.query.sensorType);
                }
                // code to check if this is the first sensor of its type in the campus
                // and add its type if so
                var bArray = campusObj.buildingArray;
                // Shortens the notation to represent all buildings under consideration
                for (var i=0; i<bArray.length; i++)
                {
                    if (bArray[i].building==req.query.building)
                    {
                        buildingObj=bArray[i];
                    }
                }
                if (!buildingObj)
                // Occurs if no corresponding building is found
                {
                    bArray.push(sensorinfo.buildingArray[0]);
                }
                else //there exists such a building
                {
                    console.log(req.query.building + " building exists")
                    // No new building object to be created
                    var floorObj=null;
                    existsSensorType=false;
                    for (var i=0; i<buildingObj.sensorTypesAvailable.length; i++)
                    {
                        if (buildingObj.sensorTypesAvailable[i]==req.query.sensorType)
                        {
                            existsSensorType=true;
                            break;
                        }
                    }
                    if (false==existsSensorType)
                    {
                        buildingObj.sensorTypesAvailable.push(req.query.sensorType);
                    }
                    // Add sensor's type to sensorTypesAvailable if it doesn't already exist
                    var fToAdd = sensorinfo.buildingArray[0].floorArray[0];
                    var fArray = buildingObj.floorArray;
                    for (var i=0; i<fArray.length; i++)
                    {
                        if (fArray[i].floor==req.query.floor)
                        {
                            floorObj=fArray[i];
                        }
                    }
                    if (!floorObj)
                    {
                        buildingObj.floorArray.push(fToAdd);
                    }
                    else //there exists such a floor
                    {
                        console.log(req.query.floor + " floor exists")
                        var zoneObj=null;
                        existsSensorType=false;
                        for (var i=0; i<floorObj.sensorTypesAvailable.length; i++)
                        {
                            if (floorObj.sensorTypesAvailable[i]==req.query.sensorType)
                            {
                                existsSensorType=true;
                                break;
                            }
                        }
                        if (false==existsSensorType)
                        {
                            floorObj.sensorTypesAvailable.push(req.query.sensorType);
                        }
                        var zToAdd = fToAdd.zoneArray[0];
                        var zArray = floorObj.zoneArray;
                        for (var i=0; i<zArray.length; i++)
                        {
                            if (zArray[i].zone==req.query.zone)
                            {
                                zoneObj=zArray[i];
                            }
                        }
                        if (!zoneObj)
                        {
                            floorObj.zoneArray.push(zToAdd);
                        }
                        else //there exists such a zone
                        {
                            console.log(req.query.zone + " zone exists")
                            var sensorObj=null;
                            existsSensorType=false;
                            for (var i=0; i<zoneObj.sensorTypesAvailable.length; i++)
                            {
                                if (zoneObj.sensorTypesAvailable[i]==req.query.sensorType)
                                {
                                    existsSensorType=true;
                                    break;
                                }
                            }
                            if (false==existsSensorType)
                            {
                                zoneObj.sensorTypesAvailable.push(req.query.sensorType);
                            }
                            var sToAdd = zToAdd.sensorArray[0];
                            var sArray = zoneObj.sensorArray;
                            for (var i=0; i<sArray.length; i++)
                            {
                                if (sArray[i].sensorId==req.query.sensorId)
                                {
                                    sensorObj=sArray[i];
                                }
                            }
                            if (!sensorObj)
                            {
                                zoneObj.sensorArray.push(sToAdd);
                            }
                            else //there exists such a sensor
                            {
                                console.log("Sensor already exists!");
                            }
                        }
                    }
                }
                //saves the old campus object which has at least one changed attribute
                campusObj.save(err =>
                    {
                        if (err)
                        {
                            console.log("Error is "+err);
                            // res.send("campus object saved succesfuly");
                        }
                        else
                        {
                            console.log("Campus object saved successfully");
                            // res.send("campus object saved succesfuly");
                        }
                    }
                )
            }
        });
})

app.listen(5000, () => {
    console.log('listening at 5000');
})
