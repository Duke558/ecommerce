import mongoose from 'mongoose';
import Category from './Category.js'; // Make sure to add the .js extension

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  reviews: [
    {
      user: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ]
});

const Product = mongoose.model('products', productSchema);
export default Product;
