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

router.post("/generatorReport", auth.authenticateToken, async (req, res) => {
  const generatedUuid = uuid.v1();
  const orderDetails = req.body;
  console.log("bill:", req.body);
  // Assign orderDetails.productDetails directly to productDetailsReport
  const productDetailsReport = orderDetails.productDetails;

  const newBill = new Bill({
    uuid: generatedUuid,
    name: orderDetails.name,
    email: orderDetails.email,
    contactNumber: orderDetails.contactNumber,
    paymentMethod: orderDetails.paymentMethod,
    total: orderDetails.totalAmount,
    productDetails: orderDetails.productDetails,
  });

  try {
    const bill = await newBill.save();

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
      console.log("test : ", productDetailsReport),

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
  } catch (err) {
    console.error("Error saving bill:", err);
    return res.status(500).json(err);
  }
});
router.post("/getPdf", auth.authenticateToken, function (req, res) {
  const orderDetails = req.body;
  const pdfPath = `./generated_pdf/${orderDetails.uuid}.pdf`;
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    const productDetailsReport = orderDetails.productDetails;
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
          .toFile(`./generated_pdf/${orderDetails.uuid}.pdf`, (err, data) => {
            if (err) {
              console.error("Error creating PDF:", err);
              return res.status(500).json(err);
            }
            res.contentType("application/pdf");
            fs.createReadStream(pdfPath).pipe(res);
          });
      }
    );
  }
});
router.get("/get", auth.authenticateToken, async (req, res) => {
  try {
    const bills = await Bill.find().populate("createdBy");
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const deletedBill = await Bill.findByIdAndDelete(req.params.id);
      if (!deletedBill) {
        return res.status(404).json({ message: "No bill Found" });
      }
      res.status(200).json({ message: "bill deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
