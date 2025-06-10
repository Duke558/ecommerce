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
      const response = await axios.get('http://localhost:5000/api/orders', {
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


  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📦 My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="border rounded p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">
              Order Date: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="font-semibold mb-1">Status: {order.status}</p>
            <p>Delivery: {order.deliveryMethod}</p>
            <p>Payment: {order.paymentStatus}</p>
            <p>Total: ₱{order.totalAmount.toFixed(2)}</p>

            <div className="mt-2">
              <p className="font-semibold">Items:</p>
              <ul className="list-disc pl-6">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity} = ₱{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Track Order Button */}
            <div className="mt-4">
              <Link
                to={`/track-order/${order._id}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Track Order
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
