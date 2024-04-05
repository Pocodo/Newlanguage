const express = require("express");
const connection = require("../connectionmongo");
const router = express.Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
var uuid = require("uuid");
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/generatorReport", auth.authenticateToken, (req, res) => {
  const generatorReport = uuid.v1();
  const orderDetails = req.body;
  var productDetailsReport = JSON.parse(orderDetails.productDetailsReport);

  query =
    "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
  connection.query(
    query,
    [
      orderDetails.name,
      generatorUuid,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      res.locals.email,
    ],
    (err, results) => {}
  );
});
