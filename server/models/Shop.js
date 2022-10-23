const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    title: String,
    startSku: Number,
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shop", ShopSchema, "shops");
module.exports = Shop;
