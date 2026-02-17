import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer footer--baskaya">
      <div className="footer__inner">
        {/* LEFT: Logo + Social */}
        <div className="footer__col footer__col--left">
          <div className="footer__logo">
            <img
              src={`${process.env.PUBLIC_URL}/images/Zdrava-logo-color.png`}
              alt="Zdrava Logo"
            />
          </div>

          <div className="footer__social">
            <a
              className="footer__socialBtn"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              className="footer__socialBtn"
              href="https://www.instagram.com/zdravagroup.ro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              className="footer__socialBtn"
              href="https://www.tiktok.com/@zdravafood.ro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* MIDDLE: Profile Links */}
        <div className="footer__col footer__col--middle">
          <h4 className="footer__title">IL TUO PROFILO</h4>

          <ul className="footer__links">
            <li>
              <Link to="/auth">Accedi / Registrati</Link>
            </li>
            <li>
              <Link to="/my-orders">Ordini</Link>
            </li>
            <li>
              <Link to="/forgot-password">Ripristina Password</Link>
            </li>
            <li>
              <Link to="/delete-account">Cancella Account</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy (Preferenze)</Link>
            </li>
            <li>
              <Link to="/terms">Termini e Condizioni</Link>
            </li>
          </ul>
        </div>

        {/* RIGHT: Contacts */}
        <div className="footer__col footer__col--right">
          <h4 className="footer__title">RIFERIMENTI</h4>

          <div className="footer__contact">
            <div className="footer__contactRow">
              <FaPhoneAlt className="footer__icon" />
              <a href="tel:+40712345678">+40 712 345 678</a>
            </div>

            <div className="footer__contactRow">
              <FaEnvelope className="footer__icon" />
              <a href="mailto:info@info-zdravafood-ro.com">
                info@info-zdravafood-ro.com
              </a>
            </div>

            <div className="footer__contactRow">
              <FaMapMarkerAlt className="footer__icon" />
              <span>Aleea 1 Constantin Argetoianu, Breasta, Dolj</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bar">
        <div className="footer__barInner">
          <span>
            Zdrava Romania SRL | P.IVA: 0000000000 | CUI: RO0000000 | REG: J00/000/0000
          </span>

          <span className="footer__madebyInline">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/kleanthi-trungu-491185336/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kleanthi Trungu
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
