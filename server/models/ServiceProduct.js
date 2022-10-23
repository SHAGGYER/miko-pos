const mongoose = require("mongoose");

const ServiceProductSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    sell_price: Number,
    quantity: Number,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const ServiceProduct = mongoose.model(
  "ServiceProduct",
  ServiceProductSchema,
  "service_products"
);
module.exports = ServiceProduct;
