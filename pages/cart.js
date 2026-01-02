import Footer2 from "@/components/Footer2";
import Miniheader from "@/components/Miniheader";
import { faAngleRight, faEye } from "@fortawesome/pro-light-svg-icons";
import {
  faAngleDown,
  faMinus,
  faPlus,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Footer from "@/components/Footer";
import FacebookPixel from "@/components/FacebookPixel";
import GuestFormModal from "@/components/ContinueAsGuestModal";
import SignInPromptModal from "@/components/signInPromptModal";
import { getRecaptchaToken } from "@/utils/recaptcha";
import { reCaptchaVerification, sendOTP, verifyOTP } from "@/lib/api";
import countryData from "country-data";
import { pushEventBeginCheckout, pushEventViewToCart } from "@/utils/dataLayer";
import { useCart } from "@/context/CartProvider";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Cart = ({

  setCart,
  clearCart,
  setSubTotal,
  saveCart,
}) => {
  const {cart, addToCart, removeFromCart, deleteFromCart, subTotal, totalShippingRate, fetchedShippingRate, userInfoStored} = useCart();
  const [loading, setLoading] = useState(true);
  const [rateOptionsError, setRateOptionsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updatedCart, setUpdatedCart] = useState(undefined);
  const [apiError, setApiError] = useState(undefined);
  const [deductedTotal, setDeductedTotal] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(undefined);
  // const [userInfoStored, setUserInfoStored] = useState({});
  const [isUserInfo, setIsUserInfo] = useState(false);
  const [openGuestForm, setOpenGuestForm] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = useRef([]);
  const [user, setUser] = useState("");

  const cartUpdatedInternally = useRef(false);

  const formatPrice = (price) => {
    const numericPrice = Number(price); // Ensure it's a number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  const getRateOptions2 = async (carts) => {
    let isError = false;
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
      setIsUserInfo(false);
      setIsLoggedIn(true);
    }
    const selectedAddress = JSON.parse(
      localStorage.getItem("selected-delivery-address")
    );
    let userInfo = {};

    if (selectedAddress && selectedAddress._id) {
      userInfo = {
        firstName: selectedAddress?.firstName,
        lastName: selectedAddress?.lastName,
        fname: selectedAddress?.firstName,
        lname: selectedAddress?.lastName,
        country: selectedAddress?.country,
        state: selectedAddress?.state,
        countryCode: selectedAddress?.countryCode,
        stateCode: selectedAddress?.stateCode,
        city: selectedAddress?.city,
        streetAddress: selectedAddress?.streetAddress,
        zipcode: selectedAddress?.ZipCode,
        ZipCode: selectedAddress?.ZipCode,
        email: user?.email,
        company: user?.company,
        moNumber: user?.phone,
        information: "",
        shippingMethod: "Freightcom",
        accesstoken: user?.accessToken,
      };
    } else {
      userInfo = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        fname: user?.firstName,
        lname: user?.lastName,
        email: user?.email,
        company: user?.company,
        country: user?.country,
        state: user?.state,
        countryCode: user?.countryCode,
        stateCode: user?.stateCode,
        city: user?.city,
        streetAddress: user?.streetAddress,
        zipcode: user?.ZipCode,
        moNumber: user?.phone,
        information: "",
        shippingMethod: "Freightcom",
        accesstoken: user?.accessToken,
      };
    }

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/getRate`,
      data: {
        cart: carts,
        userInfo: userInfo,
        userCountry: userInfoStored.country,
      },
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    try {
      let response = {};
      try {
        response = await axios.request(options);
      } catch (error) {
        isError = true;
        setRateOptionsError(true);
      }
      if (!response?.data?.rateObj?.length) {
        setRateOptionsError(true);
      }
      let selectOptions = response?.data?.rateObj.filter(
        (rate) => rate && rate.service_id
      );

      if (selectOptions?.length > 0) {
        selectOptions = selectOptions.map((opt) => {
          opt.rate = parseFloat(
            (opt.rate * parseFloat(userInfoStored?.currencyRate || 1)).toFixed(
              2
            )
          );
          opt.currency = userInfoStored?.currency
            ? userInfoStored?.currency
            : "CAD";
          return opt; // Ensure the modified object is returned
        });
      }

      carts.map((groupCartItem) => {
        let defaultShippingOption = undefined;
        let cartItem = groupCartItem.productData._id;

        if (
          cartItem &&
          groupCartItem.productData?.productType === "Customizable" &&
          groupCartItem.selectedVariations &&
          Array.isArray(groupCartItem.selectedVariations) &&
          groupCartItem.selectedVariations.length
        ) {
          const selectedVariant = groupCartItem.selectedVariations
            .map((variation) => variation.attributeValue.replace(/\s+/g, ""))
            .join("_");
          if (selectedVariant) {
            cartItem = `${cartItem}_${selectedVariant}`;
          }
        }

        const user = JSON.parse(localStorage.getItem("user"));
        let rate = -1;

        if (groupCartItem?.productData?.productType === "Downloadable") {
          rate = -1;
        } else if (
          selectOptions &&
          Array.isArray(selectOptions) &&
          selectOptions.length
        ) {
          defaultShippingOption = selectOptions[0];
          rate = parseFloat(defaultShippingOption.rate);
        }
        addToCart(
          cartItem,
          cart[cartItem]?.orderQuantiy,
          cart[cartItem]?.maxQuantity,
          cart[cartItem]?.basePrice,
          cart[cartItem]?.productData,
          cart[cartItem]?.remark,
          rate === -1
            ? undefined
            : selectOptions && selectOptions.length
            ? selectOptions
            : undefined,
          rate === -1 && !isError
            ? undefined
            : rate === -1 && isError
            ? { error: true }
            : {
                transit_time_days: defaultShippingOption?.transit_time_days,
                value: `${defaultShippingOption?.service_id}`,
                label: `${defaultShippingOption?.rate?.toFixed(2) !== "0.00" ? defaultShippingOption?.currency: ""} 
                ${defaultShippingOption?.rate?.toFixed(2) !== "0.00" ? defaultShippingOption?.rate?.toFixed(2) : "Free Shipping"} (${
                  defaultShippingOption?.carrier_name
                }${
                  defaultShippingOption?.service_name
                    ? ` - ${defaultShippingOption?.service_name}`
                    : ""
                }${
                  defaultShippingOption?.carrier_name == "Flat Rate Shipping" ||
                  defaultShippingOption?.carrier_name == "Hand Delivery" ||
                  defaultShippingOption?.carrier_name == "Free Hand Delivery"
                    ? ` - Non-Trackable`
                    : ` - Trackable`
                })`,
                deductedAmount: defaultShippingOption?.deductedAmount
                  ? Number(defaultShippingOption?.deductedAmount)
                  : 0,
                carrier_name: defaultShippingOption?.carrier_name,
              },
          rate,
          cart[cartItem]?.selectedVariations
        );
      });

      const groupedBySeller = formatCartGrouping();
      setUpdatedCart(groupedBySeller);
      cartUpdatedInternally.current = true;
    } catch (error) {
      setRateOptionsError(true);
      setLoading(false);
      throw error; // Rethrow the error
    }
  };

  const loadCartOnRefresh = (carts) => {
    carts.map((groupCartItem) => {
      let cartItem = groupCartItem.productData._id;

      if (
        cartItem &&
        groupCartItem.productData?.productType === "Customizable" &&
        groupCartItem.selectedVariations &&
        Array.isArray(groupCartItem.selectedVariations) &&
        groupCartItem.selectedVariations.length
      ) {
        const selectedVariant = groupCartItem.selectedVariations
          .map((variation) => variation.attributeValue.replace(/\s+/g, ""))
          .join("_");
        if (selectedVariant) {
          cartItem = `${cartItem}_${selectedVariant}`;
        }
      }

      let rate = -1;

      if (groupCartItem?.productData?.productType === "Downloadable") {
        rate = -1;
      } else {
        rate = 0
      }
      addToCart(
        cartItem,
        cart[cartItem]?.orderQuantiy,
        cart[cartItem]?.maxQuantity,
        cart[cartItem]?.basePrice,
        cart[cartItem]?.productData,
        cart[cartItem]?.remark,
        undefined,
        rate,
        cart[cartItem]?.selectedVariations
      );
    });
  }

  const formatCartGrouping = () => {
    const groupedBySeller = Object.values(cart).reduce((acc, order) => {
      if (order.productData) {
        const seller = order.productData.seller;
        // Check if the seller is already in the accumulator
        const sellerIndex = acc.findIndex(
          (item) => item.sellerId === seller._id
        );
        if (sellerIndex === -1) {
          // If not, create a new seller entry
          acc.push({
            sellerId: seller._id,
            sellerName: `${seller.firstName} ${seller.lastName}`,
            storeTitle: `${seller.storeTitle}`,
            storeSlug: `${seller.storeSlug}`,
            sellerSlug: `${seller.slug}`,
            cart: [],
            shippingOptions: [],
            transitDays: undefined,
          });
        }
        // if(userInfoStored.currency && !isNaN(parseFloat(order.totalAmount)) && !isNaN(parseFloat(userInfoStored.currencyRate))){
        //   order.productData.surTotalAmount = parseFloat((parseFloat(order.totalAmount) * parseFloat(userInfoStored.currencyRate)).toFixed(2))
        // }
        // Add the product to the corresponding seller's cart
        acc[sellerIndex === -1 ? acc.length - 1 : sellerIndex].cart.push({
          orderQuantiy: order.orderQuantiy,
          totalAmount: order.totalAmount,
          productData: order.productData,
          basePrice: order.basePrice,
          maxQuantity: order.maxQuantity,
          remark: order.remark,
          shippingOptions: order.shippingOptions ? order.shippingOptions : [],
          shippingRate: order.shippingRate,
          shippingService: order.shippingService,
          totalAmount: order.totalAmount,
          selectedVariations: order.selectedVariations,
        });
        if (acc && acc.length) {
          acc.forEach((accItem, accItemIndex) => {
            const found = accItem.cart.filter(
              (c) => c.shippingOptions && c.shippingOptions.length > 0
            );
            if (found && found.length) {
              acc[accItemIndex].shippingOptions = found[0].shippingOptions;
              acc[accItemIndex].shippingService = found[0].shippingService;
            }
          });
        }
        return acc;
      }
    }, []);
    return groupedBySeller;
  };

  const formatCartGroupingGetRate = useCallback(async (isCallingGetRate) => {
    setApiError(undefined);
    setRateOptionsError(false);
    const groupedBySeller = formatCartGrouping();

    if (groupedBySeller && groupedBySeller.length && isCallingGetRate) {
      setLoading(true);
      try {
        for (const group of groupedBySeller) {
          try {
            await getRateOptions2(group.cart);
          } catch (error) {
            // setApiError(
            //   "Failed to fetch rate options. Please try again later."
            // );
            setRateOptionsError(true);
            continue; // Exit loop on the first error
          }
        }
      } catch (error) {
        localStorage.removeItem("appliedCoupon");
        setApiError("An unexpected error occurred.");
      } finally {
        setLoading(false); // Ensure loading is stopped after all attempts
      }
    } else {
      for (const group of groupedBySeller) {
        loadCartOnRefresh(group.cart);
      }
      setLoading(false);
      setUpdatedCart(groupedBySeller);
    }
  });

  useEffect(() => {
    if (subTotal > 0) {
      const shipping = parseFloat(fetchedShippingRate ?? totalShippingRate);
      const subtotal = parseFloat(subTotal);

      // Stripe fee = (subtotal + shipping) * 0.03 + 0.30
      const stripeFee = (subtotal + shipping) * 0.03 + 0.30;

      const total = subtotal + shipping + stripeFee;
      console.log(total)
      pushEventViewToCart(cart, total)
    }
  }, [subTotal])

  const addToCart2 = (
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
    let newCart = JSON.parse(JSON.stringify(cart));
    if (productId in cart) {
      newCart[productId].orderQuantiy = orderQuantiy;
    } else {
      newCart[productId] = {
        orderQuantiy: orderQuantiy,
        totalAmount: orderQuantiy * basePrice,
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
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setIsUserInfo(false);
    if(userData && userData.userId) setUser(userData)
    const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
    if (appliedCoupon && appliedCoupon.couponCode) {
      setAppliedCoupon(appliedCoupon);
      setCouponApplied(true);
    } else {
      setAppliedCoupon(undefined);
      setCouponApplied(false);
    }

    if (cartUpdatedInternally.current) {
      cartUpdatedInternally.current = false;
      return; // don't call fetchData
    }
    fetchData()
    const coupon = JSON.parse(localStorage.getItem("applyCoupon"))
    if(coupon) applyCode({code: coupon.couponCode})
    localStorage.removeItem("applyCoupon")
  }, [cart]);

  
  const fetchData = useCallback(async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if(userData) {
      setIsUserInfo(false);
      setIsLoggedIn(true);
    }
    if (userData) {
      try {
        formatCartGroupingGetRate(true);
        // const response = await axios
        //   .create({
        //     headers: {
        //       "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        //       Authorization: `Bearer ${userData.accessToken}`,
        //     },
        //   })
        //   .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData.userId}`);
        // if (response && response.data) {
          
        // }
      } catch (error) {
        // setIsLoggedIn(false);
        console.error("Error fetching data:", error);
      }
    } else {
      // setIsLoggedIn(false);
      setLoading(true);
      formatCartGroupingGetRate(false);
    }
  });

  useEffect(() => {
    // Set default shipping option for each cart item if not already set
    Object.keys(cart).forEach((k) => {
      if (!cart?.shippingService && cart?.shippingOptions?.length > 0) {
        const defaultShippingOption = cart?.shippingOptions[0];
        addToCart(
          k,
          cart?.orderQuantiy,
          cart?.maxQuantity,
          cart?.basePrice,
          cart?.productData,
          cart?.remark,
          cart?.shippingOptions,
          {
            transit_time_days: defaultShippingOption.transit_time_days,
            value: `${defaultShippingOption.service_id}`,
            label: `${defaultShippingOption.currency} ${defaultShippingOption.rate} (${defaultShippingOption.carrier_name} - ${defaultShippingOption.service_name})`,
            carrier_name: defaultShippingOption.carrier_name,
          },
          defaultShippingOption.rate,
          cart?.selectedVariations
        );
      }
    });
  }, [cart, addToCart]);

  const validationSchema = Yup.object({
    code: Yup.string().required("Code is required"),
  });

  const initialValues = {
    code: "",
  };

  const applyCode = async (values) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (values && values.code && user) {
      try {
        const data = {
          email: user.email,
          cart: cart,
          couponCode: values.code,
        };
        const options = {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/coupon/apply-coupon`,
          data: data,
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        };
        const response = await axios.request(options);
        if (
          response &&
          response.status === 200 &&
          response.data &&
          response.data.updatedOrder &&
          response.data.updatedOrder.clonedCart &&
          response.data.updatedOrder.coupon
        ) {
          let updatedCart = updateOrderData(response.data.updatedOrder.clonedCart);
          const subTotal = localStorage.getItem("subTotal")
          localStorage.setItem("oldSubTotal", subTotal)
          cartUpdatedInternally.current = false;
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          setCart(updatedCart);
          cartUpdatedInternally.current = false;
          localStorage.setItem(
            "appliedCoupon",
            JSON.stringify(response.data.updatedOrder.coupon)
          );
          setAppliedCoupon(response.data.updatedOrder.coupon);
          setCouponApplied(true);
          toast.success(response.data.message);
          // fetchData()
        }
      } catch (e) {
        localStorage.removeItem("appliedCoupon");
        if (e && e.response && e.response.data && e.response.data.message) {
          toast.error(e.response.data.message);
        }
      } finally {
      }
    }
  };

  function updateOrderData(orderData) {
    for (const key in orderData) {
      if (orderData.hasOwnProperty(key)) {
        orderData[key].totalAmount = orderData[key].totalAmount
          ? orderData[key].totalAmount
          : parseFloat(orderData[key].basePrice);
      }
    }
    return orderData;
  }

  const getProductImage = (productDetail) => {
    if (
      productDetail &&
      productDetail.productData &&
      productDetail.productData.images &&
      productDetail.productData.images.length
    ) {
      const variations = productDetail.productData.variations;
      if (
        productDetail.productData.productType === "Customizable" &&
        variations &&
        variations.length &&
        productDetail.selectedVariations &&
        productDetail.selectedVariations.length
      ) {
        const selectedVariation = productDetail.selectedVariations[0];
        const find = variations.find(
          (v) =>
            v[selectedVariation.attributeName] ===
            selectedVariation.attributeValue
        );
        if (find && find.image) {
          return find.image;
        }
        return productDetail.productData.images[0].imageUrl;
      }
      return productDetail.productData.images[0].imageUrl;
    }
  };

  const handleCheckout = () => {
    setIsUserInfo(true);
  }

  const handleContinue = () => {
    setIsUserInfo(false);
    setOpenGuestForm(true);
    setShowGuestForm(true);
  }

  const handleGuestSubmit = async (values, { setSubmitting }) => {
    let user = {
      name: values.name,
      email: values.email,
      country: values.country,
      streetAddress: values.streetAddress,
      state: values.state,
      ZipCode: values.ZipCode,
      city: values.city,
      countryCode: fetchCountryCode(values.country),
      phone: values?.phone,
    }
    const token = await getRecaptchaToken(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
    const result = await reCaptchaVerification(token)
    if (result?.data?.success && result?.data?.score > 0.5) {
      localStorage.setItem("user", JSON.stringify(user));
      setSubmitting(false);
      setShowGuestForm(false);
      setOpenGuestForm(false);
      formatCartGroupingGetRate(true);
      createGuestUser(user)
      //submit data in database
    } else {
      // send OTP and Open popup to verify
      const result = await sendOTP(user)
      if (result.success) {
        setOtpToken(result.otpToken)
        setSubmitting(false);
        setShowGuestForm(false);
        setOpenGuestForm(false);
        formatCartGroupingGetRate(false);
        setOtpError(false);
      }
    }
  };

  const fetchCountryCode = (countryName) => {
    const countryInfo = countryData.countries.all.find(
      (c) => c.name === countryName
    );
    return countryInfo ? countryInfo.alpha2 : ""; // Use alpha2 for the country code
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5 && value) {
      otpRefs.current[index + 1]?.focus();
    }

    // ✅ Check if all fields are filled
    if (newOtp.every(d => d?.length === 1)) {
      handleVerifyOtp(newOtp);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const updatedOtp = [...otp];

      if (updatedOtp[index]) {
        // Clear current value
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      } else if (index > 0) {
        // Move to previous and clear it too
        otpRefs.current[index - 1]?.focus();
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
      }
    }
  };

  const handleVerifyOtp = async (newOtp = null) => {
    const otpArray = Array.isArray(newOtp) ? newOtp : Array.isArray(otp) ? otp : [];
    const finalOtp = otpArray.join("");
  
    if (finalOtp.length !== 6) {
      setOtpError(true);
      return;
    }
  
    try {
      const result = await verifyOTP(finalOtp, otpToken);
  
      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setOtpToken("");
        setShowGuestForm(false);
        setOpenGuestForm(false);
        formatCartGroupingGetRate(true);
        createGuestUser(result.user)
        //save data in database
      } else {
        setOtpError(true);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setOtpError(true);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    // Remove non-digits and limit to 6 digits
    const digits = pasteData.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 0) return;

    const newOtp = digits.split("");
    setOtp(newOtp);

    // Fill inputs visually
    newOtp.forEach((digit, idx) => {
      if (otpRefs.current[idx]) {
        otpRefs.current[idx].value = digit;
      }
    });

    // Move focus to next empty input (or last)
    const nextEmpty = newOtp.length < 6 ? newOtp.length : 5;
    otpRefs.current[nextEmpty]?.focus();

    // Auto verify if all 6 digits were pasted
    if (digits.length === 6) {
      handleVerifyOtp(newOtp);
    }
  };


  const onClose = () => {
    setOtpToken(null); // Hides the modal
    setOtp(["", "", "", "", "", ""]); // Optional: Clear the OTP fields too
    setOtpError(false); 
  };

  const createGuestUser = async (user) => {
    try {
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/guest-user`,
        data: {
          name: user?.name,
          email: user.email,
          data: user
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };
      await axios.request(options);
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="Join AFOMA Marketplace - a unique platform for artists and artisans to sell crafts globally. Be first for exclusive deals and promotions."
        ></meta>
      </Head>
      <section>
        <Miniheader />
      </section>

      <section>
            <div className="max-w-screen-xl mx-auto px-4 pt-6">
              <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
                <div className="hover:text-primary flex items-center gap-1.5">
                  <Link href="/">
                    <span>Home</span>
                  </Link>
                  <FontAwesomeIcon icon={faAngleRight} size="sm" />
                </div>
                <span className="text-primary ">Cart</span>
              </div>
            </div>
          </section>

          <section>
            <div className="max-w-screen-xl mx-auto px-4 py-8 mb-[100px]">
              <h1
                className={`text-4xl xl:text-5xl text-center text-blue-950 xl:tracking-[-0.9px] mb-10 noto-font`}
              >
                Shopping Cart
              </h1>
              {subTotal ? <FacebookPixel data={{ cart: cart, isProduct: false, cartValue: subTotal, shippingValue: totalShippingRate }} /> : ""}
              {updatedCart && updatedCart.length ? (
                <div
                  key={updatedCart.sellerId + updatedCart.sellerName}
                  className="flex flex-col gap-6 lg:flex-row items-start"
                >
                  <div className="w-full">
                    {!loading ? (
                      <>
                        {updatedCart.map((sellerCart) => (
                          <div
                            className="bg-orange-100 shadow-sm rounded-md px-[16px] py-[20px] mb-6"
                            key={sellerCart.id + sellerCart.storeTitle}
                          >
                            <>
                              <h4 className="text-md capitalize text-primary xl:tracking-[-0.9px] mb-[10px]">
                                <Link href={`/shop/${sellerCart.storeSlug}`}>
                                  {sellerCart.storeTitle}{" "}
                                </Link>
                                {/* <Link href={`/seller?slug=${sellerCart.sellerSlug}`}>
                            {" "}
                            {sellerCart.storeTitle}{" "}
                          </Link> */}
                              </h4>
                              <div className="products">
                                {sellerCart.cart.map(
                                  (groupCartItem, groupCartItemIndex) => (
                                    <div
                                      className={`product ${groupCartItemIndex + 1 ===
                                          sellerCart.cart.length
                                          ? ""
                                          : " pb-4 mb-4 border-b border-slate-600/30 "
                                        }`}
                                      key={
                                        groupCartItem.productData._id +
                                        groupCartItemIndex
                                      }
                                    >
                                      <div className="flex sm:flex-row flex-col sm:gap-6 gap-4">
                                        <div className="flex flex-col justify-center sm:justify-start items-center">
                                          <img
                                            src={getProductImage(groupCartItem)}
                                            alt={
                                              groupCartItem.productData.images[0]
                                                ?.fileName
                                            }
                                            className="sm:h-[100px] sm:w-[120px] h-[250px] w-[260px] object-cover rounded-md"
                                          />
                                          <div className="flex justify-center gap-4 items-center mt-2">
                                            <button
                                              onClick={() => {
                                                let cartUniqueId =
                                                  groupCartItem.productData._id;
                                                if (
                                                  groupCartItem &&
                                                  groupCartItem.productData &&
                                                  groupCartItem.productData
                                                    .productType ===
                                                  "Customizable" &&
                                                  groupCartItem.selectedVariations &&
                                                  Array.isArray(
                                                    groupCartItem.selectedVariations
                                                  ) &&
                                                  groupCartItem.selectedVariations
                                                    .length
                                                ) {
                                                  const selectedVariants =
                                                    groupCartItem.selectedVariations
                                                      .map((variation) =>
                                                        variation.attributeValue.replace(
                                                          /\s+/g,
                                                          ""
                                                        )
                                                      )
                                                      .join("_");
                                                  if (selectedVariants) {
                                                    cartUniqueId = `${cartUniqueId}_${selectedVariants}`;
                                                  }
                                                }
                                                deleteFromCart(cartUniqueId);
                                                setDeductedTotal(
                                                  deductedTotal -
                                                  groupCartItem?.shippingService
                                                    ?.deductedAmount || 0
                                                );
                                                cartUpdatedInternally.current = false
                                              }}
                                              className="flex items-center gap-1 group text-slate-600 hover:text-primary"
                                            >
                                              <svg
                                                id="Remove_icon"
                                                data-name="Remove icon"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="10.601"
                                                height="13.047"
                                                viewBox="0 0 10.601 13.047"
                                                className="fill-slate-600 group-hover:fill-primary"
                                              >
                                                <path
                                                  id="Path_3135"
                                                  data-name="Path 3135"
                                                  d="M57.581,1.631H55.339V1.223A1.225,1.225,0,0,0,54.116,0H52.485a1.225,1.225,0,0,0-1.223,1.223v.408H49.019A1.02,1.02,0,0,0,48,2.65V4.077a.408.408,0,0,0,.408.408h.223l.352,7.4A1.222,1.222,0,0,0,50.2,13.047H56.4a1.222,1.222,0,0,0,1.222-1.165l.352-7.4h.223a.408.408,0,0,0,.408-.408V2.65A1.02,1.02,0,0,0,57.581,1.631Zm-5.5-.408a.408.408,0,0,1,.408-.408h1.631a.408.408,0,0,1,.408.408v.408H52.077ZM48.815,2.65a.2.2,0,0,1,.2-.2h8.562a.2.2,0,0,1,.2.2V3.67h-8.97ZM56.8,11.843a.407.407,0,0,1-.407.388H50.2a.407.407,0,0,1-.407-.388l-.35-7.358h7.707Z"
                                                  transform="translate(-48)"
                                                />
                                                <path
                                                  id="Path_3136"
                                                  data-name="Path 3136"
                                                  d="M240.408,214.116a.408.408,0,0,0,.408-.408v-5.3a.408.408,0,1,0-.815,0v5.3A.408.408,0,0,0,240.408,214.116Z"
                                                  transform="translate(-235.107 -202.7)"
                                                />
                                                <path
                                                  id="Path_3137"
                                                  data-name="Path 3137"
                                                  d="M320.408,214.116a.408.408,0,0,0,.408-.408v-5.3a.408.408,0,1,0-.815,0v5.3A.408.408,0,0,0,320.408,214.116Z"
                                                  transform="translate(-313.069 -202.7)"
                                                />
                                                <path
                                                  id="Path_3138"
                                                  data-name="Path 3138"
                                                  d="M160.408,214.116a.408.408,0,0,0,.408-.408v-5.3a.408.408,0,0,0-.815,0v5.3A.408.408,0,0,0,160.408,214.116Z"
                                                  transform="translate(-157.146 -202.7)"
                                                />
                                              </svg>
                                              <span className="text-[10px]">
                                                Remove
                                              </span>
                                            </button>
                                            <Link
                                              href={`category/${groupCartItem?.productData?.Category?.slug}/${groupCartItem?.productData?.SubCategory?.slug}${groupCartItem?.productData?.childCategory ? "/" + groupCartItem?.productData?.childCategory?.slug: ""}/${groupCartItem?.productData?.slug}`}
                                            >
                                              <div className="flex items-center gap-1 group text-slate-600 hover:text-primary">
                                                <FontAwesomeIcon
                                                  icon={faEye}
                                                  className="text-slate-600 group-hover:text-primary w-4"
                                                />

                                                <span className="text-[10px]">
                                                  View
                                                </span>
                                              </div>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="flex-grow">
                                          <div className="sm:flex justify-between gap-12">
                                            <div className="flex-grow">
                                              <div className="flex justify-between items-center gap-10">
                                                <h6 className="text-blue-950 text-base xl:text-md mb-1.5 font-semibold">
                                                  {
                                                    groupCartItem.productData
                                                      .productName
                                                  }
                                                </h6>
                                                <h6 className="text-primary font-semibold block sm:hidden">
                                                  {userInfoStored?.currency &&
                                                    userInfoStored?.currencyRate
                                                    ? userInfoStored?.currency
                                                    : "CA$"}
                                                  {""}
                                                  {groupCartItem?.totalAmount
                                                    ? formatPrice(
                                                      parseFloat(
                                                        groupCartItem?.productData
                                                          ?.surTotalAmount
                                                          ? groupCartItem
                                                            ?.productData
                                                            ?.surTotalAmount * groupCartItem.orderQuantiy
                                                          : groupCartItem?.totalAmount
                                                      ).toFixed(2)
                                                    )
                                                    : "-"}
                                                </h6>
                                              </div>

                                              {groupCartItem.productData
                                                .productType === "Downloadable" ? (
                                                <div className="mb-1 px-[8px] py-[2px] text-[11px] bg-primary rounded-full w-[max-content] text-white">
                                                  Downloadable
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {((groupCartItem.productData?.seller?.country.toLowerCase() ==
                                                userInfoStored?.country?.toLowerCase() &&
                                                groupCartItem.productData?.seller
                                                  ?.shippingConfigId?.domestic
                                                  ?.flat_rate &&
                                                groupCartItem.productData?.seller
                                                  ?.shippingConfigId?.domestic
                                                  ?.flat_rate_options
                                                  ?.free_shipping) ||
                                                (groupCartItem.productData?.seller?.country.toLowerCase() !=
                                                  userInfoStored?.country?.toLowerCase() &&
                                                  groupCartItem.productData?.seller
                                                    ?.shippingConfigId
                                                    ?.international?.flat_rate &&
                                                  groupCartItem.productData?.seller
                                                    ?.shippingConfigId
                                                    ?.international
                                                    ?.flat_rate_options
                                                    ?.free_shipping) ||
                                                (groupCartItem.productData
                                                  ?.freeDelivery &&
                                                  groupCartItem.productData?.seller?.country.toLowerCase() ==
                                                  userInfoStored?.country?.toLowerCase())) &&
                                                groupCartItem.productData
                                                  .productType !== "Downloadable" ? (
                                                <div className="mb-1.5 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
                                                  Free Shipping
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              <div className="sm:flex items-center">
                                                {groupCartItem.size && (
                                                  <p className="text-blue-950 text-sm mb-1.5 sm:mr-4">
                                                    <span className="font-semibold">
                                                      Size:{" "}
                                                    </span>
                                                    <span className="text-sm">
                                                      {groupCartItem.size}
                                                    </span>
                                                  </p>
                                                )}
                                                {groupCartItem?.selectedVariations && (
                                                  <div className="mb-1.5 sm:mr-4">
                                                    {groupCartItem.selectedVariations?.map(
                                                      (variation, index) => (
                                                        <div key={index}>
                                                          <p className="text-blue-950 text-sm">
                                                            <span className="font-semibold capitalize">
                                                              {
                                                                variation.attributeName
                                                              }
                                                              :{" "}
                                                            </span>
                                                            <span className="">
                                                              {
                                                                variation.attributeValue
                                                              }
                                                            </span>
                                                          </p>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                                {groupCartItem?.remark && (
                                                  <div className="mb-1.5">
                                                    <p className="text-blue-950 text-sm">
                                                      <span className="font-semibold">
                                                        Remarks:{" "}
                                                      </span>
                                                      <span className="">
                                                        {groupCartItem.remark}
                                                      </span>
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                              {groupCartItem?.productData
                                                ?.productType == "Downloadable" && (
                                                  <div className="md:w-[100px] my-2">
                                                    <div className="w-24 bg-orange-50 flex items-center justify-between rounded-sm">
                                                      <button
                                                        className="py-1.5 px-2.5 disabled:cursor-not-allowed flex"
                                                        disabled
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faMinus}
                                                          className="text-gray-950 h-2 w-2"
                                                        />
                                                      </button>
                                                      <div className="w-10 flex-shrink-0 bg-white py-1.5 px-2.5">
                                                        <p className="text-gray-950 text-sm text-center">
                                                          {
                                                            groupCartItem?.orderQuantiy
                                                          }
                                                        </p>
                                                      </div>
                                                      <button
                                                        className="py-1.5 px-2.5 disabled:cursor-not-allowed flex"
                                                        disabled
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faPlus}
                                                          className="text-gray-950 h-2 w-2"
                                                        />
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}

                                              {groupCartItem?.productData
                                                ?.productType !==
                                                "Downloadable" && (
                                                  <div className="md:w-[100px] my-2">
                                                    <div className="w-24 bg-orange-50 flex items-center justify-between rounded-sm">
                                                      <button
                                                        className="py-1.5 px-2.5 disabled:cursor-not-allowed flex"
                                                        onClick={() => {
                                                          let productId =
                                                            groupCartItem.productData
                                                              ._id;
                                                          if (
                                                            groupCartItem &&
                                                            groupCartItem.productData &&
                                                            groupCartItem.productData
                                                              .productType ===
                                                            "Customizable" &&
                                                            groupCartItem.selectedVariations &&
                                                            Array.isArray(
                                                              groupCartItem.selectedVariations
                                                            ) &&
                                                            groupCartItem
                                                              .selectedVariations
                                                              .length
                                                          ) {
                                                            const selectedVariant =
                                                              groupCartItem.selectedVariations
                                                                .map((variation) =>
                                                                  variation.attributeValue.replace(
                                                                    /\s+/g,
                                                                    ""
                                                                  )
                                                                )
                                                                .join("_");

                                                            if (selectedVariant) {
                                                              productId = `${productId}_${selectedVariant}`;
                                                            }
                                                          }
                                                          removeFromCart(
                                                            productId,
                                                            1
                                                          );
                                                          cartUpdatedInternally.current = false
                                                        }}
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faMinus}
                                                          className="text-gray-950 h-2 w-2"
                                                        />
                                                      </button>
                                                      <div className="w-10 flex-shrink-0 bg-white py-1.5 px-2.5">
                                                        <p className="text-gray-950 text-sm text-center">
                                                          {
                                                            groupCartItem?.orderQuantiy
                                                          }
                                                        </p>
                                                      </div>
                                                      <button
                                                        className="py-1.5 px-2.5 disabled:cursor-not-allowed flex"
                                                        disabled={
                                                          groupCartItem?.orderQuantiy ==
                                                            groupCartItem?.maxQuantity
                                                            ? true
                                                            : false
                                                        }
                                                        onClick={() => {
                                                          let productId =
                                                            groupCartItem.productData
                                                              ._id;
                                                          if (
                                                            groupCartItem &&
                                                            groupCartItem.productData &&
                                                            groupCartItem.productData
                                                              .productType ===
                                                            "Customizable" &&
                                                            groupCartItem.selectedVariations &&
                                                            Array.isArray(
                                                              groupCartItem.selectedVariations
                                                            ) &&
                                                            groupCartItem
                                                              .selectedVariations
                                                              .length
                                                          ) {
                                                            const selectedVariant =
                                                              groupCartItem.selectedVariations
                                                                .map((variation) =>
                                                                  variation.attributeValue.replace(
                                                                    /\s+/g,
                                                                    ""
                                                                  )
                                                                )
                                                                .join("_");
                                                            if (selectedVariant) {
                                                              productId = `${productId}_${selectedVariant}`;
                                                            }
                                                          }
                                                          addToCart2(
                                                            productId,
                                                            groupCartItem?.orderQuantiy +
                                                            1,
                                                            groupCartItem?.maxQuantity,
                                                            groupCartItem?.basePrice,
                                                            groupCartItem?.productData,
                                                            groupCartItem?.remark,
                                                            groupCartItem?.shippingOptions,
                                                            groupCartItem?.shippingService,
                                                            groupCartItem?.shippingRate,
                                                            groupCartItem?.selectedVariations
                                                          );
                                                          cartUpdatedInternally.current = false
                                                        }}
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faPlus}
                                                          className="text-gray-950 h-2 w-2"
                                                        />
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}

                                              {sellerCart.cart.length &&
                                                groupCartItemIndex + 1 ===
                                                sellerCart.cart.length &&
                                                (groupCartItem.shippingOptions
                                                  ?.length ||
                                                  sellerCart.cart.some(
                                                    (item) =>
                                                      item.shippingOptions?.length
                                                  )) ? (
                                                <div className="md:w-[80%] mt-4">
                                                  <div className="relative text-blue-950 text-sm space-y-1.5">
                                                    <label htmlFor="shippingOptions">
                                                      Choose your shipping partner
                                                    </label>
                                                    {groupCartItem.shippingOptions
                                                      ?.length ||
                                                      sellerCart.cart.some(
                                                        (item) =>
                                                          item.shippingOptions?.length
                                                      ) ? (
                                                      <Select
                                                        className="st-react-select z-30"
                                                        classNamePrefix="react-select"
                                                        defaultValue={
                                                          groupCartItem.shippingService ||
                                                          (groupCartItem
                                                            .shippingOptions?.length
                                                            ? {
                                                              value: `${groupCartItem.shippingOptions[0]?.service_id}`,
                                                              transit_time_days:
                                                                groupCartItem
                                                                  .shippingOptions[0]
                                                                  ?.transit_time_days,
                                                              label: `${groupCartItem
                                                                  .shippingOptions[0]
                                                                  ?.currency
                                                                }$ ${groupCartItem.shippingOptions[0]?.rate?.toFixed(
                                                                  2
                                                                )} (${groupCartItem
                                                                  .shippingOptions[0]
                                                                  ?.carrier_name
                                                                } - ${groupCartItem
                                                                  .shippingOptions[0]
                                                                  ?.service_name
                                                                })`,
                                                            }
                                                            : sellerCart.cart.find(
                                                              (item) =>
                                                                item
                                                                  .shippingOptions
                                                                  ?.length
                                                            )
                                                              ?.shippingOptions[0] && {
                                                              value: `${sellerCart.cart.find(
                                                                (item) =>
                                                                  item
                                                                    .shippingOptions
                                                                    ?.length
                                                              )
                                                                  ?.shippingOptions[0]
                                                                  ?.service_id
                                                                }`,
                                                              transit_time_days:
                                                                sellerCart.cart.find(
                                                                  (item) =>
                                                                    item
                                                                      .shippingOptions
                                                                      ?.length
                                                                )
                                                                  ?.shippingOptions[0]
                                                                  ?.transit_time_days,
                                                              label: `${sellerCart.cart.find(
                                                                (item) =>
                                                                  item
                                                                    .shippingOptions
                                                                    ?.length
                                                              )
                                                                  ?.shippingOptions[0]
                                                                  ?.currency
                                                                } ${sellerCart.cart
                                                                  .find(
                                                                    (item) =>
                                                                      item
                                                                        .shippingOptions
                                                                        ?.length
                                                                  )
                                                                  ?.shippingOptions[0]?.rate.toFixed(
                                                                    2
                                                                  )} (${sellerCart.cart.find(
                                                                    (item) =>
                                                                      item
                                                                        .shippingOptions
                                                                        ?.length
                                                                  )
                                                                  ?.shippingOptions[0]
                                                                  ?.carrier_name
                                                                } - ${sellerCart.cart.find(
                                                                  (item) =>
                                                                    item
                                                                      .shippingOptions
                                                                      ?.length
                                                                )
                                                                  ?.shippingOptions[0]
                                                                  ?.service_name
                                                                })`,
                                                            })
                                                        }
                                                        onChange={(selected) => {
                                                          const selectedShipping =
                                                            groupCartItem.shippingOptions?.find(
                                                              (option) =>
                                                                `${option.service_id}` ===
                                                                selected.value
                                                            ) ||
                                                            sellerCart.cart
                                                              .find((item) =>
                                                                item.shippingOptions?.some(
                                                                  (opt) =>
                                                                    `${opt.service_id}` ===
                                                                    selected.value
                                                                )
                                                              )
                                                              ?.shippingOptions?.find(
                                                                (option) =>
                                                                  `${option.service_id}` ===
                                                                  selected.value
                                                              );

                                                          if (
                                                            sellerCart.cart.length
                                                          ) {
                                                            sellerCart.cart.forEach(
                                                              (shippingCart) => {
                                                                if (
                                                                  shippingCart
                                                                    .shippingOptions
                                                                    ?.length
                                                                ) {
                                                                  let cartUniqueId =
                                                                    shippingCart
                                                                      .productData
                                                                      ._id;
                                                                  if (
                                                                    shippingCart &&
                                                                    shippingCart.productData &&
                                                                    shippingCart
                                                                      .productData
                                                                      .productType ===
                                                                    "Customizable" &&
                                                                    shippingCart.selectedVariations &&
                                                                    Array.isArray(
                                                                      shippingCart.selectedVariations
                                                                    ) &&
                                                                    shippingCart
                                                                      .selectedVariations
                                                                      .length
                                                                  ) {
                                                                    const selectedVariant =
                                                                      shippingCart.selectedVariations
                                                                        .map(
                                                                          (
                                                                            variation
                                                                          ) =>
                                                                            variation.attributeValue.replace(
                                                                              /\s+/g,
                                                                              ""
                                                                            )
                                                                        )
                                                                        .join("_");
                                                                    if (
                                                                      selectedVariant
                                                                    ) {
                                                                      cartUniqueId = `${cartUniqueId}_${selectedVariant}`;
                                                                    }
                                                                  }
                                                                  addToCart(
                                                                    cartUniqueId,
                                                                    shippingCart.orderQuantiy,
                                                                    shippingCart.maxQuantity,
                                                                    shippingCart.basePrice,
                                                                    shippingCart.productData,
                                                                    shippingCart.remark,
                                                                    shippingCart.shippingOptions,
                                                                    selected,
                                                                    selectedShipping?.rate,
                                                                    shippingCart.selectedVariations
                                                                  );
                                                                }
                                                              }
                                                            );
                                                          }

                                                          const groupedBySeller =
                                                            formatCartGrouping();
                                                          setUpdatedCart(
                                                            groupedBySeller
                                                          );
                                                        }}
                                                        options={
                                                          groupCartItem
                                                            .shippingOptions?.length
                                                            ? groupCartItem.shippingOptions.map(
                                                              (option) => ({
                                                                value: `${option.service_id}`,
                                                                transit_time_days:
                                                                  option.transit_time_days,
                                                                label: `${option.rate?.toFixed(2) !== "0.00" ? option.currency : ""
                                                                  } ${option.rate?.toFixed(2) !== "0.00" ? option.rate?.toFixed(2) : "Free Shipping"} (${option.carrier_name
                                                                  }${option.service_name
                                                                    ? ` - ${option.service_name}`
                                                                    : ""
                                                                  }${option?.carrier_name ==
                                                                    "Flat Rate Shipping" ||
                                                                    option?.carrier_name ==
                                                                    "Hand Delivery" ||
                                                                    option?.carrier_name ==
                                                                    "Free Hand Delivery"
                                                                    ? ` - Non-Trackable`
                                                                    : ` - Trackable`
                                                                  })`,
                                                                deductedAmount:
                                                                  option?.deductedAmount
                                                                    ? Number(
                                                                      option?.deductedAmount
                                                                    )
                                                                    : 0,
                                                                carrier_name:
                                                                  option?.carrier_name,
                                                              })
                                                            )
                                                            : sellerCart.cart
                                                              .find(
                                                                (item) =>
                                                                  item
                                                                    .shippingOptions
                                                                    ?.length
                                                              )
                                                              ?.shippingOptions?.map(
                                                                (option) => ({
                                                                  value: `${option.service_id}`,
                                                                  transit_time_days:
                                                                    option.transit_time_days,
                                                                  label: `${option.rate?.toFixed(2) !== "0.00" ? option.currency : ""
                                                                  } ${option.rate?.toFixed(2) !== "0.00" ? option.rate?.toFixed(2) : "Free Shipping"}} (${option.carrier_name
                                                                    }${option.service_name
                                                                      ? ` - ${option.service_name}`
                                                                      : ""
                                                                    }${option?.carrier_name ==
                                                                      "Flat Rate Shipping" ||
                                                                      option?.carrier_name ==
                                                                      "Hand Delivery" ||
                                                                      option?.carrier_name ==
                                                                      "Free Hand Delivery"
                                                                      ? ` - Non-Trackable`
                                                                      : ` - Trackable`
                                                                    })`,
                                                                  deductedAmount:
                                                                    option?.deductedAmount
                                                                      ? Number(
                                                                        option?.deductedAmount
                                                                      )
                                                                      : 0,
                                                                  carrier_name:
                                                                    option?.carrier_name,
                                                                })
                                                              )
                                                        }
                                                      />
                                                    ) : (
                                                      <p className="text-rose-600">
                                                        No shipping rates found.
                                                        Kindly remove the item from
                                                        the cart to proceed.
                                                      </p>
                                                    )}
                                                    {groupCartItem.shippingService && (
                                                      <p>
                                                        Estimated delivery time{" "}
                                                        {
                                                          groupCartItem
                                                            .shippingService
                                                            .transit_time_days
                                                        }{" "}
                                                        days
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              ) : (
                                                groupCartItem?.shippingService
                                                  ?.error && (
                                                  <p className="text-rose-600">
                                                    No shipping rates found. Kindly
                                                    remove the item from the cart to
                                                    proceed.
                                                  </p>
                                                )
                                              )}
                                            </div>
                                            <div className="sm:block hidden">
                                              <h6 className="text-primary font-semibold">
                                                <span
                                                  style={{ whiteSpace: "nowrap" }}
                                                >
                                                  {userInfoStored?.currency &&
                                                    userInfoStored?.currencyRate
                                                    ? userInfoStored?.currency
                                                    : "CA$"}{" "}
                                                  {groupCartItem?.totalAmount >= 0
                                                    ? formatPrice(
                                                      parseFloat(
                                                        groupCartItem?.productData
                                                          ?.surTotalAmount
                                                          ? groupCartItem
                                                            ?.productData
                                                            ?.surTotalAmount * groupCartItem.orderQuantiy
                                                          : groupCartItem?.totalAmount
                                                      ).toFixed(2)
                                                    )
                                                    : "-"}
                                                </span>
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </>
                          </div>
                        ))}
                        <div>
                          {user?.userId && (
                          <Link
                          href={"/change-delivery-address"}
                          className={`bg-transparent border text-sm border-primary text-primary cursor-pointer rounded px-2 py-2 font-medium hover:opacity-50  ${loading || rateOptionsError
                              ? "pointer-events-none opacity-20"
                              : ""
                            } `}
                          disabled={!loading}
                        >
                          Change Delivery Address
                        </Link>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="bg-orange-100 rounded md:p-6 p-4 xl:px-[30px] xl:py-[26px] ">
                        <span className="flex flex-col items-center justify-center py-10">
                          <div
                            className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-primary"
                            role="status"
                          ></div>
                          <p className="text-blue-950">
                            Fetching the best shipping rate...
                          </p>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="lg:w-[370px] xl:w-[412px] lg:shrink-0 w-full">
                    <div className="bg-orange-100 rounded md:p-6 p-4 xl:px-[30px] xl:py-[26px] ">
                      <h2
                        className={`text-blue-950 text-2xl xl:text-3xl mb-[22px] noto-font`}
                      >
                        Summary
                      </h2>
                      <div className="flex gap-5 flex-col md:flex-row border-b border-slate-600/30"></div>
                      <div className="space-y-2 text-blue-950 border-b border-slate-600/30 pt-5 mb-5">
                        <div className="flex justify-between">
                          <p>Item(s) total</p>
                          <p>
                            {
                              loading ? "..."
                                : subTotal >= 0
                                  ? (() => {
                                      const rate = userInfoStored?.currencyRate || 1;
                                      const currency = userInfoStored?.currency || "CA$";

                                      const formattedSubtotal = formatPrice((subTotal * rate).toFixed(2));

                                      const oldSubTotalRaw = localStorage.getItem("oldSubTotal");
                                      const formattedOldSubTotal = oldSubTotalRaw
                                        ? formatPrice((parseFloat(oldSubTotalRaw) * rate).toFixed(2))
                                        : null;

                                      return (
                                        <>
                                          {currency} {formattedSubtotal}
                                          {formattedOldSubTotal && (
                                            <> (<del>{formattedOldSubTotal}</del>)</>
                                          )}
                                        </>
                                      );
                                    })()
                                  : "-"
                            }
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p>Service charge</p>
                          <p>
                            {loading
                              ? "..."
                              : subTotal >= 0
                                ? `${userInfoStored?.currency &&
                                  userInfoStored?.currencyRate
                                  ? userInfoStored?.currency
                                  : "CA$"
                                } 
                                ${formatPrice(
                                  (
                                    ((parseFloat(subTotal) +
                                      parseFloat(
                                        fetchedShippingRate
                                          ? fetchedShippingRate
                                          : totalShippingRate
                                      )) *
                                      0.03 +
                                      0.3) *
                                    (userInfoStored?.currencyRate || 1)
                                  ).toFixed(2)
                                )}`
                                : "-"}
                          </p>
                        </div>
                        {appliedCoupon &&
                          appliedCoupon.discountAmount &&
                          appliedCoupon.couponType ? (
                          <>
                            <div className="flex justify-between">
                              <p>Discount applied </p>
                              <p className="text-base text-blue-950">
                                <>
                                  {appliedCoupon.couponType === "fixed" ? (
                                    <>
                                      {userInfoStored?.currency &&
                                        userInfoStored?.currencyRate
                                        ? userInfoStored?.currency
                                        : "CA$ "} {" "}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                                {appliedCoupon.discountAmount?.toFixed(2)}
                                <>
                                  {appliedCoupon.couponType === "percentage" ? (
                                    <>%</>
                                  ) : (
                                    ""
                                  )}
                                </>
                              </p>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        <div className="flex justify-between pb-5">
                          <p>Shipping charge </p>
                          <p className="text-base text-blue-950">
                            {loading || rateOptionsError
                              ? "..."
                              : totalShippingRate
                                ? `${userInfoStored?.currency &&
                                  userInfoStored?.currencyRate
                                  ? userInfoStored?.currency
                                  : "CA$"
                                } 
                        ${formatPrice(
                                  parseFloat(totalShippingRate).toFixed(2)
                                )}`
                                : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between mb-5">
                        <p className="text-base text-blue-950">
                          Subtotal ({Object.keys(cart).length}{" "}
                          {Object.keys(cart).length > 1 ? "items" : "item"})
                        </p>
                        {loading ? (
                          "..."
                        ) : rateOptionsError ? (
                          <p className="text-lg font-medium text-blue-950">
                            {loading
                              ? "..."
                              : `${userInfoStored?.currency &&
                                userInfoStored?.currencyRate
                                ? userInfoStored?.currency
                                : "CA$"
                              } ${formatPrice(
                                (
                                  parseFloat(
                                    userInfoStored?.currencyRate
                                      ? subTotal * userInfoStored?.currencyRate
                                      : subTotal
                                  ) +
                                  parseFloat(
                                    (userInfoStored?.currencyRate
                                      ? subTotal * userInfoStored?.currencyRate
                                      : subTotal * 0.03
                                    ).toFixed(2)
                                  )
                                ).toFixed(2)
                              )}`}
                          </p>
                        ) : (
                          <p className="text-lg font-medium text-blue-950">
                            {loading
                              ? "..."
                              : `${userInfoStored?.currency &&
                                userInfoStored?.currencyRate
                                ? userInfoStored?.currency
                                : "CA$"
                              } ${formatPrice(
                                (
                                  (parseFloat(subTotal) +
                                    parseFloat(
                                      (
                                        (parseFloat(subTotal) +
                                          parseFloat(
                                            fetchedShippingRate
                                              ? fetchedShippingRate
                                              : totalShippingRate
                                          )) *
                                        0.03 +
                                        0.3
                                      ).toFixed(2)
                                    ) +
                                    parseFloat(
                                      fetchedShippingRate
                                        ? fetchedShippingRate
                                        : totalShippingRate
                                    )) *
                                  (userInfoStored?.currencyRate || 1)
                                ).toFixed(2)
                              )}`}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <Menu>
                          <Menu.Button className="w-full disabled:opacity-50 cursor-pointer">
                            <div className="flex justify-between items-center mb-6 w-full">
                              <div className="flex items-center gap-2.5 ">
                                <div>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="26.859"
                                    height="25.079"
                                    viewBox="0 0 26.859 25.079"
                                  >
                                    <g transform="translate(0 -16.97)">
                                      <path
                                        d="M184.792,97.965a.787.787,0,1,0,.543-.907A.786.786,0,0,0,184.792,97.965Z"
                                        transform="translate(-175.082 -75.855)"
                                        fill="#1F628E"
                                      />
                                      <path
                                        d="M26.662,33.1c-4.282-12.464-3.987-11.61-4.006-11.652a4.02,4.02,0,0,0-2.374-2.2c-.152-.053-8.771-2.069-9.02-2.155a2.649,2.649,0,0,0-2.57.569l-7.386,6.8A4.062,4.062,0,0,0,0,27.442V39.477a2.568,2.568,0,0,0,2.558,2.572h15.8a2.568,2.568,0,0,0,2.558-2.572V38.313l4.4-1.885A2.556,2.556,0,0,0,26.662,33.1Zm-8.3,7.374H2.558a.993.993,0,0,1-.985-1V27.442a2.484,2.484,0,0,1,.8-1.825c6.328-5.823,2.417-2.191,7.411-6.8a1,1,0,0,1,.977-.229c.319.1-.244-.363,7.786,7.026a2.484,2.484,0,0,1,.8,1.825V39.477A.993.993,0,0,1,18.36,40.475ZM24.7,34.983,20.918,36.6v-9.16a4.062,4.062,0,0,0-1.306-2.983l-5.5-5.061L19.8,20.748a2.443,2.443,0,0,1,1.4,1.3c4.274,12.44,3.985,11.605,4,11.648A.98.98,0,0,1,24.7,34.983Z"
                                        transform="translate(0)"
                                        fill="#1F628E"
                                      />
                                      <path
                                        d="M153.039,201.186a.787.787,0,0,0-1.03.421l-3.831,9.13a.787.787,0,1,0,1.451.609l3.831-9.13A.787.787,0,0,0,153.039,201.186Z"
                                        transform="translate(-140.346 -174.494)"
                                        fill="#1F628E"
                                      />
                                      <path
                                        d="M82.087,195.771a2.493,2.493,0,1,0-2.48,2.754A2.631,2.631,0,0,0,82.087,195.771Zm-2.48,1.181a1.222,1.222,0,1,1,.906-1.181A1.086,1.086,0,0,1,79.608,196.952Z"
                                        transform="translate(-73.082 -166.811)"
                                        fill="#1F628E"
                                      />
                                      <path
                                        d="M230.965,312.011a2.77,2.77,0,1,0,2.48,2.754A2.631,2.631,0,0,0,230.965,312.011Zm0,3.935a1.222,1.222,0,1,1,.906-1.181A1.086,1.086,0,0,1,230.965,315.946Z"
                                        transform="translate(-216.498 -279.563)"
                                        fill="#1F628E"
                                      />
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  <p className="teext-blue-950 xl:text-lg text-blue-950 ">
                                    Apply Discount Code
                                  </p>
                                </div>
                              </div>
                              <div>
                                <FontAwesomeIcon icon={faAngleDown} />
                              </div>
                            </div>
                          </Menu.Button>
                          <Transition as={Fragment}>
                            <Menu.Items>
                              {({ active }) => (
                                <Formik
                                  onSubmit={applyCode}
                                  validationSchema={validationSchema}
                                  initialValues={initialValues}
                                >
                                  {({ isSubmitting }) => (
                                    <Form>
                                      <div className="mb-6">
                                        <div className="relative">
                                          <Field
                                            type="text"
                                            name="code"
                                            className="h-[50px] px-4 py-3.5 w-full text-sm bg-transparent border-primary text-slate-600 rounded placeholder:text-slate-600/70 focus:ring-primary focus:border-primary"
                                            id="code"
                                            placeholder="Enter code"
                                            disabled={couponApplied}
                                          />
                                          <ErrorMessage
                                            name="code"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                          <button
                                            type="submit"
                                            className={`h-[50px] buttonprimary absolute right-0 top-px px-4 py-2 rounded text-white ${loading ||
                                                rateOptionsError ||
                                                isSubmitting
                                                ? "pointer-events-none opacity-40"
                                                : "bg-primary"
                                              }`}
                                            disabled={
                                              loading ||
                                              rateOptionsError ||
                                              couponApplied ||
                                              isSubmitting
                                            }
                                          >
                                            Apply
                                          </button>
                                        </div>
                                      </div>
                                    </Form>
                                  )}
                                </Formik>
                              )}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                      <div className="flex items-center justify-center">
                        {isLoggedIn && (
                          <Link
                            href="/checkout"
                            className={`w-full buttonprimary relative ${loading || rateOptionsError
                                ? "pointer-events-none opacity-40"
                                : ""
                              } `}
                          >
                            Proceed to Checkout
                          </Link>
                        )}
                        {!isLoggedIn && (
                          <button
                            onClick={handleCheckout}
                            disabled={loading || rateOptionsError}
                            className={`w-full buttonprimary relative ${loading || rateOptionsError ? "pointer-events-none opacity-40" : ""
                              }`}
                          >
                            Proceed to Checkout
                          </button>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <Link href="/">
                          <span className="text-primary ease-in hover:opacity-50 transition-colors disabled:cursor-progress rounded-sm text-sm font-medium group pt-5 disabled:opacity-50 flex gap-2 items-center">
                            Continue shopping
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="7.477"
                              height="13.14"
                              viewBox="0 0 7.477 13.14"
                              className="fill-primary mt-1"
                            >
                              <path
                                id="Down_Arrow_3_"
                                d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
                                transform="translate(-39.625 32.764) rotate(-90)"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="py-24 md:py-40">
                    <div className="flex items-center justify-center mb-9">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="126"
                        height="97.894"
                        viewBox="0 0 126 97.894"
                      >
                        <g
                          id="Group_42500"
                          data-name="Group 42500"
                          transform="translate(-125 -171.221)"
                        >
                          <ellipse
                            id="Ellipse_1020"
                            data-name="Ellipse 1020"
                            cx="63"
                            cy="18.5"
                            rx="63"
                            ry="18.5"
                            transform="translate(125 232.115)"
                            fill="#ffedd5"
                            opacity="0.8"
                          />
                          <g
                            id="_28326655_i4991"
                            data-name="28326655_i4991"
                            transform="translate(135.45 171.221)"
                          >
                            <g
                              id="Group_42499"
                              data-name="Group 42499"
                              transform="translate(0 0)"
                            >
                              <g
                                id="Group_42491"
                                data-name="Group 42491"
                                transform="translate(12.57 0.13)"
                              >
                                <g id="Group_42490" data-name="Group 42490">
                                  <path
                                    id="Path_59559"
                                    data-name="Path 59559"
                                    d="M680.641,812.067l-32.879,19.555a3.047,3.047,0,0,1-4.176-1.061h0a3.047,3.047,0,0,1,1.061-4.176l32.879-19.555a3.047,3.047,0,0,1,4.176,1.061h0A3.046,3.046,0,0,1,680.641,812.067Z"
                                    transform="translate(-643.157 -806.401)"
                                    fill="#475569"
                                  />
                                </g>
                              </g>
                              <g
                                id="Group_42493"
                                data-name="Group 42493"
                                transform="translate(54)"
                              >
                                <g id="Group_42492" data-name="Group 42492">
                                  <path
                                    id="Path_59560"
                                    data-name="Path 59560"
                                    d="M1270.9,810.092l32.8,19.683a3.047,3.047,0,0,0,4.18-1.045h0a3.047,3.047,0,0,0-1.045-4.18l-32.8-19.683a3.047,3.047,0,0,0-4.18,1.045h0A3.047,3.047,0,0,0,1270.9,810.092Z"
                                    transform="translate(-1269.425 -804.433)"
                                    fill="#475569"
                                  />
                                </g>
                              </g>
                              <g
                                id="Group_42495"
                                data-name="Group 42495"
                                transform="translate(7.031 24.613)"
                              >
                                <g id="Group_42494" data-name="Group 42494">
                                  <path
                                    id="Path_59561"
                                    data-name="Path 59561"
                                    d="M559.429,1176.49l7.127,49.887a10.686,10.686,0,0,0,10.579,9.175h55.993a10.687,10.687,0,0,0,10.579-9.175l7.127-49.887Zm20.495,48.622a2.716,2.716,0,0,1-3.046-2.352l-3.833-29.814a2.721,2.721,0,1,1,5.4-.694l3.833,29.814A2.721,2.721,0,0,1,579.924,1225.112Zm12.605.016c-.06,0-.119.006-.177.006a2.721,2.721,0,0,1-2.713-2.546l-1.917-29.814a2.721,2.721,0,0,1,5.431-.35l1.917,29.814A2.72,2.72,0,0,1,592.529,1225.128Zm15.324-2.716a2.721,2.721,0,0,1-5.442,0V1192.6a2.721,2.721,0,1,1,5.442,0Zm12.772.175a2.721,2.721,0,0,1-2.713,2.547c-.059,0-.117,0-.177-.006a2.721,2.721,0,0,1-2.541-2.89l1.917-29.814a2.721,2.721,0,1,1,5.431.349Zm16.594-29.641-3.833,29.813a2.721,2.721,0,1,1-5.4-.694l3.833-29.814a2.721,2.721,0,0,1,5.4.694Z"
                                    transform="translate(-559.429 -1176.49)"
                                    fill="#1F628E"
                                    opacity="0.87"
                                  />
                                </g>
                              </g>
                              <g
                                id="Group_42496"
                                data-name="Group 42496"
                                transform="translate(0 17.113)"
                              >
                                <path
                                  id="Path_59562"
                                  data-name="Path 59562"
                                  d="M554.625,1074.372h-97.5a3.984,3.984,0,0,1-3.984-3.984v-3.281a3.984,3.984,0,0,1,3.984-3.984h97.5a3.984,3.984,0,0,1,3.984,3.984v3.281A3.984,3.984,0,0,1,554.625,1074.372Z"
                                  transform="translate(-453.142 -1063.122)"
                                  fill="#f16217"
                                />
                              </g>
                              <g
                                id="Group_42497"
                                data-name="Group 42497"
                                transform="translate(12.592 20.166)"
                              >
                                <circle
                                  id="Ellipse_1018"
                                  data-name="Ellipse 1018"
                                  cx="2.144"
                                  cy="2.144"
                                  r="2.144"
                                  transform="matrix(0.974, -0.227, 0.227, 0.974, 0, 0.971)"
                                  fill="#304754"
                                />
                              </g>
                              <g
                                id="Group_42498"
                                data-name="Group 42498"
                                transform="translate(87.725 20.169)"
                              >
                                <circle
                                  id="Ellipse_1019"
                                  data-name="Ellipse 1019"
                                  cx="2.144"
                                  cy="2.144"
                                  r="2.144"
                                  transform="translate(0 4.172) rotate(-76.714)"
                                  fill="#304754"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    {cart && Object.keys(cart).length > 0 ? (
                      <>
                        {isLoggedIn ? (
                          !apiError ? (
                            <div className="m-auto text-center">
                              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-primary">
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                  Loading...
                                </span>
                              </div>
                              <div className="text-primary mt-1">loading</div>
                            </div>
                          ) : (
                            <>
                              <div className="m-auto text-center">
                                <div className="text-primary mt-1">{apiError}</div>
                              </div>
                            </>
                          )
                        ) : (
                          ""
                        )}
                        {!isLoggedIn ? ("") : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <p
                          className={`text-blue-950 text-3xl text-center mb-2.5 noto-font`}
                        >
                          Your Cart is Empty
                        </p>
                        <p className="text-blue-950 text-center text-base font-medium mb-6 md:mb-9">
                          Shop now and add products to your cart!
                        </p>
                        <div className="flex items-center justify-center">
                          <Link href="/" className="  buttonprimary">
                            Continue shopping
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
                      </>
                    )}
                  </div>
                </>
              )}
              {isUserInfo && (
                <SignInPromptModal
                  isOpen={isUserInfo}
                  onClose={() => setIsUserInfo(false)}
                  handleContinue={handleContinue}
                  loading={loading}
                  rateOptionsError={rateOptionsError}
                />
              )}

              {otpToken && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
                  <div className="bg-orange-50 p-6 rounded-lg shadow-xl max-w-md w-full relative text-center">
                    
                    {/* Close Button */}
                    <button
                      className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl"
                      onClick={onClose}
                    >
                      &times;
                    </button>

                    {/* Title */}
                    <p className={`text-blue-950 text-3xl font-semibold mb-4 noto-font`}>
                      Verify Your Email
                    </p>

                    {/* Instruction */}
                    <p className="text-gray-700 mb-4">
                      Enter the 6-digit code sent to your email
                    </p>

                    {/* OTP Input */}
                    <div className="flex justify-center gap-2 mb-4">
                    {[...Array(6)].map((_, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        className={`w-10 h-12 text-2xl text-center border rounded-md focus:outline-none focus:ring-2 
                          ${otpError ? "border-red-500 ring-red-300" : "border-gray-300 focus:ring-blue-500"}`}
                        value={otp[idx] || ""}
                        onChange={(e) => handleOtpChange(e, idx)}
                        onKeyDown={(e) => handleBackspace(e, idx)}
                        onPaste={(e) => handleOtpPaste(e)}
                        ref={(el) => (otpRefs.current[idx] = el)}
                      />
                    ))}
                    </div>

                    {/* Submit Button */}
                    <button
                      className="buttonprimary bg-blue-600 text-white px-6 py-2 rounded-md transition"
                      onClick={handleVerifyOtp}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {openGuestForm && (
                <section >
                  <GuestFormModal
                    isOpen={showGuestForm}
                    onClose={() => setShowGuestForm(false)}
                    onSubmit={handleGuestSubmit}
                  />
                </section>
              )}

            </div>
          </section>


      <section>
        <Footer />
      </section>
    </>
  );
};

export default Cart;
