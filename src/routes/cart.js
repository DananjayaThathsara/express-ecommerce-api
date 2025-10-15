
import express from "express";
import { getCart, addToCart, clearCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// all cart routes require auth
router.use(authMiddleware); 

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/clear", clearCart);

export default router;
