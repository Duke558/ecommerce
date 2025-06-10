import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Email validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Valid payment and delivery methods matching your schema
const validPaymentMethods = ['cod', 'gcash', 'credit_card'];
const validDeliveryMethods = ['pickup', 'delivery'];

// POST /api/orders — Place a new order
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      items,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      paymentStatus = 'Pending',  // Default value
      status = 'Processing',      // Default value
      gcash,
      creditCard
    } = req.body;

    // Validate required fields
    if (!userId || !userEmail || !items || !totalAmount || !paymentMethod || !deliveryMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!isValidEmail(userEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    if (!validDeliveryMethods.includes(deliveryMethod)) {
      return res.status(400).json({
        message: `Invalid delivery method. Must be one of: ${validDeliveryMethods.join(', ')}`
      });
    }

    if (!items.every(item =>
      item.productId &&
      item.name &&
      typeof item.quantity === 'number' &&
      typeof item.price === 'number'
    )) {
      return res.status(400).json({
        message: 'Invalid items format. Each item must include productId, name, quantity (number), and price (number).'
      });
    }

    // Build order object dynamically
    const orderData = {
      userId,
      userEmail,
      items,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      paymentStatus,
      status,
    };

    // Conditionally add payment details
    if (paymentMethod === 'gcash' && gcash) {
      orderData.gcash = gcash;
    }

    if (paymentMethod === 'credit_card' && creditCard) {
      orderData.creditCard = creditCard;
    }

    // Save to DB
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
  } catch (err) {
    console.error('Order creation failed:', err.message);
    res.status(500).json({
      message: 'Server error. Could not place order.',
      error: err.message // Only show in dev
    });
  }
});

// ✅ GET /api/orders — Fetch all orders (for admin or user views)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Most recent first
    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

export default router;
