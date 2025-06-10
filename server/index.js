import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { requireAuth } from '@clerk/express'; // ✅ Only this is needed


// dotenv config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

import Review from './models/Review.js';

// Public routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', promoRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reviews', reviewRoutes);

// Protected routes
app.use('/api/orders',  orderRoutes);
app.use('/api/reviews', requireAuth(), reviewRoutes); // For posting reviews only

// GET reviews by productId (no auth required)
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
