import "./App.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/authSlice";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import CartItems from "./components/CartItems";
import ProductPage from "./components/ProductPage";
import cartIcon from "./assets/cart-shopping-svgrepo-com.svg";

function getProductIdFromPath(pathname) {
  const match = pathname.match(/^\/products\/(\d+)$/);
  return match ? Number(match[1]) : null;
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
  const totalItemsinCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="appShell">
      <div className="appShell__header">
        <div>
          <p className="appShell__eyebrow">Redux Toolkit Demo</p>
          <h1>Redux Store</h1>
          <p className="appShell__subtitle">
            Browse products, add them to the cart, and watch the store update in
            real time.
          </p>
        </div>

        <div className="appShell__actions">
          <span className="appShell__user">Signed in as {user?.name}</span>
          <div className="appShell__actionButtons">
            <button
              type="button"
              className={`appShell__cartToggle ${isCartOpen ? "appShell__cartToggle--active" : ""}`}
              onClick={() => setIsCartOpen((current) => !current)}
              aria-label="Toggle cart"
              aria-pressed={isCartOpen}
            >
              <img src={cartIcon} alt="" aria-hidden="true" />
              {totalItemsinCart >= 0 && (
                <span className="appShell__cartCount">{totalItemsinCart}</span>
              )}
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
        {isProductRoute ? (
          <ProductPage productId={productId} onBack={() => navigateTo("/")} />
        ) : (
          <ProductList onNavigate={navigateTo} />
        )}
        {isCartOpen && <CartItems />}
      </div>
    </main>
  );
}

export default App;
