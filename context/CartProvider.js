import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getGeoIP } from "@/lib/geoIP";
import { pushEventRemoveCart } from "@/utils/dataLayer";

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [itemsTotal, setItemsTotal] = useState(0);   // BEFORE discount
  const [subTotal, setSubTotal] = useState(0);       // AFTER discount
  const [totalShippingRate, setTotalShippingRate] = useState(0);
  const [fetchedShippingRate, setFetchedShippingRate] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [currency, setCurrency] = useState("");

  // prevents API sync on first load
  const isHydrating = useRef(true);

  /* ---------------------------------------
     Currency
  --------------------------------------- */

  const findCurrency = (info) => {
    const banned = ["Pakistan", "Nigeria"];
    setCurrency(banned.includes(info?.country) ? "USD" : info?.currency);
  };

  /* ---------------------------------------
     Helpers
  --------------------------------------- */

  const groupProductsBySeller = (data) => {
    const grouped = {};
    Object.keys(data).forEach((k) => {
      const sellerId = data[k]?.productData?.seller?._id;
      if (!grouped[sellerId]) grouped[sellerId] = [];
      grouped[sellerId].push(data[k]);
    });
    return grouped;
  };

  const findSelectedVariation = (vars = [], selected = []) =>
    vars.find((v) =>
      selected.every((s) => v[s.attributeName] === s.attributeValue)
    );

  /* ---------------------------------------
     Shipping
  --------------------------------------- */

  const getShippingRate = (products) => {
    const userSurcharge =
      JSON.parse(localStorage.getItem("userInfo"))?.surCharge || {};

    let shippingRate = 0;
    let surcharge = 0;

    for (const item of products) {
      if (item.productData?.variations?.length) {
        const variant = findSelectedVariation(
          item.productData.variations,
          item.selectedVariations
        );
        if (variant) {
          item.productData.surTotalAmount = variant.surTotalAmount;
        }
      }

      if (
        item.productData.productType !== "Downloadable" &&
        item.productData?.seller?.shippingConfigId?.international?.afoma_shipping &&
        item.productData?.seller?.country?.trim() !== userInfo?.country?.trim()
      ) {
        surcharge =
          userSurcharge[
            `${item.productData?.seller?.country?.trim()}-${userInfo?.country?.trim()}`
          ] || 0;
      }

      if (!shippingRate && item.shippingRate > 0) {
        shippingRate = item.shippingRate;
      }
    }

    const qtyFactor =
      products.reduce((s, p) => s + (p.orderQuantiy - 1), 0) +
      products.length;

    return {
      shippingRate,
      deductedAm: surcharge * qtyFactor,
    };
  };

  const getShippingRatesBySeller = (cart) => {
    const grouped = groupProductsBySeller(cart);
    return Object.keys(grouped).map((sellerId) => ({
      sellerId,
      ...getShippingRate(grouped[sellerId]),
    }));
  };

  /* ---------------------------------------
     Coupons
  --------------------------------------- */

  const isCouponEligible = (product, coupon) => {
    if (!coupon) return false;

    const sellerId = product?.productData?.seller?.userId;
    const createdBy = coupon?.createdBy;

    if (createdBy?._id && createdBy._id == sellerId) return true;
    if (createdBy?.userRole === "admin") return true;
    if (createdBy?.userRole === "affiliate") return true;

    return false;
  };

  const applyDiscount = (product, amount, eligibleCount) => {
    const coupon = JSON.parse(localStorage.getItem("appliedCoupon"));
    if (!coupon) return amount;
    if (!isCouponEligible(product, coupon)) return amount;

    if (coupon.couponType === "percentage") {
      return amount - (amount * Number(coupon.discountAmount)) / 100;
    }

    // fixed coupon
    return amount - Number(coupon.discountAmount) / (eligibleCount || 1);
  };

  /* ---------------------------------------
     SAVE CART (SINGLE SOURCE OF TRUTH)
  --------------------------------------- */

  const saveCart = async (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));

    const keys = Object.keys(newCart);
    const coupon = JSON.parse(localStorage.getItem("appliedCoupon"));

    let itemsTotalRaw = 0;
    let itemsTotalAfterDiscount = 0;

    const eligibleCount = keys.filter((k) =>
      isCouponEligible(newCart[k], coupon)
    ).length;

    // BEFORE discount
    keys.forEach((k) => {
      itemsTotalRaw +=
        Number(newCart[k].basePrice) *
        Number(newCart[k].orderQuantiy);
    });

    // AFTER discount
    keys.forEach((k) => {
      const base =
        Number(newCart[k].basePrice) *
        Number(newCart[k].orderQuantiy);

      itemsTotalAfterDiscount += applyDiscount(
        newCart[k],
        base,
        eligibleCount
      );
    });

    // Shipping
    let shippingRate = 0;
    let surcharge = 0;

    getShippingRatesBySeller(newCart).forEach((r) => {
      shippingRate += r.shippingRate || 0;
      surcharge += r.deductedAm || 0;
    });

    const finalSubTotal = itemsTotalAfterDiscount + surcharge;
    itemsTotalRaw = itemsTotalRaw + surcharge;

    // Currency conversion (shipping only)
    let fetchedRate = shippingRate;
    if (
      keys.length &&
      newCart[keys[0]]?.shippingOptions?.length &&
      userInfo?.currencyRate
    ) {
      fetchedRate = shippingRate / userInfo.currencyRate;
    }

    // Persist state
    setItemsTotal(itemsTotalRaw);
    setSubTotal(finalSubTotal);
    setTotalShippingRate(shippingRate.toFixed(2));
    setFetchedShippingRate(fetchedRate.toFixed(2));

    localStorage.setItem("itemsTotal", itemsTotalRaw.toFixed(2));
    localStorage.setItem("subTotal", finalSubTotal.toFixed(2));
    localStorage.setItem("totalShippingRate", shippingRate.toFixed(2));
    localStorage.setItem("fetchedShippingRate", fetchedRate.toFixed(2));

    if (coupon && itemsTotalRaw > itemsTotalAfterDiscount) {
      localStorage.setItem("oldSubTotal", itemsTotalRaw.toFixed(2));
    } else {
      localStorage.removeItem("oldSubTotal");
    }

    // 🔒 skip backend sync during hydration
    if (isHydrating.current) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/add-cart`,
        {
          user_id: user.userId,
          cart: newCart,
          subTotal: finalSubTotal,
          totalShippingRate: shippingRate.toFixed(2),
          fetchedShippingRate: fetchedRate.toFixed(2),
        },
        { headers: { "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm" } }
      );
    }
  };

  /* ---------------------------------------
     Cart Actions
  --------------------------------------- */

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
    const info = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUserInfo(info);
    findCurrency(info);

    setCart((prev) => {
      const newCart = { ...prev };

      if (productId in newCart) {
        newCart[productId].orderQuantiy = orderQuantiy;
        newCart[productId].shippingRate = shippingRate;
      } else {
        newCart[productId] = {
          orderQuantiy,
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

      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId, qty) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (!newCart[productId]) return prev;

      if (newCart[productId].orderQuantiy > 1) {
        newCart[productId].orderQuantiy -= qty;
      } else {
        delete newCart[productId];
      }

      saveCart(newCart);
      return newCart;
    });
  };

  const deleteFromCart = (productId) => {
    setCart((prev) => {
      if (!prev[productId]) return prev;
      pushEventRemoveCart(prev[productId]);
      const newCart = { ...prev };
      delete newCart[productId];
      saveCart(newCart);
      toast.success("Item Removed!");
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("appliedCoupon");
    saveCart({});
  };

  /* ---------------------------------------
     Init
  --------------------------------------- */

  useEffect(() => {
    getGeoIP();
    const info = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUserInfo(info);
    findCurrency(info);

    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) setCart(storedCart);

    // hydration complete
    setTimeout(() => {
      isHydrating.current = false;
    }, 0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        itemsTotal,
        subTotal,
        totalShippingRate,
        fetchedShippingRate,
        currencyUser: currency,
        userInfoStored: userInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
