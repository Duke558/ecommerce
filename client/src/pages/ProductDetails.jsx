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
  const [showReviews, setShowReviews] = useState(false);

  const [token, setToken] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const t = await getToken();
        setToken(t);
      } else {
        setToken(null);
      }
    };
    fetchToken();
  }, [isSignedIn, getToken]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`https://ecommerce-ams5.onrender.com/api/products/${id}`);
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
        `https://ecommerce-ams5.onrender.com/api/reviews/product/${productId}?sortBy=${sortBy}&sortOrder=${sortOrder}`
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

  const handleSortChange = (event) => setSortBy(event.target.value);
  const handleSortOrderChange = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

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
        `https://ecommerce-ams5.onrender.com/api/reviews/product/${product._id}`,
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

  if (loading) return <p className="text-center p-10">Loading product details...</p>;
  if (error || !product) return <p className="text-center p-10 text-red-500">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-red-500 text-3xl font-extrabold mb-2">₱{product.price}</p>
            {averageRating && (
              <p className="text-yellow-500 font-medium mb-4">⭐ {averageRating} / 5</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {!showReviews ? (
          <button
            onClick={() => setShowReviews(true)}
            className="text-blue-600 font-semibold underline"
          >
            See Reviews ({reviews.length})
          </button>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="p-2 rounded border bg-white shadow-sm"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
              </select>

              <button
                onClick={handleSortOrderChange}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              </button>

              <button
                onClick={() => setShowReviews(false)}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hide Reviews
              </button>
            </div>

            <ProductReviews reviews={reviews} />
          </>
        )}
      </section>

      {/* Submit Review Section */}
      <section className="mt-10">
        <h3 className="text-xl font-bold mb-3">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block mb-1">Rating</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="p-2 w-full rounded border bg-white shadow-sm"
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
              rows="4"
              className="p-2 w-full rounded border bg-white shadow-sm"
              placeholder="Share your experience..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            Submit Review
          </button>
        </form>
      </section>

      {/* Related Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct._id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={relatedProduct.image}
                alt={relatedProduct.name}
                className="h-40 w-full object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {relatedProduct.name}
                </h3>
                <p className="text-red-500 font-bold text-lg mt-1">₱{relatedProduct.price}</p>
                <button
                  onClick={() => navigate(`/products/${relatedProduct._id}`)}
                  className="mt-3 w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
