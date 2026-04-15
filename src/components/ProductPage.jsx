import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  fetchProductById,
  increaseQuantity,
  removeFromCart,
  selectProduct,
} from "../features/productsSlice";
import "./ProductPage.scss";

function formatLabel(label) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function renderValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${formatLabel(key)}: ${item}`)
      .join(" | ");
  }

  return value;
}

export default function ProductPage({ productId, onBack }) {
  const dispatch = useDispatch();
  const {
    cart,
    selectedProduct: product,
    selectedProductLoading: loading,
    selectedProductError: error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (!productId) {
      return;
    }

    dispatch(selectProduct(productId));
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const heroStats = product
    ? [
        { label: "Rating", value: `${product.rating}/5` },
        { label: "Stock", value: product.stock },
        {
          label: "Minimum order",
          value: product.minimumOrderQuantity || "1",
        },
      ]
    : [];

  const cartItem = product ? cart.find((item) => item.id === product.id) : null;
  const quantity = cartItem?.quantity ?? 0;

  const handleDecrease = () => {
    if (!product) {
      return;
    }

    if (quantity <= 1) {
      dispatch(removeFromCart(product.id));
      return;
    }

    dispatch(decreaseQuantity(product.id));
  };

  if (loading) {
    return (
      <aside className="productPage productPage--placeholder">
        <h2>Product details</h2>
        <p>Loading product information...</p>
      </aside>
    );
  }

  if (error || !product) {
    return (
      <aside className="productPage productPage--placeholder">
        <h2>Product details</h2>
        <p>{error || "Unable to show this product right now."}</p>
      </aside>
    );
  }

  const detailFields = [
    ["Price", `$${product.price}`],
    ["Discount", `${product.discountPercentage}%`],
    ["Rating", product.rating],
    ["Stock", product.stock],
    ["Availability", product.availabilityStatus],
    ["Weight", product.weight ? `${product.weight} g` : null],
    ["Minimum order", product.minimumOrderQuantity],
    ["Dimensions", product.dimensions],
    ["Tags", product.tags],
    ["Warranty", product.warrantyInformation],
    ["Shipping", product.shippingInformation],
    ["Return policy", product.returnPolicy],
  ].filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  return (
    <aside className="productPage">
      <button type="button" className="productPage__back" onClick={onBack}>
        ← Back to products
      </button>

      <div className="productPage__heroShell">
        <div className="productPage__mediaPanel">
          <img
            className="productPage__mainImage"
            src={product.thumbnail}
            alt={product.title}
          />

          {product.images?.length > 0 && (
            <div className="productPage__gallery">
              {product.images.map((image, index) => (
                <img
                  key={`${product.id}-${index}`}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="productPage__hero">
          <div className="productPage__heroTop">
            <span className="productPage__badge">{product.category}</span>
            {product.brand && (
              <span className="productPage__brand">{product.brand}</span>
            )}
          </div>

          <div className="productPage__titleBlock">
            <h2>{product.title}</h2>
            <p className="productPage__description">{product.description}</p>
          </div>

          <div className="productPage__pricing">
            <strong>${product.price}</strong>
            <span>{product.discountPercentage}% off</span>
          </div>

          <div className="productPage__stats">
            {heroStats.map((item) => (
              <div className="productPage__stat" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          {quantity > 0 ? (
            <div className="productPage__quantityControl">
              <button
                type="button"
                className="productPage__quantityButton"
                onClick={handleDecrease}
              >
                -
              </button>
              <div className="productPage__quantityValue">
                <strong>{quantity}</strong>
              </div>
              <button
                type="button"
                className="productPage__quantityButton"
                onClick={() => dispatch(increaseQuantity(product.id))}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="productPage__button"
              onClick={() => dispatch(addToCart(product))}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <div className="productPage__details">
        <div className="productPage__sectionHeading">
          <h3>Product details</h3>
        </div>

        {detailFields.map(([label, value]) => (
          <div className="productPage__detail" key={label}>
            <span>{label}</span>
            <strong>{renderValue(value)}</strong>
          </div>
        ))}
      </div>

      {product.reviews?.length > 0 && (
        <div className="productPage__reviews">
          <div className="productPage__sectionHeading">
            <h3>Reviews</h3>
            <p>Feedback shared by customers for this product.</p>
          </div>

          {product.reviews.map((review, index) => (
            <article
              className="productPage__review"
              key={`${review.reviewerEmail}-${index}`}
            >
              <div className="productPage__reviewHeader">
                <strong>{review.reviewerName}</strong>
                <span className="productPage__reviewRating">
                  {review.rating}/5
                </span>
              </div>
              <p>{review.comment}</p>
              <small>{new Date(review.date).toLocaleDateString()}</small>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
