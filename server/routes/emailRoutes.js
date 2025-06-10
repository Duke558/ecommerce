// server/routes/emailRoutes.js

import express from 'express';
const router = express.Router();

// Example POST route (adjust as needed)
router.post('/', (req, res) => {
  const { to, subject, message } = req.body;

  // You can handle email sending here (e.g., using nodemailer)
  console.log('Email data received:', { to, subject, message });

  res.status(200).json({ message: 'Email sent (not really — just a placeholder)' });
});

export default router;
