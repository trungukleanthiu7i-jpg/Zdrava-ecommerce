import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/NewProductsPage.scss";

const categories = [
  {
    title: "HORECA",
    items: [
      {
        label: "Legume conservate HORECA",
        slug: "legume-conservate-horeca",
      },
      {
        label: "Sosuri HORECA",
        slug: "sosuri-horeca",
      },
      {
        label: "Dulcețuri",
        slug: "dulceturi",
      },
    ],
  },
  {
    title: "SUPERMARKET",
    items: [
      {
        label: "Legume conservate",
        slug: "legume-conservate",
      },
      {
        label: "Produse din brânză",
        slug: "produse-din-branza",
      },
      {
        label: "Dulciuri și snacks-uri",
        slug: "dulciuri-si-snacks-uri",
      },
      {
        label: "Cafea și băuturi",
        slug: "cafea-si-bauturi",
      },
      {
        label: "Sosuri",
        slug: "sosuri",
      },
      {
        label: "Măsline",
        slug: "masline",
      },
      {
        label: "Alimente cu amidon",
        slug: "alimente-cu-amidon",
      },
      {
        label: "Plăcintă",
        slug: "placinta",
      },
    ],
  },
];

const NewProductsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="new-products-wrapper">
      <div className="new-products-page">
        {/* ===== Left Side: Categories ===== */}
        <div className="categories-left">
          <h2>{t("All Categories")}</h2>

          <div className="categories-columns">
            {categories.map((column) => (
              <div className="category-column" key={column.title}>
                <h4>{column.title}</h4>
                <ul>
                  {column.items.map((item) => (
                    <li key={item.slug}>
                      <Link to={`/products?category=${encodeURIComponent(item.slug)}`}>
                        {t(item.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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