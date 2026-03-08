import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/TermsAndConditions.scss";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  // 📅 Fixed legal update date (change only when terms are modified)
  const formattedDate = t("02 martie 2026");

  return (
    <div className="legalPage">
      <div className="legalPage__container">
        {/* HEADER (ONLY ONCE) */}
        <h1>{t("TERMENI ȘI CONDIȚII")}</h1>
        <h2>{t("MERITA LOGISTIC S.R.L. – Magazin online Zdrava")}</h2>

        <p>
          <strong>{t("Ultima actualizare:")}</strong> {formattedDate}
        </p>

        <p>
          {t(
            "Prezentul document stabilește termenii și condițiile de utilizare a site-ului și condițiile generale de vânzare pentru achiziționarea produselor comercializate online de către MERITA LOGISTIC S.R.L. („Vânzătorul”). Prin accesarea site-ului, crearea unui cont și/sau plasarea unei comenzi, Utilizatorul/Clientul confirmă că a citit, a înțeles și acceptă integral acești Termeni și Condiții."
          )}
        </p>

        <h3>{t("1. Identificarea comerciantului")}</h3>

        <p>{t("Operatorul site-ului și vânzătorul produselor este:")}</p>

        <p>
          <strong>MERITA LOGISTIC S.R.L.</strong>
        </p>
        <p>
          {t(
            "Sediu: Str. Cerna nr. 3, et. mansardă, ap. 3, Mun. Craiova, Jud. Dolj, România"
          )}
        </p>
        <p>{t("Nr. Reg. Com.: J2023002219162")}</p>
        <p>{t("CUI/VAT: RO48977906")}</p>
        <p>{t("Telefon: 0734844079")}</p>
        <p>{t("E-mail: info@info-zdravafood-ro.com")}</p>

        <p>
          {t(
            "Merita Logistic S.R.L. este importator oficial în România al produselor alimentare marca Zdrava®, fabricate de Zdrava SHPK, Albania."
          )}
        </p>

        <p>
          {t(
            "Marca Zdrava® aparține Zdrava SHPK și este utilizată pe acest site exclusiv pentru comercializarea produselor originale distribuite de Merita Logistic S.R.L."
          )}
        </p>

        <h3>{t("2. Definiții")}</h3>

        <ul>
          <li>
            {t("„Site” – platforma online disponibilă la [URL-ul site-ului].")}
          </li>
          <li>
            {t("„Utilizator” – orice persoană care accesează Site-ul.")}
          </li>
          <li>
            {t(
              "„Client” – persoană fizică sau juridică ce plasează o comandă."
            )}
          </li>
          <li>
            {t(
              "„Consumator” – persoană fizică ce acționează în scopuri din afara activității comerciale/profesionale (OUG 34/2014)."
            )}
          </li>
          <li>
            {t(
              "„Comandă” – solicitarea electronică de achiziție transmisă de Client prin Site."
            )}
          </li>
          <li>
            {t(
              "„Contract la distanță” – contract încheiat fără prezența fizică simultană a părților."
            )}
          </li>
          <li>
            {t(
              "„Produse” – bunuri comercializate pe Site, preponderent produse alimentare ambalate."
            )}
          </li>
        </ul>

        <h3>{t("3. Cadrul legal aplicabil")}</h3>

        <ul>
          <li>{t("OUG nr. 34/2014")}</li>
          <li>{t("Legea nr. 365/2002 privind comerțul electronic")}</li>
          <li>{t("Codul Civil")}</li>
          <li>{t("Regulamentul (UE) 2016/679 (GDPR)")}</li>
          <li>{t("Normele UE și naționale aplicabile siguranței alimentelor")}</li>
        </ul>

        <h3>{t("4. Domeniul de aplicare. Acceptarea termenilor")}</h3>

        <p>
          {t(
            "4.1. Acești Termeni și Condiții se aplică tuturor Utilizatorilor/Clienților."
          )}
        </p>
        <p>
          {t(
            "4.2. Vânzătorul își rezervă dreptul de a modifica Termenii și Condițiile."
          )}
        </p>
        <p>
          {t(
            "4.3. Continuarea utilizării Site-ului constituie acceptarea modificărilor."
          )}
        </p>

        <h3>{t("5. Eligibilitate. Cont de utilizator")}</h3>

        <p>
          {t(
            "5.1. Plasarea comenzilor este permisă persoanelor cu capacitate legală deplină."
          )}
        </p>
        <p>
          {t(
            "5.2. Clientul este responsabil pentru confidențialitatea datelor de autentificare."
          )}
        </p>
        <p>
          {t(
            "5.3. Vânzătorul poate suspenda conturi în caz de utilizare frauduloasă."
          )}
        </p>

        <h3>{t("6. Reguli de utilizare a site-ului")}</h3>

        <p>
          {t(
            "6.1. Este interzisă utilizarea Site-ului în scopuri ilegale sau frauduloase."
          )}
        </p>
        <p>{t("6.2. Este interzisă transmiterea de conținut malițios.")}</p>
        <p>{t("6.3. Vânzătorul poate limita accesul în caz de abuz.")}</p>

        <h3>{t("7. Informații despre produse")}</h3>

        <p>{t("7.1. Pot apărea erori materiale (ex.: preț afișat eronat).")}</p>
        <p>{t("7.2. Imaginile au caracter informativ.")}</p>
        <p>{t("7.3. Disponibilitatea poate varia.")}</p>

        <h3>{t("8. Prețuri. Taxe. Facturare")}</h3>

        <p>{t("8.1. Prețurile includ TVA, dacă nu se specifică altfel.")}</p>
        <p>{t("8.2. Costurile de livrare sunt afișate separat.")}</p>
        <p>
          {t(
            "8.3. Clientul este responsabil de corectitudinea datelor furnizate."
          )}
        </p>

        <h3>{t("9. Comandă. Încheierea contractului")}</h3>

        <p>
          {t(
            "Contractul la distanță se consideră încheiat la confirmarea comenzii."
          )}
        </p>

        <h3>{t("10. Plată")}</h3>

        <ul>
          <li>{t("Card bancar online")}</li>
          <li>{t("PayPal")}</li>
          <li>{t("Transfer bancar")}</li>
        </ul>

        <h3>{t("11. Livrare internațională")}</h3>

        <p>
          {t(
            "Livrarea se efectuează prin DHL / servicii poștale internaționale."
          )}
        </p>
        <p>{t("Termen estimat: până la 10 zile lucrătoare.")}</p>

        <h3>{t("12. Produse alimentare")}</h3>

        <p>
          {t(
            "Clientul trebuie să respecte condițiile de păstrare și informațiile despre alergeni."
          )}
        </p>

        <h3>{t("13. Dreptul de retragere")}</h3>

        <p>
          {t(
            "Dreptul de retragere poate avea excepții pentru produse alimentare sigilate."
          )}
        </p>

        <h3>{t("14. Politica de retur")}</h3>

        <p>{t("Reclamațiile trebuie notificate în maximum 48 ore.")}</p>

        <h3>{t("15. Garanții")}</h3>

        <p>{t("Se aplică regimul legal al conformității produselor.")}</p>

        <h3>{t("16. Limitarea răspunderii")}</h3>

        <p>
          {t(
            "Răspunderea Vânzătorului este limitată la valoarea produselor achiziționate."
          )}
        </p>

        <h3>{t("17. Proprietate intelectuală")}</h3>

        <p>{t("Marca Zdrava® aparține Zdrava SHPK.")}</p>

        <h3>{t("18. Protecția datelor")}</h3>

        <p>{t("Datele personale sunt prelucrate conform GDPR.")}</p>

        <h3>{t("19. Comunicări electronice")}</h3>

        <p>{t("Clientul acceptă comunicarea prin e-mail.")}</p>

        <h3>{t("20. Forța majoră")}</h3>

        <p>{t("Niciuna dintre părți nu răspunde pentru forță majoră.")}</p>

        <h3>{t("21. Legea aplicabilă")}</h3>

        <p>{t("Prezentul document este guvernat de legea română.")}</p>
        <p>
          {t("Platforma ODR:")}{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr
          </a>
        </p>

        <h3>{t("22. Dispoziții finale")}</h3>

        <p>{t("Restul clauzelor rămân valabile dacă una este nulă.")}</p>

        <h3>{t("23. Contact")}</h3>

        <p>
          <strong>MERITA LOGISTIC S.R.L.</strong>
        </p>
        <p>{t("E-mail: info@info-zdravafood-ro.com")}</p>
        <p>{t("Telefon: 0734844079")}</p>
        <p>{t("Adresă: Str. Cerna nr. 3, Craiova, România")}</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;