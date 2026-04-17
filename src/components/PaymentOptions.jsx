import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PaymentOptions.scss";
import { clearCart } from "../features/productsSlice";
import { initiateUpiPayment } from "./payment";
import { addOrder } from "../features/orderSlice";
const paymentMethods = [
  {
    id: "card",
    title: "Credit / Debit Card",
  },
  {
    id: "upi",
    title: "UPI",
  },
  {
    id: "netbanking",
    title: "Net Banking",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
  },
];

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function formatExpiryDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    year: "2-digit",
  }).format(value);
}

export default function PaymentOptions({ onBack, onReturnHome }) {
  const { cart } = useSelector((state) => state.products);
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: null,
    cvv: "",
    upiId: "",
    bankName: "",
    accountHolder: "",
    address: "",
  });
  const cartItems = cart.filter((item) => item.quantity > 0);

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const delivery = subtotal > 0 ? 7.99 : 0;
    const packaging = subtotal > 0 ? 2.49 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + delivery + packaging + tax;

    return {
      subtotal,
      delivery,
      packaging,
      tax,
      total,
      items: cartItems.length,
    };
  }, [cartItems]);

  const selectedPaymentLabel =
    paymentMethods.find((method) => method.id === selectedMethod)?.title ||
    "Select Payment option";

  const handleBillingChange = (event) => {
    const { name, value } = event.target;

    setBillingDetails((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePaymentDetailChange = (event) => {
    const { name, value } = event.target;

    setPaymentDetails((current) => ({
      ...current,
      [name]: value,
    }));

    if (paymentError) {
      setPaymentError("");
    }
  };

  const handleReturnToHome = () => {
    dispatch(clearCart());
    setIsPaymentSuccessOpen(false);
    onReturnHome();
  };

  //   const handleDownloadPdf = () => {
  //     const doc = new jsPDF();
  //     const pageHeight = doc.internal.pageSize.getHeight();
  //     let y = 20;

  //     const addLine = (text, x = 16, gap = 8) => {
  //       const lines = doc.splitTextToSize(text, 178);

  //       if (y + lines.length * gap > pageHeight - 20) {
  //         doc.addPage();
  //         y = 20;
  //       }

  //       doc.text(lines, x, y);
  //       y += lines.length * gap;
  //     };

  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(20);
  //     addLine("Order Invoice", 16, 10);

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(11);
  //     addLine(`Payment Method: ${selectedPaymentLabel}`);
  //     if (selectedMethod === "card") {
  //       addLine(`Name on the card: ${paymentDetails.cardName || "Not provided"}`);
  //     }
  //     // addLine(`Name on Card: ${paymentDetails.cardName || "Not Provided"}`);
  //     y += 4;
  //     doc.setFont("helvetica", "bold");
  //     addLine("Billing Details", 16, 10);
  //     // y += 2;
  //     doc.setFont("helvetica", "normal");
  //     addLine(`Full Name: ${billingDetails.fullName || "Not provided"}`);
  //     addLine(`Email: ${billingDetails.email || "Not provided"}`);
  //     addLine(`Phone: ${billingDetails.phone || "Not provided"}`);
  //     addLine(`Address: ${billingDetails.address || "Not provided"}`);

  //     y += 4;
  //     doc.setFont("helvetica", "bold");
  //     addLine("Items", 16, 8);

  //     doc.setFont("helvetica", "normal");
  //     if (cartItems.length === 0) {
  //       addLine("No items in cart.");
  //     } else {
  //       cartItems.forEach((item) => {
  //         addLine(
  //           `${item.title} | Qty ${item.quantity} | ${formatCurrency(item.price * item.quantity)}`,
  //         );
  //       });
  //     }

  //     y += 4;
  //     doc.setFont("helvetica", "bold");
  //     addLine("Bill Summary", 16, 8);

  //     doc.setFont("helvetica", "normal");
  //     addLine(`Subtotal: ${formatCurrency(summary.subtotal)}`);
  //     addLine(`Delivery Charges: ${formatCurrency(summary.delivery)}`);
  //     addLine(`Packaging Fee: ${formatCurrency(summary.packaging)}`);
  //     addLine(`Estimated Tax: ${formatCurrency(summary.tax)}`);

  //     doc.setFont("helvetica", "bold");
  //     addLine(`Total Payable: ${formatCurrency(summary.total)}`);

  //     const fileName = `invoice-${Date.now()}.pdf`;
  //     doc.save(fileName);
  //   };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 20;

    const addLine = (text, x = 16, gap = 8, align = "left") => {
      const lines = doc.splitTextToSize(text, 178);

      if (y + lines.length * gap > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, align === "right" ? pageWidth - 16 : x, y, {
        align,
      });

      y += lines.length * gap;
    };

    const addDivider = () => {
      doc.line(16, y, pageWidth - 16, y);
      y += 6;
    };

    // 🧾 HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    addLine("INVOICE", 16, 10);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    addLine(`Date: ${new Date().toLocaleString()}`);
    addDivider();

    // 💳 PAYMENT INFO
    doc.setFont("helvetica", "bold");
    addLine("Payment Details", 16, 8);

    doc.setFont("helvetica", "normal");
    addLine(`Method: ${selectedPaymentLabel}`);

    if (selectedMethod === "card") {
      addLine(`Card Holder: ${paymentDetails.cardName || "Not provided"}`);
    }

    addDivider();

    // 👤 BILLING DETAILS
    doc.setFont("helvetica", "bold");
    addLine("Billing Details", 16, 8);

    doc.setFont("helvetica", "normal");
    addLine(`Name: ${billingDetails.fullName || "Not provided"}`);
    addLine(`Email: ${billingDetails.email || "Not provided"}`);
    addLine(`Phone: ${billingDetails.phone || "Not provided"}`);
    addLine(`Address: ${billingDetails.address || "Not provided"}`);

    addDivider();

    // 🛒 ITEMS TABLE HEADER
    doc.setFont("helvetica", "bold");
    addLine("Items", 16, 8);

    y += 2;
    doc.setFontSize(11);

    // Table header
    doc.text("Item", 16, y);
    doc.text("Qty", 120, y);
    doc.text("Total", pageWidth - 16, y, { align: "right" });

    y += 4;
    addDivider();

    doc.setFont("helvetica", "normal");

    if (cartItems.length === 0) {
      addLine("No items in cart.");
    } else {
      cartItems.forEach((item) => {
        // wrap item title
        const titleLines = doc.splitTextToSize(item.title, 90);

        const rowHeight = titleLines.length * 6;

        if (y + rowHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        doc.text(titleLines, 16, y);
        doc.text(String(item.quantity), 120, y);
        doc.text(
          formatCurrency(item.price * item.quantity),
          pageWidth - 16,
          y,
          { align: "right" },
        );

        y += rowHeight;
      });
    }

    addDivider();

    // 💰 BILL SUMMARY
    doc.setFont("helvetica", "bold");
    addLine("Bill Summary", 16, 8);

    doc.setFont("helvetica", "normal");

    const addRightLine = (label, value) => {
      doc.text(label, 16, y);
      doc.text(value, pageWidth - 16, y, { align: "right" });
      y += 8;
    };

    addRightLine("Subtotal", formatCurrency(summary.subtotal));
    addRightLine("Delivery", formatCurrency(summary.delivery));
    addRightLine("Packaging", formatCurrency(summary.packaging));
    addRightLine("Tax", formatCurrency(summary.tax));

    addDivider();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    addRightLine("TOTAL", formatCurrency(summary.total));

    // 💾 SAVE
    const fileName = `invoice-${Date.now()}.pdf`;
    doc.save(fileName);
  };
  const handlePayNow = async () => {
    if (cartItems.length === 0) {
      return;
    }

    if (selectedMethod !== "upi") {
      const orderData = {
        id: Date.now(),
        items: cartItems,
        total: summary.total,
        date: new Date().toISOString(),
        user: authUser,
        paymentMethod: selectedPaymentLabel,
      };

      dispatch(addOrder(orderData));

      setIsPaymentSuccessOpen(true);
      return;
    }

    if (!paymentDetails.upiId.trim()) {
      setPaymentError("Enter a UPI ID to continue with the UPI payment.");
      return;
    }

    setPaymentError("");
    setIsSubmittingPayment(true);

    try {
      const redirectUrl = await initiateUpiPayment({
        amount: Number(summary.total.toFixed(2)),
        userId:
          authUser?.phone || billingDetails.phone || `guest-${Date.now()}`,
        phone: billingDetails.phone || "9999999999",
        name: billingDetails.fullName || authUser?.name || "Guest User",
        upiId: paymentDetails.upiId.trim(),
      });

      const orderData = {
        id: Date.now(),
        items: cartItems,
        total: summary.total,
        date: new Date().toISOString(),
        user: authUser,
        paymentMethod: selectedPaymentLabel,
      };

      dispatch(addOrder(orderData));

      window.location.href = redirectUrl;
    } catch (error) {
      setPaymentError(
        error.response?.data?.error ||
          error.message ||
          "Failed to start the UPI payment.",
      );
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <section className="paymentPage">
      <div className="paymentPage__main">
        <div className="paymentPage__intro">
          <button type="button" className="paymentPage__back" onClick={onBack}>
            Back to shopping
          </button>
          {/* <p className="paymentPage__eyebrow">Checkout</p> */}
          <h2>Choose your payment method</h2>
        </div>

        <div className="paymentPage__content">
          <div className="paymentPage__methods">
            <div className="paymentPage__sectionHeader">
              <h3>Payment Options</h3>
            </div>

            <div className="paymentPage__methodList">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`paymentPage__method ${selectedMethod === method.id ? "paymentPage__method--active" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                  />
                  <div>
                    <strong>{method.title}</strong>
                  </div>
                </label>
              ))}
            </div>

            <div className="paymentPage__formCard">
              <div className="paymentPage__sectionHeader">
                <h3>{selectedPaymentLabel} Details</h3>
                {/* <p>Fill in the required information for the selected option.</p> */}
              </div>

              <div className="paymentPage__fields">
                {selectedMethod === "card" && (
                  <>
                    <label className="paymentPage__field paymentPage__field--wide">
                      <span>Card Holder Name</span>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Name on card"
                        value={paymentDetails.cardName}
                        onChange={handlePaymentDetailChange}
                      />
                    </label>
                    <label className="paymentPage__field paymentPage__field--wide">
                      <span>Card Number</span>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentDetailChange}
                      />
                    </label>
                    <label className="paymentPage__field">
                      <span>Expiry Date</span>
                      <DatePicker
                        selected={paymentDetails.expiryDate}
                        onChange={(date) =>
                          setPaymentDetails((current) => ({
                            ...current,
                            expiryDate: date,
                          }))
                        }
                        dateFormat="MM/yy"
                        showMonthYearPicker
                        minDate={new Date()}
                        placeholderText="MM/YY"
                        className="paymentPage__dateInput"
                      />
                    </label>
                    <label className="paymentPage__field">
                      <span>CVV</span>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="CVV"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentDetailChange}
                      />
                    </label>
                  </>
                )}

                {selectedMethod === "upi" && (
                  <>
                    <label className="paymentPage__field paymentPage__field--wide">
                      <span>UPI ID</span>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="name@bank"
                        value={paymentDetails.upiId}
                        onChange={handlePaymentDetailChange}
                      />
                    </label>
                    <p className="paymentPage__helper">
                      You will be redirected to the PhonePe UPI payment page to
                      complete the transaction.
                    </p>
                  </>
                )}

                {selectedMethod === "netbanking" && (
                  <>
                    <label className="paymentPage__field">
                      <span>Bank Name</span>
                      <input
                        type="text"
                        name="bankName"
                        placeholder="Enter bank name"
                        value={paymentDetails.bankName}
                        onChange={handlePaymentDetailChange}
                      />
                    </label>
                    <label className="paymentPage__field">
                      <span>Account Holder Name</span>
                      <input
                        type="text"
                        name="accountHolder"
                        placeholder="Enter account holder name"
                        value={paymentDetails.accountHolder}
                        onChange={handlePaymentDetailChange}
                      />
                    </label>
                  </>
                )}

                {selectedMethod === "cod" && (
                  <label className="paymentPage__field paymentPage__field--wide">
                    <span>Delivery Address</span>
                    <textarea
                      name="codNote"
                      placeholder="Put in the deliver address"
                      value={paymentDetails.address}
                      onChange={handlePaymentDetailChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="paymentPage__formCard">
              <div className="paymentPage__sectionHeader">
                <h3>Billing Details</h3>
                <p>Enter the details for a faster and smoother delivery.</p>
              </div>

              <div className="paymentPage__fields">
                <label className="paymentPage__field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={billingDetails.fullName}
                    onChange={handleBillingChange}
                  />
                </label>
                <label className="paymentPage__field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={billingDetails.email}
                    onChange={handleBillingChange}
                  />
                </label>
                <label className="paymentPage__field">
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={billingDetails.phone}
                    onChange={handleBillingChange}
                  />
                </label>
                <label className="paymentPage__field paymentPage__field--wide">
                  <span>Delivery Address</span>
                  <textarea
                    name="address"
                    placeholder="Flat, street, city, postal code"
                    value={billingDetails.address}
                    onChange={handleBillingChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <aside className="paymentPage__summary">
            <div className="paymentPage__summaryCard">
              <div className="paymentPage__sectionHeader">
                <h3>Bill Summary</h3>
              </div>

              <div className="paymentPage__summaryItems">
                {cartItems.length === 0 ? (
                  <p className="paymentPage__empty">
                    Your cart is empty. Add some products to continue.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div className="paymentPage__summaryItem" key={item.id}>
                      <div>
                        <strong>{item.title}</strong>
                        <span>Qty {item.quantity}</span>
                      </div>
                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))
                )}
              </div>

              <div className="paymentPage__totals">
                <div>
                  <span>Subtotal</span>
                  <strong>${summary.subtotal.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Delivery Charges</span>
                  <strong>${summary.delivery.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Packaging Fee</span>
                  <strong>${summary.packaging.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Estimated Tax</span>
                  <strong>${summary.tax.toFixed(2)}</strong>
                </div>
                <div className="paymentPage__grandTotal">
                  <span>Total Payable</span>
                  <strong>${summary.total.toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="paymentPage__placeOrder"
                onClick={handlePayNow}
                disabled={cartItems.length === 0 || isSubmittingPayment}
              >
                {/* {isSubmittingPayment ? "Starting UPI Payment..." : "Pay Now"}
                 */}
                PAY Now
              </button>
              {paymentError && (
                <p className="paymentPage__paymentError">{paymentError}</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {isPaymentSuccessOpen && (
        <div
          className="paymentPage__modalOverlay"
          onClick={() => setIsPaymentSuccessOpen(false)}
        >
          <div
            className="paymentPage__modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="paymentPage__modalClose"
              onClick={() => setIsPaymentSuccessOpen(false)}
              aria-label="Close popup"
            >
              ×
            </button>

            <div className="paymentPage__modalContent">
              <h3>Payment Successful</h3>
              {/* <p>Your payment has been completed successfully.</p> */}
            </div>

            <div className="paymentPage__modalActions">
              <button
                type="button"
                className="paymentPage__modalButton paymentPage__modalButton--ghost"
                onClick={handleReturnToHome}
              >
                Return to Home
              </button>
              <button
                type="button"
                className="paymentPage__modalButton"
                onClick={handleDownloadPdf}
              >
                Download Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
