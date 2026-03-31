import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.scss";

function Navbar() {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isHome = location.pathname === "/";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`navbar ${!isHome ? "navbar--light" : ""} ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <Link to="/" className="navbar__logo" onClick={closeMenu}>
        <img src="/images/Zdrava-logo-color.png" alt="Zdrava Store" />
      </Link>

      {/* ✅ Hamburger */}
      <div className="navbar__hamburger" onClick={toggleMenu}>
        <span className={menuOpen ? "open" : ""}></span>
        <span className={menuOpen ? "open" : ""}></span>
        <span className={menuOpen ? "open" : ""}></span>
      </div>

      {/* ✅ Links */}
      <ul className={`navbar__links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        <li>
          <Link to="/cart" className="navbar__cart" onClick={closeMenu}>
            🛒 Cosul meu ({cartItems.length})
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;