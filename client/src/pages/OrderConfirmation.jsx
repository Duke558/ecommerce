// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-6 text-center">Loading order details...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">✅ Order Placed Successfully!</h2>
      <p className="mb-4 text-sm sm:text-base">Your order ID is <span className="font-mono font-semibold break-all">{order._id}</span>.</p>

      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Order Summary</h3>
        <ul className="mb-2 text-sm sm:text-base space-y-1">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))
          ) : (
            <p>No items in this order.</p>
          )}
        </ul>
        <p className="font-semibold mt-2">Total Amount: <span className="text-black">₱{order.totalAmount.toFixed(2)}</span></p>
        <p>Delivery Method: {order.deliveryMethod}</p>
        <p>Payment Method: {order.paymentMethod}</p>
        <p>Status: {order.status}</p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Link
          to={`/track-order/${order._id}`}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-center mb-3 sm:mb-0"
        >
          Track Your Order
        </Link>

        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
