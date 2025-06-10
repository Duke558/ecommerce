import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

// Fetch all products with optional search, category filter, and sorting
router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = new mongoose.Types.ObjectId(category);
    }

    const products = await Product.find(query)
      .populate('category')
      .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {});

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
