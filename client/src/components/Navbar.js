import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.scss";

function Navbar() {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we're on the homepage
  const isHome = location.pathname === "/";

  return (
    <nav className={`navbar ${!isHome ? "navbar--light" : ""} ${scrolled ? "scrolled" : ""}`}>

      <Link to="/" className="navbar__logo">
        <img src="/images/Zdrava-logo-color.png" alt="Zdrava Store" />
      </Link>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          <Link to="/cart" className="navbar__cart">
            🛒 Cosul meu ({cartItems.length})
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
