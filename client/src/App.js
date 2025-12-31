// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// 🧩 Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

// 📄 Pages
import HomePage from "./pages/HomePage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewProductsPage from "./pages/NewProductsPage";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import OAuthSuccess from "./pages/OAuthSuccess"; // ✅ NEW

// 🔍 Other
import SearchResults from "./components/SearchResults";

// 👤 User context
import { UserContext } from "./context/UserContext";

/* =========================================
   🎬 Animated Routes
========================================= */
function AnimatedRoutes() {
  const location = useLocation();

  // 🔝 Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // 🎥 Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const AnimatedPage = ({ children }) => (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🏠 Client Pages */}
        <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
        <Route path="/products" element={<AnimatedPage><AllProductsPage /></AnimatedPage>} />
        <Route path="/product/:id" element={<AnimatedPage><ProductPage /></AnimatedPage>} />
        <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
        <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
        <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        <Route path="/my-orders" element={<AnimatedPage><MyOrders /></AnimatedPage>} />
        <Route path="/my-orders/:id" element={<AnimatedPage><OrderDetails /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
        <Route path="/category/:category" element={<AnimatedPage><CategoryPage /></AnimatedPage>} />
        <Route path="/new-products" element={<AnimatedPage><NewProductsPage /></AnimatedPage>} />
        <Route path="/search" element={<AnimatedPage><SearchResults /></AnimatedPage>} />
        <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />

        {/* 🔐 OAuth */}
        <Route path="/oauth-success" element={<AnimatedPage><OAuthSuccess /></AnimatedPage>} />

        {/* 🧑‍💼 Admin */}
        <Route path="/admin/*" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

/* =========================================
   🚀 App Root
========================================= */
function App() {
  const { user } = useContext(UserContext);

  // 🪄 Initialize AOS once
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
    });
  }, []);

  // 🛑 Prevent UI flicker while user loads
  if (user === undefined) {
    return null; // or spinner
  }

  return (
    <Router>
      <Header />
      <AnimatedRoutes />
      <CartDrawer />
      <Footer />
    </Router>
  );
}

export default App;
