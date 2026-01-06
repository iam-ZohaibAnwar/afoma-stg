import { calculateSurcharge } from "@/utils/pricingUtils";
import Link from "next/link";
import Router from "next/router";
import Image from "next/image";
import { memo, useMemo } from "react";

const formatPrice = (price) => {
  const numericPrice = Number(price); // Ensure it's a number
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

const ProductCardComponent = memo(({ data }) => {
  // Memoize calculations to avoid re-computation
  const { userInfo, userCurrency, processedData, path } = useMemo(() => {
    const userInfoData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo") || "{}") : {};
    const sellerCountry = data?.seller?.country || "";
    const userCurrency = sellerCountry ? (userInfoData?.currency && userInfoData?.currencyRate) ? userInfoData?.currency : false : false;
    const processedData = calculateSurcharge([data])?.[0];
    const categoryId = processedData?.Category ? processedData.Category.slug : "";
    const subCategoryId = processedData?.SubCategory ? processedData.SubCategory.slug : "";
    
    let computedPath = Router.pathname
      .replace("/[categoryId]", "")
      .replace("/[subCategoryId]", "")
      .replace("/[...productId]", "");

    if (categoryId) {
      computedPath += `/${categoryId}/${subCategoryId || processedData?.SubCategory?.slug}`;
      if (processedData?.childCategory?.slug) {
        computedPath += `/${processedData?.childCategory?.slug}`;
      }
    }

    if (computedPath === "/" || computedPath == "/search") {
      computedPath = `/category/${processedData?.Category?.slug}/${processedData?.SubCategory?.slug}`;
      if (processedData?.childCategory?.slug) {
        computedPath += `/${processedData.childCategory.slug}`;
      }
    }

    return { userInfo: userInfoData, userCurrency, processedData, path: computedPath };
  }, [data]);
  return (
    <div className="relative">
      <div className="w-[320px] max-w-[320px]">
        <div className="h-[320px] max-h-[320px] relative overflow-visible group bg-white border border-slate-200 rounded">
          <div className="absolute inset-0 bg-yellow-950/[55%] opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
          <Image
            src={processedData?.images?.[0]?.imageUrl || "/placeholder.jpg"}
            alt={processedData?.images?.[0]?.altText || "Afoma_Marketplace_Product"}
            width={processedData?.images?.[0]?.width || 320}
            height={processedData?.images?.[0]?.height || 320}
            className="object-fill h-full w-full rounded"
            loading="lazy"
            unoptimized={processedData?.images?.[0]?.imageUrl?.includes("http")}
          />
          <div className="absolute bottom-9 hover:visible flex items-center justify-center left-0 right-0">
            <div className="flex items-center justify-center ">
              <Link
                href={`${path}/${data?.slug}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity buttonprimary"
                prefetch={true}
              >
                Shop Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7.477"
                  height="13.14"
                  viewBox="0 0 7.477 13.14"
                >
                  <path
                    id="Down_Arrow_3_"
                    d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
                    transform="translate(-39.625 32.764) rotate(-90)"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="0.75"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <p className="text-sm lg:text-lg font-medium text-md mt-3 mb-1 text-blue-950 hover:text-primary line-clamp-1">
          <Link href={`${path}/${processedData?.slug}`} prefetch={true}>{processedData?.productName}</Link>
        </p>
      </div>
      <div>
        <div className="font-bold mb-2 text-sm lg:text-lg text-md text-blue-950">
          {processedData?.productType !== "Customizable" &&
          processedData?.discountCode &&
          parseFloat(processedData.discountCode) > 0 ? (
            <>
              <div>
                <span className="text-blue-950 font-bold mr-2">
                 {userCurrency ? userCurrency : "CA$"}{" "}
                  {formatPrice(parseFloat((processedData?.surTotalAmount ? processedData?.surTotalAmount : (processedData.finalPrice ? processedData.finalPrice : processedData.price)) || 0).toFixed(2))}
                </span>
                <span className="text-red-700 font-normal line-through  text-sm">
                  {" "}
                  {userCurrency ? userCurrency : "CA$"}{" "}
                  {
                    formatPrice(parseFloat((processedData?.surTotalAmountBDis ? processedData?.surTotalAmountBDis : (processedData?.totalPrice ? processedData?.totalPrice : processedData.price)) || 0).toFixed(2))
                  }
                </span>
                <span>
                  {" "}
                  <span className="text-orange-700 font-normal text-sm">
                    {" "}
                    ({processedData.discountCode}% off)
                  </span>
                </span>
              </div>
            </>
          ) : (
            <>
              <>
                {processedData &&
                  processedData.productType === "Customizable" &&
                  processedData.variations &&
                  processedData.variations.length && (
                    <>
                      <span className="text-blue-950 font-bold mr-2">
                       {userCurrency ? userCurrency : "CA$"}{" "}
                        {
                          formatPrice(parseFloat((processedData.variations[0]?.surTotalAmount
                            ? processedData.variations[0]?.surTotalAmount
                            : (processedData.variations[0].finalPrice
                              ? processedData.variations[0].finalPrice 
                              :processedData.variations[0].price))))
                        }
                      </span>
                      {processedData.discountCode &&
                        parseFloat(processedData.discountCode) > 0 && (
                          <>
                            <span className="text-red-700 font-normal line-through  text-sm">
                              {" "}
                              {userCurrency ? userCurrency : "CA$"}{" "}
                              {
                                formatPrice(parseFloat((processedData.variations[0].surTotalAmountBDis ? processedData.variations[0].surTotalAmountBDis : (processedData.variations[0].totalPrice ? processedData.variations[0].totalPrice : processedData.variations[0].price)).toFixed(2)))
                              }
                            </span>
                            <span>
                              {" "}
                              <span className="text-orange-700 font-normal text-sm">
                                {" "}
                                ({processedData.discountCode}% off)
                              </span>
                            </span>
                          </>
                        )}
                    </>
                  )}
              </>
              <>
                {processedData?.productType !== "Customizable" && (
                  <>{userCurrency ? userCurrency : "CA$"}{" "}
                  {formatPrice(parseFloat((processedData?.surTotalAmount ? processedData?.surTotalAmount : (processedData.totalPrice ? processedData.totalPrice : processedData.price))))}</>
                )}
              </>
            </>
          )}
        </div>
        {((( processedData?.seller?.country == userInfo?.country &&
          processedData?.seller?.shippingConfigId?.domestic?.flat_rate &&
          processedData?.seller?.shippingConfigId?.domestic?.flat_rate_options?.free_shipping) ||
          ( processedData?.seller?.country != userInfo?.country &&
          processedData?.seller?.shippingConfigId?.international?.flat_rate &&
          processedData?.seller?.shippingConfigId?.international?.flat_rate_options?.free_shipping) || 
          (processedData?.freeDelivery && processedData?.seller?.country == userInfo?.country)) &&
          processedData.productType != "Downloadable"
          ) ? (
          <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
            Free Shipping
          </div>
        ) : (
          ""
        )}
        {processedData?.productType === "Downloadable" ? (
          <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-primary rounded-full w-[max-content] text-white">
            Downloadable
          </div>
        ) : (
          ""
        )}
        <p className="text-slate-600 text-sm underline">
          <Link href={`/shop/${processedData?.seller?.storeSlug}`}>
            {processedData?.seller?.firstName} {processedData?.seller?.lastName}
          </Link>
        </p>
      </div>
    </div>
  );
});

ProductCardComponent.displayName = "ProductCardComponent";

export default ProductCardComponent;
