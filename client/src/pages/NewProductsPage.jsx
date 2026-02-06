import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/NewProductsPage.scss";

const NewProductsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="new-products-wrapper">
      <div className="new-products-page">
        {/* ===== Left Side: Categories ===== */}
        <div className="categories-left">
          <h2>{t("All Categories")}</h2>

          <div className="categories-columns">
            {/* HORECA column */}
            <div className="category-column">
              <h4>HORECA</h4>
              <ul>
                <li>
                  <a href="/category/legume-conservate-horeca">
                    {t("Legume conservate HORECA")}
                  </a>
                </li>
                <li>
                  <a href="/category/sosuri-horeca">{t("Sosuri HORECA")}</a>
                </li>
                <li>
                  <a href="/category/dulceturi">{t("Dulcețuri")}</a>
                </li>
              </ul>
            </div>

            {/* SUPERMARKET column */}
            <div className="category-column">
              <h4>SUPERMARKET</h4>
              <ul>
                <li>
                  <a href="/category/legume-conservate">
                    {t("Legume conservate")}
                  </a>
                </li>
                <li>
                  <a href="/category/produse-din-branza">
                    {t("Produse din brânză")}
                  </a>
                </li>
                <li>
                  <a href="/category/dulciuri-si-snacks-uri">
                    {t("Dulciuri și snacks-uri")}
                  </a>
                </li>
                <li>
                  <a href="/category/cafea-si-bauturi">
                    {t("Cafea și băuturi")}
                  </a>
                </li>
                <li>
                  <a href="/category/sosuri">{t("Sosuri")}</a>
                </li>
                <li>
                  <a href="/category/masline">{t("Măsline")}</a>
                </li>
                <li>
                  <a href="/category/alimente-cu-amidon">
                    {t("Alimente cu amidon")}
                  </a>
                </li>
                <li>
                  <a href="/category/placinta">{t("Plăcintă")}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Right Side: Message ===== */}
        <div className="no-products-right">
          <h2>{t("Produse noi")}</h2>
          <h3>{t("Momentan nu există produse noi.")}</h3>
          <p>{t("Caută din nou produsul dorit sau revino mai târziu.")}</p>
        </div>
      </div>
    </div>
  );
};

export default NewProductsPage;
