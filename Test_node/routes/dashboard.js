const express = require("express");
const router = express.Router();
const auth = require("../services/authentication");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Bill = require("../models/billModel");

router.get("/details", auth.authenticateToken, async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const billCount = await Bill.countDocuments();

    const data = {
      category: categoryCount,
      product: productCount,
      bill: billCount,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
