const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow listed domains for CORS
const allowedOrigins = [
  "https://naeem-portfolio-two.vercel.app", // your frontend
  "http://localhost:5173", // for local development (optional)
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Apply CORS before all routes
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Nodemailer configuration
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.PROFILE_EMAIL,
    pass: process.env.PROFILE_EMAIL_PASS,
  },
});

// ✅ Email sending route
app.post("/sendEmail", async (req, res) => {
  const { name, subject, description } = req.body;

  if (!name || !subject || !description) {
    return res.status(400).json({ result: "error", message: "Missing fields" });
  }

  const mailOptions = {
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
    await emailTransporter.sendMail(mailOptions);
    res.json({ result: "success", message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ result: "error", message: "Email failed to send" });
  }
});

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running and ready to send emails!");
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
