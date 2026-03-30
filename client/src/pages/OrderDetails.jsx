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

  const normalizeNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const getItemBoxes = (item) => normalizeNumber(item.boxes ?? item.quantity, 0);

  const getItemPieces = (item) => normalizeNumber(item.pieces, 0);

  const getUnitsPerBox = (item) => normalizeNumber(item.unitsPerBox, 0);

  const getPricePerPiece = (item) => {
    if (item.pricePerPiece !== undefined && item.pricePerPiece !== null) {
      return normalizeNumber(item.pricePerPiece, 0);
    }

    if (item.price !== undefined && item.price !== null) {
      return normalizeNumber(item.price, 0);
    }

    const lineTotal = normalizeNumber(item.lineTotal, 0);
    const boxes = getItemBoxes(item);
    const pieces = getItemPieces(item);
    const unitsPerBox = getUnitsPerBox(item);

    const totalUnits = pieces + boxes * unitsPerBox;

    if (totalUnits > 0) {
      return lineTotal / totalUnits;
    }

    return 0;
  };

  const getItemTotal = (item) => {
    if (item.lineTotal !== undefined && item.lineTotal !== null) {
      return normalizeNumber(item.lineTotal, 0);
    }

    const boxes = getItemBoxes(item);
    const pieces = getItemPieces(item);
    const unitsPerBox = getUnitsPerBox(item);
    const pricePerPiece = getPricePerPiece(item);

    return (pieces + boxes * unitsPerBox) * pricePerPiece;
  };

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-details-container">
      <h2>Order {order.orderNumber}</h2>

      <div className="section">
        <p>
          <b>Status:</b> {order.status?.replace("_", " ")}
        </p>
        <p>
          <b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <b>Payment:</b> {order.paymentMethod}
        </p>
        <p>
          <b>Payment Status:</b> {order.paymentStatus}
        </p>
      </div>

      <div className="section">
        <h4>Shipping Address</h4>
        <p>{order.shippingAddress?.addressLine}</p>
        <p>
          {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
        </p>
        <p>{order.shippingAddress?.country}</p>
      </div>

      <div className="section">
        <h4>Products</h4>

        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Bucăți</th>
              <th>Boxes</th>
              <th>Units / Box</th>
              <th>Price / bucată</th>
              <th>Total produs</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => {
              const pieces = getItemPieces(item);
              const boxes = getItemBoxes(item);
              const unitsPerBox = getUnitsPerBox(item);
              const pricePerPiece = getPricePerPiece(item);
              const itemTotal = getItemTotal(item);

              return (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{pieces > 0 ? pieces : "-"}</td>
                  <td>{boxes > 0 ? boxes : "-"}</td>
                  <td>{boxes > 0 ? unitsPerBox : "-"}</td>
                  <td>
                    {pricePerPiece.toFixed(2)} {order.currency}
                  </td>
                  <td>
                    {itemTotal.toFixed(2)} {order.currency}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="section totals">
        <p>
          <b>Subtotal:</b> {Number(order.subtotal || 0).toFixed(2)}{" "}
          {order.currency}
        </p>
        <p>
          <b>Shipping:</b> {Number(order.shipping || 0).toFixed(2)}{" "}
          {order.currency}
        </p>
        <p className="grand-total">
          <b>Total:</b> {Number(order.total || 0).toFixed(2)} {order.currency}
        </p>
      </div>
    </div>
  );
}