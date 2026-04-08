import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { removeFromCart, clearCart } from "../features/productSlice";
import { removeFromCart, clearCart } from "../features/productsSlice";
import "./CartItems.scss";

export default function CartItems() {
  const { cart } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <aside className="cartPanel">
      <div className="cartPanel__header">
        <h2>Cart</h2>
        <span className="cartPanel__badge">{totalItems} items</span>
      </div>

      {cart.length === 0 ? (
        <p className="cartPanel__empty">No items in cart</p>
      ) : (
        <>
          <div className="cartPanel__items">
            {cart.map((item) => (
              <div className="cartPanel__item" key={item.id}>
                <div>
                  <p className="cartPanel__title">{item.title}</p>
                  <p className="cartPanel__meta">Quantity: {item.quantity}</p>
                </div>
                <button
                  className="cartPanel__remove"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

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
        </>
      )}
    </aside>
  );
}
