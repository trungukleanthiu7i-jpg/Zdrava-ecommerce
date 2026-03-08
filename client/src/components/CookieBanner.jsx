import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/CookieBanner.scss";

const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const saveConsent = (data) => {
    localStorage.setItem(
      "zdrava_cookie_consent",
      JSON.stringify({
        necessary: true,
        analytics: !!data.analytics,
        marketing: !!data.marketing,
        choice:
          data.analytics || data.marketing ? "custom-or-accepted" : "rejected",
        date: new Date().toISOString(),
      })
    );

    setVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleCheckboxChange = (field) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!visible) return null;

  return (
    <div className="cookieBanner">
      <div className="cookieBanner__backdrop" />

      <div className="cookieBanner__panel" role="dialog" aria-modal="true">
        <div className="cookieBanner__top">
          <div className="cookieBanner__badge">
            {t("Cookie-uri și confidențialitate")}
          </div>

          <h3 className="cookieBanner__title">
            {t("Acest site folosește cookies")}
          </h3>

          <p className="cookieBanner__text">
            {t(
              "Folosim cookie-uri strict necesare pentru funcționarea corectă a site-ului și, doar cu acordul dumneavoastră, cookie-uri de analiză și marketing pentru a îmbunătăți experiența de navigare și conținutul afișat."
            )}{" "}
            <Link to="/cookie-policy" className="cookieBanner__link">
              {t("Politica de cookies")}
            </Link>{" "}
            {t("și")}{" "}
            <Link to="/privacy-policy" className="cookieBanner__link">
              {t("Politica de confidențialitate")}
            </Link>
            .
          </p>
        </div>

        <div className="cookieBanner__summary">
          <div className="cookieBanner__summaryItem">
            <span className="cookieBanner__summaryLabel">{t("Necesar")}</span>
            <span className="cookieBanner__summaryValue cookieBanner__summaryValue--active">
              {t("Activ mereu")}
            </span>
          </div>

          <div className="cookieBanner__summaryItem">
            <span className="cookieBanner__summaryLabel">{t("Analiză")}</span>
            <span className="cookieBanner__summaryValue">
              {preferences.analytics ? t("Activ") : t("Inactiv")}
            </span>
          </div>

          <div className="cookieBanner__summaryItem">
            <span className="cookieBanner__summaryLabel">{t("Marketing")}</span>
            <span className="cookieBanner__summaryValue">
              {preferences.marketing ? t("Activ") : t("Inactiv")}
            </span>
          </div>
        </div>

        {showPreferences && (
          <div className="cookieBanner__preferences">
            <div className="cookieBanner__prefCard cookieBanner__prefCard--locked">
              <div className="cookieBanner__prefInfo">
                <h4>{t("Cookie-uri strict necesare")}</h4>
                <p>
                  {t(
                    "Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot fi dezactivate."
                  )}
                </p>
              </div>

              <div className="cookieBanner__switchWrap">
                <input type="checkbox" checked disabled />
              </div>
            </div>

            <div className="cookieBanner__prefCard">
              <div className="cookieBanner__prefInfo">
                <h4>{t("Cookie-uri de analiză")}</h4>
                <p>
                  {t(
                    "Ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți performanța și experiența utilizatorilor."
                  )}
                </p>
              </div>

              <label className="cookieBanner__switchWrap">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handleCheckboxChange("analytics")}
                />
                <span className="cookieBanner__switchSlider" />
              </label>
            </div>

            <div className="cookieBanner__prefCard">
              <div className="cookieBanner__prefInfo">
                <h4>{t("Cookie-uri de marketing")}</h4>
                <p>
                  {t(
                    "Pot fi utilizate pentru a afișa conținut relevant și comunicări personalizate, doar cu acordul dumneavoastră."
                  )}
                </p>
              </div>

              <label className="cookieBanner__switchWrap">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleCheckboxChange("marketing")}
                />
                <span className="cookieBanner__switchSlider" />
              </label>
            </div>
          </div>
        )}

        <div className="cookieBanner__actions">
          {!showPreferences ? (
            <>
              <button
                type="button"
                className="cookieBanner__btn cookieBanner__btn--ghost"
                onClick={() => setShowPreferences(true)}
              >
                {t("Personalizează")}
              </button>

              <button
                type="button"
                className="cookieBanner__btn cookieBanner__btn--secondary"
                onClick={handleRejectAll}
              >
                {t("Refuză toate")}
              </button>

              <button
                type="button"
                className="cookieBanner__btn cookieBanner__btn--primary"
                onClick={handleAcceptAll}
              >
                {t("Acceptă toate")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cookieBanner__btn cookieBanner__btn--ghost"
                onClick={() => setShowPreferences(false)}
              >
                {t("Înapoi")}
              </button>

              <button
                type="button"
                className="cookieBanner__btn cookieBanner__btn--secondary"
                onClick={handleRejectAll}
              >
                {t("Refuză toate")}
              </button>

              <button
                type="button"
                className="cookieBanner__btn cookieBanner__btn--primary"
                onClick={handleSavePreferences}
              >
                {t("Salvează preferințele")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;