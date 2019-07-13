var mongoose = require ("mongoose");

mongoose.connect( "mongodb+srv://vaibhav:vaibhav@cluster0-txbx7.mongodb.net/test?retryWrites=true");

var Schema = mongoose.Schema;


var Reading_Schema = new Schema({
    sensorId : { type: Number, required: true},
    timeStamp : { type: Date, default: Date.now()},
    //attributes depend on sensor, can be changed
    temperature : { type: Number},
    luminosity : {type: Number},
    humidity : {type: Number}
});

var Hour_Schema = new Schema({
    sensorId : { type: Number, required: true},
    hour : { type: Number, required: true},
    date : { type: Number, required: true},
    month : { type: Number, required: true},
    year: {type: Number, required: true},
    readingArray : [Reading_Schema]
});

var Day_Schema = new Schema({
    sensorId : { type: Number, required: true},
    date : { type: Number, required: true},
    month : { type: Number, required: true},
    year: {type: Number, required: true},
    hourArray : [Hour_Schema]
});

var Month_Schema = new Schema({
    sensorId : { type: Number, required: true},
    month : { type: Number, required: true},
    year: {type: Number, required: true},
    dayArray : [Day_Schema]
});

var Year_Schema = new Schema({
    sensorId : { type: Number, required: true},
    year: { type: Number, required: true},
    monthArray : [Month_Schema]
});


// const userSchema = mongoose.model('users', user),
// const organizationSchema = mongoose.model('organizations', organization)

// module.exports = { User: userSchema, Organization: organizationSchema }


// module.exports = mongoose.model("Zone",Zone_Schema);
// module.exports = mongoose.model("Floor",Floor_Schema);
// module.exports = mongoose.model("Building",Building_Schema);
// module.exports = mongoose.model("Campus",Campus_Schema);
const Year = mongoose.model("Year_Schema",Year_Schema);
const Month = mongoose.model("Month_Schema",Month_Schema);
const Day = mongoose.model("Day_Schema",Day_Schema);
const Hour = mongoose.model("Hour_Schema",Hour_Schema);
const Reading = mongoose.model("Reading_Schema",Reading_Schema);
module.exports = {Reading_Schema: Reading, Hour_Schema: Hour, Day_Schema: Day, Month_Schema: Month, Year_Schema: Year};