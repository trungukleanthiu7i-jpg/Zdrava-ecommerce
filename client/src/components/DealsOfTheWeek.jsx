import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/DealsOfTheWeek.scss";

const DealsOfTheWeek = () => {
  const [offers, setOffers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000"; // backend base URL

  // 🟢 Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/offers`);
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };
    fetchOffers();
  }, []);

  // 🕒 Countdown logic (with days)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedTimeLeft = {};

      offers.forEach((offer) => {
        const endTime = new Date(offer.offerEndDate).getTime();
        const distance = endTime - now;

        if (distance <= 0) {
          updatedTimeLeft[offer._id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          updatedTimeLeft[offer._id] = { days, hours, minutes, seconds };
        }
      });

      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [offers]);

  // 🧭 Scroll carousel
  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 🖼️ Normalize image path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return `${BASE_URL}/images/placeholder.png`;

    let cleanPath = imagePath.trim();
    cleanPath = cleanPath.replace("/images/produce/", "/images/produse/");

    if (!cleanPath.startsWith("/images/")) {
      cleanPath = `/images/produse/${cleanPath}`;
    }

    return `${BASE_URL}${cleanPath}`;
  };

const handleProductClick = async (offer) => {
  try {
    // Try to find a product with the same name
    const res = await axios.get(`http://localhost:5000/api/products`);
    const allProducts = res.data;
    const matchingProduct = allProducts.find(
      (p) => p.name.trim().toLowerCase() === offer.name.trim().toLowerCase()
    );

    if (matchingProduct) {
      navigate(`/product/${matchingProduct._id}`);
    } else {
      alert("Product not found in the main list.");
    }
  } catch (err) {
    console.error("Error redirecting to product:", err);
  }
};


  return (
    <section className="deals-section">
      <p className="deals-subtitle">Hot Discounts Just for You</p>
      <h2 className="deals-title">Deals Of The Week</h2>

      <button className="arrow left" onClick={() => scroll("left")}>
        <FaChevronLeft />
      </button>
      <button className="arrow right" onClick={() => scroll("right")}>
        <FaChevronRight />
      </button>

      <div className="deals-carousel" ref={carouselRef}>
        {offers.length === 0 ? (
          <p className="no-offers">No offers available right now.</p>
        ) : (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="deal-card"
              onClick={() => handleProductClick(offer)}
              style={{ cursor: "pointer" }}
            >
              <div className="image-container">
                <img
                  src={getImageUrl(offer.image)}
                  alt={offer.name}
                  onError={(e) => {
                    e.target.src = `${BASE_URL}/images/placeholder.png`;
                  }}
                />

                <div className="countdown">
                  <div>
                    <span>{timeLeft[offer._id]?.days ?? 0}</span>
                    <p>DAYS</p>
                  </div>
                  <div>
                    <span>{timeLeft[offer._id]?.hours ?? 0}</span>
                    <p>HRS</p>
                  </div>
                  <div>
                    <span>{timeLeft[offer._id]?.minutes ?? 0}</span>
                    <p>MINS</p>
                  </div>
                  <div>
                    <span>{timeLeft[offer._id]?.seconds ?? 0}</span>
                    <p>SECS</p>
                  </div>
                </div>
              </div>

              <h3>{offer.name}</h3>
              <p className="old-price">{offer.oldPrice.toFixed(2)} RON</p>
              <p className="new-price">{offer.newPrice.toFixed(2)} RON</p>

              {offer.conditions && (
                <p className="offer-conditions">{offer.conditions}</p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DealsOfTheWeek;
