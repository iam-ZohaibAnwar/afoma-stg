import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
//import { Noto_Serif } from "next/font/google";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import { ConnectEmbed, lightTheme } from "thirdweb/react";
import { client, wallets, clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import Cookies from "js-cookie";
import { getGeoIP } from "@/lib/geoIP";
import toast from "react-hot-toast";
import { verifyOTP } from "@/lib/api";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Signin = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [connectedUserWallet, setConnectedUserWallet] = useState("");
  const [pageTransition, setPageTransition] = useState("SIGN-IN");
  const [email, setEmail] = useState("");
  const [isOtp, setIsOtp] = useState("");
  const [tab, setTab] = useState("SIGN-IN");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = useRef([]);
  const [otpToken, setOtpToken] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleCustomSignIn = async (e = null) => {
    if(e) {
      e.preventDefault();
    }
    try {
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/login`,
        data: { email },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };
      let response = await axios.request(options);
      if (response.data.success) {
        setIsOtp(true)
        setOtpToken(response.data.otpToken)
      } else {
        toast.error(response.data.error)
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message)
    }
  };

  const doLogin = async (params) => {
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("selected-delivery-address");
    localStorage.removeItem("user");
    try {
      const loginResult = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login-tw`,
        params,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );

      switch (loginResult.data.status) {
        case "USER_SIGNED_IN": {
          const userRole = loginResult.data.data.role;
          if (redirect) {
            router.push(redirect).then();
          } else {
            if (userRole === "seller") {
              router.push("/").then();
            } else if (userRole === "admin") {
              router.push("/").then();
            } else if (userRole === "affiliate") {
              router.push("/").then();
            } else if (userRole === "customer") {
              router.push("/").then();
            }
          }
          delete loginResult.data.data.role;
          delete loginResult.data.data.fullAccess;
          getGeoIP(loginResult.data.data.country);
          Cookies.set("accessToken", loginResult.data.data.accessToken, {
            secure: true,
          });
          localStorage.setItem("user", JSON.stringify(loginResult.data.data));
          setPageTransition("REDIRECTING");
          break;
        }
        case "USER_CREATE_NEW": {
          setConnectedUserWallet(loginResult.data.wallet);
          setPageTransition("CHOOSE-ACCOUNT-TYPE");
          break;
        }
        case "USER_AUTH_ERROR": {
          console.warn("Unable to authenticate user.");
          break;
        }
      }
    } catch (e) { }
  };

  // Invalidate JWT session
  const doLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      });
    } catch (e) {
      console.warn("unable to logout user");
    }

    clearThirdWebAuthTokens();
    setPageTransition("SIGN-IN");
  };

  // request a JWT session payload
  const getLoginPayload = async (params) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login-tw-payload`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
          params: {
            address: params.address,
            chainId: "56",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error requesting payload:", error);
      throw error;
    }
  };

  /** @DEV TODO ensure server validation or JWT validation */
  const isLoggedIn = async () => {
    return !!localStorage.getItem("user");
  };

  const showPageRegisterAs = (route) => {
    if (route === "register" || route === "register-as-a-seller") {
      router
        .push({
          pathname: "/" + route,
          query: { wallet: connectedUserWallet },
        })
        .then();
    }
  };

  // Clear all data
  const ClearAllData = async () => {
    clearThirdWebAuthTokens();
    localStorage.clear();
    sessionStorage.clear();
    setPageTransition("");
    window.location.href = "/sign-in";
    // router.push("/sign-in").then();
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
        localStorage.setItem("bypassthirdweb", true);
        localStorage.setItem("user", JSON.stringify(result.user));
        let userRole = result.user.userRole
        if (userRole === "seller") {
          router.push("/").then();
        } else if (userRole === "admin") {
          router.push("/").then();
        } else if (userRole === "affiliate") {
          router.push("/").then();
        } else if (userRole === "customer") {
          router.push("/").then();
        }

        getGeoIP(result.user.country);
        Cookies.set("accessToken", result.user.accessToken, {
          secure: true,
        });
        setPageTransition("REDIRECTING");
        setOtpToken("");
        setIsOtp(false)
        setOtp(["", "", "", "", "", ""]);
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


  useEffect(() => {
    let timer;
    if (isOtp && seconds > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isOtp, seconds]);

  const handleResendOtp = () => {
  // Your resend OTP logic here
  console.log("OTP resent");
  handleCustomSignIn()
  setSeconds(60); // restart timer
  setCanResend(false);
};

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://afomamarketplace.com/sign-in"
          data-next-head=""
        />
        <title>Join or Log In | AFOMA Marketplace for Handmade Goods</title>
        <meta
          property="og:title"
          content="Join or Log In | AFOMA Marketplace for Handmade Goods"
        />
        <meta
          property="og:description"
          content="Join AFOMA Marketplace to buy or sell ethical handmade products. Easy access for artisans and shoppers"
        />
        <meta
          property="title"
          content="Join or Log In | AFOMA Marketplace for Handmade Goods"
        />
        <meta
          name="description"
          content=" Join AFOMA Marketplace today to buy or sell handmade goods. Free to join, seller-friendly, and supporting ethical, global commerce."
        ></meta>
        <meta property="og:url" content="https://afomamarketplace.com/sign-in" />
        <meta property="og:image" content="https://afomamarketplace.com/assets/sign-in.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AFOMA Marketplace" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </Head>
      <section>
        <div className="max-w-full mx-auto bg-orange-50 flex flex-col xl:flex-row items-center   px-4 xl:px-0 relative">
          <div className="hidden xl:flex items-center bg-[url('/assets/register-as-seller/simply-lexi.jpg')] xl:w-1/2 h-screen sticky top-0 bottom-0 bg-cover bg-center bg-[#000000a6] bg-blend-overlay">
            <div className="xl:w-[570px] mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <Image
                    src={"/assets/register-as-seller/simply-lexi.jpg"}
                    alt="Simply Lexi - Jewelry Maker"
                    height={150}
                    width={150}
                    className="rounded-full object-cover h-[150px] w-[150px] "
                  />
                </div>
                <div>
                  <h2
                    className={`text-white xl:tracking-[-0.72px] mb-1 text-3xl noto-font`}
                  >
                    Simply Lexi - Jewelry Maker
                  </h2>
                  <strong className="text-sm text-white mb-4">
                    Follow on Instagram: simplylexijewelry
                  </strong>
                </div>
              </div>
              <div>
                <p className="text-sm text-white mb-4">
                  Before registering on AFOMA, I was feeling disenchanted with
                  my business. I was overwhelmed and didn’t know what direction
                  to go. I decided to register my business on the platform - as
                  it was free to register, I had nothing to lose. I am so glad I
                  did.
                </p>
                <p className="text-sm text-white mb-4">
                  The community here at AFOMA has made me feel so supported as a
                  young small business owner. Whether I need help uploading a
                  product, opinions or to talk about a business problem with
                  people who get it, the community at AFOMA has had my back at
                  every turn, and I am so grateful.
                </p>
              </div>
            </div>
          </div>

          <div className="xl:w-1/2 xl:mx-auto">
            <div className="py-8 xl:py-16 xl:w-[570px] mx-auto">
              <div className="flex items-center justify-center mb-6 md:mb-14">
                <Link href="/">
                  <Image
                    src={
                      "/assets/AFOMA New Logo (940 x 300 px).png"
                    }
                    alt="AFOMA_Marketplace"
                    width={289}
                    height={42}
                    className="w-[189px] lg:w-[289px]"
                  />
                </Link>
              </div>

              <div className="bg-orange-100 p-4 md:p-8 mb-5 md:mb-7 rounded-md">
                {/* <h3
                  className={`text-lg md:text-2xl xl:text-3xl text-blue-950 mb-5 md:mb-9 noto-font`}
                >
                  Sign In
                </h3> */}
                {pageTransition === "REDIRECTING" && (
                  <>
                    <p>Youll be redirect in a second ...</p>
                  </>
                )}

                {pageTransition === "SIGN-IN" && (
                  <>
                    <div className="w-full max-w-md mx-auto px-4 pt-2">
                      {/* Tab Header */}
                      <div className="flex justify-center space-x-4 mb-6">
                        <button
                          onClick={() => setTab("SIGN-IN")}
                          className={`px-5 py-2 rounded-full transition-all duration-200 ${tab === "SIGN-IN"
                              ? "bg-primary text-white font-semibold shadow"
                              : "text-blue-900 hover:text-blue-900"
                            }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setTab("REGISTER")}
                          className={`px-5 py-2 rounded-full transition-all duration-200 ${tab === "REGISTER"
                              ? "bg-primary text-white font-semibold shadow"
                              : "text-blue-900 hover:text-blue-900"
                            }`}
                        >
                          Register
                        </button>
                      </div>

                      {/* Tab Content */}
                      {tab === "SIGN-IN" && (
                        <div className="w-full bg-orange-100 border border-orange-200 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between">
                          <form
                            onSubmit={handleCustomSignIn}
                            className="flex flex-col justify-between h-full space-y-6"
                          >
                            {!isOtp && (
                              <div className="relative w-full">
                                <input
                                  type="email"
                                  required
                                  placeholder="Email Address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-orange-200 bg-orange-100 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                <button
                                  type="submit"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-grey-500 hover:bg-orange-50 text-black-50 p-2 rounded-full transition-all"
                                  aria-label="Submit email"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 20 22"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 12h14m0 0l-6-6m6 6l-6 6"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                            {isOtp && (
                              <div className="relative w-full flex flex-col items-center gap-4 mb-4">
                                <button
                                  type="button"
                                  onClick={() => setIsOtp(false)}
                                  className="self-start text-sm text-blue-700 hover:text-blue-900 transition"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>

                                {/* OTP inputs */}
                                <div className="flex justify-center gap-2">
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
                              </div>
                            )}


                            {!isOtp && (
                              <p className="text-sm text-grey-600 text-center">
                                Welcome back! <br />
                                Please enter your email to sign in securely.
                              </p>
                            )}

                            {isOtp && (
                              <p className="text-sm text-grey-600 text-center">
                                {canResend ? (
                                  <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-blue-700 underline hover:text-blue-900"
                                  >
                                    Resend OTP
                                  </button>
                                ) : (
                                  <>Resend OTP after {seconds} seconds.</>
                                )}
                              </p>
                            )}

                            <div className="flex items-center my-4">
                              <hr className="flex-grow border-black" />
                              <span className="px-2 text-sm text-grey-50">or</span>
                              <hr className="flex-grow border-black" />
                            </div>

                            <p className="text-sm text-grey-50 text-center mt-4">
                              Don't have an account?{" "}
                              <button
                                type="button"
                                onClick={() => setTab("REGISTER")}
                                className="text-blue-800 underline"
                              >
                                Register here
                              </button>
                            </p>
                          </form>
                        </div>
                      )}

                      {tab === "REGISTER" && (
                        <div className="w-full bg-orange-100 border border-orange-200 rounded-2xl p-6 min-h-[300px] flex flex-col justify-center items-center text-center">
                          <ConnectEmbed
                            client={client}
                            wallets={wallets}
                            theme={lightTheme({
                              colors: {
                                modalBg: "#00000",
                                dropdownBg: "#00000",
                              },
                            })}
                            auth={{
                              doLogin,
                              doLogout,
                              getLoginPayload,
                              isLoggedIn,
                            }}
                          />
                          <p className="text-sm text-orange-600 mt-4">
                            New here? Connect your wallet to register securely.
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-sm mt-4 px-10">
                      
                    </p>
                  </>
                )}

                {pageTransition === "CHOOSE-ACCOUNT-TYPE" && (
                  // <>
                  //   <div className="text-center">
                  //     <p className="mb-4">
                  //       <p> If you are already an existing user Try Again </p>
                  //     </p>
                  //     <button
                  //       onClick={() =>
                  //         showPageRegisterAs("register-as-a-seller")
                  //       }
                  //       className="buttonprimary relative mr-2"
                  //     >
                  //       Try Again
                  //     </button>
                  //   </div>
                  //   <div className="text-center">
                  //     <p className="mb-4">
                  //       What type of account do you wish to create?
                  //     </p>
                  //     <button
                  //       onClick={() =>
                  //         showPageRegisterAs("register-as-a-seller")
                  //       }
                  //       className="buttonprimary relative mr-2"
                  //     >
                  //       Seller
                  //     </button>
                  //     <button
                  //       onClick={() => showPageRegisterAs("register")}
                  //       className="buttonprimary relative"
                  //     >
                  //       Customer
                  //     </button>
                  //   </div>
                  // </>

                  <>
                    <div className="text-center">
                      <h3
                        className={`text-lg md:text-2xl xl:text-3xl text-blue-950 mb-2 md:mb-2 pt-5 noto-font`}
                      >
                        Register
                      </h3>
                      <p className="mb-4 text-sm">
                        What type of account do you wish to create?
                      </p>
                      <button
                        onClick={() => showPageRegisterAs("register")}
                        className="buttonprimary relative mr-2"
                      >
                        Buyer
                      </button>
                      <button
                        onClick={() =>
                          showPageRegisterAs("register-as-a-seller")
                        }
                        className="buttonprimary relative"
                      >
                        Seller
                      </button>
                    </div>
                    <div className="text-center mt-5 md:mt-10">
                      <h3
                        className={`text-lg md:text-2xl xl:text-3xl text-blue-950 mb-2 md:mb-2 pt-5 noto-font`}
                      >
                        Retry
                      </h3>
                      <p className="mb-4">
                        If you are already an existing user
                      </p>
                      <button
                        onClick={ClearAllData}
                        className="buttonprimary relative mr-2"
                      >
                        Try Again
                      </button>
                      <p className="text-sm mt-2 px-4">
                        For existing users: Please log in using your previously
                        registered authentication method
                      </p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-slate-600 text-sm text-center">
                Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
