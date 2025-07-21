// routes/user.js

import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// ✅ Save user after login/signup
router.post('/', async (req, res) => {
  const { uid, name, email, photoURL } = req.body;

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, name, email, photoURL });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Protected route to get user info from token (creates user if not exists)
router.get('/me', verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    // 🔄 If user not found, create one with token info
    if (!user) {
      const { uid, name, email, picture: photoURL } = req.user;

      user = new User({ uid, name, email, photoURL });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
