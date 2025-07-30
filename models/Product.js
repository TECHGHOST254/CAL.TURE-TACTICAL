const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  image: String,
  category: String,
  price: Number
});

module.exports = mongoose.model('Product', productSchema);
