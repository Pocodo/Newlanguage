const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const Bill = require("../models/billModel");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

router.post("/generatorReport", auth.authenticateToken, (req, res) => {
  const generatedUuid = uuid.v1();
  const orderDetails = req.body;

  try {
    const productDetailsReport = JSON.parse(orderDetails.productDetails);
  } catch (err) {
    console.error("Error parsing product details:", err);
    return res.status(400).json({ message: "Invalid product details format" });
  }

  const newBill = new Bill({
    uuid: generatedUuid,
    name: orderDetails.name,
    email: orderDetails.email,
    contactNumber: orderDetails.contactNumber,
    paymentMethod: orderDetails.paymentMethod,
    total: orderDetails.totalAmount,
    productDetails: orderDetails.productDetails,
    createdBy: req.user.id,
  });

  newBill.save((err, bill) => {
    if (err) {
      console.error("Error saving bill:", err);
      return res.status(500).json(err);
    }

    ejs.renderFile(
      path.join(__dirname, "", "report.ejs"),
      {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      },
      (err, html) => {
        if (err) {
          console.error("Error rendering EJS:", err);
          return res.status(500).json(err);
        }

        pdf
          .create(html)
          .toFile(`./generated_pdf/${generatedUuid}.pdf`, (err, data) => {
            if (err) {
              console.error("Error creating PDF:", err);
              return res.status(500).json(err);
            }
            return res.status(200).json({ uuid: generatedUuid });
          });
      }
    );
  });
});

module.exports = router;
