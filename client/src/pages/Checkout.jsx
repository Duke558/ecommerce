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

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phoneNumber: '',
  });

  // GCash
  const [gcashNumber, setGcashNumber] = useState('');
  const [gcashPin, setGcashPin] = useState('');

  // Credit Card
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
      const { data } = await axios.post('http://localhost:5000/api/apply-promo', {
        promoCode: discountCode.trim(),
        totalAmount: subtotal,
      });

      const { newTotal, discountApplied } = data;
      const discountVal = Math.max(0, subtotal - newTotal);
      setDiscountAmount(discountVal);
      toast.success(`🎉 ${discountApplied}% discount applied!`);
      setDiscountCode('');
    } catch (err) {
      console.error('Promo apply error:', err.response?.data || err.message || err);
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

    // Validate shipping address if delivery is selected
    if (deliveryMethod === 'delivery') {
      const { fullName, addressLine1, city, province, postalCode, phoneNumber } = shippingAddress;
      if (
        !fullName.trim() ||
        !addressLine1.trim() ||
        !city.trim() ||
        !province.trim() ||
        !postalCode.trim() ||
        !phoneNumber.trim()
      ) {
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
      toast.error(' Complete all credit card fields');
      return;
    }

    const userEmail =
      (user.primaryEmailAddress && user.primaryEmailAddress.emailAddress) ||
      (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
      user.emailAddresses ||
      '';

    // Construct a valid order.items array with type safety and filtering
    const items = cartItems
      .map((item) => ({
        productId: String(item.productId || item._id || item.id || ''),
        name: String(item.name || ''),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }))
      .filter(
        (item) =>
          item.productId &&
          item.name &&
          !isNaN(item.quantity) &&
          item.quantity > 0 &&
          !isNaN(item.price) &&
          item.price >= 0
      );

    if (items.length === 0) {
      toast.error(' Invalid items in cart.');
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

    if (deliveryMethod === 'delivery') {
      order.shippingAddress = {
        fullName: shippingAddress.fullName.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        addressLine2: shippingAddress.addressLine2.trim(),
        city: shippingAddress.city.trim(),
        province: shippingAddress.province.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        phoneNumber: shippingAddress.phoneNumber.trim(),
      };
    }

    if (paymentMethod === 'gcash') {
      order.gcash = {
        number: gcashNumber.trim(),
        pin: gcashPin.trim(),
      };
    }

    if (paymentMethod === 'credit_card') {
      order.creditCard = {
        number: cardNumber.trim(),
        expiry: expiryDate.trim(),
        cvv: cvv.trim(),
        name: cardholderName.trim(),
      };
    }

    try {
      setIsSubmitting(true);

      // Debugging logs
      console.log('cartItems:', cartItems);
      console.log('constructed order.items:', order.items);

      const response = await axios.post('http://localhost:5000/api/orders', order);

      if (response.status === 201) {
        const { orderId } = response.data;

        if (!orderId) {
          toast.error('Order ID not returned!');
          return;
        }

        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${orderId}`);
      } else {
        toast.error('Failed to place order.');
      }
    } catch (err) {
      let errorMessage = 'Something went wrong';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      console.error('Order submission failed:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800"> Checkout</h2>

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

      {/* Discount Code */}
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

      {/* Shipping Address - show only if delivery */}
      {deliveryMethod === 'delivery' && (
        <div className="border p-4 rounded mb-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Shipping Address</h3>

          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded w-full mb-2"
            value={shippingAddress.fullName}
            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Address Line 1"
            className="border p-2 rounded w-full mb-2"
            value={shippingAddress.addressLine1}
            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Address Line 2 (Optional)"
            className="border p-2 rounded w-full mb-2"
            value={shippingAddress.addressLine2}
            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="City"
            className="border p-2 rounded w-full mb-2"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Province"
            className="border p-2 rounded w-full mb-2"
            value={shippingAddress.province}
            onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="border p-2 rounded w-full mb-2"
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 rounded w-full"
            value={shippingAddress.phoneNumber}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Payment Method */}
      <div className="border p-4 rounded mb-4 bg-gray-50">
        <label className="text-lg font-medium mb-3">Payment Method</label>
        <select cl
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={isSubmitting}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="gcash">GCash</option>
          <option value="credit_card">Credit Card</option>
        </select>
      </div>

      {/* GCash fields */}
      {paymentMethod === 'gcash' && (
        <div className="mt-4">
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

      {/* Credit Card fields */}
      {paymentMethod === 'credit_card' && (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Card Number"
            className="border p-2 rounded w-full"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            className="border p-2 rounded w-full"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="CVV"
            className="border p-2 rounded w-full"
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

      {/* Order Summary */}
      <div className="mt-6 border-t pt-4 text-gray-800">
        <p className="flex justify-between font-medium">Subtotal: ₱{subtotal.toFixed(2)}</p>
        <p className="flex justify-between font-medium text-green-600">Discount: -₱{discountAmount.toFixed(2)}</p>
        <p className="flex justify-between font-medium">Delivery Fee: ₱{deliveryFee.toFixed(2)}</p>
        <p className="flex justify-between font-bold text-xl mt-2">Total: ₱{totalAmount.toFixed(2)}</p>
      </div>

      <button
        onClick={handleOrderSubmit}
        disabled={isSubmitting}
        className={`mt-6 w-full py-3 rounded text-white text-lg font-semibold ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;
