import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/MyOrders.scss";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get("/orders/my");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="orders-loading">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="orders-empty">
        You haven’t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card clickable"
            onClick={() => navigate(`/my-orders/${order._id}`)}
          >
            {/* HEADER */}
            <div className="order-header">
              <span>
                <b>Order:</b> {order.orderNumber}
              </span>

              <span className={`status ${order.status}`}>
                {order.status?.replace("_", " ")}
              </span>
            </div>

            {/* INFO */}
            <div className="order-info">
              <span>
                <b>Date:</b>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </span>

              <span>
                <b>Total:</b>{" "}
                {order.total?.toFixed(2)} {order.currency}
              </span>
            </div>

            {/* ITEMS PREVIEW */}
            <div className="order-items">
              {order.items?.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span>{item.name}</span>
                  <span>{item.boxes} boxes</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
