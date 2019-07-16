const mongoose = require('mongoose');
const { Schema } = mongoose;

const cocktailsSchema = new Schema({
    counter: String,
    lastModified: String,
});

module.exports = mongoose.model('Cocktails', cocktailsSchema);