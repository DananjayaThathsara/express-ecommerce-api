import Cart from "../models/cart.js";
import Product from "../models/product.js";

/**
 * Get Cart
 * GET /api/cart
 */
export async function getCart(req, res, next) {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    return res.json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * Add Items to cart
 * POST /api/cart/add
 */
export async function addToCart(req, res, next) {
  try {
    const userId = req.user._id ?? req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null)
      return res.status(400).json({ message: "Product and quantity required" });
    if (quantity < 0)
      return res.status(400).json({ message: "Quantity must be >= 0" });

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    console.log(cart);
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const idx = cart.items.findIndex(
      (i) => i.product.toString() === productId.toString()
    );

    if (idx === -1 && quantity > 0) {
      cart.items.push({ product: productId, quantity });
    } else if (idx !== -1) {
      if (quantity === 0) cart.items.splice(idx, 1);
      else cart.items[idx].quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updated = await Cart.findById(cart._id).populate("items.product");
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Add Items to cart
 * POST /api/cart/clear
 */
export async function clearCart(req, res, next) {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], updatedAt: new Date() },
      { upsert: true }
    );
    return res.json({ message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
}
