const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

var bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const file = multer({ dest: 'resource/products/' });
router.use(express.json());
router.use(bodyParser.urlencoded());

// Add Product
router.post("/add", auth.authenticateToken, checkRole.checkRole,file.single('image'), async (req, res) => {
  try {
    console.log(req.body);
    const product = await Product.create(req.body);

    const filepath = '../resource/products';
    const fullPath = path.join(__dirname, filepath,  '/');
    fs.mkdir(fullPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Không thể tạo thư mục:', err);
      } else {
        console.log('Thư mục đã được tạo thành công!');
      }
    });
    if (req.file) {
      console.log(req.file.originalname);
      var target_path = fullPath + product.id.toString() + '.jpg';
      const tmp_path = req.file.path;
      const src = fs.createReadStream(tmp_path);
      var dest = fs.createWriteStream(target_path);
      src.pipe(dest).once('close', () => {
        src.destroy();
        fs.unlink(path.join(req.file.path), (err) => {
          if (err) {
            console.error('Không thể xoá file tạm thời:', err);
          } else {
            console.log('File tạm thời đã được xoá thành công!');
          }
        });
      });
      product.image='http://localhost:8080/resource/products/' + product.id + '.jpg';
      await product.save();
      console.log('Đường dẫn ảnh đã được cập nhật thành công!');
    }
    else {
      console.log('no file uploaded');
    }
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

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