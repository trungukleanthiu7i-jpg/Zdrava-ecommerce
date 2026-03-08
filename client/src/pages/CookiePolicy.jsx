import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/CookiePolicy.scss";

const CookiePolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="legalPage">
      <div className="legalPage__container">

        {/* TITLE */}
        <h1>{t("POLITICA DE COOKIES")}</h1>

        <p className="legalPage__date">
          <strong>{t("Ultima actualizare:")}</strong> {t("02 martie 2026")}
        </p>

        <p>
          {t(
            "Această Politică de Cookies explică ce sunt cookie-urile, cum sunt utilizate pe acest site și ce opțiuni aveți în legătură cu acestea."
          )}
        </p>

        {/* SECTION 1 */}
        <section className="legalPage__section">
          <h3>{t("1. Ce sunt cookie-urile?")}</h3>
          <p>
            {t(
              "Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută site-ul să funcționeze corect, să rețină preferințele utilizatorului și să ofere informații despre modul de utilizare al site-ului."
            )}
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="legalPage__section">
          <h3>{t("2. Ce tipuri de cookie-uri folosim?")}</h3>

          <ul>
            <li>
              <strong>{t("Cookie-uri strict necesare")}</strong> –{" "}
              {t(
                "sunt esențiale pentru funcționarea corectă a site-ului și nu necesită consimțământ."
              )}
            </li>

            <li>
              <strong>{t("Cookie-uri de preferințe")}</strong> –{" "}
              {t(
                "rețin alegerile utilizatorului, cum ar fi limba selectată sau alte preferințe."
              )}
            </li>

            <li>
              <strong>{t("Cookie-uri de analiză")}</strong> –{" "}
              {t(
                "ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți experiența utilizatorilor."
              )}
            </li>

            <li>
              <strong>{t("Cookie-uri de marketing")}</strong> –{" "}
              {t(
                "pot fi folosite pentru a afișa conținut relevant sau reclame personalizate, doar dacă utilizatorul și-a dat consimțământul."
              )}
            </li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section className="legalPage__section">
          <h3>{t("3. De ce folosim cookie-uri?")}</h3>

          <ul>
            <li>{t("Pentru funcționarea tehnică a site-ului")}</li>
            <li>{t("Pentru memorarea preferințelor utilizatorilor")}</li>
            <li>{t("Pentru analizarea traficului și performanței site-ului")}</li>
            <li>{t("Pentru îmbunătățirea serviciilor și conținutului oferit")}</li>
          </ul>
        </section>

        {/* SECTION 4 */}
        <section className="legalPage__section">
          <h3>{t("4. Cum vă puteți gestiona consimțământul?")}</h3>

          <p>
            {t(
              "La prima vizită pe site, puteți alege ce categorii de cookie-uri acceptați. Puteți modifica ulterior preferințele dumneavoastră din setările browserului sau, dacă este disponibil, din bannerul de cookies al site-ului."
            )}
          </p>
        </section>

        {/* SECTION 5 */}
        <section className="legalPage__section">
          <h3>{t("5. Cum puteți dezactiva cookie-urile?")}</h3>

          <p>
            {t(
              "Majoritatea browserelor permit controlul cookie-urilor din setări. Puteți bloca sau șterge cookie-urile existente, însă anumite funcționalități ale site-ului pot fi afectate."
            )}
          </p>
        </section>

        {/* SECTION 6 */}
        <section className="legalPage__section">
          <h3>{t("6. Durata de stocare a cookie-urilor")}</h3>

          <p>
            {t(
              "Unele cookie-uri sunt șterse automat la închiderea browserului (cookie-uri de sesiune), iar altele rămân stocate pentru o perioadă determinată sau până la ștergerea lor manuală."
            )}
          </p>
        </section>

        {/* SECTION 7 */}
        <section className="legalPage__section">
          <h3>{t("7. Cookie-uri terțe")}</h3>

          <p>
            {t(
              "În anumite cazuri, site-ul poate utiliza servicii furnizate de terți, cum ar fi instrumente de analiză sau conținut integrat din platforme externe. Aceste servicii pot seta propriile cookie-uri, conform politicilor lor."
            )}
          </p>
        </section>

        {/* SECTION 8 */}
        <section className="legalPage__section">
          <h3>{t("8. Contact")}</h3>

          <p>
            {t(
              "Pentru întrebări legate de utilizarea cookie-urilor pe acest site, ne puteți contacta la:"
            )}
          </p>

          <p>
            <strong>info@info-zdravafood-ro.com</strong>
          </p>
        </section>

      </div>
    </div>
  );
};

export default CookiePolicy;