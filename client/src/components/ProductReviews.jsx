import React from 'react';

const ProductReviews = ({ reviews }) => {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (safeReviews.length === 0) {
    return (
      <p className="text-center text-gray-500 italic mt-6">No reviews yet.</p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {safeReviews.map((review) => {
        const user = review.user || {};
        const fullName = user.fullName || 'Anonymous';
        const email = user.email || 'No email';
        const imageUrl = user.imageUrl || '/default-avatar.png';

        return (
          <div
            key={review._id || review.id || Math.random()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 transition hover:shadow-lg"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 mb-3">
              <img
                src={imageUrl}
                alt="User avatar"
                className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
              />
              <div>
                <p className="text-gray-800 dark:text-white font-medium text-sm sm:text-base">
                  {fullName}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{email}</p>
              </div>
            </div>

            {/* Review Rating and Comment */}
            <div className="pl-1">
              <p className="text-yellow-500 font-semibold text-sm sm:text-base mb-1">
                ⭐ {review.rating}/5
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                {review.comment}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : 'Unknown date'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductReviews;
