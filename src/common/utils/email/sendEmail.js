import nodemailer from "nodemailer"
import { env } from "../../../../config/index.js";
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service : "gmail",
  auth: {
    user: env.APP_EMAIL,
    pass: env.APP_PASSWORD,
  },
});

// Send an email using async/await
export let sendEmail = async ({
    to,
    subject , 
    html
}) => {
  const info = await transporter.sendMail({
    from: `"ALi hassan" <${env.APP_EMAIL}>`,
    to,
    subject,
    // text: "Hello world?", // Plain-text version of the message
    html, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
}