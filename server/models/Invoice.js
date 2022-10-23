const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    contact: Object,
    total: Number,
    deletedAt: Date,
    lines: Array,
    shortId: String,
    fileName: String,
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema, "invoices");
module.exports = Invoice;
