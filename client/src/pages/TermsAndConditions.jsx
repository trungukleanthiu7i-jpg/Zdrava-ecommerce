import React from "react";
import "../styles/TermsAndConditions.scss";

const TermsAndConditions = () => {

  // 📅 Fixed legal update date (change only when terms are modified)
  const formattedDate = "02 martie 2026";

  return (
    <div className="legalPage">
      <div className="legalPage__container">

        {/* HEADER (ONLY ONCE) */}
        <h1>TERMENI ȘI CONDIȚII</h1>
        <h2>MERITA LOGISTIC S.R.L. – Magazin online Zdrava</h2>

        <p>
          <strong>Ultima actualizare:</strong> {formattedDate}
        </p>

        <p>
          Prezentul document stabilește termenii și condițiile de utilizare a site-ului
          și condițiile generale de vânzare pentru achiziționarea produselor
          comercializate online de către MERITA LOGISTIC S.R.L. („Vânzătorul”).
          Prin accesarea site-ului, crearea unui cont și/sau plasarea unei comenzi,
          Utilizatorul/Clientul confirmă că a citit, a înțeles și acceptă integral
          acești Termeni și Condiții.
        </p>

        {/* Continue with sections 1, 2, 3... below */}

        <h3>1. Identificarea comerciantului</h3>

        <p>Operatorul site-ului și vânzătorul produselor este:</p>

        <p><strong>MERITA LOGISTIC S.R.L.</strong></p>
        <p>Sediu: Str. Cerna nr. 3, et. mansardă, ap. 3, Mun. Craiova, Jud. Dolj, România</p>
        <p>Nr. Reg. Com.: J2023002219162</p>
        <p>CUI/VAT: RO48977906</p>
        <p>Telefon: 0734844079</p>
        <p>E-mail: info@info-zdravafood-ro.com</p>

        <p>
          Merita Logistic S.R.L. este importator oficial în România al produselor
          alimentare marca Zdrava®, fabricate de Zdrava SHPK, Albania.
        </p>

        <p>
          Marca Zdrava® aparține Zdrava SHPK și este utilizată pe acest site
          exclusiv pentru comercializarea produselor originale distribuite
          de Merita Logistic S.R.L.
        </p>

        <h3>2. Definiții</h3>

        <ul>
          <li><strong>„Site”</strong> – platforma online disponibilă la [URL-ul site-ului].</li>
          <li><strong>„Utilizator”</strong> – orice persoană care accesează Site-ul.</li>
          <li><strong>„Client”</strong> – persoană fizică sau juridică ce plasează o comandă.</li>
          <li><strong>„Consumator”</strong> – persoană fizică ce acționează în scopuri din afara activității comerciale/profesionale (OUG 34/2014).</li>
          <li><strong>„Comandă”</strong> – solicitarea electronică de achiziție transmisă de Client prin Site.</li>
          <li><strong>„Contract la distanță”</strong> – contract încheiat fără prezența fizică simultană a părților.</li>
          <li><strong>„Produse”</strong> – bunuri comercializate pe Site, preponderent produse alimentare ambalate.</li>
        </ul>

        <h3>3. Cadrul legal aplicabil</h3>

        <ul>
          <li>OUG nr. 34/2014</li>
          <li>Legea nr. 365/2002 privind comerțul electronic</li>
          <li>Codul Civil</li>
          <li>Regulamentul (UE) 2016/679 (GDPR)</li>
          <li>Normele UE și naționale aplicabile siguranței alimentelor</li>
        </ul>

        <h3>4. Domeniul de aplicare. Acceptarea termenilor</h3>

        <p>4.1. Acești Termeni și Condiții se aplică tuturor Utilizatorilor/Clienților.</p>
        <p>4.2. Vânzătorul își rezervă dreptul de a modifica Termenii și Condițiile.</p>
        <p>4.3. Continuarea utilizării Site-ului constituie acceptarea modificărilor.</p>

        <h3>5. Eligibilitate. Cont de utilizator</h3>

        <p>5.1. Plasarea comenzilor este permisă persoanelor cu capacitate legală deplină.</p>
        <p>5.2. Clientul este responsabil pentru confidențialitatea datelor de autentificare.</p>
        <p>5.3. Vânzătorul poate suspenda conturi în caz de utilizare frauduloasă.</p>

        <h3>6. Reguli de utilizare a site-ului</h3>

        <p>6.1. Este interzisă utilizarea Site-ului în scopuri ilegale sau frauduloase.</p>
        <p>6.2. Este interzisă transmiterea de conținut malițios.</p>
        <p>6.3. Vânzătorul poate limita accesul în caz de abuz.</p>

        <h3>7. Informații despre produse</h3>

        <p>7.1. Pot apărea erori materiale (ex.: preț afișat eronat).</p>
        <p>7.2. Imaginile au caracter informativ.</p>
        <p>7.3. Disponibilitatea poate varia.</p>

        <h3>8. Prețuri. Taxe. Facturare</h3>

        <p>8.1. Prețurile includ TVA, dacă nu se specifică altfel.</p>
        <p>8.2. Costurile de livrare sunt afișate separat.</p>
        <p>8.3. Clientul este responsabil de corectitudinea datelor furnizate.</p>

        <h3>9. Comandă. Încheierea contractului</h3>

        <p>Contractul la distanță se consideră încheiat la confirmarea comenzii.</p>

        <h3>10. Plată</h3>

        <ul>
          <li>Card bancar online</li>
          <li>PayPal</li>
          <li>Transfer bancar</li>
        </ul>

        <h3>11. Livrare internațională</h3>

        <p>Livrarea se efectuează prin DHL / servicii poștale internaționale.</p>
        <p>Termen estimat: până la 10 zile lucrătoare.</p>

        <h3>12. Produse alimentare</h3>

        <p>Clientul trebuie să respecte condițiile de păstrare și informațiile despre alergeni.</p>

        <h3>13. Dreptul de retragere</h3>

        <p>Dreptul de retragere poate avea excepții pentru produse alimentare sigilate.</p>

        <h3>14. Politica de retur</h3>

        <p>Reclamațiile trebuie notificate în maximum 48 ore.</p>

        <h3>15. Garanții</h3>

        <p>Se aplică regimul legal al conformității produselor.</p>

        <h3>16. Limitarea răspunderii</h3>

        <p>Răspunderea Vânzătorului este limitată la valoarea produselor achiziționate.</p>

        <h3>17. Proprietate intelectuală</h3>

        <p>Marca Zdrava® aparține Zdrava SHPK.</p>

        <h3>18. Protecția datelor</h3>

        <p>Datele personale sunt prelucrate conform GDPR.</p>

        <h3>19. Comunicări electronice</h3>

        <p>Clientul acceptă comunicarea prin e-mail.</p>

        <h3>20. Forța majoră</h3>

        <p>Niciuna dintre părți nu răspunde pentru forță majoră.</p>

        <h3>21. Legea aplicabilă</h3>

        <p>Prezentul document este guvernat de legea română.</p>
        <p>
          Platforma ODR:{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr
          </a>
        </p>

        <h3>22. Dispoziții finale</h3>

        <p>Restul clauzelor rămân valabile dacă una este nulă.</p>

        <h3>23. Contact</h3>

        <p><strong>MERITA LOGISTIC S.R.L.</strong></p>
        <p>E-mail: info@info-zdravafood-ro.com</p>
        <p>Telefon: 0734844079</p>
        <p>Adresă: Str. Cerna nr. 3, Craiova, România</p>

      </div>
    </div>
  );
};

export default TermsAndConditions;