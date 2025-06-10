import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://ecommerce-ams5.onrender.com/api/orders', {
          params: {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
          },
        });

        setOrders(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [isLoaded, user]);

  if (!isLoaded) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md bg-white transition hover:shadow-lg"
            >
              <div className="mb-3">
                <p className="text-xs text-gray-500">
                  Order Date: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Status: <span className="text-indigo-600">{order.status}</span>
                </p>
                <p className="text-sm text-gray-600">Delivery: {order.deliveryMethod}</p>
                <p className="text-sm text-gray-600">Payment: {order.paymentStatus}</p>
                <p className="text-sm font-semibold text-gray-800">
                  Total: ₱{order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Items:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-gray-600">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity} = ₱
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <Link
                  to={`/track-order/${order._id}`}
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
