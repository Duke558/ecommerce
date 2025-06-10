import express from 'express';
import { clerkMiddleware, requireAuth } from './path-to-your-middleware';

const app = express();

app.use(clerkMiddleware);

app.get('/protected-route', requireAuth, (req, res) => {
  res.json({ message: 'This is protected content', userId: req.auth.userId });
});
