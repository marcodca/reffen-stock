const mongoose = require('mongoose');
const { Schema } = mongoose;

const missingProductRecordSchema = new Schema({
    dateAdded: String,
    markedAsImportant: Boolean,
});

module.exports = mongoose.model('MissingProduct', missingProductRecordSchema);