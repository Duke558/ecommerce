import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-44 sm:h-56 md:h-64 object-cover object-center"
      />

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        {/* Product Name */}
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {product.name}
        </h2>

        {/* Price */}
        <p className="text-red-500 font-bold text-sm sm:text-base mt-1">
          ₱{product.price.toLocaleString()}
        </p>

        {/* View Details Button */}
        <Link
          to={`/products/${product._id}`}
          className="block mt-4 w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-xl text-sm sm:text-base transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
