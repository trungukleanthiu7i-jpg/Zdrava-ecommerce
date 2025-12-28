// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// 🧩 Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


// 📄 Pages
import HomePage from "./pages/HomePage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewProductsPage from "./pages/NewProductsPage";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile"; // ✅ PROFILE

// 🔍 Other
import SearchResults from "./components/SearchResults";

function AnimatedRoutes() {
  const location = useLocation();

  // 🔝 Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // 🎬 Page animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    out: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const withAnimation = (Component) => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <Component />
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🏠 Home */}
        <Route path="/" element={withAnimation(HomePage)} />

        {/* 🛒 Products */}
        <Route path="/products" element={withAnimation(AllProductsPage)} />

        {/* 📦 Single Product */}
        <Route path="/product/:id" element={withAnimation(ProductPage)} />

        {/* 🧺 Cart */}
        <Route path="/cart" element={withAnimation(CartPage)} />

        {/* 🔐 Checkout (Protected) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              {withAnimation(CheckoutPage)}
            </ProtectedRoute>
          }
        />

        {/* 👤 Profile (Protected) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              {withAnimation(Profile)}
            </ProtectedRoute>
          }
        />

        {/* 📦 My Orders (Protected) */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              {withAnimation(MyOrders)}
            </ProtectedRoute>
          }
        />

        {/* 📄 Order Details (Protected) */}
        <Route
          path="/my-orders/:id"
          element={
            <ProtectedRoute>
              {withAnimation(OrderDetails)}
            </ProtectedRoute>
          }
        />

        {/* 🧑‍💼 Admin */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              {withAnimation(AdminDashboard)}
            </AdminRoute>
          }
        />


        {/* 📞 Contact */}
        <Route path="/contact" element={withAnimation(ContactPage)} />

        {/* ℹ️ About */}
        <Route path="/about" element={withAnimation(AboutPage)} />

        {/* 🧾 Category */}
        <Route
          path="/category/:category"
          element={withAnimation(CategoryPage)}
        />

        {/* 🆕 New Products */}
        <Route path="/new-products" element={withAnimation(NewProductsPage)} />

        {/* 🔐 Auth */}
        <Route path="/auth" element={withAnimation(AuthPage)} />

        {/* 🔍 Search */}
        <Route path="/search" element={withAnimation(SearchResults)} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

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
