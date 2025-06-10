import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight, FaSearch, FaHeart, FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="flex mt-4 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔹 Sidebar Categories */}
      <motion.aside 
        className="w-1/4 bg-white shadow-md p-6 rounded-lg"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
        <ul className="space-y-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <motion.li 
                key={category._id} 
                className="hover:text-blue-600 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to={`/products?category=${encodeURIComponent(category._id)}`} 
                  className="block text-gray-700 font-medium"
                >
                  {category.name}
                </Link>
              </motion.li>
            ))
          ) : (
            <p className="text-gray-400">No categories available.</p>
          )}
        </ul>
      </motion.aside>

      {/* 🔹 Main Content */}
      <div className="flex-1 px-6">
        {/* 🔹 Hero Section */}
        <motion.div 
          className="relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg"
          style={{ 
            height: "80vh",
            backgroundImage: "url('https://images.unsplash.com/photo-1678203699263-917199c725b2?auto=format&fit=crop&w=1920&q=80')" 
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative z-10 text-center px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-blue-600 mb-4">
              SNAP CARTEL
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-6">
              Discover the new wave of shopping — bold, stylish, and unforgettable.
            </p>
            <Link to="/products">
              <motion.button
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-600 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;