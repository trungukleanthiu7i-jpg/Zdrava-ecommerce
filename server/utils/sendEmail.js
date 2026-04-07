import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  try {
    if (!to) {
      throw new Error("Missing recipient email.");
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY in environment variables.");
    }

    const from = String(
      process.env.EMAIL_FROM || "onboarding@resend.dev"
    ).trim();

    const response = await resend.emails.send({
      from,
      to: [String(to).trim()],
      subject: String(subject || "").trim(),
      html,
      text,
    });

    console.log("✅ Email sent (Resend):", response);
    return response;
  } catch (err) {
    console.error("❌ Resend email error:", err);
    throw err;
  }
}