const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

// User Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, contactNumber, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = new User({
      name,
      contactNumber,
      email,
      password,
    });
    await newUser.save();
    res.status(200).json({ message: "Successfully registered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    if (user.status === "false") {
      return res.status(401).json({ message: "Wait for admin approval" });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "8h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot Password
router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "Password sent to your email" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOption = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password",
      html: `<b>Your Password is: ${user.password}</b>`,
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(200).json({ message: "Password sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Users
router.get(
  "/get",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const users = await User.find({ role: "user" }).select(
        "id name email contactNumber status"
      );
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update User Status
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const { id, status } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User ID not found" });
      }
      res.status(200).json({ message: "Update success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Check Token
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

// Change Password
router.post("/changePassword", auth.authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({
      email: res.locals.email,
      password: oldPassword,
    });
    if (!user) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Update success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
