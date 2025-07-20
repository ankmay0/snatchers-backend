import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/auth.js'; // ✅ Add the auth middleware

const router = express.Router();

// ✅ Save user after login/signup
router.post('/user', async (req, res) => {
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

// ✅ Protected route to get user info from token
router.get('/user/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
