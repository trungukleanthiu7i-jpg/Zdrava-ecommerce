import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "../styles/AuthPage.scss";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AuthPage = () => {
  const { t } = useTranslation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  /* ==================================================
     ✅ ROLE-BASED AUTO REDIRECT
  ================================================== */
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");

    try {
      const endpoint = isSignUp
        ? `${API}/api/users/register`
        : `${API}/api/users/login`;

      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, user: userData, message: backendMessage } = res.data;

      if (!token || !userData) {
        setMessage(backendMessage || t("Authentication failed."));
        setSubmitting(false);
        return;
      }

      // 🔐 Save token
      localStorage.setItem("token", token);

      // ✅ Save user in context
      loginUser(userData);

      setFormData({ username: "", password: "" });
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          t("Authentication failed. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================================
     🔐 OAUTH HANDLERS
  ================================ */
  const handleGoogleLogin = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API}/api/auth/facebook`;
  };

  return (
    <div className="auth-wrapper">
      <div className="background-particles">
        {[...Array(15)].map((_, i) => (
          <span key={i} className="particle" />
        ))}
      </div>

      <div className={`auth-card ${isSignUp ? "flipped" : ""}`}>
        {/* ================= SIGN IN ================= */}
        <div className="auth-face front">
          <div className="auth-hero">
            <h1>{t("Welcome Back!")}</h1>
            <p>{t("Log in to your account to access all features.")}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2>{t("Sign In")}</h2>

            {/* 🔐 SOCIAL LOGIN */}
            <div className="social-login">
              <button
                type="button"
                className="social-btn google"
                onClick={handleGoogleLogin}
                title={t("Continue with Google")}
              >
                <FaGoogle />
              </button>

              <button
                type="button"
                className="social-btn facebook"
                onClick={handleFacebookLogin}
                title={t("Continue with Facebook")}
              >
                <FaFacebookF />
              </button>
            </div>

            <input
              type="text"
              name="username"
              placeholder={t("Email or Username")}
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder={t("Password")}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? t("Signing in...") : t("Sign In")}
            </button>

            {message && <p className="msg">{message}</p>}

            <p className="switch-text">
              {t("Don’t have an account?")}{" "}
              <span onClick={toggleForm}>{t("Sign Up")}</span>
            </p>
          </form>
        </div>

        {/* ================= SIGN UP ================= */}
        <div className="auth-face back">
          <div className="auth-hero">
            <h1>{t("Join Us Today!")}</h1>
            <p>{t("Create your account and start exploring the platform.")}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2>{t("Create Account")}</h2>

            <input
              type="text"
              name="username"
              placeholder={t("Email or Username")}
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder={t("Password")}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? t("Creating account...") : t("Sign Up")}
            </button>

            {message && <p className="msg">{message}</p>}

            <p className="switch-text">
              {t("Already have an account?")}{" "}
              <span onClick={toggleForm}>{t("Sign In")}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
