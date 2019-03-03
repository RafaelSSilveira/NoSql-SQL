const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeroesSchema = new Schema({
  description: {
    type: String
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Heroes', HeroesSchema);