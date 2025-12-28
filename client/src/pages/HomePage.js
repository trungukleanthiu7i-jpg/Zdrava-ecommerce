import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import "../styles/HomePage.scss";
import DealsOfTheWeek from "../components/DealsOfTheWeek"; // ✅ new section
import StatsSection from "../components/StatsSection";
import MapSection from "../components/MapSection";
import InfoSection from "../components/InfoSection";

// React Icons
import { MdLocalFlorist } from "react-icons/md";
import { GiFruitTree, GiArtificialIntelligence } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";

function HomePage() {
  const [products, setProducts] = useState([]);

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
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const scrollToProducts = () => {
    const dealsSection = document.querySelector(".deals-section");
    if (dealsSection) {
      dealsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            <h1>Welcome to Zdrava Store</h1>
            <p>
              Discover fresh, healthy products and tasty pickled delights! Browse
              our selection and add your favorites to the cart.
            </p>
            <button onClick={scrollToProducts}>Shop Now</button>
          </div>
        </div>
      </section>

      {/* 🚚 Info Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <InfoSection />
      </div>

      {/* 🛍️ Deals of the Week Section (NEW) */}
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
