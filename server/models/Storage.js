const mongoose = require("mongoose");

const StorageSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    title: String,
  },
  {
    timestamps: true,
  }
);

const Storage = mongoose.model("Storage", StorageSchema, "storages");
module.exports = Storage;
