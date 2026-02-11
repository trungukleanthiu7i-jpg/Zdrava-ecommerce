import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../components/ProductsList.scss";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
