import React, { useState } from "react";
import axios from "axios";

function AdminProductForm({ onProductAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = { name, description, price: Number(price), stock: Number(stock), image };
    try {
      const res = await axios.post("http://localhost:5000/api/products", product);
      onProductAdded(res.data);
      setName(""); setDescription(""); setPrice(""); setStock(""); setImage("");
      alert("Produs adăugat cu succes!");
    } catch (err) {
      console.error(err);
      alert("Eroare la adăugarea produsului");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <input type="text" placeholder="Nume" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Descriere" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="number" placeholder="Preț" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <input type="number" placeholder="Stoc" value={stock} onChange={(e) => setStock(e.target.value)} required />
      <input type="text" placeholder="Calea imaginii (/images/produse/...)" value={image} onChange={(e) => setImage(e.target.value)} required />
      <button type="submit">Adaugă Produs</button>
    </form>
  );
}

export default AdminProductForm;
