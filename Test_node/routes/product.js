const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/get", auth.authenticateToken, async (req, res) => {
  try {
    // Populate the 'categoryId' field to include the entire category document
    const products = await Product.find().populate("categoryId");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category ID
router.get("/getByCategory/:id", auth.authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({
      categoryId: req.params.id,
      status: "true",
    }).select("id name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get("/getById/:id", auth.authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "id name description price"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.body.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "No product Found" });
      }
      res.status(200).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete product
router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "No product Found" });
      }
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
