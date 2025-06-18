import React, { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateQuantity,
  getCartTotal,
} from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const refreshCart = () => {
    const items = getCart();

    // Ensure each item has a unique cartItemId
    const patchedItems = items.map((item) => {
      if (!item.cartItemId) {
        return {
          ...item,
          cartItemId: crypto.randomUUID?.() || `${item.name}-${Date.now()}`,
        };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(patchedItems));
    setCartItems(patchedItems);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemove = (cartItemId) => {
    removeFromCart(cartItemId);
    refreshCart();
  };

  const handleQuantityChange = (cartItemId, quantity) => {
    if (quantity < 1) return;
    updateQuantity(cartItemId, quantity);
    refreshCart();
  };

  const total = getCartTotal();
  const shipping = 10;

  return (
    <motion.div
      className="bg-gray-50 min-h-screen px-4 sm:px-6 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-orange-500 text-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🛒 Your Shopping Cart
      </motion.h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-md p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              Your cart is currently empty.
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.cartItemId}
                  className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 w-full sm:w-2/3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-orange-500 font-medium">
                        ₱{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                      onClick={() =>
                        handleQuantityChange(item.cartItemId, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="min-w-[20px] text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                      onClick={() =>
                        handleQuantityChange(item.cartItemId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      className="ml-2 text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full lg:w-1/3"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Cart Summary
          </h3>

          <div className="flex justify-between text-sm sm:text-base text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base text-gray-700 mb-2">
            <span>Shipping</span>
            <span>₱{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-800 mt-4">
            <span>Total</span>
            <span>₱{(total + shipping).toFixed(2)}</span>
          </div>

          <motion.button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-2 rounded-lg text-center shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Proceed to Checkout
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
