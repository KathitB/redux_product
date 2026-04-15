import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { removeFromCart, clearCart } from "../features/productSlice";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/productsSlice";
import "./CartItems.scss";

export default function CartItems() {
  const { cart } = useSelector((state) => state.products);
  console.log(cart, "cartvalue");
  const dispatch = useDispatch();
  const cartItems = cart.filter((item) => item.quantity > 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  console.log(totalItems, "items");

  return (
    <aside className="cartPanel">
      <div className="cartPanel__header">
        <h2>Cart</h2>
        <span className="cartPanel__badge">{totalItems} items</span>
      </div>

      {cartItems.length === 0 ? (
        <p className="cartPanel__empty">No items in cart</p>
      ) : (
        <>
          <div className="cartPanel__items">
            {cartItems.map((item) => (
              <div className="cartPanel__item" key={item.id}>
                <div className="cartPanel__details">
                  <p className="cartPanel__title">{item.title}</p>
                  <p className="cartPanel__meta">${item.price} each</p>
                </div>
                <div className="cartPanel__actions">
                  <div className="cartPanel__quantityControl">
                    <button
                      type="button"
                      className="cartPanel__quantityButton"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      -
                    </button>
                    <span className="cartPanel__quantityValue">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="cartPanel__quantityButton"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cartPanel__remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartPanel__footer">
            <div className="cartPanel__total">
              <span>Total Amount</span>
              <strong>${totalAmount.toFixed(2)}</strong>
            </div>

            <button
              className="cartPanel__clear"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
