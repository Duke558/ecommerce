import React from 'react';

const ProductReviews = ({ reviews }) => {
  // Ensure reviews is an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (safeReviews.length === 0) {
    return <p className="text-gray-400">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6 mt-6">
      {safeReviews.map((review) => {
        const user = review.user || {};
        const fullName = user.fullName || 'Anonymous';
        const email = user.email || 'No email';
        const imageUrl = user.imageUrl || '/default-avatar.png';

        return (
          <div key={review._id || review.id || Math.random()} className="bg-gray-800 p-4 rounded-lg shadow-md">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-3">
              <img
                src={imageUrl}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-semibold">{fullName}</p>
                <p className="text-gray-400 text-sm">{email}</p>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <p className="text-yellow-400 font-semibold">⭐ {review.rating}/5</p>
              <p className="text-gray-200 mt-1">{review.comment}</p>
              <p className="text-gray-500 text-sm mt-2">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductReviews;
