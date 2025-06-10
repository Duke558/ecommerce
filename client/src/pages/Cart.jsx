import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity, getCartTotal } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleRemove = (cartItemId) => {
    removeFromCart(cartItemId);
    setCartItems(getCart());
  };

  const handleQuantityChange = (cartItemId, quantity) => {
    updateQuantity(cartItemId, parseInt(quantity));
    setCartItems(getCart());
  };

  const total = getCartTotal();
  const shipping = 10;

  return (
    <motion.div
      className="bg-gray-100 min-h-screen p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔹 Header */}
      <motion.h2
        className="text-xl sm:text-2xl font-bold text-gray-800 border-b pb-2 sm:pb-4 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Shopping Cart
      </motion.h2>

      <div className="flex flex-col lg:flex-row mt-4 sm:mt-6 gap-6 sm:gap-8">
        {/* 🔹 Cart Items */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.cartItemId || item._id || item.id}
                  className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 gap-4 sm:gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-blue-600">₱{item.price}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 justify-end sm:justify-normal w-full sm:w-auto">
                    <button
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="font-medium min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      className="text-red-600 hover:underline hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Summary Section */}
        <motion.div
          className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full lg:w-1/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg sm:text-xl font-semibold border-b pb-2 sm:pb-4">Cart Summary</h3>

          <div className="mt-4 flex justify-between text-gray-700 text-sm sm:text-base">
            <span>Subtotal:</span> <span>₱{total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-gray-700 text-sm sm:text-base">
            <span>Shipping:</span> <span>₱{shipping.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex justify-between text-base sm:text-lg font-semibold text-gray-800">
            <span>Total:</span> <span>₱{(total + shipping).toFixed(2)}</span>
          </div>

          <motion.button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-green-700 transition shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Proceed To Checkout
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
