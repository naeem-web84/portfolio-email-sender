const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://naeem-portfolio-two.vercel.app",  // Your frontend domain
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));  // Preflight support
app.use(express.json());

// Create nodemailer transporter
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.PROFILE_EMAIL,
    pass: process.env.PROFILE_EMAIL_PASS,
  },
});

// Email sending route
app.post("/sendEmail", async (req, res) => {
  const { name, subject, description } = req.body;

  // Basic validation
  if (!name || !subject || !description) {
    return res.status(400).send({ result: "error", message: "Missing required fields" });
  }

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
    res.send({ result: "success" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).send({ result: "error", message: "Failed to send email" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
