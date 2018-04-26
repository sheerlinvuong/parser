const mongoose = require('mongoose');

const mongoDB =
  'mongodb+srv://sheerlin:<password>@cluster0-vbfsn.mongodb.net/imdb';
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('connected');
});

module.exports = mongoose;
