import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/RecipeDetailsPage.scss";

/* =========================================================
   REȚETE DE REZERVĂ
   Folosite dacă utilizatorul deschide pagina direct fără state
========================================================= */
const RECIPES = [
  {
    id: 1,
    slug: "fergese-tradicionale",
    title: "Fërgesë Tradițională",
    description:
      "O rețetă tradițională foarte gustoasă cu ardei, roșii și brânză cremoasă.",
    image: "/images/fergese.webp",
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
      "Adăugați brânza albă sau urda și amestecați până se topește.",
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
      "O salată proaspătă și colorată cu murături Zdrava, perfectă ca garnitură.",
    image: "/images/turshi.jpg",
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
    image: "/images/pastaAjvar.jpg",
    ingredients: [
      "300 g paste",
      "4 linguri ajvar Zdrava",
      "2 linguri ulei de măsline",
      "2 căței de usturoi",
      "100 ml smântână pentru gătit sau puțină apă de la paste",
      "Brânză rasă deasupra",
      "Sare",
      "Piper negru",
    ],
    steps: [
      "Fierbeți pastele conform instrucțiunilor de pe ambalaj.",
      "Într-o tigaie adăugați uleiul de măsline și usturoiul tocat.",
      "Adăugați ajvarul Zdrava și amestecați 1-2 minute.",
      "Adăugați smântâna sau puțină apă de la paste pentru a face sosul mai cremos.",
      "Adăugați pastele în tigaie și amestecați bine.",
      "Adăugați sare și piper după gust.",
      "Serviți cu brânză rasă deasupra.",
    ],
  },
  {
    id: 4,
    slug: "pite-me-djathe",
    title: "Plăcintă cu Brânză",
    description:
      "O plăcintă simplă de casă cu brânză, foarte bună pentru orice masă.",
    image: "/images/Byrek-me-gjize.jpeg",
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
      "Așezați foile una câte una adăugând umplutura între ele.",
      "Repetați până terminați umplutura.",
      "Deasupra ungeți cu puțin ulei sau iaurt.",
      "Coaceți la 180°C timp de 35-40 minute până devine aurie.",
      "Lăsați să se răcească puțin și serviți.",
    ],
  },
];

function RecipeDetailsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const stateRecipe = location.state?.recipe;
  const fallbackRecipe = RECIPES.find((item) => item.slug === slug);
  const recipe = stateRecipe || fallbackRecipe;

  if (!recipe) {
    return (
      <div className="recipe-details-page">
        <div className="recipe-details-page__not-found">
          <h2>{t("Rețeta nu a fost găsită.")}</h2>
          <p>{t("Această rețetă nu există sau a fost eliminată.")}</p>
          <button onClick={() => navigate("/")}>{t("Înapoi la Home")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-details-page">
      <section className="recipe-hero">
        <div className="recipe-hero__overlay">
          <button
            className="recipe-back-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            {t("← Înapoi")}
          </button>

          <div className="recipe-hero__content">
            <div className="recipe-hero__image">
              <img
                src={recipe.image || "/images/no-image.png"}
                alt={t(recipe.title)}
                onError={(e) => {
                  e.target.src = "/images/no-image.png";
                }}
              />
            </div>

            <div className="recipe-hero__text">
              <h1>{t(recipe.title)}</h1>
              <p>{t(recipe.description)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="recipe-content">
        <div className="recipe-content__container">
          <div className="recipe-content__grid">
            <div className="recipe-card-box">
              <h2>{t("Ingrediente")}</h2>
              <ul className="recipe-ingredients-list">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index}>{t(ingredient)}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-card-box">
              <h2>{t("Mod de preparare")}</h2>
              <ol className="recipe-steps-list">
                {recipe.steps?.map((step, index) => (
                  <li key={index}>{t(step)}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipeDetailsPage;