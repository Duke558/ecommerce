import express from 'express';
import PromoCode from '../models/promoCode.js';

const router = express.Router();

router.post('/apply-promo', async (req, res) => {
  const { promoCode, totalAmount } = req.body;

  // Check if the totalAmount is a valid number and greater than zero
  if (isNaN(totalAmount) || totalAmount <= 0) {
    return res.status(400).json({ message: 'Invalid total amount' });
  }

  try {
    // Check if the promo code exists and is active
    const promo = await PromoCode.findOne({ code: promoCode, isActive: true });

    if (!promo) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }

    // Calculate the discount
    const discount = (totalAmount * promo.discountPercentage) / 100;
    const newTotal = totalAmount - discount;

    // Return the new total and the discount applied
    return res.status(200).json({
      newTotal,
      discountApplied: promo.discountPercentage,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while applying promo code' });
  }
});

export default router;
