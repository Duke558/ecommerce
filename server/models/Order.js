import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    deliveryMethod: {
      type: String,
      required: [true, 'Delivery method is required'],
      enum: {
        values: ['pickup', 'delivery'],
        message: 'Delivery method must be either "pickup" or "delivery"',
      },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['cod', 'gcash', 'credit_card'],
        message: 'Payment method must be one of "cod", "gcash", or "credit_card"',
      },
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },

    // GCash details (optional)
    gcash: {
      number: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentMethod !== 'gcash' || (v && v.length > 0);
          },
          message: 'GCash number is required when payment method is GCash',
        },
      },
      pin: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentMethod !== 'gcash' || (v && v.length > 0);
          },
          message: 'GCash PIN is required when payment method is GCash',
        },
      },
    },

    // Credit Card details (optional)
    creditCard: {
      number: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentMethod !== 'credit_card' || (v && v.length > 0);
          },
          message: 'Credit card number is required when payment method is Credit Card',
        },
      },
      expiry: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentMethod !== 'credit_card' || (v && v.length > 0);
          },
          message: 'Expiry date is required when payment method is Credit Card',
        },
      },
      cvv: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentMethod !== 'credit_card' || (v && v.length > 0);
          },
          message: 'CVV is required when payment method is Credit Card',
        },
      },
      name: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentMethod !== 'credit_card' || (v && v.length > 0);
          },
          message: 'Cardholder name is required when payment method is Credit Card',
        },
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
