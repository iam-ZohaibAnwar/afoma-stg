import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@headlessui/react";
import {
  formatPrice,
  getUniqueValues,
  getInitialPrices,
  getCalculatedPrices,
  calculateInventory,
  calculateTotalQuantity
} from "@/utils/productUtils";

const ProductInfo = ({
  product,
  variations,
  selectedAttributes,
  setSelectedAttributes,
  userCurrency,
  count,
  setCount,
  totalQuantity,
  textArea,
  setTextArea,
  addToCart,
  pushEventAddToCart,
  checkSelectedVariantInCart
}) => {
  const initialPrices = useMemo(() => getInitialPrices(variations), [variations]);

  const calculatedPrices = useMemo(() =>
    getCalculatedPrices(selectedAttributes, variations, initialPrices),
    [selectedAttributes, variations, initialPrices]
  );

  const inventory = useMemo(() =>
    calculateInventory(selectedAttributes, variations),
    [selectedAttributes, variations]
  );

  const handleAttributeItemClick = (attribute, value) => {
    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [attribute]: value,
    }));
  };

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

  const attributeArray = useMemo(() => {
    if (!product?.productType === "Customizable" || !variations || variations.length === 0) {
      return [];
    }

    return Object.keys(variations[0])
      .filter(attribute =>
        !["inventory", "quantity", "price", "image", "totalPrice", "finalPrice", "surTotalAmount", "surTotalAmountBDis", "currencyPrice"].includes(attribute)
      )
      .map(attributeName => ({
        attributeName,
        attributeValue: selectedAttributes[attributeName] !== undefined
          ? selectedAttributes[attributeName]
          : variations[0][attributeName]
      }));
  }, [product, variations, selectedAttributes]);

  return (
    <div className="lg:col-span-1">
      {/* Product Title */}
      <h3 className="text-blue-950 text-lg md:text-xl xl:text-2xl mb-0 font-medium">
        {product?.productName}
      </h3>

      {/* Seller Info */}
      {product?.seller?.firstName && product?.seller?.lastName && (
        <p className="text-sm text-blue-950 mb-2">
          by{" "}
          <span className="font-medium text-primary">
            {product?.seller?.storeTitle || ""}
          </span>
        </p>
      )}

      {/* Pricing */}
      {product?.productType === "Standard" && (
        <div>
          {product?.discountCode && parseFloat(product?.discountCode) > 0 ? (
            <div>
              <div className="flex gap-1 flex-row items-center">
                <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold">
                  {userCurrency ? userCurrency : "CA$"}{" "}
                  {formatPrice(
                    parseFloat(
                      product?.surTotalAmount
                        ? product?.surTotalAmount
                        : product?.totalAmount
                        ? product?.totalAmount
                        : product?.finalPrice
                    ).toFixed(2)
                  )}
                </p>
                <h4 className="text-red-700 line-through font-medium">
                  {userCurrency ? userCurrency : "CA$"}{" "}
                  {formatPrice(
                    parseFloat(
                      product?.surTotalAmountBDis
                        ? product?.surTotalAmountBDis
                        : product?.totalAmount
                        ? product?.totalAmount
                        : product?.price
                    ).toFixed(2)
                  )}
                </h4>
              </div>
              <p className="text-orange-700 mb-2">
                {product && product?.discountCode ? `${product?.discountCode}% off` : ""}
              </p>
            </div>
          ) : (
            <h4 className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-2">
              {product && product?.finalPrice
                ? `${userCurrency ? userCurrency : "CA$"} ${formatPrice(
                    parseFloat(
                      product?.surTotalAmount
                        ? product?.surTotalAmount
                        : product?.finalPrice
                    ).toFixed(2)
                  )}`
                : ""}
            </h4>
          )}
        </div>
      )}

      {product?.productType === "Customizable" && (
        <div>
          <div className="flex gap-1 flex-row items-center">
            <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-0">
              {calculatedPrices.calculatedPrice
                ? `${userCurrency ? userCurrency : "CA$"} ${formatPrice(
                    parseFloat(calculatedPrices.calculatedPrice).toFixed(2)
                  )}`
                : ""}
            </p>
            {parseFloat(product?.discountCode) > 0 && (
              <h4 className="text-red-700 line-through font-medium">
                {calculatedPrices.calculatedActualPrice
                  ? `${userCurrency ? userCurrency : "CA$"} ${formatPrice(
                      parseFloat(calculatedPrices.calculatedActualPrice).toFixed(2)
                    )}`
                  : ""}
              </h4>
            )}
          </div>
          {parseFloat(product?.discountCode) > 0 && (
            <p className="text-orange-700 mb-2">
              {product && product?.discountCode ? `${product?.discountCode}% off` : ""}
            </p>
          )}
        </div>
      )}

      {/* Inventory Status */}
      {product?.productType === "Customizable" && (
        <h4 className="text-blue-950 text-sm mb-2">
          {inventory === "Out of Stock" ? (
            <span className="text-red-700">Out of Stock</span>
          ) : (
            inventory
          )}
        </h4>
      )}

      {product?.productType === "Standard" && (
        <h4 className="text-blue-950 text-sm mb-2">
          {product?.inventory === "OutOffStock" ? (
            <span className="text-red-700">Out of Stock</span>
          ) : product?.inventory === "InStock" ? (
            "In Stock"
          ) : (
            product?.inventory
          )}
        </h4>
      )}

      {/* Free Shipping Badge */}
      {((product?.seller?.country === userCountry &&
        product?.seller?.shippingConfigId?.domestic?.flat_rate &&
        product?.seller?.shippingConfigId?.domestic?.flat_rate_options?.free_shipping) ||
        (product?.seller?.country !== userCountry &&
          product?.seller?.shippingConfigId?.international?.flat_rate &&
          product?.seller?.shippingConfigId?.international?.flat_rate_options?.free_shipping) ||
        (product?.freeDelivery && product?.seller?.country === userCountry)) &&
        product.productType !== "Downloadable" && (
        <div className="mb-3 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
          Free Shipping
        </div>
      )}

      {product?.productType === "Downloadable" && (
        <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-primary rounded-full w-[max-content] text-white">
          Downloadable
        </div>
      )}

      {/* Customizable Product Attributes */}
      {product?.productType === "Customizable" &&
        variations &&
        variations.length > 0 && (
        <>
          {Object.keys(variations[0]).map(
            (attribute, index) =>
              !["inventory", "quantity", "price", "image", "totalPrice", "finalPrice", "surTotalAmount", "surTotalAmountBDis", "currencyPrice"].includes(attribute) && (
                <Menu
                  key={index}
                  as="div"
                  className="relative inline-block text-left w-full mb-4"
                >
                  <div className="flex w-full">
                    <Menu.Button className="text-blue-950 py-3 px-4 border rounded w-full border-zinc-200 flex items-center justify-between mb-0 shadow-[0px_2px_4px_#0000000D]">
                      {selectedAttributes[attribute] ? (
                        <div>
                          <span className="capitalize">{attribute}: </span>
                          <span>{selectedAttributes[attribute]}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="capitalize">{attribute}:</span>{" "}
                          {variations[0][attribute]}
                        </div>
                      )}
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    {getUniqueValues(variations, attribute).map((value, valueIndex) => (
                      <Menu.Item key={valueIndex}>
                        {({ active }) => (
                          <button
                            onClick={() => handleAttributeItemClick(attribute, value)}
                            className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            {`${attribute}: ${value}`}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              )
          )}
        </>
      )}

      {/* Message for Seller */}
      <p className="font-semibold text-blue-950 mb-1">Message for Seller</p>
      <input
        type="textarea"
        placeholder="Type here..."
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
        maxLength="250"
        className="text-blue-950 w-full py-3.5 rounded px-4 border border-zinc-200 text-xs flex items-center justify-between mb-1.5 shadow-[0px_2px_4px_#0000000D]"
      />
      <p className="text-red-700 text-xs mb-5 md:mb-4">Maximum characters: 250</p>

      {/* Quantity and Add to Cart */}
      {product?.productType === "Standard" && (
        <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-8">
          <div className="w-24 bg-gray-300 flex items-center justify-between rounded-sm">
            <button
              className={`py-3 px-2.5 ${count <= 1 ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={decrement}
              disabled={count <= 1}
            >
              <span className="text-gray-950 text-lg">-</span>
            </button>
            <div className="w-10 flex-shrink-0 bg-gray-200 py-3 px-2.5">
              <p className="text-gray-950 text-sm text-center">{count}</p>
            </div>
            <button
              className={`py-3 px-2.5 ${count >= product?.quantity ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={increment}
              disabled={count >= product?.quantity}
            >
              <span className="text-gray-950 text-lg">+</span>
            </button>
          </div>

          <div className="flex items-center">
            {checkSelectedVariantInCart() ? (
              <button className="buttonprimarythre relative">
                View cart
              </button>
            ) : (
              <button
                onClick={() => {
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
                }}
                className={`text-primary ease-in transition-colors rounded-sm hover:bg-orange-100 text-sm xl:text-base font-medium py-3 px-8 border border-primary ${
                  product?.inventory === "OutOffStock" ? "disabled:cursor-not-allowed opacity-50" : ""
                }`}
                disabled={product?.inventory === "OutOffStock"}
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      )}

      {/* Customizable Product Actions */}
      {product?.productType === "Customizable" && (
        <div className="flex items-center gap-3 flex-wrap mt-2.5 mb-6 md:mb-5">
          <div className="w-24 bg-gray-300 flex items-center justify-between rounded-sm">
            <button
              className={`py-3 px-2.5 ${inventory === "Out of Stock" || count <= 1 ? "disabled:cursor-not-allowed opacity-50" : ""}`}
              onClick={decrement}
              disabled={inventory === "Out of Stock" || count <= 1}
            >
              <span className="text-gray-950 text-lg">-</span>
            </button>
            <div className="w-10 flex-shrink-0 bg-gray-200 py-3 px-2.5">
              <p className="text-gray-950 text-sm text-center">{count}</p>
            </div>
            <button
              className={`py-3 px-2.5 ${inventory === "Out of Stock" || count >= totalQuantity ? "disabled:cursor-not-allowed opacity-50" : ""}`}
              onClick={increment}
              disabled={inventory === "Out of Stock" || count >= totalQuantity}
            >
              <span className="text-gray-950 text-lg">+</span>
            </button>
          </div>

          <div className="flex items-center">
            {checkSelectedVariantInCart() ? (
              <button className="buttonprimarythre relative">
                View cart
              </button>
            ) : (
              <button
                onClick={() => {
                  const productId = attributeArray && Array.isArray(attributeArray) && attributeArray.length
                    ? `${product._id}_${attributeArray.map((variation) => variation.attributeValue.replace(/\s+/g, "")).join("_")}`
                    : product?._id;

                  addToCart(
                    productId,
                    count,
                    totalQuantity ? totalQuantity : "",
                    calculatedPrices.calculatedPriceSurcharge,
                    product,
                    textArea ? textArea : "",
                    [],
                    "",
                    0,
                    attributeArray
                  );
                  pushEventAddToCart("add_to_cart", count);
                }}
                className={`text-primary ease-in transition-colors rounded-sm text-sm xl:text-base font-medium py-3 px-8 border border-primary ${
                  inventory === "Out of Stock" ? "disabled:cursor-not-allowed opacity-50" : ""
                }`}
                disabled={inventory === "Out of Stock"}
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      )}

      {/* Downloadable Product Actions */}
      {product?.productType === "Downloadable" && (
        <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-8">
          <div className="flex items-center">
            <button
              onClick={() => {
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
              }}
              className={`text-primary ease-in transition-colors rounded-sm hover:bg-orange-100 text-sm xl:text-base font-medium py-3 px-8 border border-primary ${
                product?.inventory === "OutOffStock" ? "disabled:cursor-not-allowed opacity-50" : ""
              }`}
              disabled={product?.inventory === "OutOffStock"}
            >
              Add to cart
            </button>
          </div>
        </div>
      )}

      {/* Product Description */}
      <div className="pb-4 mb-4 border-b border-zinc-200">
        <p className="text-blue-950 font-semibold mb-1">Product description</p>
        <div style={{ whiteSpace: "pre-line" }}>
          <p className="text-slate-600 text-sm mb-12 relative">
            {product?.description}
          </p>
        </div>
      </div>

      {/* Package Details */}
      {(product?.productType === "Standard" || product?.productType === "Downloadable") && (
        <div className="pb-2 mb-4 border-b border-zinc-200">
          <p className="text-blue-950 font-semibold mb-3">Package details</p>

          {product?.productType === "Standard" && (
            <>
              <div className="flex gap-2.5 mb-3">
                <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                <p className="text-sm text-slate-600">
                  Package Length: {product?.length} cm
                </p>
              </div>
              <div className="flex gap-2.5 mb-3">
                <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                <p className="text-sm text-slate-600">
                  Package Width: {product?.width} cm
                </p>
              </div>
              <div className="flex gap-2.5 mb-3">
                <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                <p className="text-sm text-slate-600">
                  Package Height: {product?.height} cm
                </p>
              </div>
              <div className="flex gap-2.5 mb-3">
                <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                <p className="text-sm text-slate-600">
                  Package Weight: {product?.weight} kg
                </p>
              </div>
              <div className="flex gap-2.5 mb-3">
                <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                <p className="text-sm text-slate-600">
                  Dispatch time (Days): {product?.dispatchDays} days
                </p>
              </div>
            </>
          )}

          {product?.productType === "Downloadable" && (
            <div className="flex gap-2.5 mb-3">
              <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
              <p className="text-sm text-slate-600">
                Download limit: {product?.downloadableLink?.downloadLimit}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
