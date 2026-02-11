import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { useTranslation } from "react-i18next";

import "../styles/HomePage.scss";
import DealsOfTheWeek from "../components/DealsOfTheWeek";
import StatsSection from "../components/StatsSection";
import MapSection from "../components/MapSection";
import InfoSection from "../components/InfoSection";

function HomePage() {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ Use backend URL from Render env var when deployed
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // 🪄 Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  // 🧩 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [API]);

  return (
    <div className="home-page">
      {/* 🌿 Hero Section */}
      <section className="hero" data-aos="fade-up">
        <video
          className="hero__video"
          src="/images/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero__overlay">
          <div className="hero__content" data-aos="fade-up" data-aos-delay="300">
            <h1>{t("Welcome to Zdrava Store")}</h1>
            <p>
              {t(
                "Discover fresh, healthy products and tasty pickled delights! Browse our selection and add your favorites to the cart."
              )}
            </p>

            {/* ✅ Redirect to AllProductsPage */}
            <button onClick={() => navigate("/products")}>
              {t("Shop Now")}
            </button>
          </div>
        </div>
      </section>

      {/* 🚚 Info Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <InfoSection />
      </div>

      {/* 🛍️ Deals of the Week */}
      <div data-aos="fade-up" data-aos-delay="300">
        <DealsOfTheWeek products={products.slice(0, 6)} />
      </div>

      {/* 📊 Stats Section */}
      <div data-aos="zoom-in" data-aos-delay="300">
        <StatsSection />
      </div>

      {/* 📍 Map Section */}
      <div data-aos="fade-up" data-aos-delay="500">
        <MapSection />
      </div>
    </div>
  );
}

export default HomePage;
