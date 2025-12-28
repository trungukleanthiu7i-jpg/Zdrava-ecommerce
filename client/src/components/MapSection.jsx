import React from "react";
import "../styles/MapSection.scss";

const MapSection = () => {
  return (
    <section className="map-section">
      <h2 className="map-title">Where to Find Us</h2>
      <p className="map-address">Zdrava Romania – 44°20'37.2"N 23°42'09.1"E</p>

      <div className="map-container">
        <iframe
          title="Zdrava Romania Location"
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
