// routes/cartRoutes.js
import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
// import verifyToken from "../middleware/verifyToken.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// GET /api/cart - Get user's cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart) return res.status(200).json({ items: [] }); // Empty cart
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/cart/:productId - Add item to cart or increase quantity
router.post("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const quantity = req.body.quantity || 1;

  try {
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.equals(productId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/cart/:productId - Update quantity
router.put("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.product.equals(productId));
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
