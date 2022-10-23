const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    title: String,
    sell_price: Number,
    sku: String,
    deletedAt: Date,
    serviceProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ServiceProduct",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", ServiceSchema, "services");
module.exports = Service;
