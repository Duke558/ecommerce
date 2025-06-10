import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  const fetchProducts = async (searchQuery = search) => {
    try {
      setLoading(true);
      const query = {};
      if (category) query.category = category;
      if (searchQuery) query.search = searchQuery;

      const queryString = new URLSearchParams(query).toString();
      const res = await axios.get(`https://ecommerce-ams5.onrender.com/api/products?${queryString}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://ecommerce-ams5.onrender.com/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const debouncedFetchProducts = useMemo(
    () => debounce((value) => fetchProducts(value), 300),
    [category]
  );

  useEffect(() => {
    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetchProducts(value);
  };

  const clearFilters = () => {
    setSearch('');
    navigate('/products');
    fetchProducts('');
  };

  const handleCategoryClick = (catId) => {
    navigate(`/products?category=${catId}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 
              ${category === cat._id
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-orange-100 hover:text-orange-600'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="🔍 Search for products..."
          className="w-full sm:w-1/2 px-4 py-3 rounded-full border border-orange-300 shadow focus:ring-2 focus:ring-orange-400 transition"
        />
        {(category || search) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center text-orange-600 font-semibold text-lg">🔄 Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition duration-300 border border-orange-200"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3 flex flex-col gap-1">
                  <h2 className="text-sm font-medium text-gray-800 truncate">{product.name}</h2>
                  <p className="text-red-500 font-bold text-base">₱{product.price.toFixed(2)}</p>
                  <Link
                    to={`/products/${product._id}`}
                    className="mt-2 text-center w-full px-3 py-1.5 text-sm bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full font-medium">
              🚫 No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
