import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load products", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
        toast.error("Failed to load products. Please try again later.");
      }
    };

    fetchProducts();
    return () => toast.dismiss();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <TailSpin color="#ef4444" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500 mb-6">
        🛍️ Shopee Picks for You
      </h2>

      {error && (
        <p className="text-center text-red-600 font-medium mb-6">{error}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-orange-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 font-medium">
            🚫 No products found.
          </p>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable
      />
    </div>
  );
};

export default ProductList;
