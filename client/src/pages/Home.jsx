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
      .get("https://ecommerce-ams5.onrender.com/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="flex flex-col lg:flex-row mt-4 px-4 md:px-10 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <motion.aside
        className="w-full lg:w-1/4 bg-white shadow-md p-4 rounded-xl sticky top-4 h-fit z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-4 text-orange-500">Categories</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <motion.li
                key={category._id}
                className="hover:text-orange-500 transition-all"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category._id)}`}
                  className="block text-gray-800 font-medium"
                >
                  {category.name}
                </Link>
              </motion.li>
            ))
          ) : (
            <p className="text-gray-400">No categories found.</p>
          )}
        </ul>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Hero Section */}
        <motion.div
          className="relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-xl"
          style={{
            height: "55vh",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1678203699263-917199c725b2?auto=format&fit=crop&w=1920&q=80')",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          
          <motion.div
            className="relative z-10 text-center px-4 md:px-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-400 mb-4 drop-shadow">
              SNAP CARTEL
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white mb-6 max-w-xl mx-auto">
              Discover hot deals and must-haves — stylish, bold, and affordable.
            </p>
            <Link to="/products">
              <motion.button
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-orange-600 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Promo Banner */}
        <motion.div
          className="w-full bg-orange-100 text-orange-700 px-6 py-4 rounded-lg shadow-sm text-center text-sm sm:text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🎉 Enjoy up to <span className="font-bold">50% OFF</span> on select
          items this month!
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
