var mongoose = require("mongoose");

// mongoose.connect( "mongodb+srv://vaibhav:vaibhav@cluster0-txbx7.mongodb.net/test?retryWrites=true");

var Schema = mongoose.Schema;

var Sensor_Attributes_Schema = new Schema({
  type: { type: String, required: true, unique: true },
  attributeArray: [String],
  dataType: { type: String, required: true }
});

const Sensor_Attributes = mongoose.model(
  "Sensor_Attributes_Schema",
  Sensor_Attributes_Schema
);
module.exports = { Sensor_Attributes_Schema: Sensor_Attributes };
