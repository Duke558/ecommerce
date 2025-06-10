import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TrackOrder = () => {
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

  if (loading) return <div className="p-6 text-center text-orange-500 font-medium">Loading your order...</div>;
  if (error) return <div className="p-6 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 mb-4 text-center">Track Your Order</h1>

      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-orange-200">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Order ID:</p>
          <p className="font-mono font-semibold break-all">{order._id}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">Current Status</h3>
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {order.status}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Order Items</h3>
          {order.items && order.items.length > 0 ? (
            <ul className="space-y-3">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="text-sm sm:text-base font-medium text-gray-700">
                    {item.name} <span className="text-gray-500">x {item.quantity}</span>
                  </div>
                  <div className="text-sm sm:text-base text-gray-800 font-semibold">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items in this order.</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <p className="text-gray-700">
            <span className="font-semibold">Total Amount:</span> ₱{order.totalAmount.toFixed(2)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Delivery Method:</span> {order.deliveryMethod}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TrackOrder;
