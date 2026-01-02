import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/pro-regular-svg-icons";

const ProductActions = ({
  product,
  variations,
  selectedAttributes,
  attributeArray,
  count,
  setCount,
  totalQuantity,
  textArea,
  addToCart,
  pushEventAddToCart,
  checkSelectedVariantInCart,
  calculateInventory,
  userCurrency,
  productAsDisabled
}) => {
  const increment = () => {
    if (count < totalQuantity) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleAddToCart = () => {
    if (product?.productType === "Standard") {
      addToCart(
        product?._id,
        count,
        product?.quantity ? product?.quantity : "",
        product?.finalPrice,
        product,
        textArea ? textArea : "",
        [],
        "",
        0
      );
      pushEventAddToCart("add_to_cart", count);
    } else if (product?.productType === "Customizable") {
      const productId = attributeArray && Array.isArray(attributeArray) && attributeArray.length
        ? `${product._id}_${attributeArray.map((variation) => variation.attributeValue.replace(/\s+/g, "")).join("_")}`
        : product?._id;

      addToCart(
        productId,
        count,
        totalQuantity ? totalQuantity : "",
        variations?.[0]?.finalPrice || variations?.[0]?.price,
        product,
        textArea ? textArea : "",
        [],
        "",
        0,
        attributeArray
      );
      pushEventAddToCart("add_to_cart", count);
    } else if (product?.productType === "Downloadable") {
      addToCart(
        product?._id,
        1,
        product?.quantity ? product?.quantity : "",
        product?.finalPrice,
        product,
        textArea ? textArea : "",
        [],
        "",
        0
      );
      pushEventAddToCart("add_to_cart", 1);
    }
  };

  const isOutOfStock = () => {
    if (product?.productType === "Customizable") {
      return calculateInventory() === "Out of Stock";
    }
    return product?.inventory === "OutOffStock";
  };

  const isInCart = () => {
    if (product?.productType === "Customizable") {
      return checkSelectedVariantInCart();
    }
    return product?._id in (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart") || "{}") : {});
  };

  return (
    <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-8">
      {/* Quantity Selector - Only for Standard and Customizable */}
      {(product?.productType === "Standard" || product?.productType === "Customizable") && (
        <div className="w-24 bg-gray-300 flex items-center justify-between rounded-sm">
          <button
            className={`py-3 px-2.5 ${
              (product?.productType === "Standard" && count <= 1) ||
              (product?.productType === "Customizable" && (isOutOfStock() || count <= 1))
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={decrement}
            disabled={
              (product?.productType === "Standard" && count <= 1) ||
              (product?.productType === "Customizable" && (isOutOfStock() || count <= 1))
            }
          >
            <FontAwesomeIcon icon={faMinus} className="text-gray-950 h-2 w-2" />
          </button>
          <div className="w-10 flex-shrink-0 bg-gray-200 py-3 px-2.5">
            <p className="text-gray-950 text-sm text-center">{count}</p>
          </div>
          <button
            className={`py-3 px-2.5 ${
              (product?.productType === "Standard" && count >= product?.quantity) ||
              (product?.productType === "Customizable" && (isOutOfStock() || count >= totalQuantity))
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={increment}
            disabled={
              (product?.productType === "Standard" && count >= product?.quantity) ||
              (product?.productType === "Customizable" && (isOutOfStock() || count >= totalQuantity))
            }
          >
            <FontAwesomeIcon icon={faPlus} className="text-gray-950 h-2 w-2" />
          </button>
        </div>
      )}

      {/* Add to Cart / View Cart Button */}
      <div className="flex items-center">
        {isInCart() ? (
          <button className="buttonprimarythre relative">
            View cart
            <Link href="/cart">
              <span className="absolute top-0 left-0 h-full w-full"></span>
            </Link>
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`text-primary ease-in transition-colors rounded-sm hover:bg-orange-100 text-sm xl:text-base font-medium py-3 px-8 border border-primary ${
              isOutOfStock() || productAsDisabled ? "disabled:cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isOutOfStock() || productAsDisabled}
            title={productAsDisabled ? "Product is disabled by seller" : ""}
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
