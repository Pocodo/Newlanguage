const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

var bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uploadDirectory = path.join(__dirname, '../../resource/images/');
const file = multer({ dest: uploadDirectory });

router.use(express.json());
router.use(bodyParser.urlencoded());

// Add Product
router.post("/add", auth.authenticateToken, checkRole.checkRole, file.single('image'), async (req, res) => {
  try {
    console.log(req.body);
    const product = await Product.create(req.body);

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
      console.log('Upload directory created successfully!');
    }

    if (req.file) {
      console.log(req.file.originalname);
      const targetPath = path.join(uploadDirectory, product.id.toString() + '.jpg');
      fs.renameSync(req.file.path, targetPath);
      product.image = 'http://localhost:8080/images/' + product.id + '.jpg';
      await product.save();
      console.log('Image path updated successfully!');
    } else {
      console.log('No file uploaded');
    }

    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all products
router.get("/get", auth.authenticateToken, async (req, res) => {
  try {
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
router.patch("/update", auth.authenticateToken, checkRole.checkRole, async (req, res) => {
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
router.delete("/delete/:id", auth.authenticateToken, checkRole.checkRole, async (req, res) => {
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