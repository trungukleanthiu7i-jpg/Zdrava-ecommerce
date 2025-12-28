import React from "react";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaMapMarkerAlt, FaTiktok } from "react-icons/fa";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      {/* ✅ Logo centered on top */}
      <div className="footer__logo">
        <img
          src={`${process.env.PUBLIC_URL}/images/Zdrava-logo-color.png`}
          alt="Zdrava Logo"
        />
      </div>

      {/* ✅ Top contact info row */}
      <div className="footer__content">
        {/* 📞 Phone */}
        <div className="footer__item">
          <FaPhoneAlt className="footer__icon" />
          <a href="tel:+40712345678">+40 712 345 678</a>
        </div>


        {/* 📧 Email */}
        <div className="footer__item">
          <FaEnvelope className="footer__icon" />
          <a href="mailto:info@info-zdravafood-ro.com">
            info@info-zdravafood-ro.com
          </a>
        </div>


        {/* 📸 Instagram */}
        <div className="footer__item">
          <FaInstagram className="footer__icon" />
          <a
            href="https://www.instagram.com/zdravagroup.ro"
            target="_blank"
            rel="noopener noreferrer"
          >
            @zdravagroup.ro
          </a>
        </div>
      </div>

      {/* ✅ Bottom info row */}
      <div className="footer__content footer__bottom">
        {/* 📍 Address */}
        <div className="footer__item">
          <FaMapMarkerAlt className="footer__icon" />
          <span>Aleea 1 Constantin Argetoianu, Breasta, Dolj</span>
        </div>

        {/* 🎵 TikTok */}
        <div className="footer__item">
          <FaTiktok className="footer__icon" />
          <a
            href="https://www.tiktok.com/@zdravafood.ro"
            target="_blank"
            rel="noopener noreferrer"
          >
            @zdravafood.ro
          </a>
        </div>
      </div>

      <p className="footer__copyright">
        © {new Date().getFullYear()} Zdrava Romania. All rights reserved.
      </p>

      <p className="footer__madeby">
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/kleanthi-trungu-491185336/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kleanthi Trungu
        </a>
      </p>
    </footer>
  );
};

export default Footer;
