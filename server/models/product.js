const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    category: String,
    availableInBars: Array,
    comment : String
});

module.exports = mongoose.model('Product', productSchema);