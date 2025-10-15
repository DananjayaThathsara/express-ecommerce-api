import express from "express";
import cors from "cors";
import { connectDB } from "./configs/db.js";
import { PORT } from "./configs/config.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

//middlewares
app.use(express.json()); //allow json body
app.use(cors()); //allow browser reuest
app.use(morgan("dev")); //log requests

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/", (req, res) => res.send("E-commerce API running"));

// Error handler (after routes)
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`server is running port: ${PORT}`);
    });
  } catch (error) {
    console.log("Server is failed to run", error.message);
    process.exit(1);
  }
};
start()
