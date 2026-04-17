import "./App.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/authSlice";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import CartItems from "./components/CartItems";
import CartItemsMobile from "./components/CartItemsMobile";
import PaymentOptions from "./components/PaymentOptions";
import ProductPage from "./components/ProductPage";
import cartIcon from "./assets/cart-shopping-svgrepo-com.svg";
import OrderIcon from "./assets/order-history.svg";
import OrderHistory from "./components/OrderHistory";

function getProductIdFromPath(pathname) {
  const match = pathname.match(/^\/products\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function isMobileWidth() {
  return window.innerWidth <= 640;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.products.cart);
  const [pathname, setPathname] = useState(window.location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (nextPath) => {
    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, "", nextPath);
      setPathname(nextPath);
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const productId = getProductIdFromPath(pathname);
  const isProductRoute = productId !== null;
  const isMobileCartRoute = pathname === "/mobile";
  const isPaymentRoute = pathname === "/payment";
  const isOrderHistoryRoute = pathname === "/orderhistory";
  const totalItemsinCart = cart.filter((item) => item.quantity > 0).length;

  const handleCartClick = () => {
    if (isMobileWidth()) {
      setIsCartOpen(false);
      navigateTo("/mobile");
      return;
    }

    setIsCartOpen((current) => !current);
  };

  const handleOrderClick = () => {
    navigateTo("/orderhistory");
  };

  const handleMobileCartBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    navigateTo("/");
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo("/payment");
  };

  return (
    <main className="appShell">
      <div
        className={`appShell__header ${isMobileCartRoute || isPaymentRoute ? "appShell__header--compact" : ""}`}
      >
        {!isMobileCartRoute && !isPaymentRoute && (
          <div>
            <p className="appShell__eyebrow">Redux Toolkit Demo</p>
            <h1>E-commerce Store</h1>
            <p className="appShell__subtitle">
              Browse products, add them to the cart, and watch the store update
              in real time.
            </p>
          </div>
        )}

        <div className="appShell__actions">
          <span className="appShell__user">Signed in as {user?.name}</span>
          <div className="appShell__actionButtons">
            {!isPaymentRoute && (
              <button
                type="button"
                className={`appShell__cartToggle ${isCartOpen || isMobileCartRoute ? "appShell__cartToggle--active" : ""}`}
                onClick={handleCartClick}
                aria-label="Toggle cart"
                aria-pressed={isCartOpen || isMobileCartRoute}
              >
                <img src={cartIcon} alt="" aria-hidden="true" />
                {totalItemsinCart >= 0 && (
                  <span className="appShell__cartCount">
                    {totalItemsinCart}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              className={`appShell__cartToggle `}
              onClick={handleOrderClick}
              aria-label="Order cart"
              aria-pressed={isCartOpen || isMobileCartRoute}
            >
              <img src={OrderIcon} alt="" aria-hidden="true" />
            </button>
            <button
              className="appShell__logout"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div
        className={`appShell__content ${isProductRoute ? "appShell__content--detail" : ""} ${isCartOpen ? "appShell__content--withCart" : ""}`}
      >
        {isOrderHistoryRoute ? (
          <OrderHistory />
        ) : isPaymentRoute ? (
          <PaymentOptions
            onBack={() => navigateTo("/")}
            onReturnHome={() => navigateTo("/")}
          />
        ) : isMobileCartRoute ? (
          <CartItemsMobile
            onBack={handleMobileCartBack}
            onCheckout={handleCheckout}
          />
        ) : isProductRoute ? (
          <ProductPage productId={productId} onBack={() => navigateTo("/")} />
        ) : (
          <ProductList onNavigate={navigateTo} />
        )}
        {isCartOpen && !isMobileCartRoute && !isPaymentRoute && (
          <CartItems onCheckout={handleCheckout} />
        )}
      </div>
    </main>
  );
}

export default App;
