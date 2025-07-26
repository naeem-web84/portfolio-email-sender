const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS options for your frontend domain
const corsOptions = {
  origin: "https://naeem-portfolio-two.vercel.app", // your frontend URL here
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware BEFORE routes
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

// Body parser middleware
app.use(express.json());

// Nodemailer setup
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.PROFILE_EMAIL,
    pass: process.env.PROFILE_EMAIL_PASS,
  },
});

// POST /sendEmail route
app.post("/sendEmail", async (req, res) => {
  const { name, subject, description } = req.body;

  const emailObj = {
    from: `Portfolio Message from ${name} <${process.env.PROFILE_EMAIL}>`,
    to: process.env.EMAIL_GETTER,
    subject,
    html: `
      <p><strong>Sender:</strong> ${name}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div>${description}</div>
    `,
  };

  try {
    await emailTransporter.sendMail(emailObj);
    res.json({ result: "success" });
  } catch (error) {
    console.error("Email sender error:", error);
    res.status(500).json({ result: "error" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
