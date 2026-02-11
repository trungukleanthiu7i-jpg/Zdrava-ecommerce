// src/components/FeaturedCarousel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useCart } from "../context/CartContext";
import { FaShoppingBasket } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/FeaturedCarousel.scss";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FeaturedCarousel = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  if (!products.length) {
    return (
      <section className="featured-carousel">
        <h2 className="featured-carousel__title">Featured Products</h2>
        <p className="loading">Loading products...</p>
      </section>
    );
  }

  return (
    <section className="featured-carousel">
      <h2 className="featured-carousel__title">Featured Products</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="featured-carousel__swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="featured-carousel__card">
              <Link
                to={`/product/${product._id}`}
                className="featured-carousel__image"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/produse/${product.image}`}
                  alt={product.name}
                />
              </Link>

              <div className="featured-carousel__info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">{product.price} €</span>
                <span className="stock">
                  {product.stock > 0
                    ? `In stock: ${product.stock}`
                    : "Out of stock"}
                </span>
                <button
                  className="btn-add"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingBasket /> Add to Cart
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedCarousel;
