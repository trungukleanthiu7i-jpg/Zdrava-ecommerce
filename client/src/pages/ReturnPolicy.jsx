import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/ReturnPolicy.scss";

const ReturnPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="returnPolicy">
      <div className="returnPolicy__container">

        <h1>{t("POLITICA DE RETUR")}</h1>

        <p>
          {t(
            "Această politică de retur stabilește condițiile în care produsele achiziționate de pe site-ul nostru pot fi returnate."
          )}
        </p>

        <h2>{t("1. Dreptul de retragere")}</h2>

        <p>
          {t(
            "Conform OUG nr. 34/2014, consumatorii au dreptul de a se retrage din contractul la distanță în termen de 14 zile calendaristice fără a invoca un motiv."
          )}
        </p>

        <p>
          {t(
            "Totuși, conform legislației aplicabile, dreptul de retragere NU se aplică produselor alimentare care sunt susceptibile de a se deteriora sau expira rapid."
          )}
        </p>

        <h2>{t("2. Produse care NU pot fi returnate")}</h2>

        <ul>
          <li>{t("Produse alimentare desigilate")}</li>
          <li>{t("Produse perisabile")}</li>
          <li>{t("Produse care prezintă semne de utilizare")}</li>
          <li>{t("Produse fără ambalajul original")}</li>
        </ul>

        <p>
          {t(
            "Din motive de igienă și siguranță alimentară, produsele alimentare desigilate sau deteriorate nu pot fi returnate."
          )}
        </p>

        <h2>{t("3. Produse defecte sau livrate greșit")}</h2>

        <p>
          {t(
            "Dacă produsul primit este deteriorat, defect sau diferit de cel comandat, clientul trebuie să ne contacteze în termen de 48 de ore de la primirea comenzii."
          )}
        </p>

        <p>
          {t(
            "În acest caz, produsul poate fi înlocuit sau rambursat după verificarea situației."
          )}
        </p>

        <h2>{t("4. Procedura de retur")}</h2>

        <p>
          {t(
            "Pentru solicitări de retur, clientul trebuie să trimită o cerere la adresa de email indicată pe site, incluzând numărul comenzii și fotografii relevante ale produsului."
          )}
        </p>

        <p>
          {t(
            "Costurile de transport pentru retur pot fi suportate de client, cu excepția cazurilor în care produsul a fost livrat greșit sau defect."
          )}
        </p>

        <h2>{t("5. Rambursări")}</h2>

        <p>
          {t(
            "Rambursările aprobate vor fi efectuate folosind aceeași metodă de plată utilizată pentru tranzacția inițială, în termen de maximum 14 zile."
          )}
        </p>

        <h2>{t("6. Contact")}</h2>

        <p>
          {t(
            "Pentru orice întrebări legate de politica de retur, ne puteți contacta folosind datele de contact disponibile pe site."
          )}
        </p>

      </div>
    </div>
  );
};

export default ReturnPolicy;