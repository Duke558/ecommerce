// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`https://ecommerce-ams5.onrender.com/api/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(' Failed to fetch order details.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-6 text-center text-lg font-medium">Loading your order details...</div>;
  if (error) return <div className="p-6 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <FaCheckCircle className="text-4xl sm:text-5xl text-green-500 mb-2" />
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">Order Placed Successfully!</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Thank you for shopping with us! Your order ID is:
            <span className="block font-mono font-semibold text-black break-all mt-1">
              {order._id}
            </span>
          </p>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800"> Order Summary</h3>
          <ul className="space-y-3 text-sm sm:text-base">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2 last:border-none text-gray-700"
                >
                  <div className="flex-1">{item.name} x {item.quantity}</div>
                  <div className="font-semibold text-black">₱{(item.price * item.quantity).toFixed(2)}</div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No items in this order.</p>
            )}
          </ul>

          <div className="mt-4 space-y-1 text-sm sm:text-base text-gray-700">
            <p><span className="font-semibold">Total Amount:</span> ₱{order.totalAmount.toFixed(2)}</p>
            <p><span className="font-semibold">Delivery Method:</span> {order.deliveryMethod}</p>
            <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
            <p><span className="font-semibold">Status:</span> <span className="capitalize">{order.status}</span></p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            to={`/track-order/${order._id}`}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-center px-5 py-2.5 rounded-full font-semibold transition"
          >
             Track Your Order
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white text-center px-5 py-2.5 rounded-full font-semibold transition"
          >
             Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
