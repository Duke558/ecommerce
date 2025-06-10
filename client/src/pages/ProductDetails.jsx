import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductReviews from '../components/ProductReviews';
import { useAuth } from '@clerk/clerk-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showReviews, setShowReviews] = useState(false); // <-- Added here

  const [token, setToken] = useState(null);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const t = await getToken();
        setToken(t);
      } else {
        setToken(null); // Clear token if signed out
      }
    };
    fetchToken();
  }, [isSignedIn, getToken]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        fetchRelatedProducts(res.data.category);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reviews/product/${productId}?sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to fetch reviews.');
    }
  };

  useEffect(() => {
    if (product?._id) {
      fetchReviews(product._id);
    }
  }, [sortBy, sortOrder, product?._id]);

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products?category=${categoryId}`);
      setRelatedProducts(res.data);
    } catch (err) {
      console.error('Error fetching related products:', err);
      toast.error('Failed to fetch related products.');
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
    window.dispatchEvent(new Event('storage'));
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newRating || !newComment.trim()) {
      toast.error('Please provide both rating and comment.');
      return;
    }

    if (!isSignedIn || !token) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/reviews/product/${product._id}`,
        { rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Review submitted!');
      setNewRating(5);
      setNewComment('');
      fetchReviews(product._id);
    } catch (err) {
      console.error('Error submitting review:', err.response?.data || err.message);
      toast.error('Failed to submit review.');
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) return <p>Loading product details...</p>;
  if (error || !product) return <p>Product not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Product Image & Info */}
      <div className="mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg shadow-md"
        />
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-green-500 font-bold text-xl mt-2">₱{product.price}</p>
      {averageRating && <p className="text-yellow-500 mt-2">⭐ {averageRating} / 5</p>}

      <button
        onClick={handleAddToCart}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        🛒 Add to Cart
      </button>

      {/* Customer Reviews */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

        {!showReviews ? (
          <button
            onClick={() => setShowReviews(true)}
            className="text-blue-600 font-semibold hover:underline focus:outline-none"
          >
            See Reviews ({reviews.length})
          </button>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3">
              <label className="text-lg">Sort by:</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="p-2 rounded border bg-gray-200 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date</option>
                <option value="rating">Rating</option>
              </select>

              <button
                onClick={handleSortOrderChange}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              </button>

              <button
                onClick={() => setShowReviews(false)}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Hide Reviews
              </button>
            </div>

            <ProductReviews reviews={reviews} />
          </>
        )}
      </section>

      {/* Write a Review */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block mb-1">Rating</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="p-2 rounded border bg-gray-200 text-gray-700 shadow-sm w-full"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="p-2 rounded border bg-gray-200 text-gray-700 shadow-sm w-full"
              rows="3"
              placeholder="Share your experience..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Related Products */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct._id}
              className="bg-gray-100 p-4 rounded-lg shadow-md transition hover:shadow-lg"
            >
              <img
                src={relatedProduct.image}
                alt={relatedProduct.name}
                className="h-40 w-full object-cover mb-4 rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800">{relatedProduct.name}</h3>
              <p className="text-green-500 font-bold">₱{relatedProduct.price}</p>
              <button
                onClick={() => navigate(`/products/${relatedProduct._id}`)}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
