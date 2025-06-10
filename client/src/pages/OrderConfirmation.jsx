// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmation = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null); // State to hold order data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    // Function to fetch order details
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(response.data); // Set order details in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details'); // Set error message if failed
        setLoading(false); // Set loading to false
      }
    };

    fetchOrder(); // Call the fetch order function
  }, [orderId]); // Dependency array ensures this runs when orderId changes

  if (loading) return <div className="p-6 text-center">Loading order details...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-green-700">✅ Order Placed Successfully!</h2>
      <p className="mb-4">Your order ID is <span className="font-mono font-semibold">{order._id}</span>.</p>

      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <ul className="mb-2">
          {/* Safely mapping through order items to display each item and its quantity */}
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity} = ₱{(item.price * item.quantity).toFixed(2)}
              </li>
            ))
          ) : (
            <p>No items in this order.</p>
          )}
        </ul>
        {/* Display total amount */}
        <p>Total Amount: <strong>₱{order.totalAmount.toFixed(2)}</strong></p>
        {/* Display delivery method */}
        <p>Delivery Method: {order.deliveryMethod}</p>
        {/* Display payment method */}
        <p>Payment Method: {order.paymentMethod}</p>
        {/* Display order status */}
        <p>Status: {order.status}</p>
      </div>

      {/* Track Order button */}
      <Link
        to={`/track-order/${order._id}`}
        className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Track Your Order
      </Link>

      {/* Link back to home page */}
      <Link
        to="/"
        className="inline-block mt-4 ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmation;
