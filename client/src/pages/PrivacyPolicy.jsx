import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/PrivacyPolicy.scss";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const formattedDate = "02 martie 2026";

  return (
    <div className="legalPage">
      <div className="legalPage__container">

        {/* TITLE */}
        <h1>{t("POLITICA DE CONFIDENȚIALITATE")}</h1>

        <p className="legalPage__date">
          <strong>{t("Ultima actualizare:")}</strong> {formattedDate}
        </p>

        <p>
          {t(
            "Această Politică de Confidențialitate descrie modul în care MERITA LOGISTIC S.R.L. colectează, utilizează și protejează datele cu caracter personal ale utilizatorilor site-ului."
          )}
        </p>

        {/* ================= SECTION 1 ================= */}
        <section className="legalPage__section">
          <h3>{t("1. Operatorul datelor")}</h3>

          <p><strong>MERITA LOGISTIC S.R.L.</strong></p>
          <p>{t("Sediu: Str. Cerna nr. 3, Craiova, România")}</p>
          <p>{t("CUI: RO48977906")}</p>
          <p>{t("Telefon: 0734844079")}</p>
          <p>{t("Email: info@info-zdravafood-ro.com")}</p>
        </section>

        {/* ================= SECTION 2 ================= */}
        <section className="legalPage__section">
          <h3>{t("2. Ce date colectăm")}</h3>

          <ul>
            <li>{t("Nume și prenume")}</li>
            <li>{t("Adresă email")}</li>
            <li>{t("Număr de telefon")}</li>
            <li>{t("Adresă de livrare")}</li>
            <li>{t("Informații despre comenzi")}</li>
            <li>{t("Adresă IP și date tehnice ale dispozitivului")}</li>
          </ul>
        </section>

        {/* ================= SECTION 3 ================= */}
        <section className="legalPage__section">
          <h3>{t("3. Scopul colectării datelor")}</h3>

          <ul>
            <li>{t("Procesarea comenzilor")}</li>
            <li>{t("Livrarea produselor")}</li>
            <li>{t("Crearea și administrarea contului")}</li>
            <li>{t("Comunicarea cu utilizatorii")}</li>
            <li>{t("Îmbunătățirea serviciilor oferite")}</li>
            <li>{t("Respectarea obligațiilor legale")}</li>
          </ul>
        </section>

        {/* ================= SECTION 4 ================= */}
        <section className="legalPage__section">
          <h3>{t("4. Temeiul legal al prelucrării")}</h3>

          <ul>
            <li>{t("Executarea contractului de vânzare")}</li>
            <li>{t("Respectarea obligațiilor legale")}</li>
            <li>{t("Consimțământul utilizatorului")}</li>
            <li>{t("Interesul legitim al operatorului")}</li>
          </ul>
        </section>

        {/* ================= SECTION 5 ================= */}
        <section className="legalPage__section">
          <h3>{t("5. Stocarea datelor")}</h3>

          <p>
            {t(
              "Datele personale sunt păstrate doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate sau conform obligațiilor legale."
            )}
          </p>
        </section>

        {/* ================= SECTION 6 ================= */}
        <section className="legalPage__section">
          <h3>{t("6. Drepturile utilizatorilor")}</h3>

          <ul>
            <li>{t("Dreptul de acces la date")}</li>
            <li>{t("Dreptul la rectificarea datelor")}</li>
            <li>{t("Dreptul la ștergerea datelor")}</li>
            <li>{t("Dreptul la restricționarea prelucrării")}</li>
            <li>{t("Dreptul la portabilitatea datelor")}</li>
            <li>{t("Dreptul de opoziție")}</li>
          </ul>
        </section>

        {/* ================= SECTION 7 ================= */}
        <section className="legalPage__section">
          <h3>{t("7. Securitatea datelor")}</h3>

          <p>
            {t(
              "MERITA LOGISTIC S.R.L. implementează măsuri tehnice și organizatorice pentru protejarea datelor împotriva accesului neautorizat."
            )}
          </p>
        </section>

        {/* ================= SECTION 8 ================= */}
        <section className="legalPage__section">
          <h3>{t("8. Contact")}</h3>

          <p>
            {t(
              "Pentru orice întrebări privind protecția datelor personale ne puteți contacta la:"
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

export default PrivacyPolicy;