import React from "react";
import "../styles/NewProductsPage.scss";

const NewProductsPage = () => {
  return (
    <div className="new-products-wrapper">
      <div className="new-products-page">
        {/* ===== Left Side: Categories ===== */}
        <div className="categories-left">
          <h2>All Categories</h2>
          <div className="categories-columns">
            {/* HORECA column */}
            <div className="category-column">
              <h4>HORECA</h4>
              <ul>
                <li><a href="/category/sauce">Sauces</a></li>
                <li><a href="/category/restaurant-products">Products for Restaurants</a></li>
                <li><a href="/category/patisserie-products">Products for Patisserie</a></li>
              </ul>
            </div>

            {/* SUPERMARKET column */}
            <div className="category-column">
              <h4>SUPERMARKET</h4>
              <ul>
                <li><a href="/category/Pickles">Turshi (Pickles)</a></li>
                <li><a href="/category/Jam">Recel (Jam)</a></li>
                <li><a href="/category/Stuffed-peppers">Speca me gjizë (Stuffed Peppers)</a></li>
                <li><a href="/category/Drinks">Pije (Drinks)</a></li>
                <li><a href="/category/Croissant">Kruasant (Croissant)</a></li>
                <li><a href="/category/Sweets">Embëlsira (Sweets)</a></li>
                <li><a href="/category/Sauce">Salca (Sauce)</a></li>
                <li><a href="/category/Others">Të tjera (Others)</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Right Side: Message ===== */}
        <div className="no-products-right">
          <h2>New Products</h2>
          <h3>Sorry, there are no new products for now.</h3>
          <p>Search again for what you are looking for or check back later.</p>
        </div>
      </div>
    </div>
  );
};

export default NewProductsPage;
