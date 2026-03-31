import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaBars,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Header.scss";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logoutUser } = useContext(UserContext);
  const { getCartCount, cartAnimationTrigger } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  const [language, setLanguage] = useState("ro");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const accountCloseTimeoutRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const langToUse = savedLang || "ro";
    setLanguage(langToUse);
    i18n.changeLanguage(langToUse);
  }, [i18n]);

  useEffect(() => {
    if (cartAnimationTrigger > 0) {
      setCartAnimation(true);
      const timer = setTimeout(() => setCartAnimation(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartAnimationTrigger]);

  useEffect(() => {
    return () => {
      if (accountCloseTimeoutRef.current) {
        clearTimeout(accountCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
    setDropdownOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleLogout = () => {
    logoutUser();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (isAdmin) return;
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setMobileMenuOpen(false);
    }
  };

  const handleAccountMouseEnter = () => {
    if (window.innerWidth <= 768) return;
    if (accountCloseTimeoutRef.current) {
      clearTimeout(accountCloseTimeoutRef.current);
    }
    setAccountMenuOpen(true);
  };

  const handleAccountMouseLeave = () => {
    if (window.innerWidth <= 768) return;
    accountCloseTimeoutRef.current = setTimeout(() => {
      setAccountMenuOpen(false);
    }, 180);
  };

  const toggleAccountMenu = () => {
    if (window.innerWidth <= 768) {
      setAccountMenuOpen((prev) => !prev);
    }
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
    setDropdownOpen(false);
    setAccountMenuOpen(false);
  };

  const categoryLinks = [
    { to: "/category/legume-conservate-horeca", label: t("Legume conservate HORECA") },
    { to: "/category/sosuri-horeca", label: t("Sosuri HORECA") },
    { to: "/category/dulceturi", label: t("Dulcețuri") },
    { to: "/category/legume-conservate", label: t("Legume conservate") },
    { to: "/category/produse-din-branza", label: t("Produse din brânză") },
    { to: "/category/dulciuri-si-snacks-uri", label: t("Dulciuri și snacks-uri") },
    { to: "/category/cafea-si-bauturi", label: t("Cafea și băuturi") },
    { to: "/category/sosuri", label: t("Sosuri") },
    { to: "/category/masline", label: t("Măsline") },
    { to: "/category/alimente-cu-amidon", label: t("Alimente cu amidon") },
    { to: "/category/placinta", label: t("Plăcintă") },
  ];

  const mainLinks = [
    { to: "/", label: t("Home") },
    { to: "/products", label: t("Shop Now") },
    { to: "/about", label: t("About Us") },
    { to: "/new-products", label: t("New Products") },
    { to: "/contact", label: t("Contact") },
  ];

  const AdminDisabledLink = ({ children }) => (
    <span className="nav-disabled">{children}</span>
  );

  return (
    <header className="header">
      {/* DESKTOP */}
      <div className="header__desktop">
        <div className="header__top">
          <div className="header__left">
            <Link to="/">
              <img
                src="/images/Zdrava-logo-color.png"
                alt="Zdrava Logo"
                className="header__logo"
              />
            </Link>
          </div>

          <form className="header__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t("Search here...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isAdmin}
            />
            <button
              className="header__search-btn"
              type="submit"
              disabled={isAdmin}
            >
              <FaSearch />
            </button>
          </form>

          <div className="header__right">
            <div
              className={`header__cart ${
                cartAnimation ? "cart-bounce" : ""
              } ${isAdmin ? "nav-disabled" : ""}`}
              onClick={() => !isAdmin && navigate("/cart")}
            >
              <FaShoppingCart className="cart-icon" />
              {!isAdmin && getCartCount() > 0 && (
                <span className="cart-count">{getCartCount()}</span>
              )}
            </div>

            {isAdmin && <span className="admin-badge">ADMIN MODE</span>}

            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="header__lang"
            >
              <option value="ro">Română</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <nav className="header__nav">
          <div
            className={`categories-dropdown ${isAdmin ? "nav-disabled" : ""}`}
            onMouseEnter={() => !isAdmin && setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button type="button" disabled={isAdmin}>
              <FaBars />
              {t("All Categories")}
            </button>

            {!isAdmin && dropdownOpen && (
              <div className="dropdown-mega-menu">
                <div className="dropdown-column">
                  <h4>HORECA</h4>
                  <Link to="/category/legume-conservate-horeca">{t("Legume conservate HORECA")}</Link>
                  <Link to="/category/sosuri-horeca">{t("Sosuri HORECA")}</Link>
                  <Link to="/category/dulceturi">{t("Dulcețuri")}</Link>
                </div>

                <div className="dropdown-column">
                  <h4>SUPERMARKET</h4>
                  <Link to="/category/legume-conservate">{t("Legume conservate")}</Link>
                  <Link to="/category/produse-din-branza">{t("Produse din brânză")}</Link>
                  <Link to="/category/dulciuri-si-snacks-uri">{t("Dulciuri și snacks-uri")}</Link>
                  <Link to="/category/cafea-si-bauturi">{t("Cafea și băuturi")}</Link>
                  <Link to="/category/sosuri">{t("Sosuri")}</Link>
                  <Link to="/category/masline">{t("Măsline")}</Link>
                  <Link to="/category/alimente-cu-amidon">{t("Alimente cu amidon")}</Link>
                  <Link to="/category/placinta">{t("Plăcintă")}</Link>
                </div>
              </div>
            )}
          </div>

          {isAdmin ? <AdminDisabledLink>{t("Home")}</AdminDisabledLink> : <Link to="/">{t("Home")}</Link>}
          {isAdmin ? <AdminDisabledLink>{t("Shop Now")}</AdminDisabledLink> : <Link to="/products">{t("Shop Now")}</Link>}
          {isAdmin ? <AdminDisabledLink>{t("About Us")}</AdminDisabledLink> : <Link to="/about">{t("About Us")}</Link>}
          {isAdmin ? <AdminDisabledLink>{t("New Products")}</AdminDisabledLink> : <Link to="/new-products">{t("New Products")}</Link>}
          {isAdmin ? <AdminDisabledLink>{t("Contact")}</AdminDisabledLink> : <Link to="/contact">{t("Contact")}</Link>}

          <div
            className="header__account"
            onMouseEnter={handleAccountMouseEnter}
            onMouseLeave={handleAccountMouseLeave}
          >
            <button type="button" className="header__account-trigger">
              <FaUser />
              {user ? (
                <span className="username">
                  {user.username || user.email}
                  <FaChevronDown className="chevron" />
                </span>
              ) : (
                <span className="auth-link" onClick={() => navigate("/auth")}>
                  {t("My Account")}
                </span>
              )}
            </button>

            {user && accountMenuOpen && (
              <div
                className="account-dropdown"
                onMouseEnter={handleAccountMouseEnter}
                onMouseLeave={handleAccountMouseLeave}
              >
                {isAdmin ? (
                  <Link to="/admin" className="dropdown-item">🛠 Admin Panel</Link>
                ) : (
                  <>
                    <Link to="/profile" className="dropdown-item">👤 Profile</Link>
                    <Link to="/my-orders" className="dropdown-item">📦 My Orders</Link>
                  </>
                )}
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* MOBILE */}
      <div className="header__mobile">
        <div className="header-mobile__top">
          <Link to="/" className="header-mobile__logo-wrap" onClick={closeAllMenus}>
            <img
              src="/images/Zdrava-logo-color.png"
              alt="Zdrava Logo"
              className="header-mobile__logo"
            />
          </Link>

          <div className="header-mobile__actions">
            <div
              className={`header__cart header-mobile__cart ${
                cartAnimation ? "cart-bounce" : ""
              } ${isAdmin ? "nav-disabled" : ""}`}
              onClick={() => !isAdmin && navigate("/cart")}
            >
              <FaShoppingCart className="cart-icon" />
              {!isAdmin && getCartCount() > 0 && (
                <span className="cart-count">{getCartCount()}</span>
              )}
            </div>

            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="header-mobile__lang"
            >
              <option value="ro">Română</option>
              <option value="en">English</option>
            </select>

            <button
              type="button"
              className="header-mobile__menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <form className="header-mobile__search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t("Search here...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isAdmin}
          />
          <button type="submit" disabled={isAdmin}>
            <FaSearch />
          </button>
        </form>

        <div className={`header-mobile__menu ${mobileMenuOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="header-mobile__menu-item header-mobile__categories-toggle"
            onClick={() => !isAdmin && setMobileCategoriesOpen((prev) => !prev)}
            disabled={isAdmin}
          >
            <span>
              <FaBars />
              {t("All Categories")}
            </span>
            <FaChevronDown className={mobileCategoriesOpen ? "rotated" : ""} />
          </button>

          <div className={`header-mobile__categories ${mobileCategoriesOpen ? "is-open" : ""}`}>
            {categoryLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={closeAllMenus}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="header-mobile__quicklinks">
            {mainLinks.map((item) =>
              isAdmin ? (
                <span key={item.to} className="nav-disabled header-mobile__pill">
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="header-mobile__pill"
                  onClick={closeAllMenus}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="header-mobile__account">
            {user ? (
              <>
                <button
                  type="button"
                  className="header-mobile__menu-item"
                  onClick={toggleAccountMenu}
                >
                  <span>
                    <FaUser />
                    {user.username || user.email}
                  </span>
                  <FaChevronDown className={accountMenuOpen ? "rotated" : ""} />
                </button>

                <div className={`header-mobile__account-links ${accountMenuOpen ? "is-open" : ""}`}>
                  {isAdmin ? (
                    <Link to="/admin" onClick={closeAllMenus}>🛠 Admin Panel</Link>
                  ) : (
                    <>
                      <Link to="/profile" onClick={closeAllMenus}>👤 Profile</Link>
                      <Link to="/my-orders" onClick={closeAllMenus}>📦 My Orders</Link>
                    </>
                  )}
                  <button type="button" onClick={handleLogout}>🚪 Logout</button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="header-mobile__menu-item"
                onClick={() => {
                  closeAllMenus();
                  navigate("/auth");
                }}
              >
                <span>
                  <FaUser />
                  {t("My Account")}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;