const express = require("express");
var cors = require("cors");
const path = require('path');
const connection = require("./connectionmongo");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const billRoute = require("./routes/bill");
const dashBoardRoute = require("./routes/dashboard");
const app = express();
app.use(cors({
    origin: 'http://localhost:4200/cafe/IndexProduct',
    origin: 'http://localhost:4200/cafe',
    origin: 'http://localhost:4200',
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/bill", billRoute);
app.use("/dashboard", dashBoardRoute);
app.use(express.static(path.join(__dirname, '../resource')));
app.use('/images/',express.static('images'))
module.exports = app;
