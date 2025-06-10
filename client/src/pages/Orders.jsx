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
        console.error(' Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [isLoaded, user]);

  if (!isLoaded) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-orange-600">
         My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border border-orange-200 rounded-xl p-4 sm:p-6 shadow-md bg-white hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order ID:</span> {order._id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 text-xs rounded-full font-semibold">
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-sm sm:text-base">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 border-t pt-4 text-sm sm:text-base">
                <p className="text-gray-700">
                  <span className="font-medium">Delivery:</span> {order.deliveryMethod}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Payment:</span> {order.paymentStatus}
                </p>
                <p className="font-semibold text-gray-800 mt-1">
                  Total: <span className="text-orange-600">₱{order.totalAmount.toFixed(2)}</span>
                </p>
              </div>

              {/* CTA */}
              <div className="mt-4">
                <Link
                  to={`/track-order/${order._id}`}
                  className="inline-block bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition"
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
