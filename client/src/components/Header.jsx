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
import { useNavigate, Link } from "react-router-dom";
import "../styles/Header.scss";

const Header = () => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState("ro");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accountCloseTimeoutRef = useRef(null);

  const { user, logoutUser } = useContext(UserContext);
  const isAdmin = user?.role === "admin";

  const { getCartCount, cartAnimationTrigger } = useCart();
  const navigate = useNavigate();

  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const langToUse = savedLang || "ro";

    setLanguage(langToUse);
    i18n.changeLanguage(langToUse);
  }, [i18n]);

  useEffect(() => {
    if (cartAnimationTrigger > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 400);
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
    setDropdownOpen(false);
    setAccountMenuOpen(false);
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const toggleCategoriesMenu = () => {
    if (window.innerWidth <= 768 && !isAdmin) {
      setDropdownOpen((prev) => !prev);
    }
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setAccountMenuOpen(false);
  };

  const AdminDisabledLink = ({ children }) => (
    <span className="nav-disabled">{children}</span>
  );

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__left">
          <Link to="/" onClick={closeAllMenus}>
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

          <button
            className="header__menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <nav className={`header__nav ${mobileMenuOpen ? "header__nav--open" : ""}`}>
        <div
          className={`categories-dropdown ${isAdmin ? "nav-disabled" : ""} ${
            dropdownOpen ? "is-open" : ""
          }`}
          onMouseEnter={() => !isAdmin && window.innerWidth > 768 && setDropdownOpen(true)}
          onMouseLeave={() => window.innerWidth > 768 && setDropdownOpen(false)}
        >
          <button
            type="button"
            disabled={isAdmin}
            onClick={toggleCategoriesMenu}
          >
            <FaBars />
            {t("All Categories")}
          </button>

          {!isAdmin && dropdownOpen && (
            <div className="dropdown-mega-menu">
              <div className="dropdown-column">
                <h4>HORECA</h4>

                <Link to="/category/legume-conservate-horeca" onClick={closeAllMenus}>
                  {t("Legume conservate HORECA")}
                </Link>

                <Link to="/category/sosuri-horeca" onClick={closeAllMenus}>
                  {t("Sosuri HORECA")}
                </Link>

                <Link to="/category/dulceturi" onClick={closeAllMenus}>
                  {t("Dulcețuri")}
                </Link>
              </div>

              <div className="dropdown-column">
                <h4>SUPERMARKET</h4>

                <Link to="/category/legume-conservate" onClick={closeAllMenus}>
                  {t("Legume conservate")}
                </Link>

                <Link to="/category/produse-din-branza" onClick={closeAllMenus}>
                  {t("Produse din brânză")}
                </Link>

                <Link to="/category/dulciuri-si-snacks-uri" onClick={closeAllMenus}>
                  {t("Dulciuri și snacks-uri")}
                </Link>

                <Link to="/category/cafea-si-bauturi" onClick={closeAllMenus}>
                  {t("Cafea și băuturi")}
                </Link>

                <Link to="/category/sosuri" onClick={closeAllMenus}>
                  {t("Sosuri")}
                </Link>

                <Link to="/category/masline" onClick={closeAllMenus}>
                  {t("Măsline")}
                </Link>

                <Link to="/category/alimente-cu-amidon" onClick={closeAllMenus}>
                  {t("Alimente cu amidon")}
                </Link>

                <Link to="/category/placinta" onClick={closeAllMenus}>
                  {t("Plăcintă")}
                </Link>
              </div>
            </div>
          )}
        </div>

        {isAdmin ? (
          <AdminDisabledLink>{t("Home")}</AdminDisabledLink>
        ) : (
          <Link to="/" onClick={closeAllMenus}>{t("Home")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("Shop Now")}</AdminDisabledLink>
        ) : (
          <Link to="/products" onClick={closeAllMenus}>{t("Shop Now")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("About Us")}</AdminDisabledLink>
        ) : (
          <Link to="/about" onClick={closeAllMenus}>{t("About Us")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("New Products")}</AdminDisabledLink>
        ) : (
          <Link to="/new-products" onClick={closeAllMenus}>{t("New Products")}</Link>
        )}

        {isAdmin ? (
          <AdminDisabledLink>{t("Contact")}</AdminDisabledLink>
        ) : (
          <Link to="/contact" onClick={closeAllMenus}>{t("Contact")}</Link>
        )}

        <div
          className={`header__account ${accountMenuOpen ? "is-open" : ""}`}
          onMouseEnter={handleAccountMouseEnter}
          onMouseLeave={handleAccountMouseLeave}
        >
          <button
            type="button"
            className="header__account-trigger"
            onClick={toggleAccountMenu}
          >
            <FaUser />

            {user ? (
              <span className="username">
                {user.username || user.email}
                <FaChevronDown className="chevron" />
              </span>
            ) : (
              <span className="auth-link" onClick={() => {
                closeAllMenus();
                navigate("/auth");
              }}>
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
                <Link to="/admin" className="dropdown-item" onClick={closeAllMenus}>
                  🛠 Admin Panel
                </Link>
              ) : (
                <>
                  <Link to="/profile" className="dropdown-item" onClick={closeAllMenus}>
                    👤 Profile
                  </Link>
                  <Link to="/my-orders" className="dropdown-item" onClick={closeAllMenus}>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;