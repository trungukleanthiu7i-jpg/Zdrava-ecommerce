import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ✅ keep language after refresh
const savedLanguage = localStorage.getItem("language") || "ro";

const resources = {
  en: {
    translation: {
      // ================= HEADER =================
      "All Categories": "All Categories",
      "Home": "Home",
      "Shop Now": "Shop Now",
      "About Us": "About Us",
      "New Products": "New Products",
      "Contact": "Contact",
      "My Account": "My Account",
      "Search here...": "Search here...",

      // ================= CATEGORIES (TRANSLATIONS) =================
      "Legume conservate HORECA": "HORECA Canned Vegetables",
      "Sosuri HORECA": "HORECA Sauces",
      "Dulcețuri": "Jams",
      "Legume conservate": "Canned Vegetables",
      "Produse din brânză": "Cheese Products",
      "Dulciuri și snacks-uri": "Sweets & Snacks",
      "Cafea și băuturi": "Coffee & Drinks",
      "Sosuri": "Sauces",
      "Măsline": "Olives",
      "Alimente cu amidon": "Starchy Foods",
      "Plăcintă": "Pie",

      // ================= NEW PRODUCTS PAGE =================
      "Produse noi": "New products",
      "Momentan nu există produse noi.": "There are no new products at the moment.",
      "Caută din nou produsul dorit sau revino mai târziu.":
        "Search again for the product you want or come back later.",

      // ================= ABOUT CTA (CLICKABLE CONTACT LINK) =================
      "ctaTextBeforeContact": "Visit our",
      "ctaContactWord": "Contact",
      "ctaTextAfterContact":
        "page or follow us on social media to stay updated with our latest products and offers.",

      // ================= HOME HERO =================
      "Welcome to Zdrava Store": "Welcome to Zdrava Store",
      "Discover fresh, healthy products and tasty pickled delights! Browse our selection and add your favorites to the cart.":
        "Discover fresh, healthy products and tasty pickled delights! Browse our selection and add your favorites to the cart.",
      "Shop Now (Hero)": "Shop Now",

      // ================= INFO SECTION =================
      "FAST DELIVERY": "FAST DELIVERY",
      "Order before 4PM": "Order before 4PM",
      "SUPPORT": "SUPPORT",
      "Contact us 9AM–6PM": "Contact us 9AM–6PM",
      "FOR PHONE ORDERS CALL:": "FOR PHONE ORDERS CALL:",
      "FRESH ZDRAVA GROUP": "FRESH ZDRAVA GROUP",
      "200+ Products": "200+ Products",

      // ================= DEALS =================
      "Hot Discounts Just for You": "Hot Discounts Just for You",
      "Deals Of The Week": "Deals Of The Week",
      "No offers available right now.": "No offers available right now.",
      "DAYS": "DAYS",
      "HRS": "HRS",
      "MINS": "MINS",
      "SECS": "SECS",
      "Product not found in the main list.": "Product not found in the main list.",

      // ================= STATS =================
      "Products": "Products",
      "Statistics": "Statistics",
      "Clients": "Clients",
      "Quality": "Quality",

      // ================= MAP =================
      "Where to Find Us": "Where to Find Us",

      // ================= ABOUT =================
      "About Zdrava": "About Zdrava",
      "Our Mission": "Our Mission",
      "Natural Ingredients": "Natural Ingredients",
      "Only the freshest, locally sourced produce.": "Only the freshest, locally sourced produce.",
      "Trusted Partners": "Trusted Partners",
      "Working with honest farmers and suppliers we trust.":
        "Working with honest farmers and suppliers we trust.",
      "Passion for Quality": "Passion for Quality",
      "Every product reflects our passion for excellence.":
        "Every product reflects our passion for excellence.",
      "Crafted with honesty, care, and love for both people and planet.":
        "Crafted with honesty, care, and love for both people and planet.",
      "Years of Experience": "Years of Experience",
      "Products Delivered": "Products Delivered",
      "Partner Countries": "Partner Countries",
      "Want to know more?": "Want to know more?",

      // ================= CONTACT =================
      "Let’s Get in Touch": "Let’s Get in Touch",
      "Have a question or feedback? We’d love to hear from you. Reach out using the form below or visit us at our store in Breasta, Dolj!":
        "Have a question or feedback? We’d love to hear from you. Reach out using the form below or visit us at our store in Breasta, Dolj!",
      "Our Location": "Our Location",
      "Email Us": "Email Us",
      "Call Us": "Call Us",
      "Your Name": "Your Name",
      "Your Email": "Your Email",
      "Your Message": "Your Message",
      "Send Message": "Send Message",
      "Sending...": "Sending...",
      "✅ Sent!": "✅ Sent!",

      // ================= AUTH =================
      "Welcome Back!": "Welcome Back!",
      "Log in to your account to access all features.":
        "Log in to your account to access all features.",
      "Sign In": "Sign In",
      "Sign Up": "Sign Up",
      "Don’t have an account?": "Don’t have an account?",
      "Already have an account?": "Already have an account?",
      "Join Us Today!": "Join Us Today!",
      "Create your account and start exploring the platform.":
        "Create your account and start exploring the platform.",
      "Create Account": "Create Account",
      "Email or Username": "Email or Username",
      "Password": "Password",
      "Signing in...": "Signing in...",
      "Creating account...": "Creating account...",
      "Continue with Google": "Continue with Google",
      "Continue with Facebook": "Continue with Facebook",
      "Authentication failed.": "Authentication failed.",
      "Authentication failed. Please try again.":
        "Authentication failed. Please try again.",

      // ================= CART DRAWER =================
      "Go to cart": "Go to cart",
      "Checkout": "Checkout",

      // ================= ACCOUNT MENU =================
      "Profile": "Profile",
      "My Orders": "My Orders",
      "Logout": "Logout",

      // ================= PROFILE PAGE =================
      "My Profile": "My Profile",
      "Username": "Username",
      "Account Type": "Account Type",
      "Individual": "Individual",
      "Email": "Email",
      "Phone": "Phone",
      "Edit Profile": "Edit Profile",
      "Change Password": "Change Password",
      "Old Password": "Old Password",
      "New Password": "New Password",
      "Update Password": "Update Password",

      // ================= MY ORDERS =================
      "You haven’t placed any orders yet.": "You haven’t placed any orders yet.",
    },
  },

  ro: {
    translation: {
      // ================= HEADER =================
      "All Categories": "Toate categoriile",
      "Home": "Acasă",
      "Shop Now": "Cumpără acum",
      "About Us": "Despre noi",
      "New Products": "Produse noi",
      "Contact": "Contact",
      "My Account": "Contul meu",
      "Search here...": "Caută aici...",

      // ================= CATEGORIES (RO kept as-is) =================
      "Legume conservate HORECA": "Legume conservate HORECA",
      "Sosuri HORECA": "Sosuri HORECA",
      "Dulcețuri": "Dulcețuri",
      "Legume conservate": "Legume conservate",
      "Produse din brânză": "Produse din brânză",
      "Dulciuri și snacks-uri": "Dulciuri și snacks-uri",
      "Cafea și băuturi": "Cafea și băuturi",
      "Sosuri": "Sosuri",
      "Măsline": "Măsline",
      "Alimente cu amidon": "Alimente cu amidon",
      "Plăcintă": "Plăcintă",

      // ================= NEW PRODUCTS PAGE =================
      "Produse noi": "Produse noi",
      "Momentan nu există produse noi.": "Momentan nu există produse noi.",
      "Caută din nou produsul dorit sau revino mai târziu.":
        "Caută din nou produsul dorit sau revino mai târziu.",

      // ================= ABOUT CTA (CLICKABLE CONTACT LINK) =================
      "ctaTextBeforeContact": "Vizitează pagina de",
      "ctaContactWord": "Contact",
      "ctaTextAfterContact":
        "sau urmărește-ne pe social media pentru a fi la curent cu produsele și ofertele noastre.",

      // ================= HOME HERO =================
      "Welcome to Zdrava Store": "Bine ai venit la Zdrava Store",
      "Discover fresh, healthy products and tasty pickled delights! Browse our selection and add your favorites to the cart.":
        "Descoperă produse proaspete, sănătoase și delicii murate gustoase! Răsfoiește selecția noastră și adaugă produsele preferate în coș.",
      "Shop Now (Hero)": "Cumpără acum",

      // ================= INFO SECTION =================
      "FAST DELIVERY": "LIVRARE RAPIDĂ",
      "Order before 4PM": "Comandă înainte de ora 16:00",
      "SUPPORT": "SUPORT",
      "Contact us 9AM–6PM": "Contactează-ne 09:00–18:00",
      "FOR PHONE ORDERS CALL:": "PENTRU COMENZI TELEFONICE SUNĂ:",
      "FRESH ZDRAVA GROUP": "ZDRAVA GROUP PROASPĂT",
      "200+ Products": "200+ produse",

      // ================= DEALS =================
      "Hot Discounts Just for You": "Reduceri speciale pentru tine",
      "Deals Of The Week": "Ofertele săptămânii",
      "No offers available right now.": "Momentan nu există oferte disponibile.",
      "DAYS": "ZILE",
      "HRS": "ORE",
      "MINS": "MIN",
      "SECS": "SEC",
      "Product not found in the main list.": "Produsul nu a fost găsit în lista principală.",

      // ================= STATS =================
      "Products": "Produse",
      "Statistics": "Statistici",
      "Clients": "Clienți",
      "Quality": "Calitate",

      // ================= MAP =================
      "Where to Find Us": "Unde ne găsești",

      // ================= ABOUT =================
      "About Zdrava": "Despre Zdrava",
      "Our Mission": "Misiunea noastră",
      "Natural Ingredients": "Ingrediente naturale",
      "Only the freshest, locally sourced produce.": "Doar produse proaspete, din surse locale.",
      "Trusted Partners": "Parteneri de încredere",
      "Working with honest farmers and suppliers we trust.":
        "Lucrăm cu fermieri și furnizori onești, în care avem încredere.",
      "Passion for Quality": "Pasiune pentru calitate",
      "Every product reflects our passion for excellence.":
        "Fiecare produs reflectă pasiunea noastră pentru excelență.",
      "Crafted with honesty, care, and love for both people and planet.":
        "Create cu onestitate, grijă și respect pentru oameni și natură.",
      "Years of Experience": "Ani de experiență",
      "Products Delivered": "Produse livrate",
      "Partner Countries": "Țări partenere",
      "Want to know more?": "Vrei să afli mai multe?",

      // ================= CONTACT =================
      "Let’s Get in Touch": "Hai să vorbim",
      "Have a question or feedback? We’d love to hear from you. Reach out using the form below or visit us at our store in Breasta, Dolj!":
        "Ai o întrebare sau un feedback? Ne-ar plăcea să te auzim. Scrie-ne folosind formularul de mai jos sau vizitează-ne în Breasta, Dolj!",
      "Our Location": "Locația noastră",
      "Email Us": "Trimite-ne email",
      "Call Us": "Sună-ne",
      "Your Name": "Numele tău",
      "Your Email": "Emailul tău",
      "Your Message": "Mesajul tău",
      "Send Message": "Trimite mesaj",
      "Sending...": "Se trimite...",
      "✅ Sent!": "✅ Trimis!",

      // ================= AUTH =================
      "Welcome Back!": "Bine ai revenit!",
      "Log in to your account to access all features.":
        "Autentifică-te în cont pentru a accesa toate funcțiile.",
      "Sign In": "Autentificare",
      "Sign Up": "Înregistrare",
      "Don’t have an account?": "Nu ai un cont?",
      "Already have an account?": "Ai deja un cont?",
      "Join Us Today!": "Alătură-te astăzi!",
      "Create your account and start exploring the platform.":
        "Creează-ți contul și începe să explorezi platforma.",
      "Create Account": "Creează cont",
      "Email or Username": "Email sau utilizator",
      "Password": "Parolă",
      "Signing in...": "Se autentifică...",
      "Creating account...": "Se creează contul...",
      "Continue with Google": "Continuă cu Google",
      "Continue with Facebook": "Continuă cu Facebook",
      "Authentication failed.": "Autentificarea a eșuat.",
      "Authentication failed. Please try again.":
        "Autentificarea a eșuat. Te rugăm să încerci din nou.",

      // ================= CART DRAWER =================
      "Go to cart": "Mergi la coș",
      "Checkout": "Finalizare comandă",

      // ================= ACCOUNT MENU =================
      "Profile": "Profil",
      "My Orders": "Comenzile mele",
      "Logout": "Deconectare",

      // ================= PROFILE PAGE =================
      "My Profile": "Profilul meu",
      "Username": "Nume utilizator",
      "Account Type": "Tip cont",
      "Individual": "Persoană fizică",
      "Email": "Email",
      "Phone": "Telefon",
      "Edit Profile": "Editează profilul",
      "Change Password": "Schimbă parola",
      "Old Password": "Parola veche",
      "New Password": "Parola nouă",
      "Update Password": "Actualizează parola",

      // ================= MY ORDERS =================
      "You haven’t placed any orders yet.": "Încă nu ai plasat nicio comandă.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage, // ✅ default is RO (unless user chose EN)
  fallbackLng: "ro",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
