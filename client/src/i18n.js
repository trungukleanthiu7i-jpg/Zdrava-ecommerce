import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "All Categories": "All Categories",
      "Search here...": "Search here...",
      "My Account": "My Account",
      "See All": "See All",
      "Best Sales": "Best Sales",
      "New Products": "New Products",
      "Contact": "Contact",
    },
  },
  ro: {
    translation: {
      "Home": "Acasă",
      "All Categories": "Toate categoriile",
      "Search here...": "Caută aici...",
      "My Account": "Contul meu",
      "See All": "Vezi tot",
      "Best Sales": "Cele mai vândute",
      "New Products": "Produse noi",
      "Contact": "Contact",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
