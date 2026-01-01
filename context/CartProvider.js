import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { changeCartPrice, getGeoIP } from "@/lib/geoIP";
import { pushEventRemoveCart } from "@/utils/dataLayer";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [currency, setCurrency] = useState("");
  const [totalShippingRate, setTotalShippingRate] = useState(0);
  const [fetchedShippingRate, setFetchedShippingRate] = useState(0);

  const saveCartInDb = async (
    newCart,
    subTotal,
    totalShippingRate,
    fetchedShippingRate
  ) => {
    let user = JSON.parse(localStorage.getItem("user"));
    if(user?.userId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/add-cart`,
        {
          user_id: user?.userId,
          cart: newCart,
          subTotal: subTotal,
          totalShippingRate: totalShippingRate,
          fetchedShippingRate: fetchedShippingRate,
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
    }
  };

  const saveCart = async (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    let subt = 0;
    let shippingRate = 0;
    let keys = Object.keys(newCart);
    let oldSubTotal = 0
    const sellerShippingRate = getShippingRatesBySeller(newCart)
      ? getShippingRatesBySeller(newCart)
      : undefined;
    for (let i = 0; i < keys.length; i++) {
      subt += applyDiscount(
        newCart[keys[i]],
        parseFloat(newCart[keys[i]].basePrice) *
          parseFloat(newCart[keys[i]].orderQuantiy),
          keys.length
      );
      oldSubTotal += parseFloat(newCart[keys[i]].basePrice) *
          parseFloat(newCart[keys[i]].orderQuantiy)
      if(oldSubTotal > subt){
        localStorage.setItem("oldSubTotal", oldSubTotal)
      }
      if (sellerShippingRate && sellerShippingRate.length) {
        for (let i = 0; i < sellerShippingRate.length; i++) {
          subt += (sellerShippingRate[i].deductedAm) || 0;
          shippingRate += sellerShippingRate[i].shippingRate
            ? sellerShippingRate[i].shippingRate
            : 0;
        }
      }
      if (
        keys.length &&
        newCart[keys[0]].shippingOptions?.length &&
        userInfo?.currency &&
        userInfo?.currencyRate
      ) {
        var fetchedShippingRate = shippingRate / (userInfo?.currencyRate || 1);
        localStorage.setItem(
          "fetchedShippingRate",
          fetchedShippingRate.toFixed(2)
        );
        setFetchedShippingRate(fetchedShippingRate.toFixed(2));
      } else {
        localStorage.setItem("fetchedShippingRate", shippingRate.toFixed(2));
        setFetchedShippingRate(shippingRate.toFixed(2));
      }

      localStorage.setItem("totalShippingRate", shippingRate.toFixed(2));
      localStorage.setItem("subTotal", subt);
      setSubTotal(subt);
      setTotalShippingRate(shippingRate.toFixed(2));
      await saveCartInDb(
        newCart,
        subt,
        shippingRate.toFixed(2),
        fetchedShippingRate?.toFixed(2)
      );
    }
  };

  const getShippingRatesBySeller = (data) => {
    const groupedData = groupProductsBySeller(data);
    const shippingRatesBySeller = [];

    for (const sellerId in groupedData) {
      const { shippingRate, deductedAm } = getShippingRate(
        groupedData[sellerId]
      );
      shippingRatesBySeller.push({ sellerId, shippingRate, deductedAm });
    }

    return shippingRatesBySeller;
  };

  const getShippingRate = (products) => {
    let userSurcharge =
      JSON.parse(localStorage.getItem("userInfo"))?.surCharge || {};
    let surcharge = 0;
    for(const item of products) {
      if (item.productData?.variations?.length) {
        let selectedVariant = findSelectedVariation(
          item.productData?.variations,
          item.selectedVariations
        );
        item.productData.surTotalAmount = selectedVariant.surTotalAmount;
      }
    }
    for (const item of products) {
      if (
        item.productData.productType !== "Downloadable" &&
        item.productData.seller?.shippingConfigId?.international
          ?.afoma_shipping &&
        item.productData?.seller?.country?.trim() !== userInfo?.country?.trim()
      ) {
        surcharge =
          userSurcharge[
            `${item.productData?.seller?.country?.trim()}-${userInfo?.country?.trim()}`
          ] || 0;
      }
      if (item.shippingRate > 0) {
        return {
          shippingRate: item.shippingRate,
          deductedAm: (surcharge * ((item.orderQuantiy - 1) + products.length)),
        };
      } else {
        return {
          shippingRate: undefined,
          deductedAm: (surcharge * ((item.orderQuantiy - 1) + products.length)),
        };
      }
    }
    return 0;
  };

  const findSelectedVariation = (variations, selectedVariations) => {
    return variations.find((variation) => {
      return selectedVariations.every(
        (selected) =>
          variation[selected.attributeName] === selected.attributeValue
      );
    });
  };

  const groupProductsBySeller = (data) => {
    const groupedData = {};
    for (const key in data) {
      const item = data[key];
      const sellerId = item.productData?.seller._id;
      if (!groupedData[sellerId]) {
        groupedData[sellerId] = [];
      }
      groupedData[sellerId].push(item);
    }
    return groupedData;
  };

  const addToCart = (
    productId,
    orderQuantiy,
    maxQuantity,
    basePrice,
    productData,
    remark,
    shippingOptions,
    shippingService,
    shippingRate,
    selectedVariations
  ) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUserInfo(userInfo);
    findCurrency(userInfo);
    let newCart = cart;
    let keys = Object.keys(newCart)
    if (productId in cart) {
      newCart[productId].orderQuantiy = orderQuantiy;
      newCart[productId].totalAmount = applyDiscount(
        newCart[productId],
        parseFloat(newCart[productId].basePrice) * orderQuantiy,
        keys.length
      );
      newCart[productId].shippingOptions = shippingOptions;
      newCart[productId].shippingService = shippingService;
      newCart[productId].shippingRate = shippingRate;
    } else {
      newCart[productId] = {
        orderQuantiy: orderQuantiy,
        totalAmount: applyDiscount(
          newCart[productId],
          parseFloat(orderQuantiy) * parseFloat(basePrice),
          1
        ),
        selectedVariations,
        productData,
        maxQuantity,
        basePrice,
        remark,
        shippingOptions,
        shippingService,
        shippingRate,
      };
      toast.success("Item Added!");
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const applyDiscount = (product, amount, cartLength) => {
    const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
    const sellerId =
      product &&
      product.productData &&
      product.productData.seller &&
      product.productData.seller.userId
        ? product.productData.seller.userId
        : undefined;
    if (
      (appliedCoupon &&
        appliedCoupon.couponCode &&
        appliedCoupon.discountAmount &&
        appliedCoupon.createdBy &&
        appliedCoupon.createdBy._id &&
        sellerId &&
        appliedCoupon.createdBy._id == sellerId) ||
      (appliedCoupon &&
        appliedCoupon.couponCode &&
        appliedCoupon.discountAmount &&
        appliedCoupon.createdBy &&
        appliedCoupon.createdBy.userRole &&
        appliedCoupon.createdBy.userRole === "admin") ||
        (appliedCoupon &&
        appliedCoupon.couponCode &&
        appliedCoupon.discountAmount &&
        appliedCoupon.createdBy &&
        appliedCoupon.createdBy.userRole &&
        appliedCoupon.createdBy.userRole === "affiliate")
    ) {
      if (appliedCoupon.couponType == "percentage") {
        const discountAmount = parseFloat(appliedCoupon.discountAmount);
        const discountedAmount =
          parseFloat(amount) - (parseFloat(amount) * discountAmount) / 100;
        return discountedAmount;
      }
      else{
        return  (parseFloat(amount) - (appliedCoupon.discountAmount / (cartLength ? cartLength : 1)))
      }

    }
    return parseFloat(amount);
  };

  const removeFromCart = (productId, orderQuantiy) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    let keys = Object.keys(newCart)
    if (newCart[productId] && newCart[productId].orderQuantiy > 1) {
      newCart[productId].orderQuantiy -= orderQuantiy;
      newCart[productId].totalAmount = applyDiscount(
        newCart[productId],
        parseFloat(newCart[productId].basePrice) *
          parseFloat(newCart[productId].orderQuantiy),
          keys.length
      );
      setCart(newCart);
      saveCart(newCart);
      if(!Object.keys(newCart).length){
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("oldSubTotal");
      }
    }
  };

  const clearCart = () => {
    localStorage.removeItem("selected-delivery-address");
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("oldSubTotal");
    setCart({});
    saveCart({});
  };

  const deleteFromCart = (productId) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    if (productId in cart) {
      if (
        newCart[productId] &&
        newCart[productId].productData &&
        newCart[productId].productData.couponCode
      ) {
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("oldSubTotal");
      }
      pushEventRemoveCart(newCart[productId])
      delete newCart[productId];
    }
    if(!Object.keys(newCart).length){
        localStorage.removeItem("oldSubTotal");
    }
    setCart(newCart);
    saveCart(newCart);
    toast.success("Item Removed!");
  };

  const findCurrency = (userInfo) => {
    const payPalBanCountries = ["Pakistan", "Nigeria"];
    if (payPalBanCountries.some((country) => country == userInfo.country)) {
      setCurrency("USD");
    } else {
      setCurrency(userInfo.currency);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUserInfo(userInfo);
    findCurrency(userInfo);
    const loadedCart = JSON.parse(localStorage.getItem("cart"));
    if (loadedCart) {
      setCart(loadedCart);
    }
  }, []);

  const getCartFromDB = async () => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      let storeCart = JSON.parse(localStorage.getItem("cart"));
      if (user?.userId && storeCart && Object.keys(storeCart).length == 0) {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/cart/${user?.userId}`,
          {
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          }
        );
        if (data && data?.cart) {
          localStorage.setItem("cart", JSON.stringify(data.cart));
          localStorage.setItem("subTotal", JSON.stringify(data.subTotal));
          localStorage.setItem("totalShippingRate", JSON.stringify(data.totalShippingRate));
          localStorage.setItem("fetchedShippingRate", JSON.stringify(data.fetchedShippingRate));
          changeCartPrice(false);
        }
      }
    } catch (err) {
      console.log(err)
    }
  };

  const value = {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    clearCart,
    deleteFromCart,
    subTotal,
    totalShippingRate,
    fetchedShippingRate,
    saveCart,
    userInfoStored: userInfo,
    currencyUser: currency,
    getCartFromDB,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
