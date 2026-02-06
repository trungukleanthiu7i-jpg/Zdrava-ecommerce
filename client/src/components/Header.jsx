import React, { useState, useContext, useEffect } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Header.scss";

const Header = () => {
  const { t, i18n } = useTranslation();

  // ✅ default to RO, but sync from localStorage on load
  const [language, setLanguage] = useState("ro");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { user, logoutUser } = useContext(UserContext);
  const isAdmin = user?.role === "admin";

  const { getCartCount, cartAnimationTrigger } = useCart();
  const navigate = useNavigate();

  const [cartAnimation, setCartAnimation] = useState(false);

  /* ✅ Sync language on first load (refresh safe) */
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const langToUse = savedLang || "ro";

    setLanguage(langToUse);
    i18n.changeLanguage(langToUse);
  }, [i18n]);

  /* 🟢 Cart animation */
  useEffect(() => {
    if (cartAnimationTrigger > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 400);
    }
  }, [cartAnimationTrigger]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang); // ✅ persist language
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (isAdmin) return; // 🔒 Admin cannot search / shop
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  /* 🔒 Admin disabled link */
  const AdminDisabledLink = ({ children }) => (
    <span className="nav-disabled">{children}</span>
  );

  return (
    <header className="header">
      {/* ================= TOP BAR ================= */}
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

        {/* 🔍 Search */}
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

        {/* 🛒 Cart + Language */}
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
            {/* ✅ Romanian first */}
            <option value="ro">Română</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* ================= NAV BAR ================= */}
      <nav className="header__nav">
        {/* 📂 Categories */}
        <div
          className={`categories-dropdown ${isAdmin ? "nav-disabled" : ""}`}
          onMouseEnter={() => !isAdmin && setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button disabled={isAdmin}>
            <FaBars />
            {t("All Categories")}
          </button>

          {!isAdmin && dropdownOpen && (
            <div className="dropdown-mega-menu">
              {/* ===== HORECA ===== */}
              <div className="dropdown-column">
                <h4>HORECA</h4>

                <Link to="/category/legume-conservate-horeca">
                  {t("Legume conservate HORECA")}
                </Link>

                <Link to="/category/sosuri-horeca">
                  {t("Sosuri HORECA")}
                </Link>

                <Link to="/category/dulceturi">{t("Dulcețuri")}</Link>
              </div>

              {/* ===== SUPERMARKET ===== */}
              <div className="dropdown-column">
                <h4>SUPERMARKET</h4>

                <Link to="/category/legume-conservate">
                  {t("Legume conservate")}
                </Link>

                <Link to="/category/produse-din-branza">
                  {t("Produse din brânză")}
                </Link>

                <Link to="/category/dulciuri-si-snacks-uri">
                  {t("Dulciuri și snacks-uri")}
                </Link>

                <Link to="/category/cafea-si-bauturi">
                  {t("Cafea și băuturi")}
                </Link>

                <Link to="/category/sosuri">{t("Sosuri")}</Link>

                <Link to="/category/masline">{t("Măsline")}</Link>

                <Link to="/category/alimente-cu-amidon">
                  {t("Alimente cu amidon")}
                </Link>

                <Link to="/category/placinta">{t("Plăcintă")}</Link>
              </div>
            </div>
          )}
        </div>

        {/* 🧭 Navigation */}
        {isAdmin ? (
          <AdminDisabledLink>{t("Home")}</AdminDisabledLink>
        ) : (
          <Link to="/">{t("Home")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("Shop Now")}</AdminDisabledLink>
        ) : (
          <Link to="/products">{t("Shop Now")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("About Us")}</AdminDisabledLink>
        ) : (
          <Link to="/about">{t("About Us")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("New Products")}</AdminDisabledLink>
        ) : (
          <Link to="/new-products">{t("New Products")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("Contact")}</AdminDisabledLink>
        ) : (
          <Link to="/contact">{t("Contact")}</Link>
        )}

        {/* 👤 Account */}
        <div
          className="header__account"
          onMouseEnter={() => setAccountMenuOpen(true)}
          onMouseLeave={() => setAccountMenuOpen(false)}
        >
          <FaUser />

          {user ? (
            <>
              <span className="username">
                {user.username || user.email}
                <FaChevronDown className="chevron" />
              </span>

              {accountMenuOpen && (
                <div className="account-dropdown">
                  {isAdmin ? (
                    <Link to="/admin" className="dropdown-item">
                      🛠 Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link to="/profile" className="dropdown-item">
                        👤 Profile
                      </Link>
                      <Link to="/my-orders" className="dropdown-item">
                        📦 My Orders
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <span className="auth-link" onClick={() => navigate("/auth")}>
              {t("My Account")}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
