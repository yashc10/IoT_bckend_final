var mongoose = require ("mongoose");

mongoose.connect( "mongodb+srv://vaibhav:vaibhav@cluster0-txbx7.mongodb.net/test?retryWrites=true");

var Schema = mongoose.Schema;

var Sensor_Schema = new Schema({
    sensorId : {type: String, required: true, unique: true},
    zone : { type: String, required: true},
    floor : { type: String, required: true},
    building : {type: String, required: true},
    campus: {type: String, required: true},
    type: {type: String, required: true},
    datatype: {type: String, required: true},
    longitude: {type: String},
    latitude: {type: String},
});

var Zone_Schema = new Schema({
    zone : { type: String, required: true},
    floor : { type: String, required: true},
    building : {type: String, required: true},
    campus: {type: String, required: true},
    sensorArray : [Sensor_Schema],
    sensorTypesAvailable: []
    
});

var Floor_Schema = new Schema({
    floor : { type: String, required: true},
    building : {type: String, required: true},
    campus: {type: String, required: true},
    zoneArray : [Zone_Schema],
    sensorTypesAvailable: []
});

var Building_Schema = new Schema({
    building : {type: String, required: true},
    campus: {type: String, required: true},
    floorArray : [Floor_Schema],
    sensorTypesAvailable: []
});

var Campus_Schema = new Schema({
    campus: { type: String, required: true, unique: true},
    buildingArray : [Building_Schema],
    sensorTypesAvailable: []
});

const Sensor = mongoose.model("Sensor_Schema", Sensor_Schema)
const Zone = mongoose.model("Zone_Schema",Zone_Schema);
const Floor = mongoose.model("Floor_Schema",Floor_Schema);
const Building = mongoose.model("Building_Schema",Building_Schema);
const Campus = mongoose.model("Campus_Schema",Campus_Schema);
module.exports = {Sensor_Schema: Sensor, Zone_Schema: Zone, Floor_Schema: Floor, Building_Schema: Building, Campus_Schema: Campus};
