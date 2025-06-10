import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

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
      className="flex flex-col lg:flex-row mt-4 px-4 md:px-6 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔹 Sidebar Categories */}
      <motion.aside
        className="w-full lg:w-1/4 bg-white shadow-md p-4 md:p-6 rounded-lg"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <ul className="space-y-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <motion.li
                key={category._id}
                className="hover:text-orange-500 cursor-pointer"
                whileHover={{ scale: 1.05 }}
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
      <div className="flex-1">
        {/* 🔹 Hero Section */}
        <motion.div
          className="relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg"
          style={{
            height: "60vh",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1678203699263-917199c725b2?auto=format&fit=crop&w=1920&q=80')",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          
          <motion.div
            className="relative z-10 text-center px-4 md:px-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-orange-500 mb-4">
              SNAP CARTEL
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-white mb-6">
              Discover hot deals and must-haves — stylish, bold, and affordable.
            </p>
            <Link to="/products">
              <motion.button
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-orange-600 transition shadow-md"
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
