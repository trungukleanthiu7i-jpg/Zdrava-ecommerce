import React, { useEffect, useState } from "react";
import "../styles/AboutPage.scss";
import {
  FaLeaf,
  FaHandshake,
  FaHeart,
  FaIndustry,
  FaBox,
  FaGlobe,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    years: 0,
    products: 0,
    partners: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".about-stats");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        setCounts({
          years: Math.floor(progress * 10),
          products: Math.floor(progress * 250),
          partners: Math.floor(progress * 20),
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible]);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" data-aos="fade-up">
        <div className="hero-content">
          <h1>{t("About Zdrava")}</h1>
          <p>
            {t(
              "At Zdrava, we believe in offering natural, delicious, and high-quality products made with care and passion. Our goal is to bring authentic flavors to your table — just like homemade."
            )}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission" data-aos="fade-up">
        <h2>{t("Our Mission")}</h2>
        <p>
          {t(
            "We strive to create a healthier world through natural ingredients, sustainable practices, and a deep respect for local traditions. Every product is crafted with love and dedication to ensure the best taste and quality for you and your family."
          )}
        </p>

        <div className="mission-icons">
          <div className="mission-item">
            <FaLeaf className="icon" />
            <h4>{t("Natural Ingredients")}</h4>
            <p>{t("Only the freshest, locally sourced produce.")}</p>
          </div>

          <div className="mission-item">
            <FaHandshake className="icon" />
            <h4>{t("Trusted Partners")}</h4>
            <p>{t("Working with honest farmers and suppliers we trust.")}</p>
          </div>

          <div className="mission-item">
            <FaHeart className="icon" />
            <h4>{t("Passion for Quality")}</h4>
            <p>{t("Every product reflects our passion for excellence.")}</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <section className="about-divider" data-aos="fade-up">
        <h3>
          {t(
            "“We believe nature’s best should stay pure — never processed, never rushed.”"
          )}
        </h3>
        <p>
          {t("Crafted with honesty, care, and love for both people and planet.")}
        </p>
      </section>

      {/* Stats */}
      <section className="about-stats" data-aos="fade-up">
        <div className="stats-container">
          <div className="stat-box">
            <FaIndustry className="stat-icon" />
            <h3>
              {counts.years}
              <span>+</span>
            </h3>
            <p>{t("Years of Experience")}</p>
          </div>

          <div className="stat-box">
            <FaBox className="stat-icon" />
            <h3>
              {counts.products}
              <span>+</span>
            </h3>
            <p>{t("Products Delivered")}</p>
          </div>

          <div className="stat-box">
            <FaGlobe className="stat-icon" />
            <h3>
              {counts.partners}
              <span>+</span>
            </h3>
            <p>{t("Partner Countries")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta" data-aos="zoom-in">
        <h3>{t("Want to know more?")}</h3>

        <p className="about-cta-text">
          {t("ctaTextBeforeContact")}{" "}
          <Link to="/contact" className="about-contact-link">
            {t("ctaContactWord")}
          </Link>{" "}
          {t("ctaTextAfterContact")}
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
