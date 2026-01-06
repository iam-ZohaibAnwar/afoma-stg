import dynamic from "next/dynamic";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "react-phone-input-2/lib/style.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const FacebookPixel = dynamic(() => import("@/components/FacebookPixel"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });
const Miniheader = dynamic(() => import("@/components/Miniheader"), { ssr: false });
const StripeComponent = dynamic(() => import("@/components/Stripe"), { ssr: false });
const ApplePay = dynamic(() => import("@/components/ApplePay"), { ssr: false });
import { loadStripe } from '@stripe/stripe-js';
import { pushEventBeginCheckout, pushEventPaymentInfo, pushEventPurchase } from "@/utils/dataLayer";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Checkout = ({ clearCart, userInfoStored, currencyUser }) => {
  let rate;
  const CurrencyRate = async () => {
    if (userInfoStored && userInfoStored.currency != currencyUser) {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cad.json`
      );
      rate = data["cad"]["usd"];
    }
  };
  CurrencyRate();

  const router = useRouter();
  const [cart, setCart] = useState("");
  // const [userInfoStored, setUserInfoStored] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [totalShippingRate, setTotalShippingRate] = useState(0);
  const [fetchedShippingRate, setFetchedShippingRate] = useState(0);
  const listenerAttached = useRef(false);
  const paymentWindowRef = useRef(null);
  const [sbLoading, setSBLoading] = useState(false);
  const [showSB, setShowSB] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false); // Force open for testing
  const [finalPrice, setFinalPrice] = useState({
        currency_code: "CAD",
        value: "",
      });
  const sbcurrencies = ["NGN", "GHS", "ZAR", "KES", "UGX", "TZS", "XOF", "RWF", "XAF"];
  const [selectedPayment, setSelectedPayment] = useState(""); // store selected option
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  useEffect(() => {
    setApplePayAvailable(isApplePayAvailable());
  }, []);

  const isApplePayAvailable = () => {
    if (typeof window === "undefined") return false;
    return !!window.ApplePaySession;
  };

  useEffect(() => {

  const handleMessage = (event) => {
    if (event.data?.reference === localStorage.getItem("sbReference")) {
      if (listenerAttached.current) return;
        listenerAttached.current = true;
      if (paymentWindowRef.current && !paymentWindowRef.current.closed) {
        paymentWindowRef.current.close();
      }
      paypalCaptureOrder(); // can stay unchanged
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);

  const formatPrice = (price) => {
    const numericPrice = Number(price); // Ensure it's a number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  // Initialize state from localStorage on first render
  useEffect(() => {
    setAllData()
  }, []);

  const setAllData = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const storedSubTotal = parseFloat(localStorage.getItem("subTotal")) || 0;
    const storedShippingRate =
      parseFloat(localStorage.getItem("totalShippingRate")) || 0;
    const fetchedShippingRate =
      parseFloat(localStorage.getItem("fetchedShippingRate")) || 0;
    pushEventBeginCheckout(storedCart, storedSubTotal)
    setCart(storedCart);
    // setUserInfoStored(storedUserInfo);
    setSubTotal(storedSubTotal);
    setTotalShippingRate(storedShippingRate);
    setFetchedShippingRate(fetchedShippingRate);
    if (sbcurrencies.includes(storedUserInfo.currency)) {
      setShowSB(true)
    }
     const data = {
      subTotal: storedSubTotal,
      totalShippingRate: fetchedShippingRate
        ? fetchedShippingRate
        : storedShippingRate,
      currency: userInfoStored?.currency || currencyUser,
      conversionRate: rate ? rate : userInfoStored?.currencyRate || 1,
    }

    let cartTotal = parseFloat(
      (parseFloat(data.subTotal) + parseFloat(data.totalShippingRate)).toFixed(2)
    );

    // Calculate service fees (3% of cartTotal + 0.3)
    let serviceFees = parseFloat((cartTotal * 0.03 + 0.3).toFixed(2));

    // Calculate the final order price (cartTotal + serviceFees)
    let order_price = parseFloat((cartTotal + serviceFees).toFixed(2));
    let convertedOrderPrice = 0
    if (order_price && data.currency && data.conversionRate) {
      convertedOrderPrice = parseFloat((order_price * data.conversionRate).toFixed(2))
    }

    console.log({
      currencyUser,
      userInfoStored,
      rate,
      data,
      cartTotal,
      serviceFees,
      order_price,
      convertedOrderPrice,
    });


    let fp = {}
    if (order_price) {
      fp = {
        currency_code: data.currency ? data.currency : "CAD",
        value: convertedOrderPrice ? convertedOrderPrice + "" : order_price + "",
      }

    } else {
      fp = {
        currency_code: "CAD",
        value: "",
      }
    }
    console.log('fp :>> ', fp);
    setFinalPrice(fp)
  }

  const priceId = 10
  const handleCheckout = useCallback(async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();

    if (!data.sessionId) {
      alert("Error creating session");
      return;
    }

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      alert("Stripe failed to initialize");
      return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    if (error) alert(error.message);
  }, [priceId]);

  const paypalCreateOrder = async (paymentType="") => {
    try {
      const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
      const user = JSON.parse(localStorage.getItem("user"));
      const selectedAddress = JSON.parse(
        localStorage.getItem("selected-delivery-address")
      );
      let userInfo = {};

      if (selectedAddress && selectedAddress._id) {
        userInfo = {
          ...user,
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
        };
      } else {
        userInfo = { ...user };
      }

      if (userInfoStored.currency != currencyUser) {
        for (let ca of Object.values(cart)) {
          ca.shippingRate = parseFloat(
            ((ca.shippingRate / userInfoStored.currencyRate) * rate).toFixed(2)
          );
        }
      }
      const payloadData = {
        cart: Object.values(cart),
        subTotal: subTotal,
        userInfo: userInfo,
        totalShippingRate: fetchedShippingRate
          ? fetchedShippingRate
          : totalShippingRate,
        currency: currencyUser,
        conversionRate: rate ? rate : userInfoStored?.currencyRate || 1,
        coupon:
          appliedCoupon && appliedCoupon.couponCode
            ? appliedCoupon.couponCode
            : "",
      };
      let response = await axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/paypal/createorder`,
          payloadData
        );

      return response?.data?.Data?.result?.id;
    } catch (err) {
      console.log(err)
      let errorMessage = "Create Order Error";

      if (err?.message) {
        errorMessage = `Error: ${err?.message}`;
      }

      if (err?.response?.data?.message) {
        errorMessage = `API Error Message: ${err.response.data.message}`;
      }

      if (err?.response?.data?.error) {
        errorMessage = `API Error: ${err.response.data.error}`;
      }

      toast.error(errorMessage);
      return null;
    }
  };

  const paypalCaptureOrder = async (resp = null) => {
    try {
      const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
      const fetchedShippingRate =  parseFloat(localStorage.getItem("fetchedShippingRate")) || 0;
      const totalShippingRate = parseFloat(localStorage.getItem("totalShippingRate")) || 0;
      const user = JSON.parse(localStorage.getItem("user"));
      const selectedAddress = JSON.parse(
        localStorage.getItem("selected-delivery-address")
      );
      let userInfo = {};

      if (selectedAddress && selectedAddress._id) {
        userInfo = {
          ...user,
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
        };
      } else {
        userInfo = { ...user };
      }

      const payloadData = {
        cart: cart ? Object.values(cart) : Object.values(JSON.parse(localStorage.getItem("cart"))),
        subTotal: subTotal ? subTotal : parseFloat(localStorage.getItem("subTotal")),
        userInfo: userInfo,
        totalShippingRate: fetchedShippingRate
          ? fetchedShippingRate
          : totalShippingRate,
        currency: resp?.orderID ? currencyUser : userInfoStored?.currency,
        conversionRate: resp?.orderID ? rate : userInfoStored?.currencyRate || 1,
        coupon:
          appliedCoupon && appliedCoupon.couponCode
            ? appliedCoupon.couponCode
            : "",
      };
      let response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/paypal/captureorder`,
        {
          orderId: resp?.orderID ? resp?.orderID : localStorage.getItem("sbReference"),
          paymentMethod: resp?.paymentType === "stripe" ? "stripe" : resp?.orderID ? "paypal" : "startButton",
          ...payloadData,
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      if (response.data.success) {
        let orderId =  resp?.orderID ? resp?.orderID : localStorage.getItem("sbReference")
        pushEventPurchase(payloadData, orderId)
        clearCart();
        router.push("/thank-you");
      }
    } catch (err) {
      console.log(err);
      toast.error("Some Error Occured");
    }
    listenerAttached.current = false;
  };

    const sbCreateOrder = async () => {
    try {
      setSBLoading(true);
      const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
      const user = JSON.parse(localStorage.getItem("user"));
      const selectedAddress = JSON.parse(
        localStorage.getItem("selected-delivery-address")
      );
      let userInfo = {};

      if (selectedAddress && selectedAddress._id) {
        userInfo = {
          ...user,
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
        };
      } else {
        userInfo = { ...user };
      }

      if (userInfoStored.currency != currencyUser) {
        for (let ca of Object.values(cart)) {
          ca.shippingRate = parseFloat(
            ((ca.shippingRate / userInfoStored.currencyRate) * rate).toFixed(2)
          );
        }
      }
      const payloadData = {
        paymentMethod : "startButton",
        cart: Object.values(cart),
        subTotal: subTotal,
        userInfo: userInfo,
        totalShippingRate: fetchedShippingRate
          ? fetchedShippingRate
          : totalShippingRate,
        currency: userInfoStored?.currency || currencyUser,
        conversionRate: userInfoStored?.currencyRate || 1,
        coupon:
          appliedCoupon && appliedCoupon.couponCode
            ? appliedCoupon.couponCode
            : "",
      };
      let response = await axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/paypal/createorder`,
          payloadData
        );
      console.log("Start Button Response", response);
      localStorage.setItem("sbReference", response?.data?.reference);
      const win = window.open(
        response?.data?.data?.data,
        "_blank",
        "width=700,height=800,resizable=yes,scrollbars=yes"
      );
      setSBLoading(false);
      return response?.data?.data?.data
    } catch (err) {
      setSBLoading(false);

      toast.error(err?.message || "Some Error Occurred");
      return null;
    }
  };

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

  return (
    <>
      {subTotal ? <FacebookPixel data={{ cart: cart, isProduct: false, cartValue: subTotal, shippingValue: totalShippingRate }} /> : ""}
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
      <div className="relative">
        <section>
          <Miniheader />
        </section>

        <section>
          <div className="max-w-screen-xl mx-auto px-4 py-6">
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
              <div className="hover:text-primary flex items-center gap-1.5">
                <Link href="/">
                  <span>Home</span>
                </Link>
                <FontAwesomeIcon icon={faAngleRight} size="sm" />
              </div>
              <div className="hover:text-primary flex items-center gap-1.5">
                <Link href="/cart">
                  <span>Cart</span>
                </Link>
                <FontAwesomeIcon icon={faAngleRight} size="sm" />
              </div>
              <span className="text-primary ">Checkout</span>
            </div>
          </div>
        </section>
        <section>
          <div className="max-w-[950px] xl:max-w-[1150px] mx-auto px-4   pt-5 pb-8 md:pb-16 xl:pb-24 ">
            <div className="mb-6 xl:mb-16">
              <h1
                className={`text-4xl xl:text-5xl text-center text-blue-950 xl:tracking-[-0.9px] mb-6 noto-font`}
              >
                Checkout
              </h1>
            </div>
            <div className="xl:relative xl:flex xl:gap-10 items-start">
              <div className="bg-orange-100 rounded md:p-6 p-4 mb-6 xl:px-[30px] xl:py-[36px] xl:sticky xl:top-10">
                <h2
                  className={`text-blue-950 text-2xl xl:text-3xl mb-[22px] noto-font`}
                >
                  Order Summary
                </h2>
                <h6 className="text-blue-950 font-semibold mb-6">
                  {Object.keys(cart).length}{" "}
                  {Object.keys(cart).length > 1 ? "items" : "item"} in cart
                </h6>

                <div className="flex gap-5 mb-5 pb-7 flex-col border-b border-slate-600/30">
                  {Object.keys(cart).map((k) => (
                    <div key={k} className="flex gap-5 flex-row">
                      <div className="shrink-0">
                        <Image
                          src={getProductImage(cart[k])}
                          width="130"
                          height="130"
                          className="h-[100px] w-[100px] lg:h-24 lg:w-24 xl:h-[130px] md:h-[120px] md:w-[120px] xl:w-[130px] rounded"
                        />
                      </div>
                      <div>
                        <h6 className="text-blue-950 xl:text-lg mb-2">
                          {cart[k]?.productData?.productName}
                        </h6>
                        <p className="text-blue-950 text-xs mb-4">
                          by{" "}
                          {cart[k]?.productData?.seller?.firstName &&
                            cart[k]?.productData?.seller?.firstName}{" "}
                          {cart[k]?.productData?.seller?.lastName &&
                            cart[k]?.productData?.seller?.lastName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mb-3.5">
                  <p className="text-base text-blue-950">Item total</p>
                  <p className="text-base text-blue-950">
                    {subTotal
                      ? `${userInfoStored?.currency
                        ? userInfoStored?.currency
                        : "CA$"
                      } 
                    ${formatPrice(
                        parseFloat(
                          userInfoStored?.currencyRate
                            ? userInfoStored?.currencyRate * subTotal
                            : subTotal
                        ).toFixed(2)
                      )}`
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between mb-3.5">
                  <p className="text-base text-blue-950">Service charge</p>
                  <p className="text-base text-blue-950">
                    {subTotal
                      ? `${userInfoStored?.currency
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

                <div className="flex justify-between mb-5 pb-5 border-b border-slate-600/30">
                  <p className="text-base text-blue-950">Shipping charges </p>
                  <p className="text-base text-blue-950">
                    {totalShippingRate
                      ? `${userInfoStored?.currency
                        ? userInfoStored?.currency
                        : "CA$"
                      } 
                      ${formatPrice(parseFloat(totalShippingRate).toFixed(2))}`
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between ">
                  <p className="text-base text-blue-950">
                    Total ({Object.keys(cart).length}{" "}
                    {Object.keys(cart).length > 1 ? "items" : "item"})
                  </p>
                  <p className="text-lg font-medium text-blue-950">
                    {userInfoStored?.currency
                      ? userInfoStored?.currency
                      : "CA$"}{" "}
                    {formatPrice(
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
                    )}
                  </p>
                </div>
              </div>

              <div className="lg:shrink-0 w-full lg:w-[447px]">
                <h2
                  className={`text-blue-950 text-2xl xl:text-3xl mb-6 xl:mb-9 noto-font`}
                >
                  Payment Method
                </h2>

                <h6 className="text-blue-950 text-lg mb-6 xl:mb-7">
                  How would you like to pay?
                </h6>

                <div className="space-y-5 w-full max-w-sm mx-auto">
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "AeLhBiWTIj8FgOdkEMzESph-_0DR17SjTkxPxPZX6M11bTjRqBo-ArzosU-ZJYcAaQy1hOHNGQkj7lYs",
                      currency: currencyUser,
                      intent: "capture",
                      components: "buttons",
                      "disable-funding": "paylater,card,venmo,credit,ideal,sepa",
                    }}
                  >
                    <div className="space-y-6 ">

                      {/* Payment options */}
                      <div className="space-y-3">
                        {/* PayPal */}
                        <label className={`flex items-center space-x-2 cursor-pointer border rounded p-3 ${selectedPayment === "paypal" ? "border-orange-500" : ""}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={selectedPayment === "paypal"}
                            onChange={(e) => {setSelectedPayment(e.target.value); pushEventPaymentInfo(cart, "Paypal")}}
                          />
                          <img
                            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                            alt="PayPal"
                            className="h-6 w-auto"
                          />
                          <span>PayPal</span>
                        </label>

                        {/* Google Pay - optional, remove if you don't support */}
                        {/* <label className="flex items-center space-x-2 cursor-pointer border rounded p-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="googlepay"
                            checked={selectedPayment === "googlepay"}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                          />
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png"
                            alt="Google Pay"
                            className="h-6 w-auto"
                          />
                          <span>Google Pay</span>
                        </label> */}

                        {/* Credit/Debit Card (Stripe) */}
                        <label className={`flex items-center space-x-2 cursor-pointer border rounded p-3 ${selectedPayment === "stripe" ? "border-orange-500" : ""}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            checked={selectedPayment === "stripe"}
                            onChange={(e) => {setSelectedPayment(e.target.value); pushEventPaymentInfo(cart, "Stripe Card")}}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-auto"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M2 6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6zm2 0v2h16V6H4zm0 4v6h16v-6H4z" />
                          </svg>
                          <span>Debit/Credit Card</span>
                        </label>


                        {/* Bank Transfer (SB) */}
                        {showSB && (
                          <label className={`flex items-center space-x-2 cursor-pointer border rounded p-3 ${selectedPayment === "sb" ? "border-orange-500" : ""}`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="sb"
                              checked={selectedPayment === "sb"}
                              onChange={(e) => {setSelectedPayment(e.target.value); pushEventPaymentInfo(cart, "Start Button")}}
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-auto"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2L1 7v2h22V7L12 2zm-7 7v10h4v-6h6v6h4V9H5z" />
                            </svg>


                            <span>Bank Transfer</span>
                          </label>
                        )}

                        {/* Apple Pay */}
                        <label
                          className={`flex items-center space-x-2 cursor-pointer border rounded p-3 ${selectedPayment === "applepay" ? "border-orange-500" : ""} ${!applePayAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="applepay"
                            checked={selectedPayment === "applepay"}
                            onChange={(e) => {setSelectedPayment(e.target.value); pushEventPaymentInfo(cart, "Apple Pay")}}
                            disabled={!applePayAvailable}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-auto"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16.365 1.43c0 .69-.26 1.38-.73 1.89-.5.54-1.23.86-1.99.86-.04-1.08.46-2.17 1.3-2.81.65-.54 1.55-.83 2.42-.77zM20.82 17.7c-.1.57-.62 1.91-1.3 3.04-1.16 1.82-2.42 3.6-4.3 3.64-1.77.05-2.29-1.11-4.26-1.11-1.97 0-2.56 1.08-4.27 1.16-1.74.08-3.02-1.85-4.22-3.67-2.45-3.67-4.3-10.32-1.95-13.7.99-1.26 2.78-2.06 4.48-2.06 1.72 0 3.01 1.08 4.27 1.08 1.21 0 3.2-1.44 5.36-1.08.91.12 3.52.36 5.21 3.17-4.88 2.86-3.34 10.87-.32 12.33z" />
                          </svg>
                          <span>Apple Pay</span>
                        </label>
                      </div>

                      {/* If PayPal is selected, show PayPalButtons component */}
                      {/* Action Buttons */}
                      {selectedPayment === "paypal" ? (
                        <PayPalButtons
                          style={{
                            color: "blue",
                            label: "paypal",
                            height: 55,
                          }}
                          createOrder={paypalCreateOrder}
                          onApprove={paypalCaptureOrder}
                        />
                      ) : selectedPayment === "stripe" ? (
                        <button
                          onClick={() => setShowStripeModal(true)}
                          disabled={sbLoading}
                          className={`w-full font-bold text-white text-xl rounded-md transition h-[55px] ${sbLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0070BA] hover:bg-[#005C9C]"
                            }`}
                        >
                          {sbLoading ? "Processing..." : "Pay via Card"}
                        </button>
                      ) : selectedPayment === "applepay" ? (
                        <div className="mt-4">
                          {/* <ApplePay amount={finalPrice} productName={""} onSuccess={paypalCaptureOrder} /> */}
                        </div>
                      ) : selectedPayment === "sb" ? (
                        <button
                          onClick={() => sbCreateOrder()}
                          disabled={sbLoading}
                          className={`w-full font-bold text-white text-xl rounded-md transition h-[55px] ${sbLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0070BA] hover:bg-[#005C9C]"
                            }`}
                        >
                          {sbLoading ? "Initiating..." : "Pay via Bank Transfer"}
                        </button>
                      ) : null}

                      {/* Stripe Modal */}
                      {showStripeModal && selectedPayment === "stripe" && (
                        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative z-[1000]">
                            <div className="flex justify-between items-center border-b p-4">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Fast. Safe. Trusted.
                              </h3>
                              <button
                                onClick={() => setShowStripeModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                                aria-label="Close modal"
                              >
                                &times;
                              </button>
                            </div>
                            <div className="p-4">
                              <StripeComponent
                                modalMode={true}
                                amount={finalPrice}
                                onSuccess={paypalCaptureOrder}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Apple Pay UI */}
                      {selectedPayment === "applepay" && (
                        <div className="mt-4">
                          <ApplePay amount={finalPrice} productName={""} onSuccess={paypalCaptureOrder} />
                        </div>
                      )}
                    </div>
                  </PayPalScriptProvider>
                </div>

                <div className="mt-6"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default Checkout;

