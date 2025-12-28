import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/OrderDetails.scss";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosClient.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(res.data);
      } catch (err) {
        console.error("❌ Failed to load order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-details-container">
      <h2>Order {order.orderNumber}</h2>

      {/* ORDER INFO */}
      <div className="section">
        <p><b>Status:</b> {order.status.replace("_", " ")}</p>
        <p><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><b>Payment:</b> {order.paymentMethod}</p>
        <p><b>Payment Status:</b> {order.paymentStatus}</p>
      </div>

      {/* SHIPPING */}
      <div className="section">
        <h4>Shipping Address</h4>
        <p>{order.shippingAddress.addressLine}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>

      {/* ITEMS */}
      <div className="section">
        <h4>Products</h4>

        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Boxes</th>
              <th>Units / Box</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.boxes}</td>
                <td>{item.unitsPerBox}</td>
                <td>{item.lineTotal} {order.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="section totals">
        <p><b>Subtotal:</b> {order.subtotal} {order.currency}</p>
        <p><b>Shipping:</b> {order.shipping} {order.currency}</p>
        <p className="grand-total">
          <b>Total:</b> {order.total} {order.currency}
        </p>
      </div>
    </div>
  );
}
