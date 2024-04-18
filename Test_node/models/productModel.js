const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: String,
  price: Number,
  image: String,
  status: String,
});

module.exports = mongoose.model("Product", productSchema);
