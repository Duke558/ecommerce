import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PrivateRoute from "./routes/PrivateRoute";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";
import { FaHome, FaBoxOpen, FaShoppingCart, FaUser, FaSearch, FaHeart } from "react-icons/fa";

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCart } from "./utils/cartUtils";

const App = () => {
  const { user } = useUser();
  const [cartCount, setCartCount] = useState(getCart().length);

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCart().length);
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 🔹 Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* 🔹 Navbar */}
      <header className="bg-white shadow-md p-3">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">🛍 SnapCartel</h1>

          <nav className="flex gap-6 text-gray-600 font-medium">
            <Link to="/" className="hover:text-blue-600 flex items-center gap-2">
              <FaHome /> Home
            </Link>
            <Link to="/products" className="hover:text-blue-600 flex items-center gap-2">
              <FaBoxOpen /> Products
            </Link>
            <Link to="/cart" className="relative hover:text-blue-600 flex items-center gap-2">
              <FaShoppingCart />
              Cart
              {cartCount > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* 🔹 User Menu */}
          <div className="flex gap-4 text-gray-600">
            <SignedIn>
              <Link to="/orders" className="hover:text-blue-600 flex items-center gap-2">
                📦 My Orders
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hover:text-blue-600">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hover:text-blue-600">Register</button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* 🔹 Main Content */}
      <main className="mt-6 px-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order-confirmation/:orderId" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;