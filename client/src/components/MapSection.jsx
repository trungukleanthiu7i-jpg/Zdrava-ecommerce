import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/MapSection.scss";

const MapSection = () => {
  const { t } = useTranslation();

  return (
    <section className="map-section">
      <h2 className="map-title">{t("Where to Find Us")}</h2>

      <p className="map-address">
        Zdrava Romania – 44°20'37.2"N 23°42'09.1"E
      </p>

      <div className="map-container">
        <iframe
          title={t("Where to Find Us")}
          src="https://www.google.com/maps?q=44.343667,23.702528&hl=en&z=15&output=embed"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection;
