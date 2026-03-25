import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaTiktok,
  FaFacebookF,
  FaBuilding,
  FaIdCard,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/Footer.scss";

const Footer = () => {
  const { t } = useTranslation();
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

        {/* MIDDLE: Info */}
        <div className="footerPro__col">
          <h4 className="footerPro__title">{t("INFORMAȚII")}</h4>

          <div className="footerPro__links">
            <Link className="footerPro__link" to="/terms-and-conditions">
              {t("Termeni și condiții")}
            </Link>

            <Link className="footerPro__link" to="/privacy-policy">
              {t("Politica de confidențialitate")}
            </Link>

            <Link className="footerPro__link" to="/cookie-policy">
              {t("Politica de cookies")}
            </Link>

            <Link className="footerPro__link" to="/return-policy">
              {t("Politica de retur")}
            </Link>

            <Link className="footerPro__link" to="/contact">
              {t("Contactează-ne")}
            </Link>

            <Link className="footerPro__link" to="/about">
              {t("Despre noi")}
            </Link>
          </div>
        </div>

        {/* RIGHT: Contact + Legal */}
        <div className="footerPro__col">
          <h4 className="footerPro__title">{t("DATE DE CONTACT")}</h4>

          <div className="footerPro__contactList">
            <div className="footerPro__contactItem">
              <FaBuilding className="footerPro__contactIcon" />
              <span className="footerPro__contactText">
                <strong>MERITA LOGISTIC S.R.L.</strong>
              </span>
            </div>

            <div className="footerPro__contactItem">
              <FaIdCard className="footerPro__contactIcon" />
              <span className="footerPro__contactText">
                {t("CUI")}: RO48977906
              </span>
            </div>

            <div className="footerPro__contactItem">
              <FaIdCard className="footerPro__contactIcon" />
              <span className="footerPro__contactText">
                {t("Nr. Reg. Com.")}: J2023002219162
              </span>
            </div>

            <div className="footerPro__contactItem">
              <FaPhoneAlt className="footerPro__contactIcon" />
              <a className="footerPro__contactLink" href="tel:+40734844079">
                0734844079
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
                {t(
                  "Str. Cerna nr. 3, et. mansardă, ap. 3, Mun. Craiova, Jud. Dolj, România"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Compliance Section */}
      <div className="footerPro__compliance">
        {/* ANPC */}
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

        {/* ✅ NETOPIA LOGO */}
        <div className="footerPro__netopia">
          <img
            src={`${process.env.PUBLIC_URL}/images/netopia-logo.svg`}
            alt="Plăți securizate prin NETOPIA Payments"
            className="footerPro__netopiaLogo"
          />
        </div>

        <div className="footerPro__complianceLinks">
          <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer">
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
            href="https://reclamatiisal.anpc.ro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Depune reclamație SAL")}
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footerPro__bottom">
        <div className="footerPro__bottomInner">
          <p className="footerPro__legalLine">
            {t("© {{year}} Zdrava România. Toate drepturile rezervate.", {
              year,
            })}
          </p>

          <p className="footerPro__madeby">
            {t("Creat de")}{" "}
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