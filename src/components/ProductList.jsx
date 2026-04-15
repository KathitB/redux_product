import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../features/productsSlice";
import Products from "./Products";
import "./ProductList.scss";

export default function ProductList({ onNavigate }) {
  const dispatch = useDispatch();
  const { products, loading, error, selectedProductId } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) return <h2 className="productList__status">Loading...</h2>;
  if (error) return <h2 className="productList__status">{error}</h2>;

  return (
    <section className="productList">
      <div className="productList__header">
        <h2>Products</h2>
        <span className="productList__count">{products.length} items</span>
      </div>

      <div className="productList__grid">
        {products.map((product) => (
          <Products
            key={product.id}
            product={product}
            isSelected={selectedProductId === product.id}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
