import React from "react";
import { useDispatch } from "react-redux";

import { addToCart } from "../features/productsSlice";
import "./Products.scss";

export default function Products({ product }) {
  const dispatch = useDispatch();

  return (
    <article className="productCard">
      <div className="productCard__body">
        <span className="productCard__category">{product.category}</span>
        <h4>{product.title}</h4>
        <p className="productCard__price">${product.price}</p>
      </div>

      <button
        className="productCard__button"
        onClick={() => dispatch(addToCart(product))}
      >
        Add to Cart
      </button>
    </article>
  );
}
