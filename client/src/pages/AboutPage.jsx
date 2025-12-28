import React, { useEffect, useState } from "react";
import "../styles/AboutPage.scss";
import { FaLeaf, FaHandshake, FaHeart, FaIndustry, FaBox, FaGlobe } from "react-icons/fa";

const AboutPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({
        years: 0,
        products: 0,
        partners: 0,
    });

    // 👁️ Detect when milestone section is visible
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

    // 🎬 Animate the counters when visible
    useEffect(() => {
        if (isVisible) {
            const duration = 2000; // 2s animation
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
                    <h1>About Zdrava</h1>
                    <p>
                        At <strong>Zdrava</strong>, we believe in offering natural, delicious,
                        and high-quality products made with care and passion. Our goal is to
                        bring authentic flavors to your table — just like homemade.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-mission" data-aos="fade-up">
                <h2>Our Mission</h2>
                <p>
                    We strive to create a healthier world through natural ingredients,
                    sustainable practices, and a deep respect for local traditions. Every
                    product is crafted with love and dedication to ensure the best taste
                    and quality for you and your family.
                </p>

                <div className="mission-icons">
                    <div className="mission-item">
                        <FaLeaf className="icon" />
                        <h4>Natural Ingredients</h4>
                        <p>Only the freshest, locally sourced produce.</p>
                    </div>
                    <div className="mission-item">
                        <FaHandshake className="icon" />
                        <h4>Trusted Partners</h4>
                        <p>Working with honest farmers and suppliers we trust.</p>
                    </div>
                    <div className="mission-item">
                        <FaHeart className="icon" />
                        <h4>Passion for Quality</h4>
                        <p>Every product reflects our passion for excellence.</p>
                    </div>
                </div>
            </section>

            {/* === 🌿 Inspirational Divider === */}
            <section className="about-divider" data-aos="fade-up">
                <h3>
                    “We believe nature’s best should stay pure — never processed, never rushed.”
                </h3>
                <p>Crafted with honesty, care, and love for both people and planet.</p>
            </section>





            {/* 🌿 Milestone / Stats Section */}
            <section className="about-stats" data-aos="fade-up">
                <div className="stats-container">
                    <div className="stat-box">
                        <FaIndustry className="stat-icon" />
                        <h3>
                            {counts.years}
                            <span>+</span>
                        </h3>
                        <p>Years of Experience</p>
                    </div>

                    <div className="stat-box">
                        <FaBox className="stat-icon" />
                        <h3>
                            {counts.products}
                            <span>+</span>
                        </h3>
                        <p>Products Delivered</p>
                    </div>

                    <div className="stat-box">
                        <FaGlobe className="stat-icon" />
                        <h3>
                            {counts.partners}
                            <span>+</span>
                        </h3>
                        <p>Partner Countries</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta" data-aos="zoom-in">
                <h3>Want to know more?</h3>
                <p>
                    Visit our <a href="/contact">Contact</a> page or follow us on social media
                    to stay updated with our latest products and offers.
                </p>
            </section>
        </div>
    );
};

export default AboutPage;
