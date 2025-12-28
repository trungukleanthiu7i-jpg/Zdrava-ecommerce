import React, { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "react-barcode";
import { FaDownload } from "react-icons/fa";
import "../styles/AdminOrders.scss";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* =========================
     FETCH ORDERS (ADMIN)
  ========================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  /* =========================
     DOWNLOAD ORDER PDF
  ========================= */
  const handleDownloadPDF = async (orderId, orderNumber) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/admin/${orderId}/pdf`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Order_${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Failed to download PDF", err);
      alert("Failed to download order PDF");
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <h1>Orders</h1>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>CUI</th>
            <th>Contact Person</th>
            <th>Country</th>
            <th>City</th>
            <th>Address</th>
            <th>Date</th>
            <th>Total</th>
            <th>Currency</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="14">No orders yet.</td>
            </tr>
          )}

          {orders.map((order) => {
            const isCompany = order.customerType === "company";
            const isExpanded = expandedOrderId === order._id;

            return (
              <React.Fragment key={order._id}>
                <tr>
                  <td>
                    {isCompany
                      ? order.company?.companyName
                      : order.customer?.fullName}
                  </td>
                  <td>{order.customer?.email}</td>
                  <td>{order.customer?.phone}</td>
                  <td>{isCompany ? "Company" : "Individual"}</td>
                  <td>{isCompany ? order.company?.vatNumber : "—"}</td>
                  <td>{isCompany ? order.company?.contactPerson : "—"}</td>
                  <td>{order.shippingAddress?.country}</td>
                  <td>{order.shippingAddress?.city}</td>
                  <td>
                    {order.shippingAddress?.addressLine},{" "}
                    {order.shippingAddress?.postalCode}
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>{order.total?.toFixed(2)}</td>
                  <td>{order.currency}</td>
                  <td>{order.paymentMethod}</td>
                  <td className="actions-cell">
                    <button
                      className="view-btn"
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order._id)
                      }
                    >
                      {isExpanded ? "Hide" : "View"}
                    </button>

                    <button
                      className="download-btn"
                      title="Download PDF"
                      onClick={() =>
                        handleDownloadPDF(order._id, order.orderNumber)
                      }
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>

                {/* ================= ORDER DETAILS ================= */}
                {isExpanded && (
                  <tr className="order-details-row">
                    <td colSpan="14">
                      <table className="order-items-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Barcode</th>
                            <th>Boxes</th>
                            <th>Units / Box</th>
                            <th>Total Units</th>
                            <th>Line Total</th>
                          </tr>
                        </thead>

                        <tbody>
                          {order.items.map((item, i) => {
                            // 🔥 ROBUST BARCODE RESOLUTION
                            const barcodeValue =
                              item.barcode ||
                              item.productId?.barcode ||
                              null;

                            const unitsPerBox =
                              item.unitsPerBox ||
                              item.productId?.unitsPerBox ||
                              1;

                            return (
                              <tr key={i}>
                                <td>{item.name}</td>

                                <td className="barcode-cell">
                                  {barcodeValue ? (
                                    <>
                                      <Barcode
                                        value={String(barcodeValue)}
                                        format="CODE128"
                                        width={1.2}
                                        height={40}
                                        displayValue={false}
                                      />
                                      <div className="barcode-number">
                                        {barcodeValue}
                                      </div>
                                    </>
                                  ) : (
                                    "—"
                                  )}
                                </td>

                                <td>{item.boxes}</td>
                                <td>{unitsPerBox}</td>
                                <td>{item.boxes * unitsPerBox}</td>
                                <td>
                                  {item.lineTotal.toFixed(2)}{" "}
                                  {order.currency}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
