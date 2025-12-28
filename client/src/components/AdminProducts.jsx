import React, { useState } from "react";
import axios from "axios";
import "../components/AdminForm.scss";

function AdminProducts() {

  // --------------------- NORMAL PRODUCT FORM ---------------------
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    unitsPerBox: "",
    boxPerPalet: "",
    barcode: "",
    image: null,
  });

  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  // --------------------- OFFER PRODUCT FORM ---------------------
  const [offerData, setOfferData] = useState({
    name: "",
    description: "",
    oldPrice: "",
    newPrice: "",
    offerEndDate: "",
    conditions: "",
    existingImage: "",
  });

  const [offerStatus, setOfferStatus] = useState("");

  // 🟢 Handle form changes (file input safe)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files && files[0] ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");

    try {
      const uploadData = new FormData();

      uploadData.append("name", formData.name);
      uploadData.append("description", formData.description);
      uploadData.append("price", formData.price);
      uploadData.append("stock", formData.stock);
      uploadData.append("category", formData.category);
      uploadData.append("unitsPerBox", String(formData.unitsPerBox));
      uploadData.append("boxPerPalet", String(formData.boxPerPalet));


      if (formData.barcode) uploadData.append("barcode", formData.barcode);
      if (formData.image) uploadData.append("image", formData.image);

      await axios.post("http://localhost:5000/api/products", uploadData);


      setStatus("✅ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        unitsPerBox: "",
        boxPerPalet: "",
        barcode: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      setStatus("❌ Error adding product.");
    }
  };

  // 🟢 Add offer product
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setOfferStatus("Adding offer...");

    try {
      await axios.post("http://localhost:5000/api/offers", offerData, {
        headers: { "Content-Type": "application/json" },
      });

      setOfferStatus("✅ Offer product added successfully!");
      setOfferData({
        name: "",
        description: "",
        oldPrice: "",
        newPrice: "",
        offerEndDate: "",
        conditions: "",
        existingImage: "",
      });
    } catch (error) {
      console.error(error);
      setOfferStatus("❌ Error adding offer product.");
    }
  };

  // 🟢 Fetch messages (toggle)
  const fetchMessages = async () => {
    if (showMessages) {
      setShowMessages(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/messages");
      setMessages(res.data);
      setShowMessages(true);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // 🟢 Delete message
  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="admin-form-container">
      {/* 🧭 Header */}
      <div className="admin-header">
        <div className="admin-header-text">
          <h1>Admin Dashboard</h1>
          <p>Manage your products and view user messages.</p>
        </div>

        <button
          className={`view-messages-btn ${showMessages ? "active" : ""}`}
          onClick={fetchMessages}
        >
          📩 View Messages
        </button>
      </div>

      {/* 📨 Messages Panel — NOW APPEARS IMMEDIATELY */}
      {showMessages && (
        <div className="messages-panel">
          <h2>User Messages</h2>

          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            <ul>
              {messages.map((msg) => (
                <li key={msg._id}>
                  <strong>{msg.name}</strong>
                  <p className="message-email">{msg.email}</p>
                  <p className="message-body">{msg.message}</p>
                  <button
                    className="delete-message-btn"
                    onClick={() => deleteMessage(msg._id)}
                  >
                    🗑️ Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 🧩 Admin content layout */}
      <div className="admin-layout">
        {/* Add Normal Product Form */}
        <div className="admin-form-box">
          <h2>Add New Product</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            {/* REQUIRED */}
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={formData.name}
              onChange={handleChange}
              required
            />


            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            {/* REQUIRED */}
            <input
              type="number"
              name="price"
              placeholder="Price (RON)"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <select
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            >
              <option value="">Select stock status</option>
              <option value="in stock">In stock</option>
              <option value="out of stock">Out of stock</option>
            </select>


            {/* REQUIRED */}
            <input
              type="number"
              name="unitsPerBox"
              placeholder="Units per box"
              value={formData.unitsPerBox}
              onChange={handleChange}
              required
            />

            {/* REQUIRED */}
            <input
              type="number"
              name="boxPerPalet"
              placeholder="Boxes per palet"
              value={formData.boxPerPalet}
              onChange={handleChange}
              required
            />

            {/* REQUIRED */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Drinks">Drinks</option>
              <option value="Jam">Recel (Jam)</option>
              <option value="Pickles">Turshi (Pickles)</option>
              <option value="Stuffed-peppers">Speca me gjize</option>
              <option value="Croissant">Kruasant</option>
              <option value="Sweets">Embelsira</option>
              <option value="Sauce">Salca</option>
              <option value="Others">Te tjera</option>
              <option value="restaurant-products">Products for Restaurants</option>
              <option value="patisserie-products">Products for Patisserie</option>
            </select>


            <input
              type="text"
              name="barcode"
              placeholder="Barcode"
              value={formData.barcode}
              onChange={handleChange}
            />


            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />

            <button type="submit">Add Product</button>

            {status && <p className="status-message">{status}</p>}
          </form>
        </div>
      </div>


      {/* Add Offer Product Form */}
      <div className="admin-form-box">
        <h2>Add Offer Product</h2>
        <form className="admin-form" onSubmit={handleOfferSubmit}>
          <input type="text" name="name" placeholder="Offer product name" value={offerData.name} onChange={handleOfferChange} required />
          <textarea name="description" placeholder="Description" value={offerData.description} onChange={handleOfferChange} />
          <input type="number" name="oldPrice" placeholder="Old price" value={offerData.oldPrice} onChange={handleOfferChange} required />
          <input type="number" name="newPrice" placeholder="New price" value={offerData.newPrice} onChange={handleOfferChange} required />
          <input type="datetime-local" name="offerEndDate" value={offerData.offerEndDate} onChange={handleOfferChange} required />
          <input type="text" name="conditions" placeholder="Conditions" value={offerData.conditions} onChange={handleOfferChange} />
          <input type="text" name="existingImage" placeholder="Existing image filename" value={offerData.existingImage} onChange={handleOfferChange} />

          <button type="submit">Add Offer Product</button>
          {offerStatus && <p className="status-message">{offerStatus}</p>}
        </form>
      </div>
    </div>

  );
}

export default AdminProducts;

