var mongoose = require('mongoose');

var LocationsSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Locations', LocationsSchema);