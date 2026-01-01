import { calculateSurcharge } from "@/utils/pricingUtils";
import Link from "next/link";
import Router from "next/router";

const formatPrice = (price) => {
  const numericPrice = Number(price); // Ensure it's a number
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

const ProductCardComponent = ({ data }) => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  let sellerCountry = data?.seller?.country || "";
  let userCurrency = sellerCountry ? (userInfo?.currency && userInfo?.currencyRate) ? userInfo?.currency : false : false
  data = calculateSurcharge([data])?.[0]

  let { categoryId, subCategoryId } = Router.query;
  let path = Router.pathname
    .replace("/[categoryId]", "")
    .replace("/[subCategoryId]", "")
    .replace("/[...productId]", "");

  if (categoryId) {
    path += `/${categoryId}/${subCategoryId || data.SubCategory.slug}`;
    if (data?.childCategory?.slug) {
      path += `/${data?.childCategory?.slug}`;
    }
  }

  if (path === "/" || path == "/search") {
    path = `/category/${data.Category.slug}/${data.SubCategory.slug}`;
    if (data?.childCategory?.slug) {
      path += `/${data.childCategory.slug}`;
    }
  }
  return (
    <div className="relative">
      <div className="w-[320px] max-w-[320px]">
        <div className="h-[320px] max-h-[320px] relative overflow-visible group bg-white border border-slate-200 rounded">
          <div className="absolute inset-0 bg-yellow-950/[55%] opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
          <img
            src={data?.images[0]?.imageUrl}
            alt={data?.images[0]?.altText || "Afoma_Marketplace_Product"}
            loading="lazy"
            width={data?.images?.[0]?.width || 300}   // fallback to default width
            height={data?.images?.[0]?.height || 300} // fallback to default height
            className="object-fill h-full w-full rounded"
          />
          <div className="absolute bottom-9 hover:visible flex items-center justify-center left-0 right-0">
            <div className="flex items-center justify-center ">
              <Link
                href={`${path}/${data?.slug}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity buttonprimary"
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
          <Link href={`${path}/${data?.slug}`}>{data?.productName}</Link>
        </p>
      </div>
      <div>
        <div className="font-bold mb-2 text-sm lg:text-lg text-md text-blue-950">
          {data?.productType !== "Customizable" &&
          data.discountCode &&
          parseFloat(data.discountCode) > 0 ? (
            <>
              <div>
                <span className="text-blue-950 font-bold mr-2">
                 {userCurrency ? userCurrency : "CA$"}{" "}
                  {formatPrice(parseFloat((data?.surTotalAmount ? data?.surTotalAmount : (data.finalPrice ? data.finalPrice : data.price)) || 0).toFixed(2))}
                </span>
                <span className="text-red-700 font-normal line-through  text-sm">
                  {" "}
                  {userCurrency ? userCurrency : "CA$"}{" "}
                  {
                    formatPrice(parseFloat((data?.surTotalAmountBDis ? data?.surTotalAmountBDis : (data?.totalPrice ? data?.totalPrice : data.price)) || 0).toFixed(2))
                  }
                </span>
                <span>
                  {" "}
                  <span className="text-orange-700 font-normal text-sm">
                    {" "}
                    ({data.discountCode}% off)
                  </span>
                </span>
              </div>
            </>
          ) : (
            <>
              <>
                {data &&
                  data.productType === "Customizable" &&
                  data.variations &&
                  data.variations.length && (
                    <>
                      <span className="text-blue-950 font-bold mr-2">
                       {userCurrency ? userCurrency : "CA$"}{" "}
                        {
                          formatPrice(parseFloat((data.variations[0]?.surTotalAmount
                            ? data.variations[0]?.surTotalAmount
                            : (data.variations[0].finalPrice
                              ? data.variations[0].finalPrice 
                              :data.variations[0].price))))
                        }
                      </span>
                      {data.discountCode &&
                        parseFloat(data.discountCode) > 0 && (
                          <>
                            <span className="text-red-700 font-normal line-through  text-sm">
                              {" "}
                              {userCurrency ? userCurrency : "CA$"}{" "}
                              {
                                formatPrice(parseFloat((data.variations[0].surTotalAmountBDis ? data.variations[0].surTotalAmountBDis : (data.variations[0].totalPrice ? data.variations[0].totalPrice : data.variations[0].price)).toFixed(2)))
                              }
                            </span>
                            <span>
                              {" "}
                              <span className="text-orange-700 font-normal text-sm">
                                {" "}
                                ({data.discountCode}% off)
                              </span>
                            </span>
                          </>
                        )}
                    </>
                  )}
              </>
              <>
                {data?.productType !== "Customizable" && (
                  <>{userCurrency ? userCurrency : "CA$"}{" "}
                  {formatPrice(parseFloat((data?.surTotalAmount ? data?.surTotalAmount : (data.totalPrice ? data.totalPrice : data.price))))}</>
                )}
              </>
            </>
          )}
        </div>
        {((( data?.seller?.country == userInfo?.country &&
          data?.seller?.shippingConfigId?.domestic?.flat_rate &&
          data?.seller?.shippingConfigId?.domestic?.flat_rate_options?.free_shipping) ||
          ( data?.seller?.country != userInfo?.country &&
          data?.seller?.shippingConfigId?.international?.flat_rate &&
          data?.seller?.shippingConfigId?.international?.flat_rate_options?.free_shipping) || 
          (data?.freeDelivery && data?.seller?.country == userInfo?.country)) &&
          data.productType != "Downloadable"
          ) ? (
          <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
            Free Shipping
          </div>
        ) : (
          ""
        )}
        {data?.productType === "Downloadable" ? (
          <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-primary rounded-full w-[max-content] text-white">
            Downloadable
          </div>
        ) : (
          ""
        )}
        <p className="text-slate-600 text-sm underline">
          <Link href={`/shop/${data?.seller?.storeSlug}`}>
            {data?.seller?.firstName} {data?.seller?.lastName}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProductCardComponent;
