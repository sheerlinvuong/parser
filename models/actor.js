const mongoose = require('../mongoose');

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  images: { type: [] },
  id: { type: String },
});

module.exports = mongoose.model('Actor', ActorSchema);
