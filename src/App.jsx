import "./App.scss";
import ProductList from "./components/ProductList";
import CartItems from "./components/CartItems";

function App() {
  return (
    <main className="appShell">
      <div className="appShell__header">
        <p className="appShell__eyebrow">Redux Toolkit Demo</p>
        <h1>Redux Store</h1>
        <p className="appShell__subtitle">
          Browse products, add them to the cart, and watch the store update in
          real time.
        </p>
      </div>

      <div className="appShell__content">
        <ProductList />
        <CartItems />
      </div>
    </main>
  );
}

export default App;
