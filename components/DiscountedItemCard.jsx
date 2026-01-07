import Image from "next/image";
import { useRouter } from "next/router";
import { memo } from "react";

const DiscountedItemCard = memo(({ product, userCurrency, userCountry }) => {
  const router = useRouter();
  const formatPrice = (price) => {
    const numericPrice = Number(price); // Ensure it's a number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };
  return (
    <div
      className="flex flex-col items-center bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 w-full min-w-[220px] max-w-[320px] h-auto lg:h-[350px] cursor-pointer relative"
      onClick={() => {
        router.push(
          `category/${product?.Category?.slug}/${product?.SubCategory?.slug}${
            product?.childCategory?.slug
              ? "/" + product?.childCategory?.slug
              : ""
          }/${product?.slug}`
        );
      }}
    >
      {/* Product Image */}
      <div className="relative w-full h-[200px] lg:h-[250px] mb-4 z-10 group">
        <Image
          src={product?.images?.[0]?.imageUrl || "/placeholder.jpg"}
          alt={product?.productName}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
          // width={300}
          // height={300}
          loading="lazy"
        />
        {/* Free Domestic Delivery Badge */}
        {((product?.seller?.country == userCountry &&
          product?.seller?.shippingConfigId?.domestic?.flat_rate &&
          product?.seller?.shippingConfigId?.domestic?.flat_rate_options
            ?.free_shipping) ||
          (product?.seller?.country != userCountry &&
            product?.seller?.shippingConfigId?.international?.flat_rate &&
            product?.seller?.shippingConfigId?.international?.flat_rate_options
              ?.free_shipping) ||
          (product?.freeDelivery && product?.seller?.country == userCountry)) &&
          product.productType !== "Downloadable" && (
            <div className="absolute top-2 left-2 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Free Shipping
            </div>
          )}
      </div>

      {/* Product Title */}
      <h3 className="text-md font-semibold text-gray-800 text-center mb-4 px-4">
        {product.productName.length > 15
          ? product.productName.slice(0, 15) + "..."
          : product.productName}
      </h3>

      {product.seller?.country?.toLowerCase() !==
        userCountry?.toLowerCase() && (
        <div>
          {/* Price Section */}
          {product.productType !== "Customizable" && (
            <div className="flex justify-center items-center space-x-2">
              {/* Final Price */}
              <p className="text-lg font-semibold text-black">
                {userCurrency}{" "}
                {formatPrice(
                  parseFloat(product?.surTotalAmount || product?.price)
                ) || "--"}
              </p>

              {/* Original Price (Strikethrough) */}
              {product?.discountCode > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(
                    parseFloat(
                      product?.surTotalAmountBDis
                        ? product?.surTotalAmountBDis
                        : product?.price
                    )
                  )}
                </p>
              )}
            </div>
          )}

          {product.productType === "Customizable" && (
            <div className="flex justify-center items-center space-x-2">
              {/* Final Price */}
              <p className="text-lg font-semibold text-black">
                {userCurrency}{" "}
                {formatPrice(
                  parseFloat(
                    product?.variations?.[0]?.surTotalAmount ||
                      product?.variations?.[0]?.price
                  )
                ) || "--"}
              </p>

              {/* Original Price (Strikethrough) */}
              {product?.discountCode > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(
                    parseFloat(
                      product?.variations?.[0]?.surTotalAmountBDis
                        ? product?.variations?.[0]?.surTotalAmountBDis
                        : product?.variations?.[0]?.price
                    )
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {product.seller?.country?.toLowerCase() == userCountry?.toLowerCase() &&
        product.freeDelivery && (
          <div>
            {/* Price Section */}
            {product.productType !== "Customizable" && (
              <div className="flex justify-center items-center space-x-2">
                {/* Final Price */}
                <p className="text-lg font-semibold text-black">
                  {userCurrency}{" "}
                  {formatPrice(
                    parseFloat(
                      product?.surTotalAmount ||
                        product?.finalPrice ||
                        product?.price
                    )
                  ) || "--"}
                </p>

                {/* Original Price (Strikethrough) */}
                {product?.discountCode > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(
                      parseFloat(
                        product?.surTotalAmountBDis
                          ? product?.surTotalAmountBDis
                          : product?.totalPrice
                      )
                    )}
                  </p>
                )}
              </div>
            )}

            {product.productType === "Customizable" && (
              <div className="flex justify-center items-center space-x-2">
                {/* Final Price */}
                <p className="text-lg font-semibold text-black">
                  {userCurrency}{" "}
                  {formatPrice(
                    parseFloat(
                      product?.variations?.[0]?.surTotalAmount ||
                        product?.variations?.[0]?.finalPrice ||
                        product?.variations?.[0]?.price
                    )
                  ) || "--"}
                </p>

                {/* Original Price (Strikethrough) */}
                {product?.discountCode > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(
                      parseFloat(
                        product?.variations?.[0]?.surTotalAmountBDis
                          ? product?.variations?.[0]?.surTotalAmountBDis
                          : product?.variations?.[0]?.totalPrice
                      )
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      {product.seller?.country?.toLowerCase() == userCountry?.toLowerCase() &&
        !product.freeDelivery && (
          <div>
            {/* Price Section */}
            {product.productType !== "Customizable" && (
              <div className="flex justify-center items-center space-x-2">
                {/* Final Price */}
                <p className="text-lg font-semibold text-black">
                  {userCurrency}{" "}
                  {formatPrice(
                    parseFloat(
                      product?.surTotalAmount ||
                        product?.finalPrice ||
                        product?.price
                    )
                  ) || "--"}
                </p>

                {/* Original Price (Strikethrough) */}
                {product?.discountCode > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(
                      parseFloat(
                        product?.surTotalAmountBDis
                          ? product?.surTotalAmountBDis
                          : product?.totalPrice
                      )
                    )}
                  </p>
                )}
              </div>
            )}

            {product.productType === "Customizable" && (
              <div className="flex justify-center items-center space-x-2">
                {/* Final Price */}
                <p className="text-lg font-semibold text-black">
                  {userCurrency}{" "}
                  {formatPrice(
                    parseFloat(
                      product?.variations?.[0]?.surTotalAmount ||
                        product?.variations?.[0]?.finalPrice ||
                        product?.variations?.[0]?.price
                    )
                  ) || "--"}
                </p>

                {/* Original Price (Strikethrough) */}
                {product?.discountCode > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(
                      parseFloat(
                        product?.variations?.[0]?.surTotalAmountBDis
                          ? product?.variations?.[0]?.surTotalAmountBDis
                          : product?.variations?.[0]?.totalPrice
                      )
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      {/* Add to Cart Button (Optional) */}
      {/* <button className="buttonprimary mt-5">Add to Cart</button> */}
    </div>
  );
});

DiscountedItemCard.displayName = "DiscountedItemCard";

export default DiscountedItemCard;
