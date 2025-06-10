// src/components/Checkout.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../utils/cartUtils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phoneNumber: '',
  });
  const [gcashNumber, setGcashNumber] = useState('');
  const [gcashPin, setGcashPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const cart = getCart() || [];
    setCartItems(cart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 50 : 0;
  const totalAmount = subtotal - discountAmount + deliveryFee;

  const handleDiscountApply = async () => {
    if (!discountCode.trim()) {
      toast.warning('Please enter a discount code');
      return;
    }
    setIsApplyingDiscount(true);
    try {
      const { data } = await axios.post('https://ecommerce-ams5.onrender.com/api/apply-promo', {
        promoCode: discountCode.trim(),
        totalAmount: subtotal,
      });
      const { newTotal, discountApplied } = data;
      const discountVal = Math.max(0, subtotal - newTotal);
      setDiscountAmount(discountVal);
      toast.success(`🎉 ${discountApplied}% discount applied!`);
      setDiscountCode('');
    } catch (err) {
      console.error('Promo apply error:', err);
      setDiscountAmount(0);
      toast.error('Invalid or expired discount code');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!isLoaded || !user) {
      toast.error('Please login to place an order');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (deliveryMethod === 'delivery') {
      const { fullName, addressLine1, city, province, postalCode, phoneNumber } = shippingAddress;
      if (!fullName || !addressLine1 || !city || !province || !postalCode || !phoneNumber) {
        toast.error('Please complete all required shipping address fields.');
        return;
      }
    }
    if (paymentMethod === 'gcash' && (!gcashNumber.trim() || !gcashPin.trim())) {
      toast.error('Please enter your GCash number and PIN');
      return;
    }
    if (
      paymentMethod === 'credit_card' &&
      (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardholderName.trim())
    ) {
      toast.error('Complete all credit card fields');
      return;
    }

    const userEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      '';

    const items = cartItems.map(item => ({
      productId: String(item.productId || item._id || item.id || ''),
      name: String(item.name || ''),
      quantity: Number(item.quantity),
      price: Number(item.price),
    })).filter(item => item.productId && item.name && item.quantity > 0 && item.price >= 0);

    if (items.length === 0) {
      toast.error('Invalid items in cart.');
      return;
    }

    const order = {
      userId: user.id,
      userEmail,
      items,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      status: 'Processing',
    };

    if (deliveryMethod === 'delivery') order.shippingAddress = shippingAddress;
    if (paymentMethod === 'gcash') order.gcash = { number: gcashNumber, pin: gcashPin };
    if (paymentMethod === 'credit_card') order.creditCard = { number: cardNumber, expiry: expiryDate, cvv, name: cardholderName };

    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:5000/api/orders', order);
      if (response.status === 201) {
        const { orderId } = response.data;
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${orderId}`);
      } else {
        toast.error('Failed to place order.');
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Checkout</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">Your cart is empty. Please add items to proceed.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={item.id || index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-2 shadow-sm">
            <p className="text-gray-700 font-medium">
              {item.name} x {item.quantity} = ₱{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))
      )}

      {/* Discount */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700 mb-2">Discount Code</label>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter code (e.g. SAVE20)"
            className="flex-1 border border-gray-300 p-2 rounded-l-md focus:ring-2 focus:ring-blue-500"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            disabled={isApplyingDiscount}
          />
          <button
            onClick={handleDiscountApply}
            disabled={isApplyingDiscount}
            className={`px-4 py-2 rounded-r-md text-white transition ${
              isApplyingDiscount ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isApplyingDiscount ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Delivery Method */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700">Delivery Method</label>
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="pickup">Pickup (₱0)</option>
          <option value="delivery">Delivery (₱50)</option>
        </select>
      </div>

      {/* Shipping Address */}
      {deliveryMethod === 'delivery' && (
        <div className="border p-4 rounded mb-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
          {Object.entries(shippingAddress).map(([key, value]) => (
            <input
              key={key}
              type="text"
              placeholder={key.replace(/([A-Z])/g, ' $1')}
              className="border p-2 rounded w-full mb-2"
              value={value}
              onChange={(e) => setShippingAddress({ ...shippingAddress, [key]: e.target.value })}
              disabled={isSubmitting}
            />
          ))}
        </div>
      )}

      {/* Payment Method */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="gcash">GCash</option>
          <option value="credit_card">Credit Card</option>
        </select>
      </div>

      {/* GCash Fields */}
      {paymentMethod === 'gcash' && (
        <div className="border p-4 rounded mt-4 bg-gray-50">
          <input
            type="text"
            placeholder="GCash Number"
            className="border p-2 rounded w-full mb-2"
            value={gcashNumber}
            onChange={(e) => setGcashNumber(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="GCash PIN"
            className="border p-2 rounded w-full"
            value={gcashPin}
            onChange={(e) => setGcashPin(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Credit Card Fields */}
      {paymentMethod === 'credit_card' && (
        <div className="border p-4 rounded mt-4 bg-gray-50">
          <input
            type="text"
            placeholder="Card Number"
            className="border p-2 rounded w-full mb-2"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            className="border p-2 rounded w-full mb-2"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="CVV"
            className="border p-2 rounded w-full mb-2"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Cardholder Name"
            className="border p-2 rounded w-full"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Summary & Button */}
      <div className="mt-6 text-gray-800">
        <p>Subtotal: ₱{subtotal.toFixed(2)}</p>
        <p>Discount: -₱{discountAmount.toFixed(2)}</p>
        <p>Delivery Fee: ₱{deliveryFee.toFixed(2)}</p>
        <p className="font-bold text-xl mt-2">Total: ₱{totalAmount.toFixed(2)}</p>
      </div>

      <button
        onClick={handleOrderSubmit}
        disabled={isSubmitting || cartItems.length === 0}
        className={`mt-6 w-full py-3 rounded-md text-white font-semibold transition ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;
