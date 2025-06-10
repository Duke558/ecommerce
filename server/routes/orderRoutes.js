import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Email validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Valid payment and delivery methods
const validPaymentMethods = ['cod', 'gcash', 'credit_card'];
const validDeliveryMethods = ['pickup', 'delivery'];

// ✅ POST /api/orders — Place a new order
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      items,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      paymentStatus = 'Pending',
      status = 'Processing',
      gcash,
      creditCard,
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
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`,
      });
    }

    if (!validDeliveryMethods.includes(deliveryMethod)) {
      return res.status(400).json({
        message: `Invalid delivery method. Must be one of: ${validDeliveryMethods.join(', ')}`,
      });
    }

    if (
      !items.every(
        (item) =>
          item.productId &&
          item.name &&
          !isNaN(Number(item.quantity)) &&
          !isNaN(Number(item.price))
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid items format. Each item must include productId, name, quantity (number), and price (number).',
      });
    }

    const sanitizedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const orderData = {
      userId,
      userEmail,
      items: sanitizedItems,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      paymentStatus,
      status,
    };

    if (paymentMethod === 'gcash' && gcash) {
      orderData.gcash = gcash;
    }

    if (paymentMethod === 'credit_card' && creditCard) {
      orderData.creditCard = creditCard;
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
  } catch (err) {
    console.error('Order creation failed:', err.message);
    res.status(500).json({
      message: 'Server error. Could not place order.',
      error: err.message,
    });
  }
});


// ✅ GET /api/orders?userId=...&email=... — Fetch orders by userId or email
router.get('/', async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ message: 'userId or email query parameter is required' });
    }

    const query = {};
    if (userId) query.userId = userId;
    if (email) query.userEmail = email;

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err.message);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});


// ✅ GET /api/orders/:id — Fetch a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Failed to fetch order:', err.message);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

export default router;
