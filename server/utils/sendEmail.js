import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

function createTransporter() {
  const emailUser = String(process.env.EMAIL_USER || "").trim();
  const emailPass = String(process.env.EMAIL_PASS || "").trim();

  if (!emailUser || !emailPass) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is missing in environment variables."
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    logger: true,
    debug: true,
  });
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    if (!to) {
      throw new Error("Missing recipient email.");
    }

    const transporter = createTransporter();

    const verifyResult = await transporter.verify();
    console.log("✅ SMTP verify result:", verifyResult);

    const info = await transporter.sendMail({
      from: String(process.env.EMAIL_FROM || process.env.EMAIL_USER || "").trim(),
      to: String(to).trim(),
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error message:", err.message);
    console.error("❌ sendEmail error code:", err.code);
    console.error("❌ sendEmail full error:", err);
    console.error("❌ EMAIL CONFIG:", {
      hasEmailUser: Boolean(process.env.EMAIL_USER),
      hasEmailPass: Boolean(process.env.EMAIL_PASS),
      hasEmailFrom: Boolean(process.env.EMAIL_FROM),
      emailUser: String(process.env.EMAIL_USER || "").trim(),
      emailFrom: String(process.env.EMAIL_FROM || "").trim(),
    });

    throw err;
  }
}