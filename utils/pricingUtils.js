// utils/surcharge.js
export const calculateSurcharge = (products) => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}
    if (!Array.isArray(products) || !userInfo) return products;
  
    const userCountry = userInfo?.country?.trim() || "";
    const userSurcharge = userInfo?.surCharge || {};
    const conversionRate = parseFloat(userInfo?.currencyRate) || 1;
  
    return products.map((data) => {
      if (!data?.seller) return data;
  
      const { seller } = data;
      const sellerCountry = seller?.country?.trim() || "";
      const shippingConfig = seller?.shippingConfigId || {};
      const isDomestic = sellerCountry === userCountry;
      const configApply = isDomestic ? shippingConfig?.domestic : shippingConfig?.international;
  
      const isShippingEnabled = configApply?.afoma_shipping;
      const isFreeShipping = configApply?.flat_rate && configApply?.flat_rate_options?.free_shipping;
  
      let surchargeValue = 0;
      if (data.productType !== "Downloadable" && isShippingEnabled && !isDomestic && !isFreeShipping) {
        surchargeValue = userSurcharge[`${sellerCountry}-${userCountry}`] || 0;
      }
  
      let handlingFee = 0;
      if (configApply?.flat_rate && configApply?.flat_rate_options?.free_shipping && data.productType !== "Downloadable") {
        const flatRateOptions = configApply?.flat_rate_options;
        handlingFee = flatRateOptions?.is_flat_rate
          ? flatRateOptions?.flat_rate_rate
          : data.weight <= 1
          ? flatRateOptions?.flat_rate_0_1
          : data.weight <= 5
          ? flatRateOptions?.flat_rate_1_5
          : flatRateOptions?.flat_rate_5_A;
      }

      if(data?.freeDelivery && sellerCountry == userCountry){
        handlingFee = parseFloat(data?.handlingFee) || 0
      }
  
      const basePrice = parseFloat(data.price) || 0;
      const discountFactor = data.discountCode ? 1 - data.discountCode / 100 : 1;
      const discountedAmount = basePrice * discountFactor;
      const amountWithSurcharge = parseFloat((discountedAmount + surchargeValue + handlingFee).toFixed(2));
      
      if(data.productType === "Standard"){
        // SET FINAL AND TOTAL PRICES
        data.finalPrice = parseFloat((discountedAmount + handlingFee).toFixed(2))
        data.surTotalAmount = parseFloat((amountWithSurcharge * conversionRate));
        data.surTotalAmountBDis = data.discountCode
          ? parseFloat(((amountWithSurcharge / discountFactor) * conversionRate))
          : data.surTotalAmount;
      }

      if(data.productType === "Downloadable"){
        data.surTotalAmount = parseFloat((discountedAmount * conversionRate));
        data.surTotalAmountBDis = data.discountCode
          ? parseFloat(((discountedAmount / discountFactor) * conversionRate))
          : data.surTotalAmount;
      }
  
      if (data.productType === "Customizable" && Array.isArray(data.variations)) {
        data.variations.forEach((variation) => {
          // SET FINAL AND TOTAL PRICES
          const variationPrice = parseFloat(variation.price) || 0;
          const varDiscountedAmount = variationPrice * discountFactor;
          const varAmountWithSurcharge = parseFloat((varDiscountedAmount + surchargeValue + handlingFee).toFixed(2));
  
          variation.surTotalAmount = parseFloat((varAmountWithSurcharge * conversionRate));
          variation.surTotalAmountBDis = data.discountCode
            ? parseFloat(((varAmountWithSurcharge / discountFactor) * conversionRate))
            : variation.surTotalAmount;
            // if(data.sku = "SETOFHANB9ABE7CC" && variation?.Fragrance == "Lavender & Honey"){
            //   console.log(parseFloat(varAmountWithSurcharge.toFixed(2)) * conversionRate)
            //   console.log(variation.surTotalAmount)
            //   console.log(varAmountWithSurcharge)
            //   console.log(parseFloat(varDiscountedAmount + handlingFee))
            // }
          variation.finalPrice = parseFloat((varDiscountedAmount + handlingFee).toFixed(2))
        });
      }
  
      return data;
    });
  };

  export const calculateItemPrice = (data, order, converted = true, seller = false) => {
    if(data?.productData?.productType !== "Customizable"){
      const basePrice = data.productData.finalPrice ?? data.basePrice;
        const priceWithShipping =
          data?.shippingOptions?.length && !seller
          ? (Number(basePrice) + (data?.shippingOptions[0]?.deductedAmount ? Number(data?.shippingOptions[0]?.deductedAmount) : 0))
            : basePrice;
  
        return order.conversionRate && converted
          ? order.conversionRate * priceWithShipping
          : priceWithShipping;
    }else{
      const selectedVariation = data?.productData?.variations?.find(
        (variation) => variation?.[data.selectedVariations?.[0]?.attributeName] === data.selectedVariations?.[0]?.attributeValue
      );
      const basePrice = selectedVariation?.finalPrice ?? data.basePrice;

      const priceWithShipping =
        data?.shippingOptions?.length && !seller
        ? (Number(basePrice) + (data?.shippingOptions[0]?.deductedAmount ? Number(data?.shippingOptions[0]?.deductedAmount) : 0))
          : basePrice;

      return order.conversionRate && converted
        ? order.conversionRate * priceWithShipping
        : priceWithShipping;
    }

  }

  export const calculateItemTotalPrice = (data, order, converted = true, seller = false) => {
    if(data.productData.productType != "Customizable"){
      const discountFactor = data.productData.discountCode ? 1 - data.productData.discountCode / 100 : 1;
      const basePrice = data.productData.finalPrice ?? data.totalAmount; 
  
      const priceWithShipping =
        data?.shippingOptions?.length && !seller
        ? (Number(basePrice) + (data?.shippingOptions[0]?.deductedAmount ? Number(data?.shippingOptions[0]?.deductedAmount) : 0))
          : basePrice;
      let coupon = data.productData.couponCode && data.productData.couponDiscount ? data.productData.couponDiscount : 0
      const amount = (Number(priceWithShipping) + coupon ) / discountFactor

      return order.conversionRate && converted
        ? order.conversionRate * amount
        :  amount;
    }else{
      const selectedVariation = data?.productData?.variations?.find(
        (variation) => variation?.[data.selectedVariations?.[0]?.attributeName] === data.selectedVariations?.[0]?.attributeValue
      );
      const discountFactor = data.productData.discountCode ? 1 - data.productData.discountCode / 100 : 1;
      const basePrice = selectedVariation?.finalPrice ?? data.totalAmount; 

      const priceWithShipping =
        data?.shippingOptions?.length && !seller
          ? (Number(basePrice) + (data?.shippingOptions[0]?.deductedAmount ? Number(data?.shippingOptions[0]?.deductedAmount) : 0))
          : basePrice;

      let coupon = data.productData.couponCode && data.productData.couponDiscount ? data.productData.couponDiscount : 0
      const amount = (Number(priceWithShipping) + coupon ) / discountFactor

      return order.conversionRate && converted
        ? order.conversionRate * amount
        :  amount;
    }
}

export const calculateItemsTotalPrice = (order, converted = true, seller = false) => {
  let total = 0
  for(let data of order.cart){
    if(data?.productData?.productType !== "Customizable"){
      const basePrice = data.productData.finalPrice ?? data.basePrice;
        const priceWithShipping =
          data?.shippingOptions?.length && !seller
          ? (Number(basePrice) + (data?.shippingOptions[0]?.deductedAmount ? Number(data?.shippingOptions[0]?.deductedAmount) : 0))
            : basePrice;
  
        total += order.conversionRate && converted
          ? order.conversionRate * priceWithShipping
          : priceWithShipping;
    }else{
      const selectedVariation = data?.productData?.variations?.find(
        (variation) => variation?.[data.selectedVariations?.[0]?.attributeName] === data.selectedVariations?.[0]?.attributeValue
      );
      const basePrice = selectedVariation?.finalPrice ?? data.basePrice;

      const priceWithShipping =
        data?.shippingOptions?.length && !seller
        ? (Number(basePrice) + (data?.shippingOptions[0]?.deductedAmount ? Number(data?.shippingOptions[0]?.deductedAmount) : 0))
          : basePrice;

      total += order.conversionRate && converted
        ? order.conversionRate * priceWithShipping
        : priceWithShipping;
    }
  }

  return total ? Number(total) : ""
}

export const calculateShippingRate = (order) => {
  const sellers = new Set();
  let total = 0;

  order.cart.forEach(({ productData, shippingRate }) => {
    const sellerId = productData?.seller?._id || productData?.seller;
    if (sellerId && !sellers.has(sellerId)) {
      sellers.add(sellerId);
      total += shippingRate > 0 ? shippingRate : 0;
    }
  });
  return order.conversionRate > 0 ? total / order.conversionRate : total;
};
