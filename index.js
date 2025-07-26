const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const emailTrnasporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.PROFILE_EMAIL,
        pass: process.env.PROFILE_EMAIL_PASS
    }
})



// email route
app.post('/sendEmail', async (req, res) => {
   const { name, subject, description } = req.body;

   const emailObj = {
     from: `Portfolio Message from ${name} <${process.env.PROFILE_EMAIL}>`,
     to: process.env.EMAIL_GETTER,
     subject: subject,
     html: `
       <p><strong>Sender:</strong> ${name}</p>
       <p><strong>Subject:</strong> ${subject}</p>
       <p><strong>Message:</strong></p>
       <div>${description}</div>
     `
   };

   try {
     await emailTrnasporter.sendMail(emailObj);
     res.send({ result: 'success' });
   } catch (err) {
     console.error("email sender error", err);
     res.status(500).send({ result: 'error' });
   }
});






// test route
app.get("/", (req, res) => {
    res.send("Backend is running...");
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
