import express from 'express';
import Review from '../models/Review.js';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// POST /api/reviews/product/:productId — Create a new review
router.post('/product/:productId', requireAuth(), async (req, res) => {
  console.log('🔐 Authorization Header:', req.headers.authorization);
  console.log('🙋 User ID from Clerk:', req.auth?.userId);

  const { productId } = req.params; // Get productId from route param
  const { rating, comment } = req.body; // Get rating and comment from request body
  const userId = req.auth?.userId; // User ID from Clerk (Authenticated user)

  // Ensure required fields are provided
  if (!rating || !comment || !productId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if userId is valid
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Fetch the user data from Clerk using the authenticated userId
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found in Clerk' });
    }

    const userName =
      user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();

    // Create a new review document in MongoDB
    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date(),
    });

    // Save the review to the database
    await newReview.save();

    // Respond with the created review
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Failed to create review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/product/:productId — Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params; // Get productId from route param
  const sortBy = req.query.sortBy || 'createdAt'; // Sort by field (default: createdAt)
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Sort order (default: descending)

  try {
    // Fetch all reviews for the specific productId, sorted by the specified field
    const reviews = await Review.find({ productId }).sort({ [sortBy]: sortOrder });

    // Get the unique userIds from the reviews to fetch user data
    const userIds = [...new Set(reviews.map((review) => review.userId).filter(Boolean))];
    const userMap = {}; // Map to store user data (to prevent multiple API calls for the same user)

    if (userIds.length > 0) {
      try {
        // Fetch user data from Clerk for each unique userId
        for (const userId of userIds) {
          try {
            const user = await clerkClient.users.getUser(userId);
            userMap[user.id] = {
              fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              imageUrl: user.imageUrl, // Profile image URL
              email: user.emailAddresses[0]?.emailAddress || '', // User's email address
            };
          } catch (err) {
            console.error(' Error fetching user info from Clerk for userId:', userId, err);
            // Skip this user and move to the next one if there's an error fetching user info
          }
        }
      } catch (err) {
        console.error('Error fetching user info from Clerk:', err);
        return res.status(500).json({ message: 'Failed to fetch user details' });
      }
    }

    // Add user info to each review
    const reviewsWithUser = reviews.map((review) => ({
      ...review.toObject(),
      user: userMap[review.userId] || null, // Attach user data to review
    }));

    // Respond with the reviews and associated user info
    res.json(reviewsWithUser);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
