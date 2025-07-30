const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/calture_tactical', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Connected to MongoDB");

  await Product.deleteMany({});
  console.log("🗑️ Old products removed");

  const data = fs.readFileSync(path.join(__dirname, 'products.json'));
  const products = JSON.parse(data);

  await Product.insertMany(products);
  console.log("✅ Products seeded successfully");

  mongoose.connection.close();
});
