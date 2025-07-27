import express from 'express';
import axios from 'axios';
const router = express.Router();

// You should put real credentials in .env and use process.env.SHIPROCKET_EMAIL, etc
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let shiprocketToken = null;
let tokenExpiry = null;

// Helper function to fetch a new token if needed
const getShiprocketToken = async () => {
  const shouldRefresh = !shiprocketToken || (tokenExpiry && Date.now() >= tokenExpiry);
  if (!shouldRefresh) return shiprocketToken;

  const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: SHIPROCKET_EMAIL,
    password: SHIPROCKET_PASSWORD,
  });
  shiprocketToken = res.data.token;
  tokenExpiry = Date.now() + ((res.data.expires_in ? res.data.expires_in : 240 * 60 * 60) * 1000); // fallback: 10 days
  return shiprocketToken;
};

router.post('/create-order', async (req, res) => {
  try {
    const token = await getShiprocketToken();

    // `orderData` should follow Shiprocket's API format.
    const orderData = req.body;

    const result = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ status: 'SUCCESS', shiprocket: result.data });
  } catch (err) {
    res.status(err.response?.status || 500).json({
      status: 'ERROR',
      message: err.response?.data || err.message,
    });
  }
});

export default router;
