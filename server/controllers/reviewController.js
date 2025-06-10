import Review from '../models/Review.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const createReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.auth?.userId;

  if (!rating || !comment || !productId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const userName =
      user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date(),
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error('❌ Failed to create review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  try {
    const reviews = await Review.find({ productId }).sort({ [sortBy]: sortOrder });

    const userIds = [...new Set(reviews.map((review) => review.userId).filter(Boolean))];

    const userMap = {};

    if (userIds.length > 0) {
      for (const userId of userIds) {
        const user = await clerkClient.users.getUser(userId);
        userMap[user.id] = {
          fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0]?.emailAddress || '',
        };
      }
    }

    const reviewsWithUser = reviews.map((review) => ({
      ...review.toObject(),
      user: userMap[review.userId] || null,
    }));

    res.json(reviewsWithUser);
  } catch (error) {
    console.error('❌ Failed to fetch reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
