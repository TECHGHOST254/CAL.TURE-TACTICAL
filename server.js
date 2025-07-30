const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/calture_tactical', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB from server.js");
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API route to get products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API route to submit order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order({
      items: req.body.items
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// API route to get all orders (for admin dashboard)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Serve main site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
