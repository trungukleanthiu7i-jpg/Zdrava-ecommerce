import React, { useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminProducts from "../components/AdminProducts";
import "../styles/AdminDashboard.scss";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="admin-dashboard">
      {/* ===== HEADER ===== */}
      <div className="admin-header">
        <h1>Admin Panel</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            📦 Orders
          </button>

          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            🛒 Products & Offers
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="admin-content">
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "products" && <AdminProducts />}
      </div>
    </div>
  );
};

export default AdminDashboard;
