var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var birdSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },         // Bird species common name e.g. "Great Horned Owl"
  description: String,  // e.g. "Large brown owl"
  averageEggs: { type: Number, min: 1, max: 50 },
  endangered: { type: Boolean, default: false },  // Is this bird species threatened with extinction?
  datesSeen: [ Date ]   // Array of dates a bird of this species was seen
});

var Bird = mongoose.model('Bird', birdSchema);
birdSchema.plugin(uniqueValidator);

module.exports = Bird;
