const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    category: String,
    availableInBars: Array,
    description : String
});

module.exports = mongoose.model('Product', productSchema);