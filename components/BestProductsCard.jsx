import Image from 'next/image'
import { useRouter } from 'next/router';

const BestProductsCard = ({ data, userCurrency, userCountry}) => {
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
    className="flex flex-col items-center mx-3 p-0 bg-white shadow-lg rounded-lg hover:shadow-xl hover:scale-105 hover:bg-gray-50 transition-all duration-300 w-full min-w-[220px] max-w-[320px] h-[400px] lg:h-[500px] pb-5 cursor-pointer"
    onClick={() => {
      router.push(`category/${data?.Category?.slug}/${data?.SubCategory?.slug}${data?.childCategory?.slug ? "/" + data?.childCategory?.slug : ""}/${data?.slug}`);
    }}
    >
      {/* Image that touches the card borders with sharp corners */}
      <div className="relative w-full h-80 mb-4 overflow-hidden group">
      {/* Product Image */}
      <Image
        src={data?.images?.[0]?.imageUrl || "/placeholder.jpg"}
        alt={data.productName}
        width={400}
        height={300}
        // layout="fill"
        objectFit="cover"
        className="w-full h-full"
        loading='lazy'
      />

      {/* Free Domestic Delivery Badge */}
      {((data?.seller?.country == userCountry && data?.seller?.shippingConfigId?.domestic?.flat_rate &&
        data?.seller?.shippingConfigId?.domestic?.flat_rate_options?.free_shipping) ||
        (data?.seller?.country != userCountry && data?.seller?.shippingConfigId?.international?.flat_rate &&
        data?.seller?.shippingConfigId?.international?.flat_rate_options?.free_shipping) || 
        (data?.freeDelivery && data?.seller?.country == userCountry)) && data.productType !== "Downloadable" && (
        <div className="absolute top-2 left-2 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Free Shipping
        </div>
      )}

      {/* Price (Hidden by Default, Shows on Hover) */}
        <p className="absolute bottom-4 left-4 bg-white text-black text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            {data.seller.country?.toLowerCase() !== userCountry?.toLowerCase() && (
            <div>
                {/* Price Section */}
                {data.productType !== "Customizable" && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Final Price */}
                        <p className="text-sm font-semibold text-black">
                            {userCurrency} {formatPrice(parseFloat(data?.surTotalAmount || data?.price)) || "--"}
                        </p>

                        {/* Original Price (Strikethrough) */}
                        {data?.discountCode > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(parseFloat(data?.surTotalAmountBDis ? data?.surTotalAmountBDis : data?.price))}
                            </p>
                        )}
                    </div>
                )}

                {data.productType === "Customizable" && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Final Price */}
                        <p className="text-sm font-semibold text-black">
                            {userCurrency} {formatPrice(parseFloat(data?.variations?.[0]?.surTotalAmount || data?.variations?.[0]?.price)) || "--"}
                        </p>

                        {/* Original Price (Strikethrough) */}
                        {data?.discountCode > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(parseFloat(data?.variations?.[0]?.surTotalAmountBDis ? data?.variations?.[0]?.surTotalAmountBDis : data?.variations?.[0]?.price))}
                            </p>
                        )}
                    </div>
                )}
            </div>
            )}

            {data.seller.country.toLowerCase() == userCountry?.toLowerCase() && data.freeDelivery && (
            <div>
                {/* Price Section */}
                {data.productType !== "Customizable" && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Final Price */}
                        <p className="text-sm font-semibold text-black">
                            {userCurrency} {formatPrice(parseFloat(data?.surTotalAmount || data?.finalPrice || data?.price)) || "--"}
                        </p>

                        {/* Original Price (Strikethrough) */}
                        {data?.discountCode > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(parseFloat(data?.surTotalAmountBDis ? data?.surTotalAmountBDis : data?.totalPrice))}
                            </p>
                        )}
                    </div>
                )}

                {data.productType === "Customizable" && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Final Price */}
                        <p className="text-sm font-semibold text-black">
                            {userCurrency} {formatPrice(parseFloat(data?.variations?.[0]?.surTotalAmount || data?.variations?.[0]?.finalPrice || data?.variations?.[0]?.price)) || "--"}
                        </p>

                        {/* Original Price (Strikethrough) */}
                        {data?.discountCode > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(parseFloat(data?.variations?.[0]?.surTotalAmountBDis ? data?.variations?.[0]?.surTotalAmountBDis : data?.variations?.[0]?.totalPrice))}
                            </p>
                        )}
                    </div>
                )}
            </div>
            )}

            {data.seller.country.toLowerCase() == userCountry?.toLowerCase() && !data.freeDelivery && (
            <div>
                {/* Price Section */}
                {data.productType !== "Customizable" && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Final Price */}
                        <p className="text-sm font-semibold text-black">
                            {userCurrency} {formatPrice(parseFloat(data?.surTotalAmount || data?.finalPrice || data?.price)) || "--"}
                        </p>

                        {/* Original Price (Strikethrough) */}
                        {data?.discountCode > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(parseFloat(data?.surTotalAmountBDis ? data?.surTotalAmountBDis : data?.totalPrice))}
                            </p>
                        )}
                    </div>
                )}

                {data.productType === "Customizable" && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Final Price */}
                        <p className="text-sm font-semibold text-black">
                            {userCurrency} {formatPrice(parseFloat(data?.variations?.[0]?.surTotalAmount || data?.variations?.[0]?.finalPrice || data?.variations?.[0]?.price)) || "--"}
                        </p>

                        {/* Original Price (Strikethrough) */}
                        {data?.discountCode > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(parseFloat(data?.variations?.[0]?.surTotalAmountBDis ? data?.variations?.[0]?.surTotalAmountBDis : data?.variations?.[0]?.totalPrice))}
                            </p>
                        )}
                    </div>
                )}
            </div>
            )}
        </p>
    </div>
      
      <p className="text-base font-semibold text-gray-600 mt-2">{data?.Category?.name || "--"}</p>
      <h3 className="text-lg font-bold text-gray-800 text-center truncate">{data.productName.length > 18 ? data.productName.slice(0, 18) + '...' : data.productName}</h3>
      {/* <p className="text-lg font-bold text-gray-900 mt-2">{data?.productDetails?.price || "--"}</p> */}
      
      {/* New Flat Button Style */}
      <button className="buttonprimary mt-5">
        Add to Cart
      </button>
    </div>
  )
}

export default BestProductsCard;
