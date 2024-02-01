const mongoose = require('mongoose');
const Route = require('./Route'); 
const Status = require('./Status'); 
const Runner = require('./Runner');
const Sponsor = require('./Sponsor'); 

const raceSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  creationDate: { type: Date, default: Date.now },
  eventDate: { type: Date, required: true },
  city: { type: String, required: true },
  length: { type: String, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: Route },
  status: { type: mongoose.Schema.Types.ObjectId, ref: Status },
  runners: [{ type: String, ref: Runner }],
  sponsors: [{ type: String, ref: Sponsor }],
  filename: {type: String}
});

const Race = mongoose.model('Race', raceSchema);
module.exports = Race;
