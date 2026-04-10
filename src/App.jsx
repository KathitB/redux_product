import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/authSlice";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import CartItems from "./components/CartItems";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <main className="appShell">
      <div className="appShell__header">
        <div>
          <p className="appShell__eyebrow">Redux Toolkit Demo</p>
          <h1>Redux Store</h1>
          <p className="appShell__subtitle">
            Browse products, add them to the cart, and watch the store update
            in real time.
          </p>
        </div>

        <div className="appShell__actions">
          <span className="appShell__user">Signed in as {user?.name}</span>
          <button
            className="appShell__logout"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="appShell__content">
        <ProductList />
        <CartItems />
      </div>
    </main>
  );
}

export default App;
