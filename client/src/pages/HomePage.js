import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { useTranslation } from "react-i18next";

import "../styles/HomePage.scss";
import DealsOfTheWeek from "../components/DealsOfTheWeek";
import StatsSection from "../components/StatsSection";
import MapSection from "../components/MapSection";
import InfoSection from "../components/InfoSection";

/* =========================================================
   DATELE REȚETELOR
========================================================= */
const HOME_RECIPES = [
  {
    id: 1,
    slug: "fergese-tradicionale",
    title: "Fërgesë Tradițională",
    description:
      "Un preparat tradițional balcanic realizat cu ardei, roșii și brânză cremoasă.",
    image: `${process.env.PUBLIC_URL}/images/fergese.webp`,
    ingredients: [
      "2 borcane ardei copți Zdrava",
      "2-3 roșii proaspete sau sos de roșii Zdrava",
      "200 g brânză albă / urdă",
      "100 g cașcaval ras",
      "2 linguri ulei",
      "1 cățel de usturoi",
      "Sare",
      "Piper negru",
    ],
    steps: [
      "Tăiați ardeii în bucăți mici.",
      "Într-o tigaie adăugați uleiul și usturoiul tocat, apoi adăugați roșiile sau sosul de roșii.",
      "Lăsați să fiarbă câteva minute și adăugați ardeii.",
      "Adăugați brânza albă sau urda și amestecați până devine cremoasă.",
      "La final adăugați cașcavalul ras deasupra.",
      "Introduceți în cuptor pentru 10-15 minute până devine aurie.",
      "Serviți caldă cu pâine.",
    ],
  },
  {
    id: 2,
    slug: "sallate-me-turshi",
    title: "Salată cu Murături",
    description:
      "O salată proaspătă și colorată realizată cu murături Zdrava, perfectă ca garnitură.",
    image: `${process.env.PUBLIC_URL}/images/turshi.jpg`,
    ingredients: [
      "1 borcan murături mix Zdrava",
      "1 castravete proaspăt",
      "2 roșii",
      "1 ceapă roșie",
      "2 linguri ulei de măsline",
      "1 lingură suc de lămâie",
      "Sare",
      "Piper negru",
    ],
    steps: [
      "Tăiați roșiile, castravetele și ceapa în bucăți.",
      "Adăugați murăturile Zdrava bine scurse.",
      "Puneți toate ingredientele într-un bol mare.",
      "Adăugați uleiul de măsline, sucul de lămâie, sarea și piperul.",
      "Amestecați bine și lăsați 5 minute înainte de servire.",
    ],
  },
  {
    id: 3,
    slug: "makarona-me-ajvar",
    title: "Paste cu Ajvar",
    description:
      "O rețetă rapidă și gustoasă cu ajvar, ideală pentru prânz sau cină.",
    image: `${process.env.PUBLIC_URL}/images/pastaAjvar.jpg`,
    ingredients: [
      "300 g paste",
      "4 linguri ajvar Zdrava",
      "2 linguri ulei de măsline",
      "2 căței de usturoi",
      "100 ml smântână pentru gătit sau puțină apă de la paste",
      "Brânză rasă pentru servire",
      "Sare",
      "Piper negru",
    ],
    steps: [
      "Fierbeți pastele conform instrucțiunilor de pe ambalaj.",
      "Într-o tigaie adăugați uleiul de măsline și usturoiul tocat.",
      "Adăugați ajvarul Zdrava și amestecați timp de 1-2 minute.",
      "Adăugați smântâna sau puțină apă de la paste pentru a face sosul mai cremos.",
      "Adăugați pastele în tigaie și amestecați bine.",
      "Condimentați cu sare și piper după gust.",
      "Serviți cu brânză rasă deasupra.",
    ],
  },
  {
    id: 4,
    slug: "pite-me-djathe",
    title: "Plăcintă cu Brânză",
    description:
      "O plăcintă simplă de casă cu brânză și ingrediente tradiționale.",
    image: `${process.env.PUBLIC_URL}/images/Byrek-me-gjize.jpeg`,
    ingredients: [
      "1 pachet foi de plăcintă",
      "300 g brânză albă",
      "200 g urdă",
      "2 ouă",
      "100 ml iaurt",
      "50 ml ulei",
      "Puțină sare",
    ],
    steps: [
      "Într-un bol amestecați brânza, urda, ouăle, iaurtul și puțină sare.",
      "Ungeți tava cu puțin ulei.",
      "Așezați foile una câte una adăugând puțin din umplutură între ele.",
      "Repetați până terminați umplutura.",
      "Deasupra ungeți cu puțin ulei sau iaurt.",
      "Coaceți la 180°C timp de aproximativ 35-40 minute până devine aurie.",
      "Lăsați să se răcească puțin și serviți.",
    ],
  },
];

function HomePage() {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea produselor:", err);
      }
    };
    fetchProducts();
  }, [API]);

  const openRecipe = (recipe) => {
    navigate(`/recipes/${recipe.slug}`, {
      state: { recipe },
    });
  };

  return (
    <div className="home-page">
      <section className="hero" data-aos="fade-up">
        <video
          className="hero__video"
          src={`${process.env.PUBLIC_URL}/images/hero-video.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero__overlay">
          <div className="hero__content" data-aos="fade-up" data-aos-delay="300">
            <h1>{t("Welcome to Zdrava Store")}</h1>
            <p>
              {t(
                "Discover fresh, healthy products and tasty pickled delights! Browse our selection and add your favorites to the cart."
              )}
            </p>

            <button onClick={() => navigate("/products")}>
              {t("Shop Now")}
            </button>
          </div>
        </div>
      </section>

      <div data-aos="fade-up" data-aos-delay="200">
        <InfoSection />
      </div>

      <div data-aos="fade-up" data-aos-delay="300">
        <DealsOfTheWeek products={products.slice(0, 6)} />
      </div>

      <div data-aos="zoom-in" data-aos-delay="300">
        <StatsSection />
      </div>

      <section className="recipes-section" data-aos="fade-up" data-aos-delay="350">
        <div className="recipes-section__container">
          <div className="recipes-section__header">
            <h2>{t("Rețete")}</h2>
            <p>
              {t(
                "Descoperă rețete delicioase preparate cu produsele Zdrava. Le poți actualiza oricând dorești."
              )}
            </p>
          </div>

          <div className="recipes-section__grid">
            {HOME_RECIPES.map((recipe) => (
              <div
                className="recipe-card"
                key={recipe.id}
                onClick={() => openRecipe(recipe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openRecipe(recipe);
                  }
                }}
              >
                <div className="recipe-card__image">
                  <img
                    src={recipe.image}
                    alt={t(recipe.title)}
                    onError={(e) => {
                      console.error("Imagine nereușită:", recipe.image);
                      e.target.src = `${process.env.PUBLIC_URL}/images/no-image.png`;
                    }}
                  />
                </div>

                <div className="recipe-card__content">
                  <h3>{t(recipe.title)}</h3>
                  <p>{t(recipe.description)}</p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openRecipe(recipe);
                    }}
                  >
                    {t("Vezi rețeta")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div data-aos="fade-up" data-aos-delay="500">
        <MapSection />
      </div>
    </div>
  );
}

export default HomePage;