const mongoose = require('mongoose');
const Race = require('./Race');
const routeSchema = new mongoose.Schema({
  race: { type: String, ref: 'Race', unique: true },
  checkpoint: { type: Number, required: true },
  startPoint: { type: String, required: true },
  goal: { type: String, required: true }
});

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
