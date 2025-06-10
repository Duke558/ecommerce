import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300 transition hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover mb-4 rounded-lg"
      />
      <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
      <p className="text-green-500 font-bold text-lg">₱{product.price}</p>
      <Link
        to={`/products/${product._id}`}
        className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;