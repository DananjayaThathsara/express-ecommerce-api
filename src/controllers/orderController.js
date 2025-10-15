
import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

/**
 * 
 * POST /api/orders
 */
export async function createOrderFromCart(req, res, next) {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // check stock
    for (const item of cart.items) {
      if (item.quantity > item.product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
    }

    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const prod = await Product.findById(item.product._id);
      prod.quantity -= item.quantity;//reduce products qnty
      await prod.save();

      orderItems.push({
        product: prod._id,
        quantity: item.quantity,
        priceAtPurchase: prod.price
      });

      total += prod.price * item.quantity;
    }

    const order = await Order.create({ user: userId, items: orderItems, total });

    // clear cart
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
    return res.json(orders);
  } catch (err) {
    next(err);
  }
}
