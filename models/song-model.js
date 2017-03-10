const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const songSchema = new Schema({
  artist: String,
  track: String,
  url: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
