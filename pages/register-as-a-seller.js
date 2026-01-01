import Footer from "@/components/Footer";
import Footer2 from "@/components/Footer2";
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import countryData from "country-data";
import { State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";
import { object, string } from "yup";
import { findOptions, sellerOptions } from "@/lib/select-option";
import { socialMediaOpt } from "@/lib/select-option";
import Select from "react-select";
//const noto = Noto_Serif({ subsets: ["latin"] });

const RegisterAsASeller = () => {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code
  const [referralSource, setReferralSource] = useState([]); // State to hold region (state) code
  const [socialMedia, setSocialMedia] = useState([]); // State to hold region (state) code
  const [sellerOptions, setSellerOptions] = useState([]); // State to hold seller options
  const [userOptions, setUserOptions] = useState([]); // State to hold seller options

  const blockedCountries = [
    "Belarus",
    "Central African Republic",
    "China",
    "Korea, Democratic People's Republic Of",
    "Democratic Republic Of Congo",
    "Guatemala",
    "Haiti",
    "Iran, Islamic Republic Of",
    "Iraq",
    "Lebanon",
    "Libya",
    "Moldova",
    "Myanmar",
    "Nicaragua",
    "Russian Federation",
    "Somalia",
    "South Sudan",
    "Sri Lanka",
    "Sudan",
    "Syria",
    "Ukraine",
    "Venezuela, Bolivarian Republic Of",
    "Yemen"
  ];

  const countryOptions = Object.values(Object.values(countryData)[6])
    .filter((co) => co && co.name && !blockedCountries.includes(co.name)) // Remove undefined and entries without a name
    .map((co) => ({
      value: co.name, // Use the country name as both value and label
      label: co.name, // Same for label
    }));

  const uniqueCountryOptions = [
    ...new Set(countryOptions.map((option) => option.value)),
  ].map((value) => {
    return countryOptions.find((option) => option.value === value);
  }).sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (country) {
      const countryCode = fetchCountryCode(country);
      if (countryCode) {
        setCountryCode(countryCode);
        setStatesListData(countryCode);
      }
    }
  }, [country]);

  useEffect(() => {
    getSellers();
    getCustomer();
  }, [])

  const getSellers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`, {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          }
        }
      );
      const sellers = response.data.map((seller) => ({
        value: seller.userId,
        label: `${seller.firstName} ${seller.lastName} (${seller.storeTitle})`,
      }));
      setSellerOptions(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  }

  const getCustomer = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          }
        }
      );

      const users = response.data
        .filter(user => user.userRole === "customer")
        .map(user => ({
          value: user._id,
          label: `${user.firstName} ${user.lastName}`,
        }));
        console.log(users)
      setUserOptions(users);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  }

  const selectCountry = (val) => {
    setCountry(val);
  };

  const fetchCountryCode = (countryName) => {
    const countryInfo = countryData.countries.all.find(
      (c) => c.name === countryName
    );
    return countryInfo ? countryInfo.alpha2 : ""; // Use alpha2 for the country code
  };

  const setStatesListData = (countryCode) => {
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode);
      setStatesList(states);
    } else {
      setStatesList([]);
    }
  };

  const selectRegion = (val) => {
    setRegion(val);
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode);
      const selectedState = states.find((state) => state.name === val);
      if (selectedState) {
        const stateCode = selectedState.isoCode;
        setRegionCode(stateCode);
      } else {
        setRegionCode("");
      }
    }
  };
  //

  const [faqOne, setFaqOne] = useState(false);
  const [faqTwo, setFaqTwo] = useState(false);
  const [faqThree, setFaqThree] = useState(false);
  const [faqFour, setFaqFour] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const validationSchema = object({
    fname: string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    lname: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
    // password: string().required("Required").min(5),
    phone: string().required("Required"),
    agree: yup.boolean().oneOf([true], "Required"),
    city: string().required("Required"),
    countryName: string().required("Required"),
    state: string().required("Required"),
    zipCode: string().required("Required"),
    address: string().required("Required"),
    storeTitle: string().required("Required"),
    referral_source: string().required("Required"),
    referral_id: string().optional(),
    social_media: string().optional(),
    social_media_handle: string().optional(),
  });

  const initialValues = {
    fname: "",
    lname: "",
    email: "",
    // password: "",
    phone: "",
    city: "",
    countryName: country,
    contact: "",
    state: region,
    zipCode: "",
    address: "",
    storeTitle: "",
    web3address: "",
    agree: false,
    userRole: "customer",
    networkType: "Binance Network",
    countryCode: countryCode,
    stateCode: regionCode,
    referral_source: "",
    referral_id: "",
    social_media: "",
    social_media_handle: "",
  };
  // const clearUserLocalStorage = () => {
  //   localStorage.removeItem("user"); // Remove user-related data
  //   // You can add more keys here if there are other user-related data stored in localStorage
  // };
  const router = useRouter();
  const { wallet } = router.query;

  // const onSubmit = (values, { resetForm, setFieldValue }) => {
  //   setLoading(true);
  //   axios
  //     .create({
  //       headers: {
  //         "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //       },
  //     })
  //     .post(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers`, {
  //       enableProduct: false,
  //       firstName: values.fname,
  //       lastName: values.lname,
  //       email: values.email,
  //       phone: values.phone,
  //       // password: values.password,
  //       country: initialValues.countryName,
  //       state: initialValues.state,
  //       city: values.city,
  //       storeTitle: values.storeTitle,
  //       ZipCode: values.zipCode,
  //       streetAddress: values.address,
  //       web3address: values.web3address,
  //       userRole: "customer",
  //       status: "Pending",
  //       countryCode: countryCode,
  //       stateCode: regionCode,
  //     })
  //     .then(function (response) {
  //       toast.success("Registration Successful.");

  //       // Perform a hard redirect with a new page load
  //       window.location.href = `/thank-you-registration`;

  //       // Optionally, clear form and reset state if needed
  //       resetForm();
  //       setLoading(false);
  //     })
  //     .catch(function (error) {
  //       if (error?.response?.status == 403) {
  //         toast.error("User already exists.");
  //       } else {
  //         toast.error("Something went wrong.");
  //       }

  //       // Optionally clear state or handle form reset
  //       setCountry("");
  //       setRegion("");
  //       setLoading(false);
  //     });
  // };

  initialValues.web3address = wallet;

  const onSubmit = (values, { resetForm, setFieldValue }) => {
    setLoading(true);
    if((referralSource === "referred_by_seller" || referralSource === "referred_by_buyer") && !values.referral_id) {
      toast.error("Please select a seller you were referred by.");
      setLoading(false);
      return;
    }
    if(referralSource != "referred_by_seller" && referralSource != "referred_by_buyer"){
      values.referral_id = null
    }
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers`, {
        enableProduct: false,
        firstName: values.fname,
        lastName: values.lname,
        email: values.email,
        phone: values.phone,
        // password: values.password,
        country: initialValues.countryName,
        state: initialValues.state,
        city: values.city,
        storeTitle: values.storeTitle,
        ZipCode: values.zipCode,
        streetAddress: values.address,
        web3address: values.web3address,
        userRole: "seller",
        status: "Pending",
        countryCode: countryCode,
        stateCode: regionCode,
        referral_source: referralSource,
        referral_id: values.referral_id,
        social_media: values.social_media,
        social_media_handle: values.social_media_handle,
      })
      .then(function (response) {
        toast.success("Registration Successful.");
        // router.push(`/thank-you-registration`);

        const cartData = localStorage.getItem("cart"); // Keep cart data
        localStorage.clear(); // Clear all local storage
        if (cartData) {
          localStorage.setItem("cart", cartData); // Restore cart data
        }
        window.location.href = `/thank-you-registration`;
        resetForm();
        setLoading(false);
      })
      .catch(function (error) {
        if (error?.response?.status == 403) {
          toast.error("User already exist.");
        } else {
          toast.error("Something went wrong.");
        }
        setCountry("");
        setRegion("");
        setLoading(false);
      });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Register as a Seller on AFOMA Marketplace Today",
    url: "https://afomamarketplace.com/register-as-a-seller",
    headline: "Register as a Seller on AFOMA Marketplace Today",
    description:
      "Ready to sell your artwork? Register as a seller on AFOMA Marketplace and connect with buyers worldwide. Start your journey today!",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What payment methods are accepted on the AFOMA marketplace?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AFOMA Marketplace supports flexible payment options, including digital assets. Payments are processed securely, ensuring smooth transactions for both buyers and sellers.",
          },
        },
        {
          "@type": "Question",
          name: "Can I track the shipment of my order?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can track your shipments through the platform. AFOMA provides easy access to your order status and shipping information after the purchase is made.",
          },
        },
        {
          "@type": "Question",
          name: "How are transactions processed on the marketplace?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AFOMA Marketplace ensures secure payment processing with escrow services. Payments are held until the order is delivered, providing security for both buyers and sellers.",
          },
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "AFOMA Marketplace",
      logo: {
        "@type": "ImageObject",
        url: "https://afomamarketplace.com/assets/logo.png",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://afomamarketplace.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Register as a Seller",
          item: "https://afomamarketplace.com/register-as-a-seller",
        },
      ],
    },
  };

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="Register as a Seller on AFOMA Marketplace Today"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="Ready to sell your artwork? Register as a seller on AFOMA Marketplace and connect with buyers worldwide. Start your journey today!"
        ></meta>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>

      <section>
        <div className="max-w-full mx-auto bg-orange-50 flex flex-col xl:flex-row items-center   px-4 xl:px-0 relative">
          <div className="hidden xl:flex items-center bg-[url('/assets/register-as-seller/ritu.jpg')] xl:w-1/2 h-screen sticky top-0 bottom-0 bg-cover bg-center bg-[#000000bd] bg-blend-overlay">
            <div className="xl:w-[570px] mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <Image
                    src={"/assets/register-as-seller/ritu.jpg"}
                    alt="Ritu Garg, RG Jewelry Boutique  - Jewelry Maker"
                    height={150}
                    width={150}
                    className="rounded-full object-cover min-h-[150px] min-w-[150px] h-[150px] w-[150px]"
                  />
                </div>
                <div>
                  <h2
                    className={`text-white xl:tracking-[-0.72px] mb-1 text-3xl noto-font`}
                  >
                    Ritu Garg, RG Jewelry Boutique - Jewelry Maker
                  </h2>
                  <strong className="text-sm text-white mb-4">
                    Follow on Instagram: jewelryboutique
                  </strong>
                </div>
              </div>
              <div>
                <p className="text-sm text-white mb-4">
                  My passion for Indian jewelry stems from the intricate
                  craftsmanship and rich cultural heritage behind each piece.
                </p>
                <p className="text-sm text-white mb-4">
                  I started my business to share the beauty and artistry of
                  Indian jewelry with others, offering high-quality pieces that
                  are affordable and perfect for sensitive skin.
                </p>
                <p className="text-sm text-white mb-4">
                  AFOMA Marketplace has given me a wonderful platform to
                  showcase my designs, and I am so grateful for the immense
                  support I’ve received.
                </p>
                <p className="text-sm text-white mb-4">
                  I look forward to growing both my business and my presence on
                  AFOMA in the years ahead!
                </p>
              </div>
            </div>
          </div>

          <div className="xl:w-1/2 xl:mx-auto">
            <div className="py-8 xl:py-16 xl:w-[620px] mx-auto">
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
                <div>
                  <h2
                    className={`noto-font text-2xl xl:text-3xl text-blue-950 mb-5 lg:mb-7`}
                  >
                    Register as a Seller
                  </h2>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    // onSubmit={() =>}
                    onSubmit={onSubmit}
                  >
                    {({ errors, setFieldValue, touched, submitCount }) => (
                      <Form className="st-form ">
                        <div className="grid gap-4 lg:gap-6 md:grid-cols-2 mb-6 lg:mb-12">
                          <div className="relative">
                            <label htmlFor="fname">
                              First Name{" "}
                              <span className="text-red-700 ">*</span>
                            </label>
                            <Field
                              type="text"
                              name="fname"
                              id="fname"
                              placeholder="Eg. John"
                            />
                            <ErrorMessage
                              name="fname"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative">
                            <label htmlFor="lname">
                              Last Name <span className="text-red-700 ">*</span>
                            </label>
                            <Field
                              type="text"
                              name="lname"
                              id="lname"
                              placeholder="Eg. Doe"
                            />
                            <ErrorMessage
                              name="lname"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative">
                            <label htmlFor="email">
                              Email Address{" "}
                              <span className="text-red-700 ">*</span>
                            </label>
                            <Field
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Eg. johndoe@gmail.com"
                            />
                            <ErrorMessage
                              name="email"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          {/* <div className="relative">
                        <label htmlFor="password">
                          Password <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          className="absolute right-4 bottom-3.5"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </button>
                        <ErrorMessage
                          name="password"
                          component="p"
                          className="invalid"
                        />
                      </div> */}
                          <div className="relative">
                            <div>
                              {" "}
                              <label htmlFor="storeTitle">
                                Shop Title{" "}
                                <span className="text-red-700 ">*</span>
                              </label>
                            </div>
                            <div>
                              <Field
                                type="text"
                                name="storeTitle"
                                id="storeTitle"
                                placeholder="Enter shop title"
                              />
                              <ErrorMessage
                                name="storeTitle"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative country-select">
                             <label htmlFor="countryName">
                              Country{" "}
                              <span className="text-red-700 ">*</span>
                            </label>
                            
                            <select
                              name="countryName"
                              id="countryName"
                              value={country}
                              onChange={(event) => {
                                const selectedValue = event.target.value;
                                console.log("Selected Country:", selectedValue);
                                selectCountry(selectedValue);
                                setFieldValue("countryName", selectedValue);
                              }}
                              className="st-select"
                            >
                              <option value="" disabled>
                                Select Country
                              </option>
                              {uniqueCountryOptions.map(({ label, value }) => (
                                <option key={label} value={label}>
                                  {label}
                                </option>
                              ))}
                            </select>
                            <ErrorMessage
                              name="countryName"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative country-select">
                            <label htmlFor="state">
                              State/Province{" "}
                              <span className="text-red-700 ">*</span>
                            </label>

                            <select
                              name="state"
                              id="state"
                              value={region}
                              onChange={(event) => {
                                const selectedValue = event.target.value;
                                selectRegion(selectedValue);
                                setFieldValue("state", selectedValue);
                              }}
                              className="st-select"
                            >
                              <option value="" disabled>
                                Select state or province
                              </option>
                              {statesList.map(({ name }) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>

                            <ErrorMessage
                              name="state"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative">
                            <label htmlFor="city">
                              City <span className="text-red-700 ">*</span>
                            </label>
                            <Field
                              type="text"
                              name="city"
                              id="city"
                              placeholder="Enter city"
                            />
                            <ErrorMessage
                              name="city"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative viewform">
                            <label htmlFor="phone">
                              Contact No.{" "}
                              <span className="text-red-700 ">*</span>
                            </label>
                            <Field name="phone">
                              {({ field }) => (
                                <PhoneInput
                                  country={`ca`}
                                  countryCode={`ca`}
                                  value={field.value}
                                  onChange={(value) =>
                                    setFieldValue("phone", `+${value}`)
                                  }
                                  id="phone"
                                  name="phone"
                                  type="text"
                                  inputProps={{
                                    className: `${
                                      errors.phone &&
                                      touched.phone &&
                                      submitCount > 0
                                        ? "border-red-600"
                                        : "border-slate-300"
                                    }`,
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="phone"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative">
                            <label htmlFor="zipCode">
                              Zip/Postal Code{" "}
                              <span className="text-red-700 ">*</span>
                            </label>
                            <Field
                              type="text"
                              name="zipCode"
                              id="zipCode"
                              placeholder="Enter zip/postal code"
                            />
                            <ErrorMessage
                              name="zipCode"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative md:col-span-2">
                            <label htmlFor="address">
                              Street Address{" "}
                              <span className="text-red-700 ">*</span>
                            </label>
                            <Field
                              type="text"
                              name="address"
                              id="address"
                              placeholder="Enter street address"
                            />
                            <ErrorMessage
                              name="address"
                              component="p"
                              className="invalid"
                            />
                          </div>
                          <div className="relative referral-select md:col-span-2">
                            <label htmlFor="referral_source">
                              How did you find us?{" "}
                              <span className="text-red-700 ">*</span>
                            </label>

                            <select
                              name="referral_source"
                              id="referral_source"
                              value={referralSource}
                              onChange={(event) => {
                                const selectedValue = event.target.value;
                                console.log(selectedValue)
                                setReferralSource(selectedValue);
                                setFieldValue("referral_source", selectedValue);
                              }}
                              className="st-select"
                            >
                              <option value="" disabled>
                                How did you find us?
                              </option>
                              {findOptions.map((opt) => (
                                <option key={opt.label} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>

                            <ErrorMessage
                              name="state"
                              component="p"
                              className="invalid"
                            />
                          </div>

                            {/* 👉 Conditional field */}
                            {referralSource === "referred_by_seller" && (
                              <div className="relative referral-select md:col-span-2">
                                <label htmlFor="referral_id">
                                  Please Select/Search Seller <span className="text-red-700">*</span>
                                </label>

                              <Select
                                id="referral_id"
                                name="referral_id"
                                options={sellerOptions} // 👈 pass array of sellers here
                                placeholder="Search or select seller..."
                                isSearchable
                                onChange={(selected) => setFieldValue("referral_id", selected?.value || "")}
                                classNamePrefix="st-select"
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    backgroundColor: "#FFEDD5", // orange-100 : orange-50
                                    border: "1px solid rgba(71, 85, 105, 0.8)", // slate-600/80
                                    borderRadius: "0.375rem", // rounded-md
                                    height: "3rem", // h-10
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    border: "1px solid rgba(71, 85, 105, 0.8)",
                                    borderRadius: "0.375rem",
                                    marginTop: "0.25rem",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    fontSize: "0.875rem", // text-sm
                                  }),
                                  option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? "#1E40AF" : "",
                                    color: state.isFocused ? "#FFFFFF" : "", // slate-700
                                    cursor: "pointer",
                                    padding: "0.25rem 0.5rem", // px-2 py-1 → reduces vertical space
                                    lineHeight: "1.25rem",     // leading-5
                                    fontSize: "0.875rem",      // text-sm
                                  }),
                                }}
                              />

                                <ErrorMessage
                                  name="referral_id"
                                  component="p"
                                  className="invalid"
                                />
                              </div>
                            )}

                            {referralSource === "referred_by_buyer" && (
                              <div className="relative referral-select md:col-span-2">
                                <label htmlFor="referral_id">
                                  Please Select/Search Buyer <span className="text-red-700">*</span>
                                </label>

                              <Select
                                id="referral_id"
                                name="referral_id"
                                options={userOptions} // 👈 pass array of sellers here
                                placeholder="Search or select buyer..."
                                isSearchable
                                onChange={(selected) => setFieldValue("referral_id", selected?.value || "")}
                                classNamePrefix="st-select"
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    backgroundColor: "#FFEDD5", // orange-100 : orange-50
                                    border: "1px solid rgba(71, 85, 105, 0.8)", // slate-600/80
                                    borderRadius: "0.375rem", // rounded-md
                                    height: "3rem", // h-10
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    border: "1px solid rgba(71, 85, 105, 0.8)",
                                    borderRadius: "0.375rem",
                                    marginTop: "0.25rem",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    fontSize: "0.875rem", // text-sm
                                  }),
                                  option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? "#1E40AF" : "",
                                    color: state.isFocused ? "#FFFFFF" : "", // slate-700
                                    cursor: "pointer",
                                    padding: "0.25rem 0.5rem", // px-2 py-1 → reduces vertical space
                                    lineHeight: "1.25rem",     // leading-5
                                    fontSize: "0.875rem",      // text-sm
                                  }),
                                }}
                              />

                                <ErrorMessage
                                  name="referral_id"
                                  component="p"
                                  className="invalid"
                                />
                              </div>
                            )}
                          

                          <div className="relative referral-select">
                            <label htmlFor="referral_source">
                              Social Media Platform{" "}
                            </label>
                            <select
                              name="social_media"
                              id="social_media"
                              value={socialMedia}
                              onChange={(event) => {
                                const selectedValue = event.target.value;
                                setSocialMedia(selectedValue);
                                setFieldValue("social_media", selectedValue);
                              }}
                              className="st-select"
                            >
                              <option value="" disabled>
                                Select the platform you use
                              </option>
                              {socialMediaOpt.map((opt) => (
                                <option key={opt.label} value={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>

                            <ErrorMessage
                              name="state"
                              component="p"
                              className="invalid"
                            />
                          </div>
                          <div className="relative">
                            <label htmlFor="social_media_handle">
                              Social Media Handle{" "}
                            </label>
                            <Field
                              type="text"
                              name="social_media_handle"
                              id="social_media_handle"
                              placeholder="@yourhandle or profile link"
                            />
                            <ErrorMessage
                              name="social_media_handle"
                              component="p"
                              className="invalid"
                            />
                          </div>
                          <div className="relative md:col-span-2 pointer-events-none">
                            <label htmlFor="web3address">
                              Web3 Wallet Address
                            </label>
                            <p className="mb-1 -mt-1 text-xs font-medium text-blue-950">
                              Currently supporting BNB Smart Chain Network
                              Addressses.
                            </p>
                            <p className="text-xs font-medium">
                              This address is automatically linked to your
                              E-Mail account.
                              <br /> This optional Web3 wallet allows secure
                              sign-in (without email), digital asset
                              transactions, and loyalty reward redemption. In
                              addition, it can be used for Tamperproof Digital
                              Product Certificates and NFT purchases (applicable
                              to Digital Artists).
                            </p>
                            <Field
                              readOnly
                              type="text"
                              name="web3address"
                              id="web3address"
                              className="pointer-events-none"
                              placeholder="Enter Web3 Wallet Address"
                            />
                          </div>

                          <div className="relative mb-3 md:col-span-2">
                            <label
                              className="gap-20 text-sm text-slate-600 pt-2"
                              htmlFor="agree"
                            >
                              <Field type="checkbox" name="agree" id="agree" />
                              <span>
                                Yes, I agree to the{" "}
                                <Link
                                  href="/terms-conditions"
                                  className="underline hover:text-primary"
                                >
                                  Terms and Conditions
                                </Link>
                              </span>
                            </label>
                            <ErrorMessage
                              name="agree"
                              component="p"
                              className="invalidcheckbox"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <button
                            type="submit"
                            className={`buttonprimary rounded flex gap-2 items-center`}
                            disabled={loading}
                          >
                            {loading ? (
                              <>Submitting...</>
                            ) : (
                              <>Register as a seller</>
                            )}
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
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>

                  <p className="text-center text-sm text-slate-600 pt-5">
                    Already have an account?{" "}
                    <Link href="/sign-in">
                      <span className="text-primary font-medium">Sign In</span>
                    </Link>
                  </p>
                </div>
              </div>
              <p className="text-slate-600 text-sm text-center">
                Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* 
      <section className="max-w-screen-md xl:max-w-screen-xl mx-auto px-4 py-8 md:pb-16 xl:pb-32 relative">
        <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-8 lg:mt-6 lg:mb-10">
          <Link href="/" className="hover:text-primary">
            {" "}
            <span>Home</span>
          </Link>
          <FontAwesomeIcon icon={faAngleRight} size="sm" />
          <span className="text-primary ">Register as a Seller</span>
        </div>
        <div className="flex flex-col-reverse xl:flex-row xl:justify-between xl:items-start xl:relative gap-6">
          <div className="max-w-[558px]">
            <div className="mb-8">
              <h1
                className={`text-4xl xl:text-5xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950  mb-5 noto-font `}
              >
                A Marketplace for all Artists & Artisans
              </h1>
              <p className="text-blue-950 mb-8 xl:mb-16">
                A purpose-driven handicraft marketplace built to create
                opportunities and a fair market access for all creators across
                the globe.
              </p>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mb-6 md:mb-9 text-2xl xl:text-4xl noto-font`}
              >
                Enabling the creative economy for the global community
              </h2>
              <div className="flex items-center justify-center">
                <Image
                  src={"/assets/register-as-seller/register_page_banner.jpg"}
                  alt="Banner Image Home Page Afoma"
                  height={252}
                  width={558}
                  quality={100}
                />
              </div>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mt-8 md:mt-12 xl:mt-16 mb-6 md:mb-9 text-2xl xl:text-4xl noto-font`}
              >
                Maximize Your Profits!
              </h2>
              <div className="mb-6 md:mb-12 xl:mb-16">
                <div className="flex gap-2.5 items-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18.594"
                    height="18.594"
                    viewBox="0 0 18.594 18.594"
                    className="flex-shrink-0"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                  <p className="text-blue-950">
                    No Shipping Label (Waybill) Fee
                  </p>
                </div>
                <div className="flex gap-2.5 items-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18.594"
                    height="18.594"
                    viewBox="0 0 18.594 18.594"
                    className="flex-shrink-0"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                  <p className="text-blue-950">No Payment Processing Fee</p>
                </div>
                <div className="flex gap-2.5 items-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18.594"
                    height="18.594"
                    viewBox="0 0 18.594 18.594"
                    className="flex-shrink-0"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                  <p className="text-blue-950">No Listing Currency Fee</p>
                </div>
                <div className="flex gap-2.5 items-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18.594"
                    height="18.594"
                    viewBox="0 0 18.594 18.594"
                    className="flex-shrink-0"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                  <p className="text-blue-950">
                    Optional and Affordable Marketing and Advertising Fee
                  </p>
                </div>
                <div className="flex gap-2.5 items-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18.594"
                    height="18.594"
                    viewBox="0 0 18.594 18.594"
                    className="flex-shrink-0"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                  <p className="text-blue-950">
                    No Listing Fee (Promotional Offer)
                  </p>
                </div>
              </div>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mt-8 md:mt-12 xl:mt-16 mb-8 md:mb-9 text-2xl xl:text-4xl noto-font`}
              >
                Our Value Proposition
              </h2>
              <div className="grid gap-5 md:grid-cols-2 mb-6 md:mb-12 xl:mb-16">
                <div className="bg-orange-100 px-5 py-4 rounded-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.677"
                    height="26.749"
                    viewBox="0 0 29.677 26.749"
                  >
                    <g
                      id="Borderless_Payments"
                      data-name="Borderless Payments"
                      transform="translate(-1.943 -4.909)"
                    >
                      <path
                        id="Path_3176"
                        data-name="Path 3176"
                        d="M28.36,11.8A3.456,3.456,0,1,0,24.9,8.342,3.46,3.46,0,0,0,28.36,11.8Zm0-5.924a2.468,2.468,0,1,1-2.468,2.468A2.471,2.471,0,0,1,28.36,5.874Z"
                        transform="translate(-11.625 0)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_3177"
                        data-name="Path 3177"
                        d="M17.789,23.9a.99.99,0,0,0,.538-.161A10.274,10.274,0,0,1,20.8,22.594v.759a.494.494,0,0,0,.987,0V21.942a.5.5,0,0,0-.615-.479,11.291,11.291,0,0,0-3.382,1.454,7.423,7.423,0,0,1,4.235-3.465,2.785,2.785,0,0,0,4.461,0,7.422,7.422,0,0,1,4.232,3.457,11.441,11.441,0,0,0-3.379-1.445.5.5,0,0,0-.615.479v1.412a.494.494,0,0,0,.987,0v-.759a10.277,10.277,0,0,1,2.473,1.145.977.977,0,0,0,1.218-.114.961.961,0,0,0,.182-1.187,8.4,8.4,0,0,0-5.267-4.06.5.5,0,0,0-.6.373,1.438,1.438,0,0,1-1.458.846,1.438,1.438,0,0,1-1.458-.846.494.494,0,0,0-.6-.373,8.4,8.4,0,0,0-5.265,4.057.992.992,0,0,0,.86,1.466Z"
                        transform="translate(-7.521 -6.811)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_3178"
                        data-name="Path 3178"
                        d="M4.486,51.859a3.456,3.456,0,1,0-.834-6.331,3.469,3.469,0,0,0,.834,6.331Zm-.34-5.476a2.469,2.469,0,0,1,2.468,4.275A2.469,2.469,0,0,1,4.146,46.383Z"
                        transform="translate(0 -20.332)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_3179"
                        data-name="Path 3179"
                        d="M12.392,38.233a.5.5,0,0,0,.384.036,1.421,1.421,0,0,1,1.462.837,1.433,1.433,0,0,1-.006,1.692.5.5,0,0,0-.018.707,8.4,8.4,0,0,0,5.992,2.53,1,1,0,0,0,1.1-.756.974.974,0,0,0-.509-1.106A10.244,10.244,0,0,1,18.563,40.6L19,40.348a.494.494,0,0,0-.493-.855l-1,.578a.5.5,0,0,0-.107.772,11.269,11.269,0,0,0,2.947,2.2,7.391,7.391,0,0,1-5.118-1.934c.89-1.429-.545-3.925-2.229-3.863a7.416,7.416,0,0,1,.879-5.394,11.33,11.33,0,0,0,.438,3.649.5.5,0,0,0,.722.292l1.032-.6a.494.494,0,0,0-.495-.854l-.467.27a10.16,10.16,0,0,1-.244-2.713.98.98,0,0,0-.706-1,.966.966,0,0,0-1.124.435,8.419,8.419,0,0,0-.881,6.594.5.5,0,0,0,.241.3Z"
                        transform="translate(-5.01 -13.139)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_3180"
                        data-name="Path 3180"
                        d="M53.229,45.527a3.456,3.456,0,1,0,1.265,4.721,3.461,3.461,0,0,0-1.265-4.721Zm.41,4.227a2.469,2.469,0,0,1-4.276-2.468A2.469,2.469,0,0,1,53.638,49.754Z"
                        transform="translate(-23.335 -20.331)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_3181"
                        data-name="Path 3181"
                        d="M39.372,31.908a10.323,10.323,0,0,1-.249,2.715l-.546-.316a.494.494,0,0,0-.494.855l1.111.642a.5.5,0,0,0,.722-.293,11.267,11.267,0,0,0,.435-3.658,7.432,7.432,0,0,1,.886,5.4c-1.688-.064-3.123,2.432-2.233,3.863a7.451,7.451,0,0,1-5.113,1.939,11.4,11.4,0,0,0,2.942-2.208.5.5,0,0,0-.108-.772l-1.037-.6a.494.494,0,0,0-.493.855l.471.271a10.137,10.137,0,0,1-2.229,1.573.974.974,0,0,0-.506,1.108.993.993,0,0,0,1.088.754,8.391,8.391,0,0,0,6-2.53A.494.494,0,0,0,40,40.805c-.841-.771.37-2.879,1.461-2.53a.5.5,0,0,0,.624-.337,8.416,8.416,0,0,0-.885-6.592.987.987,0,0,0-1.826.56Z"
                        transform="translate(-15.676 -13.146)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_3182"
                        data-name="Path 3182"
                        d="M31.8,33.8a4.937,4.937,0,1,0-4.937,4.937A4.942,4.942,0,0,0,31.8,33.8Zm-4.937,3.95a3.95,3.95,0,1,1,3.95-3.949A3.954,3.954,0,0,1,26.867,37.75Z"
                        transform="translate(-10.133 -12.128)"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                  <h3 className="mt-4 font-medium text-blue-950 text-lg md:text-xl mb-2.5">
                    Borderless Payments
                  </h3>
                  <p className="text-blue-950 text-sm">
                    Using digital assets as a remittance option, we can reach
                    marginalized or unbanked creators across the globe.
                  </p>
                </div>
                <div className="bg-orange-100 px-5 py-4 rounded-sm">
                  <svg
                    id="Cost_Savings"
                    data-name="Cost Savings"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.566"
                    height="26.749"
                    viewBox="0 0 23.566 26.749"
                  >
                    <path
                      id="Path_2417"
                      data-name="Path 2417"
                      d="M187.948,153.536a.418.418,0,0,0-.15-.005,1,1,0,0,1-.882-.989.439.439,0,1,0-.878,0,1.877,1.877,0,0,0,1.38,1.807v.439a.439.439,0,0,0,.878,0v-.412a1.874,1.874,0,0,0-.384-3.707,1,1,0,1,1,1-1,.439.439,0,0,0,.878,0,1.877,1.877,0,0,0-1.49-1.834v-.4a.439.439,0,0,0-.878,0v.426a1.873,1.873,0,0,0,.494,3.681,1,1,0,0,1,.036,1.99Zm0,0"
                      transform="translate(-175.855 -138.938)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2418"
                      data-name="Path 2418"
                      d="M104.195,112.854a6.362,6.362,0,1,0,6.362-6.362A6.362,6.362,0,0,0,104.195,112.854Zm6.362-5.485a5.485,5.485,0,1,1-5.485,5.485A5.485,5.485,0,0,1,110.557,107.37Zm0,0"
                      transform="translate(-98.5 -100.651)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2419"
                      data-name="Path 2419"
                      d="M20.942,328.1l-3.437,1.624a2.8,2.8,0,0,0-2.387-1.473l-3.173-.087A3.35,3.35,0,0,1,10.5,327.8l-.323-.167a5.7,5.7,0,0,0-5.275.006l.02-.731a.439.439,0,0,0-.427-.451l-3.479-.1a.439.439,0,0,0-.451.427l-.21,7.635a.439.439,0,0,0,.427.451l3.479.1h.012a.439.439,0,0,0,.439-.427l.01-.365.9-.484a1.55,1.55,0,0,1,1.157-.127l5.4,1.515.028.007a5.777,5.777,0,0,0,1.186.122,5.854,5.854,0,0,0,2.446-.534.408.408,0,0,0,.054-.03l7.826-5.062a.439.439,0,0,0,.144-.584,2.216,2.216,0,0,0-2.927-.892ZM1.249,334l.186-6.758,2.6.072-.186,6.758Zm14.2-.115a4.975,4.975,0,0,1-3.042.34l-5.383-1.511a2.426,2.426,0,0,0-1.809.2l-.462.247.124-4.493a4.823,4.823,0,0,1,4.9-.261l.323.167a4.237,4.237,0,0,0,1.821.47l3.173.087a1.924,1.924,0,0,1,1.829,1.534l-4.726-.13a.439.439,0,1,0-.024.877l5.216.144H17.4a.439.439,0,0,0,.438-.427,2.784,2.784,0,0,0-.042-.569l3.525-1.666.01,0a1.341,1.341,0,0,1,1.516.212Zm0,0"
                      transform="translate(-0.36 -308.457)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2420"
                      data-name="Path 2420"
                      d="M213.081,4.607V.439a.439.439,0,1,0-.878,0V4.607a.439.439,0,1,0,.878,0Zm0,0"
                      transform="translate(-200.584)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2421"
                      data-name="Path 2421"
                      d="M273.081,42.413V40.439a.439.439,0,1,0-.878,0v1.974a.439.439,0,1,0,.878,0Zm0,0"
                      transform="translate(-257.294 -37.806)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2422"
                      data-name="Path 2422"
                      d="M153.081,42.413V40.439a.439.439,0,1,0-.878,0v1.974a.439.439,0,1,0,.878,0Zm0,0"
                      transform="translate(-143.875 -37.806)"
                      fill="#1F628E"
                    />
                  </svg>

                  <h3 className="mt-4 font-medium text-blue-950 text-lg md:text-xl mb-2.5">
                    Cost Savings
                  </h3>
                  <p className="text-blue-950 text-sm">
                    Take home 90% on the sale of every product you sell on our
                    marketplace. No hidden costs or complex pricing plans.
                  </p>
                </div>
                <div className="bg-orange-100 px-5 py-4 rounded-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24.018"
                    height="24.161"
                    viewBox="0 0 24.018 24.161"
                  >
                    <g
                      id="Genuinely_Handmade"
                      data-name="Genuinely Handmade"
                      transform="translate(-132.777 615.686)"
                    >
                      <g id="g6059" transform="translate(133.283 -615.186)">
                        <g
                          id="Group_40848"
                          data-name="Group 40848"
                          transform="translate(0 0)"
                        >
                          <g id="g6067" transform="translate(0 8.123)">
                            <path
                              id="path6069"
                              d="M-37.027,0l-.915,1.585a8.97,8.97,0,0,0,1.425,10.826h0a8.968,8.968,0,0,0,12.683,0l4.1-4.1"
                              transform="translate(39.143)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6071" transform="translate(3.378)">
                            <path
                              id="path6073"
                              d="M0-103.889l.78-1.35a1.878,1.878,0,0,1,2.533-.705,1.912,1.912,0,0,1,.7,2.62l-.975,1.688,7.625-7.625a1.912,1.912,0,0,1,2.711,0,1.878,1.878,0,0,1-.025,2.629l1.106-1.107a1.877,1.877,0,0,1,2.629-.025,1.912,1.912,0,0,1,0,2.711l-1.63,1.629a1.878,1.878,0,0,1,2.63-.025,1.912,1.912,0,0,1,0,2.711l-1.629,1.629a1.877,1.877,0,0,1,2.629-.025,1.911,1.911,0,0,1,0,2.711l-1.254,1.254"
                              transform="translate(0 109.827)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6075" transform="translate(15.812 10.713)">
                            <path
                              id="path6077"
                              d="M-70.159,0l-4.01,4.01"
                              transform="translate(74.169)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6079" transform="translate(13.156 6.399)">
                            <path
                              id="path6081"
                              d="M-99.193,0l-5.67,5.67"
                              transform="translate(104.862)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6083" transform="translate(10.501 3.19)">
                            <path
                              id="path6085"
                              d="M-108.87,0l-6.223,6.223"
                              transform="translate(115.093)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6087" transform="translate(9.948 8.86)">
                            <path
                              id="path6089"
                              d="M0,0,6.417,6.417"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6091" transform="translate(3.506 13.22)">
                            <path
                              id="path6093"
                              d="M-121.01-63.017l.25-.25a1.967,1.967,0,0,0-.018-2.8,1.98,1.98,0,0,0-2.734-.01,1.962,1.962,0,0,0-.544.934,1.957,1.957,0,0,0-.544-.934,1.979,1.979,0,0,0-2.733.01,1.967,1.967,0,0,0-.019,2.8L-125.086-61a1.456,1.456,0,0,0,2.06,0l.232-.232"
                              transform="translate(127.927 66.618)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                          <g id="g6147" transform="translate(5.956 8.19)">
                            <path
                              id="path6149"
                              d="M-8.017,0l-.336.48a.673.673,0,0,0,.075.862l.388.388a1.424,1.424,0,0,1,.417,1.007v.653"
                              transform="translate(8.475)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>

                  <h3 className="mt-4 font-medium text-blue-950 text-lg md:text-xl mb-2.5">
                    Genuinely Handmade
                  </h3>
                  <p className="text-blue-950 text-sm">
                    We are a handmade-only marketplace. We choose to empower
                    you, the small business owner.
                  </p>
                </div>

                <div className="bg-orange-100 px-5 py-4 rounded-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28.798"
                    height="27.374"
                    viewBox="0 0 28.798 27.374"
                  >
                    <g
                      id="A_Shared_Economy"
                      data-name="A Shared Economy"
                      transform="translate(0.05 -12.643)"
                    >
                      <path
                        id="Path_3157"
                        data-name="Path 3157"
                        d="M206.646,186.1l-1.993,1.993a.421.421,0,0,0,.6.595l1.993-1.993a1.8,1.8,0,0,1,1.279-.53h4.085a1.8,1.8,0,0,1,1.279.53l1.354,1.354a.421.421,0,0,0,.3.123h5.8a.421.421,0,1,0,0-.841H215.71l-1.23-1.23a2.633,2.633,0,0,0-1.874-.776H208.52A2.634,2.634,0,0,0,206.646,186.1Z"
                        transform="translate(-193.057 -162.945)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3158"
                        data-name="Path 3158"
                        d="M165.007,250.252a.421.421,0,0,0-.595-.595l-.571.571a2.025,2.025,0,0,0,2.864,2.865l1.4-1.4a3.093,3.093,0,0,0,1.887.635h1.021a3.1,3.1,0,0,0,2.2-.913l.387-.387,1.727,1.727a.421.421,0,0,0,.6-.595l-1.727-1.727.524-.524a.421.421,0,1,0-.595-.595l-.821.821h0l-.684.684a2.26,2.26,0,0,1-1.609.666h-1.021a2.26,2.26,0,0,1-1.609-.666.421.421,0,0,0-.595,0L166.11,252.5a1.184,1.184,0,1,1-1.675-1.674Z"
                        transform="translate(-154.092 -223.236)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3159"
                        data-name="Path 3159"
                        d="M28.277,312.805h-3.8c.005-.055.008-.111.008-.167a1.758,1.758,0,0,0-.518-1.252l-.864-.864a.421.421,0,0,0-.595.595l.864.864a.928.928,0,1,1-1.313,1.313l-2.371-2.371a.421.421,0,0,0-.595.595l2.71,2.71a.928.928,0,0,1-1.313,1.313l-3.448-3.448a.421.421,0,1,0-.595.595l2.547,2.547a.928.928,0,0,1-1.314,1.312l-2.533-2.533a.421.421,0,0,0-.595.595l2.166,2.166a.928.928,0,1,1-1.313,1.313l-.676-.676a1.8,1.8,0,0,0,.017-.243,1.77,1.77,0,0,0-1.77-1.77c-.049,0-.1,0-.144.006,0-.048.006-.1.006-.144a1.77,1.77,0,0,0-1.77-1.77c-.049,0-.1,0-.145.006a1.768,1.768,0,0,0-1.763-1.914c-.049,0-.1,0-.144.006,0-.048.006-.1.006-.144A1.77,1.77,0,0,0,6,310.195l-1.356,1.356a1.773,1.773,0,0,0-.345,2.015H.421a.421.421,0,0,0,0,.841H5.145a1.763,1.763,0,0,0,.747.165c.049,0,.1,0,.144-.006,0,.048-.006.1-.006.144a1.768,1.768,0,0,0,1.77,1.769c.048,0,.1,0,.144-.006,0,.048-.006.1-.006.145a1.77,1.77,0,0,0,1.77,1.77c.049,0,.1,0,.145-.006a1.771,1.771,0,0,0,2.99,1.418.421.421,0,0,0-.584-.606.928.928,0,0,1-1.3-1.324l1.356-1.356a.928.928,0,0,1,1.313,1.313l-.1.1a.421.421,0,0,0,.595.595l.1-.1a1.787,1.787,0,0,0,.15-.171l.433.433a1.77,1.77,0,0,0,3.014-1.1,1.776,1.776,0,0,0,.512.075,1.77,1.77,0,0,0,1.726-1.377,1.769,1.769,0,0,0,2.786-1.883,1.762,1.762,0,0,0,1.118-.512,1.791,1.791,0,0,0,.2-.243h4.112a.421.421,0,1,0,0-.841Zm-23.042.654a.93.93,0,0,1,0-1.313l1.356-1.356A.928.928,0,0,1,7.9,312.1l-1.356,1.356A.929.929,0,0,1,5.235,313.459Zm1.908,1.908a.928.928,0,0,1,0-1.313L8.5,312.7a.928.928,0,0,1,1.313,1.313h0l-1.356,1.356A.93.93,0,0,1,7.143,315.367Zm3.221,1.908a.928.928,0,1,1-1.313-1.313l1.356-1.356h0a.928.928,0,1,1,1.313,1.313Z"
                        transform="translate(0 -280.326)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3160"
                        data-name="Path 3160"
                        d="M1.155,201.244H6.533a.421.421,0,0,0,.273-.1l1.069-.913a1.745,1.745,0,0,1,1.132-.417h3.22a.421.421,0,0,0,0-.841H9.007a2.587,2.587,0,0,0-1.678.619l-.951.812H1.155a.421.421,0,1,0,0,.841Z"
                        transform="translate(-0.693 -175.83)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3161"
                        data-name="Path 3161"
                        d="M206.378,62.928l-.373,1.162a.6.6,0,0,0,.81.728l1.319-.585a.239.239,0,0,1,.193,0l1.319.585a.6.6,0,0,0,.81-.728h0l-.372-1.162.821-1.008a.735.735,0,0,0-.569-1.2h-.851l-.628-1.012a.735.735,0,0,0-1.248,0l-.628,1.012h-.851a.735.735,0,0,0-.569,1.2Zm.659-1.365a.73.73,0,0,0,.624-.347l.569-.917.569.917a.73.73,0,0,0,.624.347h.686l-.716.878a.732.732,0,0,0-.13.688l.224.7-.82-.363a1.082,1.082,0,0,0-.875,0l-.82.363.224-.7a.732.732,0,0,0-.13-.688l-.716-.878Z"
                        transform="translate(-193.87 -44.051)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3162"
                        data-name="Path 3162"
                        d="M248.935,14.118a.421.421,0,0,0,.421-.421v-.584a.421.421,0,1,0-.841,0V13.7A.421.421,0,0,0,248.935,14.118Z"
                        transform="translate(-234.574)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3163"
                        data-name="Path 3163"
                        d="M182.471,41.818a.421.421,0,0,0,.6-.595l-.413-.413a.421.421,0,1,0-.595.595Z"
                        transform="translate(-171.73 -26.424)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                      <path
                        id="Path_3164"
                        data-name="Path 3164"
                        d="M308.158,41.941a.42.42,0,0,0,.3-.123l.413-.413a.421.421,0,1,0-.595-.595l-.413.413a.421.421,0,0,0,.3.718Z"
                        transform="translate(-290.476 -26.424)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.1"
                      />
                    </g>
                  </svg>

                  <h3 className="mt-4 font-medium text-blue-950 text-lg md:text-xl mb-2.5">
                    A Shared Economy
                  </h3>
                  <p className="text-blue-950 text-sm">
                    We adopt a purpose-driven business model. We rely on each
                    other’s contribution to mutual prosperity and growth.
                  </p>
                </div>
                <div className="bg-orange-100 px-5 py-4 rounded-sm">
                  <Image
                    src="/assets/register-as-seller/Futuristic.png"
                    alt="Futuristic"
                    width="29"
                    height="23"
                  ></Image>

                  <h6 className="mt-4 font-medium text-blue-950 text-lg md:text-xl mb-2.5">
                    Futuristic
                  </h6>
                  <p className="text-blue-950 text-sm">
                    We adopt Web3 technology through tokenization to enable
                    trust, shared ownership and transparency.
                  </p>
                </div>
                <div className="bg-orange-100 px-5 py-4 rounded-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24.1"
                    height="24.1"
                    viewBox="0 0 24.1 24.1"
                  >
                    <g id="Rewards" transform="translate(-17.45 -17.45)">
                      <circle
                        id="Ellipse_597"
                        data-name="Ellipse 597"
                        cx="11.5"
                        cy="11.5"
                        r="11.5"
                        transform="translate(18 18)"
                        fill="none"
                        stroke="#1F628E"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.1"
                      />
                      <path
                        id="Path_2904"
                        data-name="Path 2904"
                        d="M153.286,141.384l2.251,4.562,5.034.732-3.643,3.551.86,5.014-4.5-2.367-4.5,2.367.86-5.014L146,146.677l5.034-.732Z"
                        transform="translate(-123.105 -119.323)"
                        fill="none"
                        stroke="#1F628E"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.1"
                      />
                    </g>
                  </svg>

                  <h3 className="mt-4 font-medium text-blue-950 text-lg md:text-xl mb-2.5">
                    Rewards
                  </h3>
                  <p className="text-blue-950 text-sm">
                    We will incentivize you for conducting excellent business
                    practices and contributing towards our growth and success.
                  </p>
                </div>
              </div>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mt-8 md:mt-12 xl:mt-16 mb-8 md:mb-9 text-2xl xl:text-4xl noto-font`}
              >
                How it Works
              </h2>
              <div className="relative mb-7 md:mb-16">
                <div className="flex gap-4 md:gap-7 mb-7 md:mb-14">
                  <div className="bg-orange-100 z-50 h-14 w-14 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23.659"
                      height="22.502"
                      viewBox="0 0 23.659 22.502"
                    >
                      <g
                        id="How_it_works_-_Create_Your_Seller_Profile"
                        data-name="How it works - Create Your Seller Profile"
                        transform="translate(-1.35 -0.85)"
                      >
                        <path
                          id="Path_2355"
                          data-name="Path 2355"
                          d="M11.489,2.067a4.267,4.267,0,1,0,4.267,4.267A4.267,4.267,0,0,0,11.489,2.067ZM6.156,6.333a5.333,5.333,0,1,1,5.333,5.333A5.333,5.333,0,0,1,6.156,6.333Z"
                          transform="translate(0.31)"
                          fill="#1F628E"
                          stroke="#1F628E"
                          strokeWidth="0.3"
                          fillRule="evenodd"
                        />
                        <path
                          id="Path_2356"
                          data-name="Path 2356"
                          d="M13.189,14.035A18.825,18.825,0,0,0,2.8,16.172a.435.435,0,0,0-.231.384v3.917a.533.533,0,0,0,.533.533H8.967a.533.533,0,1,1,0,1.067H3.1a1.6,1.6,0,0,1-1.6-1.6V16.556a1.5,1.5,0,0,1,.8-1.326,19.892,19.892,0,0,1,10.98-2.259.533.533,0,0,1-.088,1.063Z"
                          transform="translate(0 0.794)"
                          fill="#1F628E"
                          stroke="#1F628E"
                          strokeWidth="0.3"
                          fillRule="evenodd"
                        />
                        <path
                          id="Path_2357"
                          data-name="Path 2357"
                          d="M12.294,19.2a2.667,2.667,0,0,1,.757-1.529l6.562-6.562a2.667,2.667,0,0,1,3.771,3.771l-6.562,6.562a2.667,2.667,0,0,1-1.529.757l-2.775.375a.533.533,0,0,1-.6-.6Zm1.511-.774a1.6,1.6,0,0,0-.454.917l-.281,2.081,2.081-.281a1.6,1.6,0,0,0,.917-.454l6.562-6.562a1.6,1.6,0,0,0-2.263-2.263Z"
                          transform="translate(0.694 0.622)"
                          fill="#1F628E"
                          stroke="#1F628E"
                          strokeWidth="0.3"
                          fillRule="evenodd"
                        />
                      </g>
                    </svg>
                  </div>
                  <div
                    className="h-[20rem] top-0 w-3 ml-7 border-l border-dashed border-slate-600/50 absolute
            "
                  ></div>
                  <div>
                    <h3 className="text-blue-950 font-medium text-lg md:text-xl mb-3">
                      Create Your Seller Profile
                    </h3>
                    <p className="text-sm text-blue-950">
                      Join our artisan community - Register, log in, and share
                      your unique brand story and details to create your seller
                      profile!
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-7 mb-7 md:mb-14">
                  <div className="bg-orange-100 z-50 h-14 w-14 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18.501"
                      height="22.201"
                      viewBox="0 0 18.501 22.201"
                    >
                      <g
                        id="How_it_works_-_Showcase_Your_Creations"
                        data-name="How it works - Showcase Your Creations"
                        transform="translate(-2)"
                      >
                        <path
                          id="Path_2351"
                          data-name="Path 2351"
                          d="M15.638,3.7H7.313A2.316,2.316,0,0,1,5,1.388V.463A.463.463,0,0,1,5.463,0H17.488a.463.463,0,0,1,.463.463v.925A2.316,2.316,0,0,1,15.638,3.7ZM5.925.925v.463A1.389,1.389,0,0,0,7.313,2.775h8.325a1.389,1.389,0,0,0,1.388-1.388V.925Z"
                          transform="translate(-0.225)"
                          fill="#1F628E"
                        />
                        <path
                          id="Path_2352"
                          data-name="Path 2352"
                          d="M14.8,22.426H7.7a2.329,2.329,0,0,1-1.388-.463l-.642-.482A9.188,9.188,0,0,1,5.449,6.956,3.12,3.12,0,0,0,6.625,4.508V3.463a.463.463,0,1,1,.925,0V4.508A4.044,4.044,0,0,1,6.027,7.679a8.263,8.263,0,0,0,.2,13.064l.642.481A1.4,1.4,0,0,0,7.7,21.5H14.8a1.389,1.389,0,0,0,.832-.278l.642-.482a8.262,8.262,0,0,0,.2-13.062,4.046,4.046,0,0,1-1.524-3.172V3.463a.463.463,0,0,1,.925,0V4.508a3.121,3.121,0,0,0,1.177,2.449,9.189,9.189,0,0,1-.227,14.526l-.642.481A2.327,2.327,0,0,1,14.8,22.426Z"
                          transform="translate(0 -0.225)"
                          fill="#1F628E"
                        />
                        <path
                          id="Path_2353"
                          data-name="Path 2353"
                          d="M18.218,18.852a2.045,2.045,0,0,1-1.488-.6,1.246,1.246,0,0,0-1.648,0,2.19,2.19,0,0,1-2.977,0,1.246,1.246,0,0,0-1.648,0,2.19,2.19,0,0,1-2.977,0,1.246,1.246,0,0,0-1.648,0,2.19,2.19,0,0,1-2.977,0,.562.562,0,0,0-.185-.142.463.463,0,0,1,.386-.841,1.486,1.486,0,0,1,.473.349,1.256,1.256,0,0,0,1.638-.01,2.19,2.19,0,0,1,2.977,0,1.246,1.246,0,0,0,1.648,0,2.19,2.19,0,0,1,2.977,0,1.246,1.246,0,0,0,1.648,0,2.19,2.19,0,0,1,2.977,0,1.246,1.246,0,0,0,1.648,0,1.476,1.476,0,0,1,.463-.339.463.463,0,1,1,.386.841.564.564,0,0,0-.175.131,2.047,2.047,0,0,1-1.5.613Z"
                          transform="translate(-0.03 -1.276)"
                          fill="#1F628E"
                        />
                        <path
                          id="Path_2354"
                          data-name="Path 2354"
                          d="M18.2,14.852a2.045,2.045,0,0,1-1.488-.6,1.246,1.246,0,0,0-1.648,0,2.19,2.19,0,0,1-2.977,0,1.246,1.246,0,0,0-1.648,0,2.19,2.19,0,0,1-2.977,0,1.246,1.246,0,0,0-1.648,0,2.19,2.19,0,0,1-2.977,0A.975.975,0,0,0,2.426,14a.462.462,0,1,1,.292-.877,1.88,1.88,0,0,1,.782.49,1.25,1.25,0,0,0,1.645,0,2.19,2.19,0,0,1,2.977,0,1.246,1.246,0,0,0,1.648,0,2.19,2.19,0,0,1,2.977,0,1.246,1.246,0,0,0,1.648,0,2.19,2.19,0,0,1,2.977,0,1.246,1.246,0,0,0,1.648,0,1.873,1.873,0,0,1,.778-.487.462.462,0,1,1,.292.877.972.972,0,0,0-.4.25A2.045,2.045,0,0,1,18.2,14.852Z"
                          transform="translate(-0.008 -0.976)"
                          fill="#1F628E"
                        />
                      </g>
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-blue-950 font-medium text-lg md:text-xl mb-3">
                      Showcase Your Creations
                    </h3>
                    <p className="text-sm text-blue-950">
                      Upload your stunning creations with high-quality images
                      and captivating product descriptions. Let your art speak
                      for itself!
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-7 ">
                  <div className="bg-orange-100 z-50 h-14 w-14 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      width="22.201"
                      height="22.201"
                      viewBox="0 0 22.201 22.201"
                    >
                      <defs>
                        <clipPath id="clipPath">
                          <path
                            id="path291"
                            d="M0-682.665H22.2v22.2H0Z"
                            transform="translate(0 682.665)"
                            fill="#1F628E"
                          />
                        </clipPath>
                      </defs>
                      <g
                        id="How_it_works_-_Connect_with_Global_Audience"
                        data-name="How it works - Connect with Global Audience"
                        transform="translate(0 682.665)"
                      >
                        <g id="g287" transform="translate(0 -682.665)">
                          <g id="g289" clipPath="url(#clipPath)">
                            <g id="g295" transform="translate(4.625 4.611)">
                              <path
                                id="path297"
                                d="M-444.514,0a10.621,10.621,0,0,1,2.2,6.489,10.667,10.667,0,0,1-10.667,10.667,10.62,10.62,0,0,1-6.475-2.19"
                                transform="translate(459.456)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g299" transform="translate(4.957 0.434)">
                              <path
                                id="path301"
                                d="M0-57.892a10.618,10.618,0,0,1,6.144-1.946,10.62,10.62,0,0,1,6.492,2.2"
                                transform="translate(0 59.839)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g303" transform="translate(0.434 5.159)">
                              <path
                                id="path305"
                                d="M-65.031-369.26a10.62,10.62,0,0,1-2.186-6.471,10.617,10.617,0,0,1,1.807-5.942"
                                transform="translate(67.217 381.672)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g307" transform="translate(7.545 8.933)">
                              <path
                                id="path309"
                                d="M-199.535-211.529c-.594,3.4-1.783,5.724-3.152,5.724-1.964,0-3.556-4.776-3.556-10.667,0-.743.025-1.467.073-2.167"
                                transform="translate(206.242 218.639)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g311" transform="translate(7.946 0.434)">
                              <path
                                id="path313"
                                d="M0-170.834c.593-3.413,1.783-5.743,3.155-5.743,1.964,0,3.556,4.776,3.556,10.667,0,.743-.025,1.468-.073,2.168"
                                transform="translate(0 176.577)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g315" transform="translate(1.2 14.656)">
                              <path
                                id="path317"
                                d="M0,0H11.866"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g319" transform="translate(9.294 7.545)">
                              <path
                                id="path321"
                                d="M0,0H11.708"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g323" transform="translate(1.2 7.545)">
                              <path
                                id="path325"
                                d="M0,0H5.131"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g327" transform="translate(13.066 13.269)">
                              <path
                                id="path329"
                                d="M-82.558-41.279a1.388,1.388,0,0,0-1.388-1.388,1.388,1.388,0,0,0-1.388,1.388,1.388,1.388,0,0,0,1.388,1.388A1.388,1.388,0,0,0-82.558-41.279Z"
                                transform="translate(85.333 42.667)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g331" transform="translate(6.331 6.157)">
                              <path
                                id="path333"
                                d="M-82.558-41.279a1.388,1.388,0,0,0-1.388-1.388,1.388,1.388,0,0,0-1.388,1.388,1.388,1.388,0,0,0,1.388,1.388A1.388,1.388,0,0,0-82.558-41.279Z"
                                transform="translate(85.333 42.667)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g335" transform="translate(17.258 2.168)">
                              <path
                                id="path337"
                                d="M-82.558-41.279a1.388,1.388,0,0,0-1.388-1.388,1.388,1.388,0,0,0-1.388,1.388,1.388,1.388,0,0,0,1.388,1.388A1.388,1.388,0,0,0-82.558-41.279Z"
                                transform="translate(85.333 42.667)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g339" transform="translate(2.168 17.258)">
                              <path
                                id="path341"
                                d="M-82.558-41.279a1.388,1.388,0,0,0-1.388-1.388,1.388,1.388,0,0,0-1.388,1.388,1.388,1.388,0,0,0,1.388,1.388A1.388,1.388,0,0,0-82.558-41.279Z"
                                transform="translate(85.333 42.667)"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g343" transform="translate(15.841 14.656)">
                              <path
                                id="path345"
                                d="M0,0H5.16"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                            <g id="g347" transform="translate(3.472 3.645)">
                              <path
                                id="path349"
                                d="M0,0H0"
                                fill="none"
                                stroke="#1F628E"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-blue-950 font-medium text-lg md:text-xl mb-3">
                      Connect with Global Audience
                    </h3>
                    <p className="text-sm text-blue-950">
                      Share your artistry, inspire, and reach hearts across the
                      globe!
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-primary font-semibold mb-3.5">Testimonial</p>
                <h2
                  className={`text-blue-950 xl:tracking-[-0.72px] mb-5 md:mb-4 text-2xl lg:text-4xl noto-font`}
                >
                  Ksu Shade Art - Resin Artist
                </h2>
              </div>
              <div className="flex gap-4 flex-col mb-7 md:mb-16 xl:gap-7">
                <div className="shrink-0 flex items-center justify-center">
                  <Image
                    src={"/assets/register-as-seller/ksu_shade.png"}
                    alt="Ksu Shade Art"
                    height={336}
                    width={337}
                    className="shrink-0 w-full rounded-sm object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-blue-950 mb-4">
                    As a resin artist, I initially sold through Instagram, but
                    as my audience grew - especially internationally - I needed
                    a reliable online marketplace. After researching options,
                    AFOMA Marketplace stood out as the best choice for
                    self-starters like me.
                  </p>
                  <p className="text-sm text-blue-950 mb-4">
                    AFOMA makes it easy for creatives to launch and grow their
                    online presence with a clear registration process, fair
                    fees, and no product restrictions. They also offer valuable
                    workshops to help sellers improve their shops.
                  </p>
                  <p className="text-sm text-blue-950 mb-4">
                    What truly sets AFOMA apart is their commitment to
                    artisans—they listen, refine their platform based on our
                    needs, and even use AI to simplify registration and product
                    listing. Whether you're just starting or expanding your
                    online reach, AFOMA is the place to be.
                  </p>
                  <strong className="text-sm text-blue-950 mb-4">
                    Follow on Instagram: @ksushade_art
                  </strong>
                </div>
              </div>
              <div>
                <h2
                  className={`text-blue-950 xl:tracking-[-0.72px] mb-8 md:mb-9 text-2xl lg:text-4xl noto-font`}
                >
                  FAQs
                </h2>
                <div>
                  <div className="border-b border-b-inputBorder pb-3 pl-0 pr-3">
                    <div
                      className="flex items-center justify-between cursor-pointer "
                      onClick={() => {
                        setFaqOne(!faqOne);
                        setFaqTwo(false);
                        setFaqThree(false);
                        setFaqFour(false);
                      }}
                    >
                      <p className="font-medium md:text-lg text-blue-950">
                        What payment methods are accepted on the AFOMA
                        marketplace?
                      </p>
                      <div className="shrink-0">
                        <svg
                          width="14.381"
                          height="8.152"
                          viewBox="0 0 14.381 8.152"
                          className={faqOne ? "-rotate-180" : "rotate-0"}
                        >
                          <path
                            id="FAQ_dropdown_icon"
                            data-name="FAQ dropdown icon"
                            d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                            transform="translate(-19.625 -39.625)"
                            fill="#172554"
                            stroke="#172554"
                            strokeWidth="0.75"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`${
                        faqOne ? "h-fit" : "h-0"
                      }  overflow-hidden transition-all ease-in-out`}
                    >
                      <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                        Becoming a seller is easy! Expand the “Sign in”
                        drop-down and click on the &quot;Register as
                        Seller&quot; link. Fill out all the information, then
                        click the “Register as a seller” button. Once approved,
                        you can showcase your unique handmade creations to our
                        global audience.
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-b-inputBorder py-3 pl-0 pr-3">
                    <div
                      className="flex items-center justify-between cursor-pointer "
                      onClick={() => {
                        setFaqOne(false);
                        setFaqTwo(!faqTwo);
                        setFaqThree(false);
                        setFaqFour(false);
                      }}
                    >
                      <p className="font-medium md:text-lg text-slate-800">
                        Can I track the shipment of my order?
                      </p>
                      <div className="shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14.381"
                          height="8.152"
                          viewBox="0 0 14.381 8.152"
                          className={faqTwo ? "-rotate-180" : "rotate-0"}
                        >
                          <path
                            id="FAQ_dropdown_icon"
                            data-name="FAQ dropdown icon"
                            d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                            transform="translate(-19.625 -39.625)"
                            fill="#172554"
                            stroke="#172554"
                            strokeWidth="0.75"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`${
                        faqTwo ? "h-fit" : "h-0"
                      }  overflow-hidden transition-all ease-in-out`}
                    >
                      <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                        We welcome a wide range of artisanal products, including
                        handmade crafts, unique artworks, jewelry, home decor,
                        and more. You can list them for sale as long as your
                        creations are authentic, handcrafted, and comply with
                        our marketplace policies.
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-b-inputBorder py-3 pl-0 pr-3">
                    <div
                      className="flex items-center justify-between cursor-pointer "
                      onClick={() => {
                        setFaqOne(false);
                        setFaqTwo(false);
                        setFaqThree(!faqThree);
                        setFaqFour(false);
                      }}
                    >
                      <p className="font-medium md:text-lg text-slate-800">
                        How are transactions processed on the marketplace?
                      </p>
                      <div className="shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14.381"
                          height="8.152"
                          viewBox="0 0 14.381 8.152"
                          className={faqThree ? "-rotate-180" : "rotate-0"}
                        >
                          <path
                            id="FAQ_dropdown_icon"
                            data-name="FAQ dropdown icon"
                            d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                            transform="translate(-19.625 -39.625)"
                            fill="#172554"
                            stroke="#172554"
                            strokeWidth="0.75"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`${
                        faqThree ? "h-fit" : "h-0"
                      }  overflow-hidden transition-all ease-in-out`}
                    >
                      <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                        Our marketplace leverages flexible payment options,
                        including cryptocurrency. When a customer purchases your
                        product, the payment is held in escrow until the order
                        is successfully delivered, providing peace of mind for
                        both buyers and sellers.
                      </p>
                    </div>
                  </div>
                  <div className="py-3 pl-0 pr-3">
                    <div
                      className="flex items-center justify-between cursor-pointer "
                      onClick={() => {
                        setFaqOne(false);
                        setFaqTwo(false);
                        setFaqThree(false);
                        setFaqFour(!faqFour);
                      }}
                    >
                      <p className="font-medium md:text-lg text-slate-800">
                        What should I consider about shipping costs for
                        international purchases?
                      </p>
                      <div className="shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14.381"
                          height="8.152"
                          viewBox="0 0 14.381 8.152"
                          className={faqFour ? "-rotate-180" : "rotate-0"}
                        >
                          <path
                            id="FAQ_dropdown_icon"
                            data-name="FAQ dropdown icon"
                            d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                            transform="translate(-19.625 -39.625)"
                            fill="#172554"
                            stroke="#172554"
                            strokeWidth="0.75"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`${
                        faqFour ? "h-fit" : "h-0"
                      }  overflow-hidden transition-all ease-in-out`}
                    >
                      <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                        Shipping costs for international purchases may vary
                        based on your location and the seller&apos;s location.
                        Please be aware that your country&apos;s regulations may
                        incur customs duties on the delivery of your product.
                        Despite the potential of incurring higher charges for
                        international shipping, rest assured that your chosen
                        artisanal creations will be carefully packaged and
                        delivered with care.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" mb-10 xl:sticky xl:top-10 "></div>
        </div>
      </section>
      <section>
        <Footer />
      </section> */}
    </>
  );
};
export default RegisterAsASeller;
