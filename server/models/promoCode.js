import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;
