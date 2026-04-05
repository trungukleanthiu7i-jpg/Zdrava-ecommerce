import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Missing verification token.");
          return;
        }

        const res = await axiosClient.get(
          `/users/verify-email?token=${encodeURIComponent(token)}`
        );

        setStatus("success");
        setMessage(
          res.data?.message || "Email verified successfully. You can now log in."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Email verification failed."
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>
          {status === "loading"
            ? "Verifying..."
            : status === "success"
            ? "Email Verified"
            : "Verification Failed"}
        </h1>

        <p style={{ marginBottom: "24px", color: "#555", lineHeight: 1.6 }}>
          {message}
        </p>

        {status !== "loading" && (
          <Link
            to="/auth"
            style={{
              display: "inline-block",
              padding: "12px 22px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "10px",
            }}
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}