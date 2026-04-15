import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  decreaseQuantity,
  fetchProductById,
  increaseQuantity,
  removeFromCart,
  selectProduct,
} from "../features/productsSlice";
import "./Products.scss";

export default function Products({ product, isSelected, onNavigate }) {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.products);

  const handleSelectProduct = () => {
    dispatch(selectProduct(product.id));
    dispatch(fetchProductById(product.id));
    onNavigate(`/products/${product.id}`);
  };
  const cartItem = product ? cart.find((item) => item.id === product.id) : null;
  const quantity = cartItem?.quantity ?? 0;

  const handleDecrease = (event) => {
    event.stopPropagation();

    if (!product) {
      return;
    }

    if (quantity <= 1) {
      dispatch(removeFromCart(product.id));
      return;
    }

    dispatch(decreaseQuantity(product.id));
  };

  return (
    <article
      className={`productCard ${isSelected ? "productCard--selected" : ""}`}
      onClick={handleSelectProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelectProduct();
        }
      }}
    >
      <div className="productCard__body">
        <span className="productCard__category">{product.category}</span>
        <img
          className="productCard__image"
          src={product.thumbnail}
          alt={product.title}
        />
        <h4>{product.title}</h4>
        <p className="productCard__description">{product.description}</p>
        <p className="productCard__price">${product.price}</p>
      </div>

      {/* <button
        type="button"
        className="productCard__button"
        onClick={(event) => {
          event.stopPropagation();
          dispatch(addToCart(product));
        }}
      >
        Add to Cart
      </button> */}

      {quantity > 0 ? (
        <div
          className="productPage__quantityControl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="productPage__quantityButton"
            onClick={handleDecrease}
          >
            -
          </button>
          <div className="productPage__quantityValue">
            <strong>{quantity}</strong>
          </div>
          <button
            type="button"
            className="productPage__quantityButton"
            onClick={(event) => {
              event.stopPropagation();
              dispatch(increaseQuantity(product.id));
            }}
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="productPage__button"
          onClick={(event) => {
            event.stopPropagation();
            dispatch(addToCart(product));
          }}
        >
          Add to Cart
        </button>
      )}
    </article>
  );
}
