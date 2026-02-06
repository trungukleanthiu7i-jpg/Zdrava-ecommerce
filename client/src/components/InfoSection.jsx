import React from "react";
import { FaTruck, FaHeadset, FaMobileAlt, FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../styles/InfoSection.scss";

const InfoSection = () => {
  const { t } = useTranslation();

  return (
    <section className="info-section">
      <div className="info-item">
        <FaTruck className="info-icon" />
        <div className="info-text">
          <h4>{t("FAST DELIVERY")}</h4>
          <p>{t("Order before 4PM")}</p>
        </div>
      </div>

      <div className="info-item">
        <FaHeadset className="info-icon" />
        <div className="info-text">
          <h4>{t("SUPPORT")}</h4>
          <p>{t("Contact us 9AM–6PM")}</p>
        </div>
      </div>

      <div className="info-item">
        <FaMobileAlt className="info-icon" />
        <div className="info-text">
          <h4>{t("FOR PHONE ORDERS CALL:")}</h4>
          <p>+40 712 345 678</p>
        </div>
      </div>

      <div className="info-item">
        <FaShoppingCart className="info-icon" />
        <div className="info-text">
          <h4>{t("FRESH ZDRAVA GROUP")}</h4>
          <p>{t("200+ Products")}</p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
