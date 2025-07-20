// server.js
import dotenv from 'dotenv';
import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import './config/firebase.js'; // ✅ Firebase Admin SDK initialized
import authRoutes from './routes/auth.js';
import wishlistRoutes from './routes/wishlist.js';
import userRoutes from './routes/user.js'; // ✅ Add this line
import productRoutes from './routes/product.js';
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // if you're using cookies or auth headers
}));
app.use(express.json());

// Routes
app.use('/api', authRoutes);              // 🔑 Login (POST /api/auth/google)
app.use('/api', userRoutes);              // 👤 User routes (POST /api/user, GET /api/user/me)
app.use('/api/wishlist', wishlistRoutes); // 🛒 Wishlist protected routes
app.use("/api/products", productRoutes); // productRoutes imported correctly
app.use("/api/cart", cartRoutes); // 🛒 Cart protected routes

// Root
app.get('/', (req, res) => {
  res.send('🔥 API is running...');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
