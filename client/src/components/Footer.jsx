import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaTiktok,
  FaFacebookF,
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
            >
              <FaFacebookF />
            </a>

            <a
              className="footerPro__socialBtn"
              href="https://www.instagram.com/zdravagroup.ro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              className="footerPro__socialBtn"
              href="https://www.tiktok.com/@zdravafood.ro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* MIDDLE: Info */}
        <div className="footerPro__col">
          <h4 className="footerPro__title">INFORMAȚII</h4>

          <div className="footerPro__links">
            <a className="footerPro__link" href="/terms-and-conditions">
              Termeni și condiții
            </a>

            <a className="footerPro__link" href="/contact">
              Contactează-ne
            </a>

            <a className="footerPro__link" href="/about">
              Despre noi
            </a>
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
                href="tel:+40712345678"
              >
                +40 712 345 678
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
                Aleea 1 Constantin Argetoianu, Breasta, Dolj, România
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Compliance Section */}
      <div className="footerPro__compliance">

        <a
          href="https://anpc.ro/"
          target="_blank"
          rel="noopener noreferrer"
          className="footerPro__anpcLink"
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/anpcLogo.png`}
            alt="ANPC"
            className="footerPro__anpcLogo"
          />
        </a>

        <div className="footerPro__complianceLinks">
          <a
            href="https://anpc.ro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ANPC
          </a>

          <span> | </span>

          <a
            href="https://anpc.ro/ce-este-sal/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SAL
          </a>

          <span> | </span>

          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            SOL (ODR)
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footerPro__bottom">
        <div className="footerPro__bottomInner">
          <p className="footerPro__legalLine">
            © {year} Zdrava România. Toate drepturile rezervate.
          </p>

          <p className="footerPro__madeby">
            Creat de{" "}
            <a
              href="https://www.linkedin.com/in/kleanthi-trungu-491185336/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kleanthi Trungu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;