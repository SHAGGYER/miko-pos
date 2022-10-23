const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    title: String,
    buy_price: Number,
    sell_price: Number,
    quantity: Number,
    sku: String,
    storage: {
      type: mongoose.Types.ObjectId,
      ref: "Storage",
    },
    type: String,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema, "products");
module.exports = Product;
