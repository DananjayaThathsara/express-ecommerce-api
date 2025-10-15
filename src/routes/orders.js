// src/routes/orders.js
import express from "express";
import { createOrderFromCart, getMyOrders } from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrderFromCart);
router.get("/", getMyOrders);

export default router;
