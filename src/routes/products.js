import express from "express";
import { createProduct, getAllProduts, getProductByName} from "../controllers/productController.js";
import { adminOnly, authMiddleware } from "../middlewares/auth.js";

const router =express.Router();

router.get('/', getAllProduts);
router.get('/:name',getProductByName);
// router.get("/:id", getProductById);
router.post('/', authMiddleware, adminOnly, createProduct);

export default router;