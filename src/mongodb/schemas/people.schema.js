const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Heroes = require('./heroes.schema');

const PeopleSchema = new Schema({
  description: {
    type: String
  },
  alter_ego: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: Heroes
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('People', PeopleSchema);