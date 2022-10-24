const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    lines: Array,
    contact: Object,
    total: Number,
    ready: Boolean,
    type: String,
    shortId: String,
    paidAt: Date,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Case = mongoose.model("Case", CaseSchema, "cases");
module.exports = Case;
