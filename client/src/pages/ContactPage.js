import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/ContactPage.scss";

function ContactPage() {
  const { t } = useTranslation();

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await axios.post("http://localhost:5000/api/messages", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <div className="contact-page">
      {/* 🌿 Header Section */}
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>{t("Let’s Get in Touch")}</h1>
        <p>
          {t(
            "Have a question or feedback? We’d love to hear from you. Reach out using the form below or visit us at our store in Breasta, Dolj!"
          )}
        </p>
      </motion.div>

      {/* 📍 Info Cards Section */}
      <div className="contact-info">
        <motion.div
          className="info-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaMapMarkerAlt className="icon" />
          <h3>{t("Our Location")}</h3>
          <p>{t("Aleea 1 Constantin Argetoianu, Breasta, Dolj, Romania")}</p>
        </motion.div>

        <motion.div
          className="info-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaEnvelope className="icon" />
          <h3>{t("Email Us")}</h3>
          <p>info@zdravaromania.com</p>
        </motion.div>

        <motion.div
          className="info-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaPhoneAlt className="icon" />
          <h3>{t("Call Us")}</h3>
          <p>+40 712 345 678</p>
        </motion.div>
      </div>

      {/* ✉️ Contact Form Section */}
      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <input
          type="text"
          name="name"
          placeholder={t("Your Name")}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("Your Email")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder={t("Your Message")}
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" disabled={status === "sending"}>
          {status === "sending"
            ? t("Sending...")
            : status === "success"
            ? t("✅ Sent!")
            : t("Send Message")}
        </button>
      </motion.form>

      {/* 🗺️ Map Section */}
      <motion.div
        className="map-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          title={t("Zdrava Romania Location")}
          src="https://www.google.com/maps?q=44.343667,23.702528&z=15&output=embed"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </motion.div>
    </div>
  );
}

export default ContactPage;
