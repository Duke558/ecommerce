import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 sm:h-56 object-cover"
      />

      <div className="p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-green-600 font-bold text-sm sm:text-base mt-1">
          ₱{product.price}
        </p>

        <Link
          to={`/products/${product._id}`}
          className="inline-block mt-3 w-full sm:w-auto text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
