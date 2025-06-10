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
import { FaHome, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";
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
    <div className="bg-white min-h-screen font-sans">
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
      <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-orange-500">SnapCartel</h1>

          {/* 🔹 Main Navigation */}
          <nav className="flex flex-wrap justify-center sm:justify-start gap-4 text-gray-600 font-medium text-sm">
            <Link to="/" className="hover:text-orange-500 flex items-center gap-1">
              <FaHome /> <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/products" className="hover:text-orange-500 flex items-center gap-1">
              <FaBoxOpen /> <span className="hidden sm:inline">Products</span>
            </Link>
            <Link to="/cart" className="hover:text-orange-500 flex items-center gap-1 relative">
              <FaShoppingCart />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* 🔹 User Auth / Profile */}
          <div className="flex gap-2 items-center text-gray-600 text-sm">
            <SignedIn>
              <Link to="/orders" className="hover:text-orange-500">
                📦 My Orders
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hover:text-orange-500">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hover:text-orange-500">Register</button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* 🔹 Main Content */}
      <main className="pt-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
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
