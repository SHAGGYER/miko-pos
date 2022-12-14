const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    name: String,
    email: String,
    type: String,
    note: String,
    address: Object,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", ContactSchema, "contacts");
module.exports = Contact;
