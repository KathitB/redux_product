import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/productsSlice";
import "./CartItemsMobile.scss";

export default function CartItemsMobile({ onBack, onCheckout }) {
  const { cart } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const cartItems = cart.filter((item) => item.quantity > 0);

  const totalItems = cartItems.length;
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="cartMobile">
      <div className="cartMobile__header">
        <button type="button" className="cartMobile__back" onClick={onBack}>
          Back
        </button>
        <div>
          <h2>Cart</h2>
          <p>{totalItems} items</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <p className="cartMobile__empty">No items in cart</p>
      ) : (
        <>
          <div className="cartMobile__items">
            {cartItems.map((item) => (
              <div className="cartMobile__item" key={item.id}>
                <div className="cartMobile__details">
                  <p className="cartMobile__title">{item.title}</p>
                  <p className="cartMobile__meta">${item.price} each</p>
                </div>

                <div className="cartMobile__actions">
                  <div className="cartMobile__quantityControl">
                    <button
                      type="button"
                      className="cartMobile__quantityButton"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      -
                    </button>
                    <span className="cartMobile__quantityValue">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="cartMobile__quantityButton"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cartMobile__remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartMobile__footer">
            <div className="cartMobile__total">
              <span>Total Amount</span>
              <strong>${totalAmount.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              className="cartMobile__clear"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>

            <button
              type="button"
              className="cartMobile__checkout"
              onClick={onCheckout}
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </section>
  );
}
