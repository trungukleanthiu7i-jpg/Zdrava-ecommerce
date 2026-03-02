import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaTiktok,
} from "react-icons/fa";
import "../styles/Footer.scss";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footerPro">
      <div className="footerPro__inner">

        {/* LEFT: Logo + Social */}
        <div className="footerPro__col footerPro__brand">
          <div className="footerPro__logoWrap">
            <img
              className="footerPro__logo"
              src={`${process.env.PUBLIC_URL}/images/Zdrava-logo-color.png`}
              alt="Zdrava Natural Food"
            />
          </div>

          <div className="footerPro__social">
            <a
              className="footerPro__socialBtn"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              className="footerPro__socialBtn"
              href="https://www.instagram.com/zdravagroup.ro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              className="footerPro__socialBtn"
              href="https://www.tiktok.com/@zdravafood.ro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* MIDDLE: Informații */}
        <div className="footerPro__col">
          <h4 className="footerPro__title">INFORMAȚII</h4>

          <div className="footerPro__links">
            <Link className="footerPro__link" to="/terms-and-conditions">
              Termeni și condiții
            </Link>

            <Link className="footerPro__link" to="/contact">
              Contact
            </Link>

            <Link className="footerPro__link" to="/about">
              Despre noi
            </Link>
          </div>
        </div>

        {/* RIGHT: Contact */}
        <div className="footerPro__col">
          <h4 className="footerPro__title">DATE DE CONTACT</h4>

          <div className="footerPro__contactList">
            <div className="footerPro__contactItem">
              <FaPhoneAlt className="footerPro__contactIcon" />
              <a
                className="footerPro__contactLink"
                href="tel:+40734844079"
              >
                0734 844 079
              </a>
            </div>

            <div className="footerPro__contactItem">
              <FaEnvelope className="footerPro__contactIcon" />
              <a
                className="footerPro__contactLink"
                href="mailto:info@info-zdravafood-ro.com"
              >
                info@info-zdravafood-ro.com
              </a>
            </div>

            <div className="footerPro__contactItem">
              <FaMapMarkerAlt className="footerPro__contactIcon" />
              <span className="footerPro__contactText">
                Str. Cerna nr. 3, Craiova, Dolj, România
              </span>
            </div>
          </div>

          {/* Legal Company Info (recommended for e-commerce) */}
          <div className="footerPro__companyInfo">
            <p>MERITA LOGISTIC S.R.L.</p>
            <p>CUI: RO48977906</p>
            <p>Reg. Com.: J2023002219162</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footerPro__bottom">
        <div className="footerPro__bottomInner">
          <p className="footerPro__legalLine">
            © {year} Zdrava România. Toate drepturile rezervate.
          </p>

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
    </footer>
  );
};

export default Footer;