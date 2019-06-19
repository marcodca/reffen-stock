const mongoose = require('mongoose');
const { Schema } = mongoose;

const missingProductRecordSchema = new Schema({
    dateAdded: String,
    markedAsImportant: Boolean,
    productId : String,
    comment: String
});

module.exports = mongoose.model('MissingProduct', missingProductRecordSchema);