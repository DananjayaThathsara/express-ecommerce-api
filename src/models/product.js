
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, min: 0, required: true },
  quantity: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model("Product", productSchema);
