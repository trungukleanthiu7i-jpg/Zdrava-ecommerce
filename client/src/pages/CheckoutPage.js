import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axiosClient from "../api/axiosClient";
import "../styles/CheckoutPage.scss";
import {
  FaCcPaypal,
  FaUniversity,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import { SiRevolut } from "react-icons/si";
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  /* ===============================
     State
  =============================== */
  const [customerType, setCustomerType] = useState("individual");

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [company, setCompany] = useState({
    companyName: "",
    vatNumber: "",
    contactPerson: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    country: "",
    city: "",
    addressLine: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("REVOLUT");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [instructions, setInstructions] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = useMemo(() => Number(getTotalPrice() || 0), [getTotalPrice]);

  /* ===============================
     Handlers
  =============================== */
  const handleCustomerChange = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleCompanyChange = (e) =>
    setCompany({ ...company, [e.target.name]: e.target.value });

  const handleAddressChange = (e) =>
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  /* ===============================
     Place Order
  =============================== */
  const placeOrder = async () => {
    if (loading) return;

    setError("");
    setInstructions(null);

    // Validation
    if (
      !shippingAddress.country ||
      !shippingAddress.city ||
      !shippingAddress.addressLine ||
      !shippingAddress.postalCode
    ) {
      setError(t("Please complete all delivery details."));
      return;
    }

    if (
      customerType === "individual" &&
      (!customer.fullName || !customer.email || !customer.phone)
    ) {
      setError(t("Please complete all personal details."));
      return;
    }

    if (
      customerType === "company" &&
      (!company.companyName ||
        !company.vatNumber ||
        !company.contactPerson ||
        !customer.email ||
        !customer.phone)
    ) {
      setError(t("Please complete all company details."));
      return;
    }

    if (!acceptTerms || !acceptCookies) {
      setError(
        t(
          "You must accept the Terms and Conditions, Privacy Policy, and Cookie Policy to continue."
        )
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerType,
        customer,
        company: customerType === "company" ? company : null,
        shippingAddress,
        cart: cartItems.map((i) => ({
          productId: i._id,
          quantity: Number(i.quantity || 0),
          pallets: Number(i.pallets || 0),
        })),
        paymentMethod,
        currency: "€",
      };

      const res = await axiosClient.post("/payments/initiate", payload);

      if (res.data.instructions) {
        setInstructions(res.data.instructions);
      }

      /* ===============================
         ✅ SUCCESS FLOW
      =============================== */
      clearCart();
      setShowSuccess(true);

      // Reset form
      setCustomer({ fullName: "", email: "", phone: "" });
      setCompany({ companyName: "", vatNumber: "", contactPerson: "" });
      setShippingAddress({
        country: "",
        city: "",
        addressLine: "",
        postalCode: "",
      });
      setAcceptTerms(false);
      setAcceptCookies(false);

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("Checkout failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon" />
            <h2>{t("Order sent successfully")}</h2>
            <p>{t("You will be redirected to the homepage.")}</p>
          </div>
        </div>
      )}

      <div className="checkout-wrapper">
        <div className="checkout-grid">
          {/* ================= LEFT ================= */}
          <div className="checkout-left">
            <div className="checkout-form">
              <h2>{t("Customer details")}</h2>

              <div className="customer-type-toggle">
                <label>
                  <input
                    type="radio"
                    checked={customerType === "individual"}
                    onChange={() => setCustomerType("individual")}
                  />
                  {t("Physical person")}
                </label>

                <label>
                  <input
                    type="radio"
                    checked={customerType === "company"}
                    onChange={() => setCustomerType("company")}
                  />
                  {t("Company")}
                </label>
              </div>

              {customerType === "individual" && (
                <input
                  name="fullName"
                  placeholder={t("Full name")}
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                />
              )}

              {customerType === "company" && (
                <>
                  <input
                    name="companyName"
                    placeholder={t("Company name")}
                    value={company.companyName}
                    onChange={handleCompanyChange}
                  />
                  <input
                    name="vatNumber"
                    placeholder={t("VAT number (CUI)")}
                    value={company.vatNumber}
                    onChange={handleCompanyChange}
                  />
                  <input
                    name="contactPerson"
                    placeholder={t("Contact person")}
                    value={company.contactPerson}
                    onChange={handleCompanyChange}
                  />
                </>
              )}

              <input
                name="email"
                placeholder={t("Email")}
                value={customer.email}
                onChange={handleCustomerChange}
              />

              <input
                name="phone"
                placeholder={t("Phone number")}
                value={customer.phone}
                onChange={handleCustomerChange}
              />

              <input
                name="country"
                placeholder={t("Country")}
                value={shippingAddress.country}
                onChange={handleAddressChange}
              />

              <input
                name="city"
                placeholder={t("City")}
                value={shippingAddress.city}
                onChange={handleAddressChange}
              />

              <input
                name="addressLine"
                placeholder={t("Street address")}
                value={shippingAddress.addressLine}
                onChange={handleAddressChange}
              />

              <input
                name="postalCode"
                placeholder={t("Postal code")}
                value={shippingAddress.postalCode}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="checkout-right">
            <h2>{t("Checkout")}</h2>

            <div className="payment-methods-icons">
              <button
                type="button"
                className={`payment-card ${
                  paymentMethod === "REVOLUT" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("REVOLUT")}
              >
                <SiRevolut className="payment-icon" /> Revolut
              </button>

              <button
                type="button"
                className={`payment-card ${
                  paymentMethod === "PAYPAL" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("PAYPAL")}
              >
                <FaCcPaypal className="payment-icon" /> PayPal
              </button>

              <button
                type="button"
                className={`payment-card ${
                  paymentMethod === "IBAN_RON" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("IBAN_RON")}
              >
                <FaUniversity className="payment-icon" /> IBAN RON
              </button>

              <button
                type="button"
                className={`payment-card ${
                  paymentMethod === "IBAN_EUR" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("IBAN_EUR")}
              >
                <FaUniversity className="payment-icon" /> IBAN EUR
              </button>

              <button
                type="button"
                className={`payment-card ${
                  paymentMethod === "WU" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("WU")}
              >
                <FaMoneyBillWave className="payment-icon" /> Western Union
              </button>
            </div>

            {/* ================= AGREEMENTS ================= */}
            <div className="checkout-page__agreements">
              <label className="checkout-page__checkboxLabel">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  {t("I have read and accept")}{" "}
                  <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                    {t("Terms and Conditions")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    {t("Privacy Policy")}
                  </Link>
                  .
                </span>
              </label>

              <label className="checkout-page__checkboxLabel">
                <input
                  type="checkbox"
                  checked={acceptCookies}
                  onChange={(e) => setAcceptCookies(e.target.checked)}
                />
                <span>
                  {t("I have read")}{" "}
                  <Link to="/cookie-policy" target="_blank" rel="noopener noreferrer">
                    {t("Cookie Policy")}
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              className={`pay-now-btn ${
                !acceptTerms || !acceptCookies ? "pay-now-btn--disabled" : ""
              }`}
              onClick={placeOrder}
              disabled={loading || !acceptTerms || !acceptCookies}
            >
              {loading ? t("Processing...") : t("Pay now")}
            </button>

            {error && <p className="checkout-message error">{error}</p>}

            {instructions && (
              <div className="payment-instructions">
                <h3>{instructions.title}</h3>
                <ul>
                  {instructions.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="checkout-total">
              <strong>
                {t("Total")}: €{total.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}