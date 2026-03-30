import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "../styles/AuthPage.scss";
import {
  FaFacebookF,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AuthPage = () => {
  const { t } = useTranslation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    signIn: false,
    signUp: false,
  });

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

  const getPasswordChecks = (password) => {
    return {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  };

  const validatePassword = (password) => {
    const checks = getPasswordChecks(password);
    return checks.minLength && checks.hasUppercase && checks.hasNumber;
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setMessage("");
    setPasswordError("");
    setFormData({ username: "", password: "" });
    setShowPassword({
      signIn: false,
      signUp: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" && isSignUp) {
      if (!value) {
        setPasswordError("");
      } else if (!validatePassword(value)) {
        setPasswordError(
          t(
            "Password must contain at least 6 characters, one uppercase letter and one number."
          )
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setMessage("");
    setPasswordError("");

    if (isSignUp && !validatePassword(formData.password)) {
      setPasswordError(
        t(
          "Password must contain at least 6 characters, one uppercase letter and one number."
        )
      );
      return;
    }

    setSubmitting(true);

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

      localStorage.setItem("token", token);
      loginUser(userData);
      setFormData({ username: "", password: "" });
      setPasswordError("");
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        t("Authentication failed. Please try again.");

      if (isSignUp && backendMsg.toLowerCase().includes("password")) {
        setPasswordError(backendMsg);
      } else {
        setMessage(backendMsg);
      }
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

  const passwordChecks = getPasswordChecks(formData.password);

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

            <div className="password-input-wrapper">
              <input
                type={showPassword.signIn ? "text" : "password"}
                name="password"
                placeholder={t("Password")}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    signIn: !prev.signIn,
                  }))
                }
                aria-label={
                  showPassword.signIn
                    ? t("Hide password")
                    : t("Show password")
                }
              >
                {showPassword.signIn ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

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

            <div className="password-input-wrapper">
              <input
                type={showPassword.signUp ? "text" : "password"}
                name="password"
                placeholder={t("Password")}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    signUp: !prev.signUp,
                  }))
                }
                aria-label={
                  showPassword.signUp
                    ? t("Hide password")
                    : t("Show password")
                }
              >
                {showPassword.signUp ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {isSignUp && formData.password && (
              <div className="password-rules">
                <div
                  className={`password-rule ${
                    passwordChecks.minLength ? "valid" : "invalid"
                  }`}
                >
                  {passwordChecks.minLength ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                  <span>{t("At least 6 characters")}</span>
                </div>

                <div
                  className={`password-rule ${
                    passwordChecks.hasUppercase ? "valid" : "invalid"
                  }`}
                >
                  {passwordChecks.hasUppercase ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                  <span>{t("At least one uppercase letter")}</span>
                </div>

                <div
                  className={`password-rule ${
                    passwordChecks.hasNumber ? "valid" : "invalid"
                  }`}
                >
                  {passwordChecks.hasNumber ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                  <span>{t("At least one number")}</span>
                </div>
              </div>
            )}

            {passwordError && (
              <p
                className="msg"
                style={{
                  color: "#d93025",
                  fontSize: "13px",
                  marginTop: "4px",
                  marginBottom: "10px",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {passwordError}
              </p>
            )}

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