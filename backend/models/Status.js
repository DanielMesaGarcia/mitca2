const mongoose = require('mongoose');
const Race = require('./Race'); 

const statusSchema = new mongoose.Schema({
  carrera: { type: String, ref: 'Race', unique: true },
  statusAtTheMoment: { type: String, required: true, default: "No empezada" },
  winner: { type: String },
  duration: { type: String }
});

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
