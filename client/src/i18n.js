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

      // ================= CATEGORIES =================
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
      "Momentan nu există produse noi.":
        "There are no new products at the moment.",
      "Caută din nou produsul dorit sau revino mai târziu.":
        "Search again for the product you want or come back later.",

      // ================= ABOUT CTA =================
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
      "Product not found in the main list.":
        "Product not found in the main list.",

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
      "Only the freshest, locally sourced produce.":
        "Only the freshest, locally sourced produce.",
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
      "You haven’t placed any orders yet.":
        "You haven’t placed any orders yet.",

      // ================= RECIPES SECTION =================
      "Rețete": "Recipes",
      "Descoperă rețete delicioase preparate cu produsele Zdrava. Le poți actualiza oricând dorești.":
        "Discover delicious recipes prepared with Zdrava products. You can update them anytime you want.",
      "Vezi rețeta": "See recipe",

      // ================= RECIPE PAGE =================
      "Ingrediente": "Ingredients",
      "Mod de preparare": "Preparation method",
      "Rețeta nu a fost găsită.": "Recipe not found.",
      "Această rețetă nu există sau a fost eliminată.":
        "This recipe does not exist or has been removed.",
      "Înapoi la Home": "Back to Home",
      "← Înapoi": "← Back",

      // ================= RECIPE 1 =================
      "Fërgesë Tradițională": "Traditional Fërgesë",
      "Un preparat tradițional balcanic realizat cu ardei, roșii și brânză cremoasă.":
        "A traditional Balkan dish made with peppers, tomatoes, and creamy cheese.",
      "O rețetă tradițională foarte gustoasă cu ardei, roșii și brânză cremoasă.":
        "A very tasty traditional recipe with peppers, tomatoes, and creamy cheese.",
      "2 borcane ardei copți Zdrava": "2 jars of Zdrava roasted peppers",
      "2-3 roșii proaspete sau sos de roșii Zdrava":
        "2-3 fresh tomatoes or Zdrava tomato sauce",
      "200 g brânză albă / urdă": "200 g white cheese / ricotta",
      "100 g cașcaval ras": "100 g grated cheese",
      "2 linguri ulei": "2 tablespoons oil",
      "1 cățel de usturoi": "1 garlic clove",
      "Sare": "Salt",
      "Piper negru": "Black pepper",
      "Tăiați ardeii în bucăți mici.": "Cut the peppers into small pieces.",
      "Într-o tigaie adăugați uleiul și usturoiul tocat, apoi adăugați roșiile sau sosul de roșii.":
        "In a pan add the oil and chopped garlic, then add the tomatoes or tomato sauce.",
      "Lăsați să fiarbă câteva minute și adăugați ardeii.":
        "Let it simmer for a few minutes and add the peppers.",
      "Adăugați brânza albă sau urda și amestecați până devine cremoasă.":
        "Add the white cheese or ricotta and mix until creamy.",
      "Adăugați brânza albă sau urda și amestecați până se topește.":
        "Add the white cheese or ricotta and stir until it melts.",
      "La final adăugați cașcavalul ras deasupra.":
        "At the end add the grated cheese on top.",
      "Introduceți în cuptor pentru 10-15 minute până devine aurie.":
        "Put it in the oven for 10-15 minutes until golden.",
      "Serviți caldă cu pâine.": "Serve warm with bread.",

      // ================= RECIPE 2 =================
      "Salată cu Murături": "Pickled Vegetable Salad",
      "O salată proaspătă și colorată realizată cu murături Zdrava, perfectă ca garnitură.":
        "A fresh and colorful salad made with Zdrava pickles, perfect as a side dish.",
      "O salată proaspătă și colorată cu murături Zdrava, perfectă ca garnitură.":
        "A fresh and colorful salad with Zdrava pickles, perfect as a side dish.",
      "1 borcan murături mix Zdrava": "1 jar of Zdrava mixed pickles",
      "1 castravete proaspăt": "1 fresh cucumber",
      "2 roșii": "2 tomatoes",
      "1 ceapă roșie": "1 red onion",
      "2 linguri ulei de măsline": "2 tablespoons olive oil",
      "1 lingură suc de lămâie": "1 tablespoon lemon juice",
      "Tăiați roșiile, castravetele și ceapa în bucăți.":
        "Cut the tomatoes, cucumber, and onion into pieces.",
      "Adăugați murăturile Zdrava bine scurse.":
        "Add the well-drained Zdrava pickles.",
      "Puneți toate ingredientele într-un bol mare.":
        "Put all the ingredients in a large bowl.",
      "Adăugați uleiul de măsline, sucul de lămâie, sarea și piperul.":
        "Add the olive oil, lemon juice, salt, and pepper.",
      "Amestecați bine și lăsați 5 minute înainte de servire.":
        "Mix well and let it rest for 5 minutes before serving.",

      // ================= RECIPE 3 =================
      "Paste cu Ajvar": "Pasta with Ajvar",
      "O rețetă rapidă și gustoasă cu ajvar, ideală pentru prânz sau cină.":
        "A quick and tasty recipe with ajvar, ideal for lunch or dinner.",
      "300 g paste": "300 g pasta",
      "4 linguri ajvar Zdrava": "4 tablespoons Zdrava ajvar",
      "2 căței de usturoi": "2 garlic cloves",
      "100 ml smântână pentru gătit sau puțină apă de la paste":
        "100 ml cooking cream or a little pasta water",
      "Brânză rasă pentru servire": "Grated cheese for serving",
      "Brânză rasă deasupra": "Grated cheese on top",
      "Fierbeți pastele conform instrucțiunilor de pe ambalaj.":
        "Boil the pasta according to the instructions on the package.",
      "Într-o tigaie adăugați uleiul de măsline și usturoiul tocat.":
        "In a pan add the olive oil and chopped garlic.",
      "Adăugați ajvarul Zdrava și amestecați timp de 1-2 minute.":
        "Add the Zdrava ajvar and stir for 1-2 minutes.",
      "Adăugați ajvarul Zdrava și amestecați 1-2 minute.":
        "Add the Zdrava ajvar and stir for 1-2 minutes.",
      "Adăugați smântâna sau puțină apă de la paste pentru a face sosul mai cremos.":
        "Add the cream or a little pasta water to make the sauce creamier.",
      "Adăugați pastele în tigaie și amestecați bine.":
        "Add the pasta to the pan and mix well.",
      "Condimentați cu sare și piper după gust.":
        "Season with salt and pepper to taste.",
      "Adăugați sare și piper după gust.": "Add salt and pepper to taste.",
      "Serviți cu brânză rasă deasupra.": "Serve with grated cheese on top.",

      // ================= RECIPE 4 =================
      "Plăcintă cu Brânză": "Cheese Pie",
      "O plăcintă simplă de casă cu brânză și ingrediente tradiționale.":
        "A simple homemade cheese pie with traditional ingredients.",
      "O plăcintă simplă de casă cu brânză, foarte bună pentru orice masă.":
        "A simple homemade cheese pie, perfect for any meal.",
      "1 pachet foi de plăcintă": "1 pack pie sheets",
      "300 g brânză albă": "300 g white cheese",
      "200 g urdă": "200 g ricotta",
      "2 ouă": "2 eggs",
      "100 ml iaurt": "100 ml yogurt",
      "50 ml ulei": "50 ml oil",
      "Puțină sare": "A little salt",
      "Într-un bol amestecați brânza, urda, ouăle, iaurtul și puțină sare.":
        "In a bowl mix the cheese, ricotta, eggs, yogurt, and a little salt.",
      "Ungeți tava cu puțin ulei.": "Grease the tray with a little oil.",
      "Așezați foile una câte una adăugând puțin din umplutură între ele.":
        "Place the sheets one by one, adding a little filling between them.",
      "Așezați foile una câte una adăugând umplutura între ele.":
        "Place the sheets one by one, adding the filling between them.",
      "Repetați până terminați umplutura.":
        "Repeat until you finish the filling.",
      "Deasupra ungeți cu puțin ulei sau iaurt.":
        "Brush the top with a little oil or yogurt.",
      "Coaceți la 180°C timp de aproximativ 35-40 minute până devine aurie.":
        "Bake at 180°C for about 35-40 minutes until golden.",
      "Coaceți la 180°C timp de 35-40 minute până devine aurie.":
        "Bake at 180°C for 35-40 minutes until golden.",
      "Lăsați să se răcească puțin și serviți.":
        "Let it cool slightly and serve.",

      // ================= FOOTER =================
      "INFORMAȚII": "INFORMATION",
      "Termeni și condiții": "Terms and Conditions",
      "Politica de confidențialitate": "Privacy Policy",
      "Politica de cookies": "Cookie Policy",
      "Contactează-ne": "Contact Us",
      "Despre noi": "About Us",
      "DATE DE CONTACT": "CONTACT DETAILS",
      "Aleea 1 Constantin Argetoianu, Breasta, Dolj, România":
        "Aleea 1 Constantin Argetoianu, Breasta, Dolj, Romania",
      "© {{year}} Zdrava România. Toate drepturile rezervate.":
        "© {{year}} Zdrava Romania. All rights reserved.",
      "Creat de": "Created by",

      // ================= TERMS AND CONDITIONS =================
      "TERMENI ȘI CONDIȚII": "TERMS AND CONDITIONS",
      "MERITA LOGISTIC S.R.L. – Magazin online Zdrava":
        "MERITA LOGISTIC S.R.L. – Zdrava online store",
      "Ultima actualizare:": "Last updated:",
      "02 martie 2026": "March 2, 2026",
      "Prezentul document stabilește termenii și condițiile de utilizare a site-ului și condițiile generale de vânzare pentru achiziționarea produselor comercializate online de către MERITA LOGISTIC S.R.L. („Vânzătorul”). Prin accesarea site-ului, crearea unui cont și/sau plasarea unei comenzi, Utilizatorul/Clientul confirmă că a citit, a înțeles și acceptă integral acești Termeni și Condiții.":
        "This document sets out the terms and conditions for using the website and the general conditions of sale for purchasing products sold online by MERITA LOGISTIC S.R.L. (the “Seller”). By accessing the website, creating an account and/or placing an order, the User/Customer confirms that they have read, understood, and fully accepted these Terms and Conditions.",
      "1. Identificarea comerciantului": "1. Identification of the trader",
      "Operatorul site-ului și vânzătorul produselor este:":
        "The website operator and seller of the products is:",
      "Sediu: Str. Cerna nr. 3, et. mansardă, ap. 3, Mun. Craiova, Jud. Dolj, România":
        "Registered office: 3 Cerna Street, attic floor, apt. 3, Craiova, Dolj County, Romania",
      "Nr. Reg. Com.: J2023002219162": "Trade Register No.: J2023002219162",
      "CUI/VAT: RO48977906": "VAT / Registration No.: RO48977906",
      "Telefon: 0734844079": "Phone: 0734844079",
      "E-mail: info@info-zdravafood-ro.com": "Email: info@info-zdravafood-ro.com",
      "Merita Logistic S.R.L. este importator oficial în România al produselor alimentare marca Zdrava®, fabricate de Zdrava SHPK, Albania.":
        "Merita Logistic S.R.L. is the official importer in Romania of Zdrava® branded food products manufactured by Zdrava SHPK, Albania.",
      "Marca Zdrava® aparține Zdrava SHPK și este utilizată pe acest site exclusiv pentru comercializarea produselor originale distribuite de Merita Logistic S.R.L.":
        "The Zdrava® trademark belongs to Zdrava SHPK and is used on this website exclusively for the sale of original products distributed by Merita Logistic S.R.L.",
      "2. Definiții": "2. Definitions",
      "„Site” – platforma online disponibilă la [URL-ul site-ului].":
        "“Website” – the online platform available at [website URL].",
      "„Utilizator” – orice persoană care accesează Site-ul.":
        "“User” – any person who accesses the Website.",
      "„Client” – persoană fizică sau juridică ce plasează o comandă.":
        "“Customer” – a natural or legal person who places an order.",
      "„Consumator” – persoană fizică ce acționează în scopuri din afara activității comerciale/profesionale (OUG 34/2014).":
        "“Consumer” – a natural person acting for purposes outside their trade, business, or profession (Government Emergency Ordinance 34/2014).",
      "„Comandă” – solicitarea electronică de achiziție transmisă de Client prin Site.":
        "“Order” – the electronic purchase request submitted by the Customer through the Website.",
      "„Contract la distanță” – contract încheiat fără prezența fizică simultană a părților.":
        "“Distance contract” – a contract concluded without the simultaneous physical presence of the parties.",
      "„Produse” – bunuri comercializate pe Site, preponderent produse alimentare ambalate.":
        "“Products” – goods sold on the Website, predominantly packaged food products.",
      "3. Cadrul legal aplicabil": "3. Applicable legal framework",
      "OUG nr. 34/2014": "Government Emergency Ordinance no. 34/2014",
      "Legea nr. 365/2002 privind comerțul electronic":
        "Law no. 365/2002 on electronic commerce",
      "Codul Civil": "Civil Code",
      "Regulamentul (UE) 2016/679 (GDPR)":
        "Regulation (EU) 2016/679 (GDPR)",
      "Normele UE și naționale aplicabile siguranței alimentelor":
        "EU and national rules applicable to food safety",
      "4. Domeniul de aplicare. Acceptarea termenilor":
        "4. Scope. Acceptance of the terms",
      "4.1. Acești Termeni și Condiții se aplică tuturor Utilizatorilor/Clienților.":
        "4.1. These Terms and Conditions apply to all Users/Customers.",
      "4.2. Vânzătorul își rezervă dreptul de a modifica Termenii și Condițiile.":
        "4.2. The Seller reserves the right to modify the Terms and Conditions.",
      "4.3. Continuarea utilizării Site-ului constituie acceptarea modificărilor.":
        "4.3. Continued use of the Website constitutes acceptance of the changes.",
      "5. Eligibilitate. Cont de utilizator": "5. Eligibility. User account",
      "5.1. Plasarea comenzilor este permisă persoanelor cu capacitate legală deplină.":
        "5.1. Placing orders is allowed only for persons with full legal capacity.",
      "5.2. Clientul este responsabil pentru confidențialitatea datelor de autentificare.":
        "5.2. The Customer is responsible for the confidentiality of login data.",
      "5.3. Vânzătorul poate suspenda conturi în caz de utilizare frauduloasă.":
        "5.3. The Seller may suspend accounts in case of fraudulent use.",
      "6. Reguli de utilizare a site-ului": "6. Rules for website use",
      "6.1. Este interzisă utilizarea Site-ului în scopuri ilegale sau frauduloase.":
        "6.1. It is forbidden to use the Website for illegal or fraudulent purposes.",
      "6.2. Este interzisă transmiterea de conținut malițios.":
        "6.2. The transmission of malicious content is prohibited.",
      "6.3. Vânzătorul poate limita accesul în caz de abuz.":
        "6.3. The Seller may restrict access in case of abuse.",
      "7. Informații despre produse": "7. Product information",
      "7.1. Pot apărea erori materiale (ex.: preț afișat eronat).":
        "7.1. Material errors may occur (e.g. incorrectly displayed price).",
      "7.2. Imaginile au caracter informativ.":
        "7.2. Images are for informational purposes only.",
      "7.3. Disponibilitatea poate varia.": "7.3. Availability may vary.",
      "8. Prețuri. Taxe. Facturare": "8. Prices. Taxes. Invoicing",
      "8.1. Prețurile includ TVA, dacă nu se specifică altfel.":
        "8.1. Prices include VAT, unless otherwise specified.",
      "8.2. Costurile de livrare sunt afișate separat.":
        "8.2. Delivery costs are displayed separately.",
      "8.3. Clientul este responsabil de corectitudinea datelor furnizate.":
        "8.3. The Customer is responsible for the accuracy of the data provided.",
      "9. Comandă. Încheierea contractului":
        "9. Order. Conclusion of the contract",
      "Contractul la distanță se consideră încheiat la confirmarea comenzii.":
        "The distance contract is considered concluded when the order is confirmed.",
      "10. Plată": "10. Payment",
      "Card bancar online": "Online bank card",
      "PayPal": "PayPal",
      "Transfer bancar": "Bank transfer",
      "11. Livrare internațională": "11. International delivery",
      "Livrarea se efectuează prin DHL / servicii poștale internaționale.":
        "Delivery is carried out through DHL / international postal services.",
      "Termen estimat: până la 10 zile lucrătoare.":
        "Estimated term: up to 10 working days.",
      "12. Produse alimentare": "12. Food products",
      "Clientul trebuie să respecte condițiile de păstrare și informațiile despre alergeni.":
        "The Customer must comply with storage conditions and allergen information.",
      "13. Dreptul de retragere": "13. Right of withdrawal",
      "Dreptul de retragere poate avea excepții pentru produse alimentare sigilate.":
        "The right of withdrawal may be subject to exceptions for sealed food products.",
      "14. Politica de retur": "14. Return policy",
      "Reclamațiile trebuie notificate în maximum 48 ore.":
        "Complaints must be reported within a maximum of 48 hours.",
      "15. Garanții": "15. Warranties",
      "Se aplică regimul legal al conformității produselor.":
        "The legal regime regarding product conformity applies.",
      "16. Limitarea răspunderii": "16. Limitation of liability",
      "Răspunderea Vânzătorului este limitată la valoarea produselor achiziționate.":
        "The Seller's liability is limited to the value of the purchased products.",
      "17. Proprietate intelectuală": "17. Intellectual property",
      "Marca Zdrava® aparține Zdrava SHPK.":
        "The Zdrava® trademark belongs to Zdrava SHPK.",
      "18. Protecția datelor": "18. Data protection",
      "Datele personale sunt prelucrate conform GDPR.":
        "Personal data is processed in accordance with GDPR.",
      "19. Comunicări electronice": "19. Electronic communications",
      "Clientul acceptă comunicarea prin e-mail.":
        "The Customer accepts communication by email.",
      "20. Forța majoră": "20. Force majeure",
      "Niciuna dintre părți nu răspunde pentru forță majoră.":
        "Neither party shall be liable for force majeure.",
      "21. Legea aplicabilă": "21. Applicable law",
      "Prezentul document este guvernat de legea română.":
        "This document is governed by Romanian law.",
      "Platforma ODR:": "ODR Platform:",
      "22. Dispoziții finale": "22. Final provisions",
      "Restul clauzelor rămân valabile dacă una este nulă.":
        "The remaining clauses remain valid if one of them is null.",
      "23. Contact": "23. Contact",
      "Adresă: Str. Cerna nr. 3, Craiova, România":
        "Address: 3 Cerna Street, Craiova, Romania",

      // ================= PRIVACY POLICY =================
      "POLITICA DE CONFIDENȚIALITATE": "PRIVACY POLICY",
      "Această Politică de Confidențialitate descrie modul în care MERITA LOGISTIC S.R.L. colectează, utilizează și protejează datele cu caracter personal ale utilizatorilor site-ului.":
        "This Privacy Policy describes how MERITA LOGISTIC S.R.L. collects, uses, and protects the personal data of website users.",
      "1. Operatorul datelor": "1. Data controller",
      "Sediu: Str. Cerna nr. 3, Craiova, România":
        "Registered office: Str. Cerna nr. 3, Craiova, Romania",
      "CUI: RO48977906": "VAT / Registration No.: RO48977906",
      "Email: info@info-zdravafood-ro.com": "Email: info@info-zdravafood-ro.com",
      "2. Ce date colectăm": "2. What data we collect",
      "Nume și prenume": "Full name",
      "Adresă email": "Email address",
      "Număr de telefon": "Phone number",
      "Adresă de livrare": "Delivery address",
      "Informații despre comenzi": "Order information",
      "Adresă IP și date tehnice ale dispozitivului":
        "IP address and device technical data",
      "3. Scopul colectării datelor": "3. Purpose of data collection",
      "Procesarea comenzilor": "Order processing",
      "Livrarea produselor": "Product delivery",
      "Crearea și administrarea contului": "Account creation and management",
      "Comunicarea cu utilizatorii": "Communication with users",
      "Îmbunătățirea serviciilor oferite": "Improving the provided services",
      "Respectarea obligațiilor legale": "Compliance with legal obligations",
      "4. Temeiul legal al prelucrării": "4. Legal basis for processing",
      "Executarea contractului de vânzare": "Performance of the sales contract",
      "Consimțământul utilizatorului": "User consent",
      "Interesul legitim al operatorului":
        "Legitimate interest of the controller",
      "5. Stocarea datelor": "5. Data storage",
      "Datele personale sunt păstrate doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate sau conform obligațiilor legale.":
        "Personal data is stored only for the period necessary to fulfill the purposes for which it was collected or as required by law.",
      "6. Drepturile utilizatorilor": "6. User rights",
      "Dreptul de acces la date": "Right of access to data",
      "Dreptul la rectificarea datelor": "Right to rectification",
      "Dreptul la ștergerea datelor": "Right to erasure",
      "Dreptul la restricționarea prelucrării":
        "Right to restriction of processing",
      "Dreptul la portabilitatea datelor": "Right to data portability",
      "Dreptul de opoziție": "Right to object",
      "7. Securitatea datelor": "7. Data security",
      "MERITA LOGISTIC S.R.L. implementează măsuri tehnice și organizatorice pentru protejarea datelor împotriva accesului neautorizat.":
        "MERITA LOGISTIC S.R.L. implements technical and organizational measures to protect data against unauthorized access.",
      "8. Contact": "8. Contact",
      "Pentru orice întrebări privind protecția datelor personale ne puteți contacta la:":
        "For any questions regarding personal data protection, you can contact us at:",

      // ================= COOKIE POLICY =================
      "POLITICA DE COOKIES": "COOKIE POLICY",
      "Această Politică de Cookies explică ce sunt cookie-urile, cum sunt utilizate pe acest site și ce opțiuni aveți în legătură cu acestea.":
        "This Cookie Policy explains what cookies are, how they are used on this website and what choices you have regarding them.",
      "1. Ce sunt cookie-urile?": "1. What are cookies?",
      "Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută site-ul să funcționeze corect, să rețină preferințele utilizatorului și să ofere informații despre modul de utilizare al site-ului.":
        "Cookies are small text files stored on your device when you visit a website. They help the website function properly, remember user preferences and provide information about how the site is used.",
      "2. Ce tipuri de cookie-uri folosim?": "2. What types of cookies do we use?",
      "Cookie-uri strict necesare": "Strictly necessary cookies",
      "sunt esențiale pentru funcționarea corectă a site-ului și nu necesită consimțământ.":
        "are essential for the proper functioning of the website and do not require consent.",
      "Cookie-uri de preferințe": "Preference cookies",
      "rețin alegerile utilizatorului, cum ar fi limba selectată sau alte preferințe.":
        "store user choices such as selected language or other preferences.",
      "Cookie-uri de analiză": "Analytics cookies",
      "ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți experiența utilizatorilor.":
        "help us understand how the website is used to improve the user experience.",
      "Cookie-uri de marketing": "Marketing cookies",
      "pot fi folosite pentru a afișa conținut relevant sau reclame personalizate, doar dacă utilizatorul și-a dat consimțământul.":
        "may be used to display relevant content or personalized advertisements only if the user has given consent.",
      "3. De ce folosim cookie-uri?": "3. Why do we use cookies?",
      "Pentru funcționarea tehnică a site-ului":
        "For the technical functioning of the website",
      "Pentru memorarea preferințelor utilizatorilor":
        "To remember user preferences",
      "Pentru analizarea traficului și performanței site-ului":
        "To analyze website traffic and performance",
      "Pentru îmbunătățirea serviciilor și conținutului oferit":
        "To improve services and content",
      "4. Cum vă puteți gestiona consimțământul?":
        "4. How can you manage your consent?",
      "La prima vizită pe site, puteți alege ce categorii de cookie-uri acceptați. Puteți modifica ulterior preferințele dumneavoastră din setările browserului sau, dacă este disponibil, din bannerul de cookies al site-ului.":
        "On your first visit to the website you can choose which categories of cookies you accept. You can later change your preferences in your browser settings or in the cookie banner of the website.",
      "5. Cum puteți dezactiva cookie-urile?":
        "5. How can you disable cookies?",
      "Majoritatea browserelor permit controlul cookie-urilor din setări. Puteți bloca sau șterge cookie-urile existente, însă anumite funcționalități ale site-ului pot fi afectate.":
        "Most browsers allow you to control cookies through their settings. You can block or delete existing cookies, but some features of the website may be affected.",
      "6. Durata de stocare a cookie-urilor": "6. Cookie storage duration",
      "Unele cookie-uri sunt șterse automat la închiderea browserului (cookie-uri de sesiune), iar altele rămân stocate pentru o perioadă determinată sau până la ștergerea lor manuală.":
        "Some cookies are deleted automatically when the browser is closed (session cookies), while others remain stored for a certain period or until manually deleted.",
      "7. Cookie-uri terțe": "7. Third-party cookies",
      "În anumite cazuri, site-ul poate utiliza servicii furnizate de terți, cum ar fi instrumente de analiză sau conținut integrat din platforme externe. Aceste servicii pot seta propriile cookie-uri, conform politicilor lor.":
        "In some cases the website may use services provided by third parties such as analytics tools or embedded content from external platforms. These services may set their own cookies according to their policies.",
      "Pentru întrebări legate de utilizarea cookie-urilor pe acest site, ne puteți contacta la:":
        "For questions related to the use of cookies on this website you can contact us at:",

      // ================= COOKIE BANNER =================
      "Cookie-uri și confidențialitate": "Cookies and privacy",
      "Acest site folosește cookies": "This site uses cookies",
      "Folosim cookie-uri strict necesare pentru funcționarea corectă a site-ului și, doar cu acordul dumneavoastră, cookie-uri de analiză și marketing pentru a îmbunătăți experiența de navigare și conținutul afișat.":
        "We use strictly necessary cookies for the proper functioning of the site and, only with your consent, analytics and marketing cookies to improve the browsing experience and displayed content.",
      "și": "and",
      "Necesar": "Necessary",
      "Activ mereu": "Always active",
      "Analiză": "Analytics",
      "Marketing": "Marketing",
      "Activ": "Active",
      "Inactiv": "Inactive",
      "Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot fi dezactivate.":
        "These cookies are necessary for the functioning of the site and cannot be disabled.",
      "Ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți performanța și experiența utilizatorilor.":
        "They help us understand how the site is used in order to improve performance and user experience.",
      "Pot fi utilizate pentru a afișa conținut relevant și comunicări personalizate, doar cu acordul dumneavoastră.":
        "They may be used to display relevant content and personalized communications only with your consent.",
      "Personalizează": "Customize",
      "Refuză toate": "Reject all",
      "Acceptă toate": "Accept all",
      "Înapoi": "Back",
      "Salvează preferințele": "Save preferences",

      // ================= CHECKOUT =================
      "I have read and accept": "I have read and accept",
      "Terms and Conditions": "Terms and Conditions",
      "and": "and",
      "Privacy Policy": "Privacy Policy",
      "I have read": "I have read",
      "Cookie Policy": "Cookie Policy",
      "Please complete all delivery details.":
        "Please complete all delivery details.",
      "Please complete all personal details.":
        "Please complete all personal details.",
      "Please complete all company details.":
        "Please complete all company details.",
      "You must accept the Terms and Conditions, Privacy Policy, and Cookie Policy to continue.":
        "You must accept the Terms and Conditions, Privacy Policy, and Cookie Policy to continue.",
      "Checkout failed. Please try again.":
        "Checkout failed. Please try again.",
      "Order sent successfully": "Order sent successfully",
      "You will be redirected to the homepage.":
        "You will be redirected to the homepage.",
      "Customer details": "Customer details",
      "Physical person": "Physical person",
      "Company": "Company",
      "Full name": "Full name",
      "Company name": "Company name",
      "VAT number (CUI)": "VAT number (CUI)",
      "Contact person": "Contact person",
      "Phone number": "Phone number",
      "Country": "Country",
      "City": "City",
      "Street address": "Street address",
      "Postal code": "Postal code",
      "Processing...": "Processing...",
      "Pay now": "Pay now",
      "Total": "Total",

      // ================= RETURN POLICY =================
"Politica de retur": "Return Policy",
"POLITICA DE RETUR": "RETURN POLICY",
"Această politică de retur stabilește condițiile în care produsele achiziționate de pe site-ul nostru pot fi returnate.":
  "This return policy sets out the conditions under which products purchased from our website may be returned.",

"1. Dreptul de retragere": "1. Right of withdrawal",
"Conform OUG nr. 34/2014, consumatorii au dreptul de a se retrage din contractul la distanță în termen de 14 zile calendaristice fără a invoca un motiv.":
  "According to Government Emergency Ordinance no. 34/2014, consumers have the right to withdraw from a distance contract within 14 calendar days without giving any reason.",
"Totuși, conform legislației aplicabile, dreptul de retragere NU se aplică produselor alimentare care sunt susceptibile de a se deteriora sau expira rapid.":
  "However, according to applicable legislation, the right of withdrawal does NOT apply to food products that are liable to deteriorate or expire rapidly.",

"2. Produse care NU pot fi returnate": "2. Products that CANNOT be returned",
"Produse alimentare desigilate": "Unsealed food products",
"Produse perisabile": "Perishable products",
"Produse care prezintă semne de utilizare": "Products showing signs of use",
"Produse fără ambalajul original": "Products without original packaging",
"Din motive de igienă și siguranță alimentară, produsele alimentare desigilate sau deteriorate nu pot fi returnate.":
  "For hygiene and food safety reasons, unsealed or damaged food products cannot be returned.",

"3. Produse defecte sau livrate greșit": "3. Defective or wrongly delivered products",
"Dacă produsul primit este deteriorat, defect sau diferit de cel comandat, clientul trebuie să ne contacteze în termen de 48 de ore de la primirea comenzii.":
  "If the received product is damaged, defective, or different from the one ordered, the customer must contact us within 48 hours of receiving the order.",
"În acest caz, produsul poate fi înlocuit sau rambursat după verificarea situației.":
  "In this case, the product may be replaced or refunded after the situation has been verified.",

"4. Procedura de retur": "4. Return procedure",
"Pentru solicitări de retur, clientul trebuie să trimită o cerere la adresa de email indicată pe site, incluzând numărul comenzii și fotografii relevante ale produsului.":
  "For return requests, the customer must send a request to the email address indicated on the website, including the order number and relevant photos of the product.",
"Costurile de transport pentru retur pot fi suportate de client, cu excepția cazurilor în care produsul a fost livrat greșit sau defect.":
  "Return shipping costs may be borne by the customer, except in cases where the product was delivered incorrectly or is defective.",

"5. Rambursări": "5. Refunds",
"Rambursările aprobate vor fi efectuate folosind aceeași metodă de plată utilizată pentru tranzacția inițială, în termen de maximum 14 zile.":
  "Approved refunds will be made using the same payment method used for the initial transaction, within a maximum of 14 days.",

"6. Contact": "6. Contact",
"Pentru orice întrebări legate de politica de retur, ne puteți contacta folosind datele de contact disponibile pe site.":
  "For any questions related to the return policy, you can contact us using the contact details available on the website.",

  "Prin plasarea comenzii confirmați că ați citit și acceptat":
  "By placing the order, you confirm that you have read and accepted",
"Prin apăsarea butonului":
  "By pressing the button",
"confirmați că această comandă implică o obligație de plată.":
  "you confirm that this order implies an obligation to pay.",
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

      // ================= CATEGORIES =================
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

      // ================= ABOUT CTA =================
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
      "Product not found in the main list.":
        "Produsul nu a fost găsit în lista principală.",

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
      "Only the freshest, locally sourced produce.":
        "Doar produse proaspete, din surse locale.",
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
      "You haven’t placed any orders yet.":
        "Încă nu ai plasat nicio comandă.",

      // ================= RECIPES SECTION =================
      "Rețete": "Rețete",
      "Descoperă rețete delicioase preparate cu produsele Zdrava. Le poți actualiza oricând dorești.":
        "Descoperă rețete delicioase preparate cu produsele Zdrava. Le poți actualiza oricând dorești.",
      "Vezi rețeta": "Vezi rețeta",

      // ================= RECIPE PAGE =================
      "Ingrediente": "Ingrediente",
      "Mod de preparare": "Mod de preparare",
      "Rețeta nu a fost găsită.": "Rețeta nu a fost găsită.",
      "Această rețetă nu există sau a fost eliminată.":
        "Această rețetă nu există sau a fost eliminată.",
      "Înapoi la Home": "Înapoi la Home",
      "← Înapoi": "← Înapoi",

      // ================= RECIPE 1 =================
      "Fërgesë Tradițională": "Fërgesë Tradițională",
      "Un preparat tradițional balcanic realizat cu ardei, roșii și brânză cremoasă.":
        "Un preparat tradițional balcanic realizat cu ardei, roșii și brânză cremoasă.",
      "O rețetă tradițională foarte gustoasă cu ardei, roșii și brânză cremoasă.":
        "O rețetă tradițională foarte gustoasă cu ardei, roșii și brânză cremoasă.",
      "2 borcane ardei copți Zdrava": "2 borcane ardei copți Zdrava",
      "2-3 roșii proaspete sau sos de roșii Zdrava":
        "2-3 roșii proaspete sau sos de roșii Zdrava",
      "200 g brânză albă / urdă": "200 g brânză albă / urdă",
      "100 g cașcaval ras": "100 g cașcaval ras",
      "2 linguri ulei": "2 linguri ulei",
      "1 cățel de usturoi": "1 cățel de usturoi",
      "Sare": "Sare",
      "Piper negru": "Piper negru",
      "Tăiați ardeii în bucăți mici.": "Tăiați ardeii în bucăți mici.",
      "Într-o tigaie adăugați uleiul și usturoiul tocat, apoi adăugați roșiile sau sosul de roșii.":
        "Într-o tigaie adăugați uleiul și usturoiul tocat, apoi adăugați roșiile sau sosul de roșii.",
      "Lăsați să fiarbă câteva minute și adăugați ardeii.":
        "Lăsați să fiarbă câteva minute și adăugați ardeii.",
      "Adăugați brânza albă sau urda și amestecați până devine cremoasă.":
        "Adăugați brânza albă sau urda și amestecați până devine cremoasă.",
      "Adăugați brânza albă sau urda și amestecați până se topește.":
        "Adăugați brânza albă sau urda și amestecați până se topește.",
      "La final adăugați cașcavalul ras deasupra.":
        "La final adăugați cașcavalul ras deasupra.",
      "Introduceți în cuptor pentru 10-15 minute până devine aurie.":
        "Introduceți în cuptor pentru 10-15 minute până devine aurie.",
      "Serviți caldă cu pâine.": "Serviți caldă cu pâine.",

      // ================= RECIPE 2 =================
      "Salată cu Murături": "Salată cu Murături",
      "O salată proaspătă și colorată realizată cu murături Zdrava, perfectă ca garnitură.":
        "O salată proaspătă și colorată realizată cu murături Zdrava, perfectă ca garnitură.",
      "O salată proaspătă și colorată cu murături Zdrava, perfectă ca garnitură.":
        "O salată proaspătă și colorată cu murături Zdrava, perfectă ca garnitură.",
      "1 borcan murături mix Zdrava": "1 borcan murături mix Zdrava",
      "1 castravete proaspăt": "1 castravete proaspăt",
      "2 roșii": "2 roșii",
      "1 ceapă roșie": "1 ceapă roșie",
      "2 linguri ulei de măsline": "2 linguri ulei de măsline",
      "1 lingură suc de lămâie": "1 lingură suc de lămâie",
      "Tăiați roșiile, castravetele și ceapa în bucăți.":
        "Tăiați roșiile, castravetele și ceapa în bucăți.",
      "Adăugați murăturile Zdrava bine scurse.":
        "Adăugați murăturile Zdrava bine scurse.",
      "Puneți toate ingredientele într-un bol mare.":
        "Puneți toate ingredientele într-un bol mare.",
      "Adăugați uleiul de măsline, sucul de lămâie, sarea și piperul.":
        "Adăugați uleiul de măsline, sucul de lămâie, sarea și piperul.",
      "Amestecați bine și lăsați 5 minute înainte de servire.":
        "Amestecați bine și lăsați 5 minute înainte de servire.",

      // ================= RECIPE 3 =================
      "Paste cu Ajvar": "Paste cu Ajvar",
      "O rețetă rapidă și gustoasă cu ajvar, ideală pentru prânz sau cină.":
        "O rețetă rapidă și gustoasă cu ajvar, ideală pentru prânz sau cină.",
      "300 g paste": "300 g paste",
      "4 linguri ajvar Zdrava": "4 linguri ajvar Zdrava",
      "2 căței de usturoi": "2 căței de usturoi",
      "100 ml smântână pentru gătit sau puțină apă de la paste":
        "100 ml smântână pentru gătit sau puțină apă de la paste",
      "Brânză rasă pentru servire": "Brânză rasă pentru servire",
      "Brânză rasă deasupra": "Brânză rasă deasupra",
      "Fierbeți pastele conform instrucțiunilor de pe ambalaj.":
        "Fierbeți pastele conform instrucțiunilor de pe ambalaj.",
      "Într-o tigaie adăugați uleiul de măsline și usturoiul tocat.":
        "Într-o tigaie adăugați uleiul de măsline și usturoiul tocat.",
      "Adăugați ajvarul Zdrava și amestecați timp de 1-2 minute.":
        "Adăugați ajvarul Zdrava și amestecați timp de 1-2 minute.",
      "Adăugați ajvarul Zdrava și amestecați 1-2 minute.":
        "Adăugați ajvarul Zdrava și amestecați 1-2 minute.",
      "Adăugați smântâna sau puțină apă de la paste pentru a face sosul mai cremos.":
        "Adăugați smântâna sau puțină apă de la paste pentru a face sosul mai cremos.",
      "Adăugați pastele în tigaie și amestecați bine.":
        "Adăugați pastele în tigaie și amestecați bine.",
      "Condimentați cu sare și piper după gust.":
        "Condimentați cu sare și piper după gust.",
      "Adăugați sare și piper după gust.":
        "Adăugați sare și piper după gust.",
      "Serviți cu brânză rasă deasupra.":
        "Serviți cu brânză rasă deasupra.",

      // ================= RECIPE 4 =================
      "Plăcintă cu Brânză": "Plăcintă cu Brânză",
      "O plăcintă simplă de casă cu brânză și ingrediente tradiționale.":
        "O plăcintă simplă de casă cu brânză și ingrediente tradiționale.",
      "O plăcintă simplă de casă cu brânză, foarte bună pentru orice masă.":
        "O plăcintă simplă de casă cu brânză, foarte bună pentru orice masă.",
      "1 pachet foi de plăcintă": "1 pachet foi de plăcintă",
      "300 g brânză albă": "300 g brânză albă",
      "200 g urdă": "200 g urdă",
      "2 ouă": "2 ouă",
      "100 ml iaurt": "100 ml iaurt",
      "50 ml ulei": "50 ml ulei",
      "Puțină sare": "Puțină sare",
      "Într-un bol amestecați brânza, urda, ouăle, iaurtul și puțină sare.":
        "Într-un bol amestecați brânza, urda, ouăle, iaurtul și puțină sare.",
      "Ungeți tava cu puțin ulei.": "Ungeți tava cu puțin ulei.",
      "Așezați foile una câte una adăugând puțin din umplutură între ele.":
        "Așezați foile una câte una adăugând puțin din umplutură între ele.",
      "Așezați foile una câte una adăugând umplutura între ele.":
        "Așezați foile una câte una adăugând umplutura între ele.",
      "Repetați până terminați umplutura.":
        "Repetați până terminați umplutura.",
      "Deasupra ungeți cu puțin ulei sau iaurt.":
        "Deasupra ungeți cu puțin ulei sau iaurt.",
      "Coaceți la 180°C timp de aproximativ 35-40 minute până devine aurie.":
        "Coaceți la 180°C timp de aproximativ 35-40 minute până devine aurie.",
      "Coaceți la 180°C timp de 35-40 minute până devine aurie.":
        "Coaceți la 180°C timp de 35-40 minute până devine aurie.",
      "Lăsați să se răcească puțin și serviți.":
        "Lăsați să se răcească puțin și serviți.",

      // ================= FOOTER =================
      "INFORMAȚII": "INFORMAȚII",
      "Termeni și condiții": "Termeni și condiții",
      "Politica de confidențialitate": "Politica de confidențialitate",
      "Politica de cookies": "Politica de cookies",
      "Contactează-ne": "Contactează-ne",
      "Despre noi": "Despre noi",
      "DATE DE CONTACT": "DATE DE CONTACT",
      "Aleea 1 Constantin Argetoianu, Breasta, Dolj, România":
        "Aleea 1 Constantin Argetoianu, Breasta, Dolj, România",
      "© {{year}} Zdrava România. Toate drepturile rezervate.":
        "© {{year}} Zdrava România. Toate drepturile rezervate.",
      "Creat de": "Creat de",

      // ================= TERMS AND CONDITIONS =================
      "TERMENI ȘI CONDIȚII": "TERMENI ȘI CONDIȚII",
      "MERITA LOGISTIC S.R.L. – Magazin online Zdrava":
        "MERITA LOGISTIC S.R.L. – Magazin online Zdrava",
      "Ultima actualizare:": "Ultima actualizare:",
      "02 martie 2026": "02 martie 2026",
      "Prezentul document stabilește termenii și condițiile de utilizare a site-ului și condițiile generale de vânzare pentru achiziționarea produselor comercializate online de către MERITA LOGISTIC S.R.L. („Vânzătorul”). Prin accesarea site-ului, crearea unui cont și/sau plasarea unei comenzi, Utilizatorul/Clientul confirmă că a citit, a înțeles și acceptă integral acești Termeni și Condiții.":
        "Prezentul document stabilește termenii și condițiile de utilizare a site-ului și condițiile generale de vânzare pentru achiziționarea produselor comercializate online de către MERITA LOGISTIC S.R.L. („Vânzătorul”). Prin accesarea site-ului, crearea unui cont și/sau plasarea unei comenzi, Utilizatorul/Clientul confirmă că a citit, a înțeles și acceptă integral acești Termeni și Condiții.",
      "1. Identificarea comerciantului": "1. Identificarea comerciantului",
      "Operatorul site-ului și vânzătorul produselor este:":
        "Operatorul site-ului și vânzătorul produselor este:",
      "Sediu: Str. Cerna nr. 3, et. mansardă, ap. 3, Mun. Craiova, Jud. Dolj, România":
        "Sediu: Str. Cerna nr. 3, et. mansardă, ap. 3, Mun. Craiova, Jud. Dolj, România",
      "Nr. Reg. Com.: J2023002219162": "Nr. Reg. Com.: J2023002219162",
      "CUI/VAT: RO48977906": "CUI/VAT: RO48977906",
      "Telefon: 0734844079": "Telefon: 0734844079",
      "E-mail: info@info-zdravafood-ro.com": "E-mail: info@info-zdravafood-ro.com",
      "Merita Logistic S.R.L. este importator oficial în România al produselor alimentare marca Zdrava®, fabricate de Zdrava SHPK, Albania.":
        "Merita Logistic S.R.L. este importator oficial în România al produselor alimentare marca Zdrava®, fabricate de Zdrava SHPK, Albania.",
      "Marca Zdrava® aparține Zdrava SHPK și este utilizată pe acest site exclusiv pentru comercializarea produselor originale distribuite de Merita Logistic S.R.L.":
        "Marca Zdrava® aparține Zdrava SHPK și este utilizată pe acest site exclusiv pentru comercializarea produselor originale distribuite de Merita Logistic S.R.L.",
      "2. Definiții": "2. Definiții",
      "„Site” – platforma online disponibilă la [URL-ul site-ului].":
        "„Site” – platforma online disponibilă la [URL-ul site-ului].",
      "„Utilizator” – orice persoană care accesează Site-ul.":
        "„Utilizator” – orice persoană care accesează Site-ul.",
      "„Client” – persoană fizică sau juridică ce plasează o comandă.":
        "„Client” – persoană fizică sau juridică ce plasează o comandă.",
      "„Consumator” – persoană fizică ce acționează în scopuri din afara activității comerciale/profesionale (OUG 34/2014).":
        "„Consumator” – persoană fizică ce acționează în scopuri din afara activității comerciale/profesionale (OUG 34/2014).",
      "„Comandă” – solicitarea electronică de achiziție transmisă de Client prin Site.":
        "„Comandă” – solicitarea electronică de achiziție transmisă de Client prin Site.",
      "„Contract la distanță” – contract încheiat fără prezența fizică simultană a părților.":
        "„Contract la distanță” – contract încheiat fără prezența fizică simultană a părților.",
      "„Produse” – bunuri comercializate pe Site, preponderent produse alimentare ambalate.":
        "„Produse” – bunuri comercializate pe Site, preponderent produse alimentare ambalate.",
      "3. Cadrul legal aplicabil": "3. Cadrul legal aplicabil",
      "OUG nr. 34/2014": "OUG nr. 34/2014",
      "Legea nr. 365/2002 privind comerțul electronic":
        "Legea nr. 365/2002 privind comerțul electronic",
      "Codul Civil": "Codul Civil",
      "Regulamentul (UE) 2016/679 (GDPR)":
        "Regulamentul (UE) 2016/679 (GDPR)",
      "Normele UE și naționale aplicabile siguranței alimentelor":
        "Normele UE și naționale aplicabile siguranței alimentelor",
      "4. Domeniul de aplicare. Acceptarea termenilor":
        "4. Domeniul de aplicare. Acceptarea termenilor",
      "4.1. Acești Termeni și Condiții se aplică tuturor Utilizatorilor/Clienților.":
        "4.1. Acești Termeni și Condiții se aplică tuturor Utilizatorilor/Clienților.",
      "4.2. Vânzătorul își rezervă dreptul de a modifica Termenii și Condițiile.":
        "4.2. Vânzătorul își rezervă dreptul de a modifica Termenii și Condițiile.",
      "4.3. Continuarea utilizării Site-ului constituie acceptarea modificărilor.":
        "4.3. Continuarea utilizării Site-ului constituie acceptarea modificărilor.",
      "5. Eligibilitate. Cont de utilizator":
        "5. Eligibilitate. Cont de utilizator",
      "5.1. Plasarea comenzilor este permisă persoanelor cu capacitate legală deplină.":
        "5.1. Plasarea comenzilor este permisă persoanelor cu capacitate legală deplină.",
      "5.2. Clientul este responsabil pentru confidențialitatea datelor de autentificare.":
        "5.2. Clientul este responsabil pentru confidențialitatea datelor de autentificare.",
      "5.3. Vânzătorul poate suspenda conturi în caz de utilizare frauduloasă.":
        "5.3. Vânzătorul poate suspenda conturi în caz de utilizare frauduloasă.",
      "6. Reguli de utilizare a site-ului": "6. Reguli de utilizare a site-ului",
      "6.1. Este interzisă utilizarea Site-ului în scopuri ilegale sau frauduloase.":
        "6.1. Este interzisă utilizarea Site-ului în scopuri ilegale sau frauduloase.",
      "6.2. Este interzisă transmiterea de conținut malițios.":
        "6.2. Este interzisă transmiterea de conținut malițios.",
      "6.3. Vânzătorul poate limita accesul în caz de abuz.":
        "6.3. Vânzătorul poate limita accesul în caz de abuz.",
      "7. Informații despre produse": "7. Informații despre produse",
      "7.1. Pot apărea erori materiale (ex.: preț afișat eronat).":
        "7.1. Pot apărea erori materiale (ex.: preț afișat eronat).",
      "7.2. Imaginile au caracter informativ.":
        "7.2. Imaginile au caracter informativ.",
      "7.3. Disponibilitatea poate varia.":
        "7.3. Disponibilitatea poate varia.",
      "8. Prețuri. Taxe. Facturare": "8. Prețuri. Taxe. Facturare",
      "8.1. Prețurile includ TVA, dacă nu se specifică altfel.":
        "8.1. Prețurile includ TVA, dacă nu se specifică altfel.",
      "8.2. Costurile de livrare sunt afișate separat.":
        "8.2. Costurile de livrare sunt afișate separat.",
      "8.3. Clientul este responsabil de corectitudinea datelor furnizate.":
        "8.3. Clientul este responsabil de corectitudinea datelor furnizate.",
      "9. Comandă. Încheierea contractului":
        "9. Comandă. Încheierea contractului",
      "Contractul la distanță se consideră încheiat la confirmarea comenzii.":
        "Contractul la distanță se consideră încheiat la confirmarea comenzii.",
      "10. Plată": "10. Plată",
      "Card bancar online": "Card bancar online",
      "PayPal": "PayPal",
      "Transfer bancar": "Transfer bancar",
      "11. Livrare internațională": "11. Livrare internațională",
      "Livrarea se efectuează prin DHL / servicii poștale internaționale.":
        "Livrarea se efectuează prin DHL / servicii poștale internaționale.",
      "Termen estimat: până la 10 zile lucrătoare.":
        "Termen estimat: până la 10 zile lucrătoare.",
      "12. Produse alimentare": "12. Produse alimentare",
      "Clientul trebuie să respecte condițiile de păstrare și informațiile despre alergeni.":
        "Clientul trebuie să respecte condițiile de păstrare și informațiile despre alergeni.",
      "13. Dreptul de retragere": "13. Dreptul de retragere",
      "Dreptul de retragere poate avea excepții pentru produse alimentare sigilate.":
        "Dreptul de retragere poate avea excepții pentru produse alimentare sigilate.",
      "14. Politica de retur": "14. Politica de retur",
      "Reclamațiile trebuie notificate în maximum 48 ore.":
        "Reclamațiile trebuie notificate în maximum 48 ore.",
      "15. Garanții": "15. Garanții",
      "Se aplică regimul legal al conformității produselor.":
        "Se aplică regimul legal al conformității produselor.",
      "16. Limitarea răspunderii": "16. Limitarea răspunderii",
      "Răspunderea Vânzătorului este limitată la valoarea produselor achiziționate.":
        "Răspunderea Vânzătorului este limitată la valoarea produselor achiziționate.",
      "17. Proprietate intelectuală": "17. Proprietate intelectuală",
      "Marca Zdrava® aparține Zdrava SHPK.":
        "Marca Zdrava® aparține Zdrava SHPK.",
      "18. Protecția datelor": "18. Protecția datelor",
      "Datele personale sunt prelucrate conform GDPR.":
        "Datele personale sunt prelucrate conform GDPR.",
      "19. Comunicări electronice": "19. Comunicări electronice",
      "Clientul acceptă comunicarea prin e-mail.":
        "Clientul acceptă comunicarea prin e-mail.",
      "20. Forța majoră": "20. Forța majoră",
      "Niciuna dintre părți nu răspunde pentru forță majoră.":
        "Niciuna dintre părți nu răspunde pentru forță majoră.",
      "21. Legea aplicabilă": "21. Legea aplicabilă",
      "Prezentul document este guvernat de legea română.":
        "Prezentul document este guvernat de legea română.",
      "Platforma ODR:": "Platforma ODR:",
      "22. Dispoziții finale": "22. Dispoziții finale",
      "Restul clauzelor rămân valabile dacă una este nulă.":
        "Restul clauzelor rămân valabile dacă una este nulă.",
      "23. Contact": "23. Contact",
      "Adresă: Str. Cerna nr. 3, Craiova, România":
        "Adresă: Str. Cerna nr. 3, Craiova, România",

      // ================= PRIVACY POLICY =================
      "POLITICA DE CONFIDENȚIALITATE": "POLITICA DE CONFIDENȚIALITATE",
      "Această Politică de Confidențialitate descrie modul în care MERITA LOGISTIC S.R.L. colectează, utilizează și protejează datele cu caracter personal ale utilizatorilor site-ului.":
        "Această Politică de Confidențialitate descrie modul în care MERITA LOGISTIC S.R.L. colectează, utilizează și protejează datele cu caracter personal ale utilizatorilor site-ului.",
      "1. Operatorul datelor": "1. Operatorul datelor",
      "Sediu: Str. Cerna nr. 3, Craiova, România":
        "Sediu: Str. Cerna nr. 3, Craiova, România",
      "CUI: RO48977906": "CUI: RO48977906",
      "Email: info@info-zdravafood-ro.com":
        "Email: info@info-zdravafood-ro.com",
      "2. Ce date colectăm": "2. Ce date colectăm",
      "Nume și prenume": "Nume și prenume",
      "Adresă email": "Adresă email",
      "Număr de telefon": "Număr de telefon",
      "Adresă de livrare": "Adresă de livrare",
      "Informații despre comenzi": "Informații despre comenzi",
      "Adresă IP și date tehnice ale dispozitivului":
        "Adresă IP și date tehnice ale dispozitivului",
      "3. Scopul colectării datelor": "3. Scopul colectării datelor",
      "Procesarea comenzilor": "Procesarea comenzilor",
      "Livrarea produselor": "Livrarea produselor",
      "Crearea și administrarea contului": "Crearea și administrarea contului",
      "Comunicarea cu utilizatorii": "Comunicarea cu utilizatorii",
      "Îmbunătățirea serviciilor oferite":
        "Îmbunătățirea serviciilor oferite",
      "Respectarea obligațiilor legale": "Respectarea obligațiilor legale",
      "4. Temeiul legal al prelucrării":
        "4. Temeiul legal al prelucrării",
      "Executarea contractului de vânzare":
        "Executarea contractului de vânzare",
      "Consimțământul utilizatorului": "Consimțământul utilizatorului",
      "Interesul legitim al operatorului":
        "Interesul legitim al operatorului",
      "5. Stocarea datelor": "5. Stocarea datelor",
      "Datele personale sunt păstrate doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate sau conform obligațiilor legale.":
        "Datele personale sunt păstrate doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate sau conform obligațiilor legale.",
      "6. Drepturile utilizatorilor": "6. Drepturile utilizatorilor",
      "Dreptul de acces la date": "Dreptul de acces la date",
      "Dreptul la rectificarea datelor": "Dreptul la rectificarea datelor",
      "Dreptul la ștergerea datelor": "Dreptul la ștergerea datelor",
      "Dreptul la restricționarea prelucrării":
        "Dreptul la restricționarea prelucrării",
      "Dreptul la portabilitatea datelor": "Dreptul la portabilitatea datelor",
      "Dreptul de opoziție": "Dreptul de opoziție",
      "7. Securitatea datelor": "7. Securitatea datelor",
      "MERITA LOGISTIC S.R.L. implementează măsuri tehnice și organizatorice pentru protejarea datelor împotriva accesului neautorizat.":
        "MERITA LOGISTIC S.R.L. implementează măsuri tehnice și organizatorice pentru protejarea datelor împotriva accesului neautorizat.",
      "8. Contact": "8. Contact",
      "Pentru orice întrebări privind protecția datelor personale ne puteți contacta la:":
        "Pentru orice întrebări privind protecția datelor personale ne puteți contacta la:",

      // ================= COOKIE POLICY =================
      "POLITICA DE COOKIES": "POLITICA DE COOKIES",
      "Această Politică de Cookies explică ce sunt cookie-urile, cum sunt utilizate pe acest site și ce opțiuni aveți în legătură cu acestea.":
        "Această Politică de Cookies explică ce sunt cookie-urile, cum sunt utilizate pe acest site și ce opțiuni aveți în legătură cu acestea.",
      "1. Ce sunt cookie-urile?": "1. Ce sunt cookie-urile?",
      "Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută site-ul să funcționeze corect, să rețină preferințele utilizatorului și să ofere informații despre modul de utilizare al site-ului.":
        "Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută site-ul să funcționeze corect, să rețină preferințele utilizatorului și să ofere informații despre modul de utilizare al site-ului.",
      "2. Ce tipuri de cookie-uri folosim?": "2. Ce tipuri de cookie-uri folosim?",
      "Cookie-uri strict necesare": "Cookie-uri strict necesare",
      "sunt esențiale pentru funcționarea corectă a site-ului și nu necesită consimțământ.":
        "sunt esențiale pentru funcționarea corectă a site-ului și nu necesită consimțământ.",
      "Cookie-uri de preferințe": "Cookie-uri de preferințe",
      "rețin alegerile utilizatorului, cum ar fi limba selectată sau alte preferințe.":
        "rețin alegerile utilizatorului, cum ar fi limba selectată sau alte preferințe.",
      "Cookie-uri de analiză": "Cookie-uri de analiză",
      "ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți experiența utilizatorilor.":
        "ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți experiența utilizatorilor.",
      "Cookie-uri de marketing": "Cookie-uri de marketing",
      "pot fi folosite pentru a afișa conținut relevant sau reclame personalizate, doar dacă utilizatorul și-a dat consimțământul.":
        "pot fi folosite pentru a afișa conținut relevant sau reclame personalizate, doar dacă utilizatorul și-a dat consimțământul.",
      "3. De ce folosim cookie-uri?": "3. De ce folosim cookie-uri?",
      "Pentru funcționarea tehnică a site-ului":
        "Pentru funcționarea tehnică a site-ului",
      "Pentru memorarea preferințelor utilizatorilor":
        "Pentru memorarea preferințelor utilizatorilor",
      "Pentru analizarea traficului și performanței site-ului":
        "Pentru analizarea traficului și performanței site-ului",
      "Pentru îmbunătățirea serviciilor și conținutului oferit":
        "Pentru îmbunătățirea serviciilor și conținutului oferit",
      "4. Cum vă puteți gestiona consimțământul?":
        "4. Cum vă puteți gestiona consimțământul?",
      "La prima vizită pe site, puteți alege ce categorii de cookie-uri acceptați. Puteți modifica ulterior preferințele dumneavoastră din setările browserului sau, dacă este disponibil, din bannerul de cookies al site-ului.":
        "La prima vizită pe site, puteți alege ce categorii de cookie-uri acceptați. Puteți modifica ulterior preferințele dumneavoastră din setările browserului sau, dacă este disponibil, din bannerul de cookies al site-ului.",
      "5. Cum puteți dezactiva cookie-urile?":
        "5. Cum puteți dezactiva cookie-urile?",
      "Majoritatea browserelor permit controlul cookie-urilor din setări. Puteți bloca sau șterge cookie-urile existente, însă anumite funcționalități ale site-ului pot fi afectate.":
        "Majoritatea browserelor permit controlul cookie-urilor din setări. Puteți bloca sau șterge cookie-urile existente, însă anumite funcționalități ale site-ului pot fi afectate.",
      "6. Durata de stocare a cookie-urilor":
        "6. Durata de stocare a cookie-urilor",
      "Unele cookie-uri sunt șterse automat la închiderea browserului (cookie-uri de sesiune), iar altele rămân stocate pentru o perioadă determinată sau până la ștergerea lor manuală.":
        "Unele cookie-uri sunt șterse automat la închiderea browserului (cookie-uri de sesiune), iar altele rămân stocate pentru o perioadă determinată sau până la ștergerea lor manuală.",
      "7. Cookie-uri terțe": "7. Cookie-uri terțe",
      "În anumite cazuri, site-ul poate utiliza servicii furnizate de terți, cum ar fi instrumente de analiză sau conținut integrat din platforme externe. Aceste servicii pot seta propriile cookie-uri, conform politicilor lor.":
        "În anumite cazuri, site-ul poate utiliza servicii furnizate de terți, cum ar fi instrumente de analiză sau conținut integrat din platforme externe. Aceste servicii pot seta propriile cookie-uri, conform politicilor lor.",
      "Pentru întrebări legate de utilizarea cookie-urilor pe acest site, ne puteți contacta la:":
        "Pentru întrebări legate de utilizarea cookie-urilor pe acest site, ne puteți contacta la:",

      // ================= COOKIE BANNER =================
      "Cookie-uri și confidențialitate": "Cookie-uri și confidențialitate",
      "Acest site folosește cookies": "Acest site folosește cookies",
      "Folosim cookie-uri strict necesare pentru funcționarea corectă a site-ului și, doar cu acordul dumneavoastră, cookie-uri de analiză și marketing pentru a îmbunătăți experiența de navigare și conținutul afișat.":
        "Folosim cookie-uri strict necesare pentru funcționarea corectă a site-ului și, doar cu acordul dumneavoastră, cookie-uri de analiză și marketing pentru a îmbunătăți experiența de navigare și conținutul afișat.",
      "și": "și",
      "Necesar": "Necesar",
      "Activ mereu": "Activ mereu",
      "Analiză": "Analiză",
      "Marketing": "Marketing",
      "Activ": "Activ",
      "Inactiv": "Inactiv",
      "Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot fi dezactivate.":
        "Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot fi dezactivate.",
      "Ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți performanța și experiența utilizatorilor.":
        "Ne ajută să înțelegem cum este utilizat site-ul pentru a îmbunătăți performanța și experiența utilizatorilor.",
      "Pot fi utilizate pentru a afișa conținut relevant și comunicări personalizate, doar cu acordul dumneavoastră.":
        "Pot fi utilizate pentru a afișa conținut relevant și comunicări personalizate, doar cu acordul dumneavoastră.",
      "Personalizează": "Personalizează",
      "Refuză toate": "Refuză toate",
      "Acceptă toate": "Acceptă toate",
      "Înapoi": "Înapoi",
      "Salvează preferințele": "Salvează preferințele",

      // ================= CHECKOUT =================
      "I have read and accept": "Am citit și accept",
      "Terms and Conditions": "Termeni și condiții",
      "and": "și",
      "Privacy Policy": "Politica de confidențialitate",
      "I have read": "Am citit",
      "Cookie Policy": "Politica de cookies",
      "Please complete all delivery details.":
        "Vă rugăm să completați toate datele de livrare.",
      "Please complete all personal details.":
        "Vă rugăm să completați toate datele personale.",
      "Please complete all company details.":
        "Vă rugăm să completați toate datele companiei.",
      "You must accept the Terms and Conditions, Privacy Policy, and Cookie Policy to continue.":
        "Trebuie să acceptați Termenii și condițiile, Politica de confidențialitate și Politica de cookies pentru a continua.",
      "Checkout failed. Please try again.":
        "Finalizarea comenzii a eșuat. Vă rugăm să încercați din nou.",
      "Order sent successfully": "Comanda a fost trimisă cu succes",
      "You will be redirected to the homepage.":
        "Veți fi redirecționat către pagina principală.",
      "Customer details": "Detalii client",
      "Physical person": "Persoană fizică",
      "Company": "Companie",
      "Full name": "Nume complet",
      "Company name": "Nume companie",
      "VAT number (CUI)": "Cod fiscal (CUI)",
      "Contact person": "Persoană de contact",
      "Phone number": "Număr de telefon",
      "Country": "Țară",
      "City": "Oraș",
      "Street address": "Adresă",
      "Postal code": "Cod poștal",
      "Processing...": "Se procesează...",
      "Pay now": "Plătește acum",
      "Total": "Total",

      // ================= RETURN POLICY =================
"Politica de retur": "Politica de retur",
"POLITICA DE RETUR": "POLITICA DE RETUR",
"Această politică de retur stabilește condițiile în care produsele achiziționate de pe site-ul nostru pot fi returnate.":
  "Această politică de retur stabilește condițiile în care produsele achiziționate de pe site-ul nostru pot fi returnate.",

"1. Dreptul de retragere": "1. Dreptul de retragere",
"Conform OUG nr. 34/2014, consumatorii au dreptul de a se retrage din contractul la distanță în termen de 14 zile calendaristice fără a invoca un motiv.":
  "Conform OUG nr. 34/2014, consumatorii au dreptul de a se retrage din contractul la distanță în termen de 14 zile calendaristice fără a invoca un motiv.",
"Totuși, conform legislației aplicabile, dreptul de retragere NU se aplică produselor alimentare care sunt susceptibile de a se deteriora sau expira rapid.":
  "Totuși, conform legislației aplicabile, dreptul de retragere NU se aplică produselor alimentare care sunt susceptibile de a se deteriora sau expira rapid.",

"2. Produse care NU pot fi returnate": "2. Produse care NU pot fi returnate",
"Produse alimentare desigilate": "Produse alimentare desigilate",
"Produse perisabile": "Produse perisabile",
"Produse care prezintă semne de utilizare": "Produse care prezintă semne de utilizare",
"Produse fără ambalajul original": "Produse fără ambalajul original",
"Din motive de igienă și siguranță alimentară, produsele alimentare desigilate sau deteriorate nu pot fi returnate.":
  "Din motive de igienă și siguranță alimentară, produsele alimentare desigilate sau deteriorate nu pot fi returnate.",

"3. Produse defecte sau livrate greșit": "3. Produse defecte sau livrate greșit",
"Dacă produsul primit este deteriorat, defect sau diferit de cel comandat, clientul trebuie să ne contacteze în termen de 48 de ore de la primirea comenzii.":
  "Dacă produsul primit este deteriorat, defect sau diferit de cel comandat, clientul trebuie să ne contacteze în termen de 48 de ore de la primirea comenzii.",
"În acest caz, produsul poate fi înlocuit sau rambursat după verificarea situației.":
  "În acest caz, produsul poate fi înlocuit sau rambursat după verificarea situației.",

"4. Procedura de retur": "4. Procedura de retur",
"Pentru solicitări de retur, clientul trebuie să trimită o cerere la adresa de email indicată pe site, incluzând numărul comenzii și fotografii relevante ale produsului.":
  "Pentru solicitări de retur, clientul trebuie să trimită o cerere la adresa de email indicată pe site, incluzând numărul comenzii și fotografii relevante ale produsului.",
"Costurile de transport pentru retur pot fi suportate de client, cu excepția cazurilor în care produsul a fost livrat greșit sau defect.":
  "Costurile de transport pentru retur pot fi suportate de client, cu excepția cazurilor în care produsul a fost livrat greșit sau defect.",

"5. Rambursări": "5. Rambursări",
"Rambursările aprobate vor fi efectuate folosind aceeași metodă de plată utilizată pentru tranzacția inițială, în termen de maximum 14 zile.":
  "Rambursările aprobate vor fi efectuate folosind aceeași metodă de plată utilizată pentru tranzacția inițială, în termen de maximum 14 zile.",

"6. Contact": "6. Contact",
"Pentru orice întrebări legate de politica de retur, ne puteți contacta folosind datele de contact disponibile pe site.":
  "Pentru orice întrebări legate de politica de retur, ne puteți contacta folosind datele de contact disponibile pe site.",

  "Prin plasarea comenzii confirmați că ați citit și acceptat":
  "Prin plasarea comenzii confirmați că ați citit și acceptat",
"Prin apăsarea butonului":
  "Prin apăsarea butonului",
"confirmați că această comandă implică o obligație de plată.":
  "confirmați că această comandă implică o obligație de plată.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "ro",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;