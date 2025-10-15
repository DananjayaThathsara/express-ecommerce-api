import Product from "../models/product.js";

/**
 * Create Product
 * POST /api/products
 *
 */
export async function createProduct(req, res, next) {
  try {
    const { name, description, price, quantity } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
    });
    return res.json(product);
  } catch (error) {
    next(error);
  }
}

/**
 * Retrive all products
 * GET /api/products
 *
 */
export async function getAllProduts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

/**
 * Retrive a produt ID
 * GET /api/products/:id
 *
 */
// export async function getProductById(req, res, next) {
//   try {
//     const  _id  = req.params.id;
//     const product = await Product.findOne({ _id });
//     return res.json(product);
//   } catch (error) {
//     next(error);
//   }
// }

/**
 * Retrive a produt Name
 * GET /api/products/:name
 *
 */
export async function getProductByName(req, res, next) {
  try {
    
    const name = req.params.name;
    const product = await Product.findOne({ name });
    return res.json(product);
  } catch (error) {
    next(error);
  }
}
