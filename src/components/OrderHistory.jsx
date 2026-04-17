import { useSelector } from "react-redux";
import "./OrderHistory.scss";

export default function OrderHistory() {
  const orders = useSelector((state) => state.orders.orders);

  return (
    <div className="order-history">
      <div className="order-history__header">
        <p className="order-history__eyebrow">Orders</p>
        <h2>Order History</h2>
        <p className="order-history__subtitle">
          Review your previous purchases, totals, and product details in one
          organized view.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="order-history__empty">
          <h3>No orders yet</h3>
          <p>
            Your placed orders will appear here once a purchase is completed.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card__top">
              <div>
                <p className="order-card__label">Order</p>
                <h4>#{order.id}</h4>
              </div>

              <div className="order-card__meta">
                <span className="order-card__amount">
                  Total price: Rs. {order.total.toFixed(2)}
                </span>
                {/* <span className="order-card__date">
                  Order placed date: {new Date(order.date).toLocaleString()}
                </span> */}
              </div>
            </div>

            <div className="order-card__tableWrap">
              <table className="order-card__table">
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Order ID</th>
                    <th>Name</th>
                    <th>Ordered On</th>
                    <th>Discount</th>
                    <th>Warranty</th>
                    <th>Payment Mode</th>
                    <th>Item Price</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Product Image">
                        <img
                          className="order-card__image"
                          src={item.thumbnail || item.images?.[0]}
                          alt={item.title}
                        />
                      </td>
                      <td data-label="Order ID">#{order.id}</td>
                      <td data-label="Name">
                        <div className="order-card__productCell">
                          <strong>{item.title}</strong>
                          <span>Qty {item.quantity}</span>
                        </div>
                      </td>
                      <td data-label="Ordered On">
                        {new Date(order.date).toLocaleString()}
                      </td>
                      <td data-label="Discount">{item.discountPercentage}%</td>
                      <td data-label="Warranty">
                        {item.warrantyInformation || "Not available"}
                      </td>
                      <td data-label="Payment Mode">
                        {order.paymentMethod || "Not recorded"}
                      </td>
                      <td data-label="Item Price">
                        Rs. {item.price.toFixed(2)}
                      </td>
                      <td data-label="Total Price">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
