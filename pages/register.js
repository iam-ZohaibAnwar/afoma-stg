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
import { findOptions } from "@/lib/select-option";
//const noto = Noto_Serif({ subsets: ["latin"] });

const Register = () => {
  // const initialValues = {
  //   firstName: "",
  //   password: "",
  //   lastName: "",
  //   email: "",
  //   cpassword: "",
  //   subscribe: false,
  //   agree: false,
  // };
  // const validationSchema = object({
  //   firstName: string().required("Required"),
  //   lastName: string().required("Required"),
  //   password: string().required("Required"),
  //   cpassword: string().required("Required"),
  //   email: string().required("Required").email("Invalid email address"),
  //   subscribe: boolean().oneOf([true], "Required"),
  //   agree: boolean().oneOf([true], "Required"),
  // });
  // const onSubmit = (values) => {
  //   // Add request to create the global attribute using the POST method
  //   axios
  //     .post(`${process.env.NEXT_PUBLIC_BASE_URL}/global-attribute`, {
  //       enableProduct: false,
  //       firstName: values.firstName,
  //     })
  //     .then(function (response) {
  //       // After successful POST, make the GET request to retrieve the updated data
  //       axios.create({
  //   headers: {
  //     "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //   },
  // }).get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`).then((res) => {
  //         setPersons(res.data);
  //       });
  //     })
  //     .catch(function (error) {
  //       //
  //     });
  // };
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code
  const [referralSource, setReferralSource] = useState([]); // State to hold region (state) code

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

  const selectCountry = (val) => {
    setCountry(val);
  };

  const setStatesListData = (countryCode) => {
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode);
      setStatesList(states);
    } else {
      setStatesList([]);
    }
  };

  const fetchCountryCode = (countryName) => {
    const countryInfo = countryData.countries.all.find(
      (c) => c.name === countryName
    );
    return countryInfo ? countryInfo.alpha2 : ""; // Use alpha2 for the country code
  };

  const selectRegion = (val) => {
    setRegion(val);
    if (countryCode) {
      // Make sure you have imported and used a valid library for state/subdivision data
      const states = State.getStatesOfCountry(countryCode); // Replace with correct method
      const selectedState = states.find((state) => state.name === val);
      // setRegionCode(selectedState ? selectedState.isoCode : "");
      if (selectedState) {
        const stateCode = selectedState.isoCode;
        setRegionCode(stateCode);
      } else {
        setRegionCode("");
      }
    }
  };

  //
  const router = useRouter();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    // password: "",
    // cpassword: "",
    city: "",
    countryName: country,
    state: region,
    zipCode: "",
    address: "",
    phone: "",
    web3address: "",
    agree: false,
    networkType: "Binance Network",
    subscribe: false,
    userRole: "customer",
    countryCode: countryCode,
    stateCode: regionCode,
    referral_source: "",
    social_media: "",
  };

  const { wallet } = router.query;
  initialValues.web3address = wallet;

  const [emailError, setEmailError] = useState("");
  const onSubmit = (values, { resetForm }) => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        // password: values.password,
        country: initialValues.countryName,
        state: initialValues.state,
        city: values.city,
        ZipCode: values.zipCode,
        phone: values.phone,
        web3address: values.web3address,
        streetAddress: values.address,
        userRole: "customer",
        countryCode: countryCode,
        stateCode: regionCode,
        referral_source: referralSource,
        social_media: ""
      })
      .then(function (response) {
        // //
        if (response.data.message === "User is Alredy Exist") {
          setEmailError("Email is already in use."); // Update the email error state
        }
        toast.success("New User Added");
        router.push(`/thank-you`);
      })
      .catch(function (error) {
        toast.error(error?.response?.data?.message);
        resetForm();
      });
  };

  const validationSchema = object({
    firstName: string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    lastName: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
    city: string().required("Required"),
    countryName: string().required("Required"),
    state: string().required("Required"),
    phone: string().required("Required"),
    zipCode: string().required("Required"),
    address: string().required("Required"),
    // password: string()
    //   .required("Required")
    //   .min(5, "Password must be at least 5 characters"),
    // cpassword: string()
    //   .required("Required")
    //   .min(5, "Password must be at least 5 characters")
    //   .test("passwords-match", "Passwords must match", function (value) {
    //     return this.parent.password === value;
    //   }),
    agree: yup.boolean().oneOf([true], "Required"),
    referral_source: string().required("Required"),
    social_media: string().optional(),
    // subscribe: yup.boolean().oneOf([true], "Required"),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showcpassword, setConShowPassword] = useState(false);
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://afomamarketplace.com/register"
          data-next-head=""
        />
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans
"
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
        <div className="max-w-full mx-auto bg-orange-50 flex flex-col xl:flex-row items-center px-4 xl:px-0 relative">
          <div className="hidden xl:flex items-center bg-[url('/assets/customer/customer-review-experience.jpg')] xl:w-1/2 h-screen sticky top-0 bottom-0 bg-cover bg-center bg-[#00000096] bg-blend-overlay">
            <div className="xl:w-[570px] mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <Image
                    src={"/assets/customer/customer-review-experience.jpg"}
                    alt="Simply Lexi - Jewelry Maker"
                    height={150}
                    width={150}
                    className="rounded-full object-cover h-[150px] w-[150px] "
                    loading="lazy"
                  />
                </div>
                <div>
                  <h2
                    className={`text-white xl:tracking-[-0.72px] mb-1 text-3xl noto-font`}
                  >
                    Coe Kerby
                  </h2>
                </div>
              </div>
              <div>
                <p className="text-sm text-white mb-4">
                  My first order experience at AFOMA Marketplace has been
                  nothing short of wonderful.
                </p>
                <p className="text-sm text-white mb-4">
                  I went onto the site hoping to find something beautiful pieces
                  that could add to my special anniversary trip and not only
                  were there several jewelry pieces to choose from, there were
                  jewelry pieces that suited several different styles and sizes.
                  There is truly something for everyone.
                </p>
                <p className="text-sm text-white mb-4">
                  I easily ordered my pieces from Simply Lexi Jewelry and was
                  extremely pleasantly surprised that my order came from Canada
                  to the UK in just 8 days!
                </p>
                <p className="text-sm text-white mb-4">
                  Shopping at AFOMA Marketplace was a seamless experience and I
                  am excited to order more items from the Marketplace! I feel
                  like I was able to get to know the artisans I am shopping
                  from, could sense the care of the AFOMA team, and was provided
                  with several options that fit my specific needs.
                </p>
                <p className="text-sm text-white mb-4">
                  Thank you AFOMA Marketplace!
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
                    width={359}
                    height={42}
                    className="w-[309px] lg:w-[359px]"
                  />
                </Link>
              </div>

              <div className="bg-orange-100  p-4 md:p-8 mb-5 md:mb-7 rounded-md">
                <h3
                  className={`text-lg md:text-2xl xl:text-3xl text-blue-950 mb-4 md:mb-9 noto-font`}
                >
                  Register as a Customer
                </h3>
                {/* <div className="flex gap-3.5 flex-wrap mb-5 md:mb-9 items-center justify-center">
                  <Link href="#">
                    <div className="flex items-center gap-2 py-3 px-[37px] border border-[#47556980] rounded group hover:border-primary ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.607"
                        height="19.04"
                        viewBox="0 0 18.607 19.04"
                        className="fill-[#172554] group-hover:fill-[#1F628E]"
                      >
                        <defs>
                          <clipPath id="clipPath">
                            <path
                              id="Path_3146"
                              data-name="Path 3146"
                              d="M19.845,9.243H10.974v3.678H16.08C15.6,15.258,13.614,16.6,10.974,16.6a5.625,5.625,0,0,1,0-11.251A5.5,5.5,0,0,1,14.479,6.6l2.769-2.769a9.514,9.514,0,1,0-6.274,16.66c4.76,0,9.087-3.462,9.087-9.52A7.9,7.9,0,0,0,19.845,9.243Z"
                              transform="translate(-1.455 -1.455)"
                            />
                          </clipPath>
                        </defs>
                        <g
                          id="Continue_with_Google"
                          data-name="Continue with Google"
                          transform="translate(-1.455 -1.455)"
                        >
                          <g
                            id="Group_40820"
                            data-name="Group 40820"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3145"
                              data-name="Path 3145"
                              d="M0,19.251V8l7.356,5.625Z"
                              transform="translate(-0.865 -4.106)"
                            />
                          </g>
                          <g
                            id="Group_40821"
                            data-name="Group 40821"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3147"
                              data-name="Path 3147"
                              d="M0,4.76l7.356,5.625,3.029-2.64L20.77,6.058V0H0Z"
                              transform="translate(-0.865 -0.865)"
                            />
                          </g>
                          <g
                            id="Group_40822"
                            data-name="Group 40822"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3149"
                              data-name="Path 3149"
                              d="M0,16.011,12.982,6.058l3.418.433L20.77,0V20.77H0Z"
                              transform="translate(-0.865 -0.865)"
                            />
                          </g>
                          <g
                            id="Group_40823"
                            data-name="Group 40823"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3151"
                              data-name="Path 3151"
                              d="M24.6,24.011,11.185,13.625l-1.731-1.3L24.6,8Z"
                              transform="translate(-4.695 -4.106)"
                            />
                          </g>
                        </g>
                      </svg>
                      <p className="text-blue-950 text-sm group-hover:text-primary">
                        Continue with Google
                      </p>
                    </div>
                  </Link>
                  <Link href="#">
                    <div className="flex items-center gap-2 py-3 px-8 border border-[#47556980] rounded group hover:border-primary ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10.192"
                        height="19.04"
                        viewBox="0 0 10.192 19.04"
                        className="fill-[#172554] group-hover:fill-[#1F628E]"
                      >
                        <g
                          id="Continue_with_Facebook"
                          data-name="Continue with Facebook"
                          transform="translate(-1279.566 -17.498)"
                        >
                          <path
                            id="Path_3153"
                            data-name="Path 3153"
                            d="M11.133,10.707l.528-3.444h-3.3V5.029A1.718,1.718,0,0,1,10.3,3.168h1.5V.237A18.321,18.321,0,0,0,9.135,0a4.2,4.2,0,0,0-4.5,4.635V7.263H1.609v3.444H4.635v8.325H8.356V10.707Z"
                            transform="translate(1277.957 17.507)"
                          />
                        </g>
                      </svg>

                      <p className="text-ble-950 text-sm group-hover:text-primary">
                        Continue with Facebook
                      </p>
                    </div>
                  </Link>
                </div> */}
                <div className="flex gap-3.5 flex-wrap mb-5 md:mb-9 items-center justify-center">
                  <button
                    title="Coming soon..."
                    className={`opacity-50 `}
                    disabled
                  >
                    <div className="flex items-center gap-2 py-3 px-[37px] border border-[#47556980] rounded   ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.607"
                        height="19.04"
                        viewBox="0 0 18.607 19.04"
                        className="fill-[#172554] "
                      >
                        <defs>
                          <clipPath id="clipPath">
                            <path
                              id="Path_3146"
                              data-name="Path 3146"
                              d="M19.845,9.243H10.974v3.678H16.08C15.6,15.258,13.614,16.6,10.974,16.6a5.625,5.625,0,0,1,0-11.251A5.5,5.5,0,0,1,14.479,6.6l2.769-2.769a9.514,9.514,0,1,0-6.274,16.66c4.76,0,9.087-3.462,9.087-9.52A7.9,7.9,0,0,0,19.845,9.243Z"
                              transform="translate(-1.455 -1.455)"
                            />
                          </clipPath>
                        </defs>
                        <g
                          id="Continue_with_Google"
                          data-name="Continue with Google"
                          transform="translate(-1.455 -1.455)"
                        >
                          <g
                            id="Group_40820"
                            data-name="Group 40820"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3145"
                              data-name="Path 3145"
                              d="M0,19.251V8l7.356,5.625Z"
                              transform="translate(-0.865 -4.106)"
                            />
                          </g>
                          <g
                            id="Group_40821"
                            data-name="Group 40821"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3147"
                              data-name="Path 3147"
                              d="M0,4.76l7.356,5.625,3.029-2.64L20.77,6.058V0H0Z"
                              transform="translate(-0.865 -0.865)"
                            />
                          </g>
                          <g
                            id="Group_40822"
                            data-name="Group 40822"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3149"
                              data-name="Path 3149"
                              d="M0,16.011,12.982,6.058l3.418.433L20.77,0V20.77H0Z"
                              transform="translate(-0.865 -0.865)"
                            />
                          </g>
                          <g
                            id="Group_40823"
                            data-name="Group 40823"
                            transform="translate(1.455 1.455)"
                            clipPath="url(#clipPath)"
                          >
                            <path
                              id="Path_3151"
                              data-name="Path 3151"
                              d="M24.6,24.011,11.185,13.625l-1.731-1.3L24.6,8Z"
                              transform="translate(-4.695 -4.106)"
                            />
                          </g>
                        </g>
                      </svg>
                      <p className="text-blue-950 text-sm group-hover:text-primary">
                        Continue with Google
                      </p>
                    </div>
                  </button>

                  <button
                    title="Coming soon..."
                    className={`opacity-50  `}
                    disabled
                  >
                    <div className="flex items-center gap-2 py-3 px-8 border border-[#47556980] rounded group  ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10.192"
                        height="19.04"
                        viewBox="0 0 10.192 19.04"
                        className="fill-[#172554] "
                      >
                        <g
                          id="Continue_with_Facebook"
                          data-name="Continue with Facebook"
                          transform="translate(-1279.566 -17.498)"
                        >
                          <path
                            id="Path_3153"
                            data-name="Path 3153"
                            d="M11.133,10.707l.528-3.444h-3.3V5.029A1.718,1.718,0,0,1,10.3,3.168h1.5V.237A18.321,18.321,0,0,0,9.135,0a4.2,4.2,0,0,0-4.5,4.635V7.263H1.609v3.444H4.635v8.325H8.356V10.707Z"
                            transform="translate(1277.957 17.507)"
                          />
                        </g>
                      </svg>

                      <p className="text-blue-950 text-sm ">
                        Continue with Facebook
                      </p>
                    </div>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2.5 mb-6">
                  <div className="h-px w-2.5 bg-blue-950/50"></div>
                  <p className="text-slate-600 text-sm font-medium">
                    or Register with
                  </p>
                  <div className="h-px w-2.5 bg-blue-950/50"></div>
                </div>
                <Formik
                  onSubmit={onSubmit}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  // validate={(values) => {
                  //   const errors = {};

                  //   if (values.password !== values.cpassword) {
                  //     errors.cpassword = "Passwords do not match";
                  //   }

                  //   return errors;
                  // }}
                  // validationSchema={validationSchema}
                >
                  {({ submitCount, touched, errors, setFieldValue }) => (
                    <Form className="st-form grid md:grid-cols-2 gap-4 lg:gap-6">
                      <div className="relative">
                        <label htmlFor="firstName">
                          First Name <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="Eg. John"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="lastName">
                          Last Name <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Eg. Doe"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="email">
                          Email Address <span className="text-red-700 ">*</span>
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
                        {emailError && (
                          <p className="text-red-500">{emailError}</p>
                        )}
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
                            className="text-slate-600"
                          />
                        </button>
                        <ErrorMessage
                          name="password"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative mb-1">
                        <label htmlFor="cpassword">
                          Confirm Password{" "}
                          <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type={showcpassword ? "text" : "password"}
                          name="cpassword"
                          id="cpassword"
                          placeholder="Re-enter password"
                        />
                        <button
                          type="button"
                          className="absolute right-4 bottom-3.5"
                          onClick={() => setConShowPassword(!showcpassword)}
                        >
                          <FontAwesomeIcon
                            icon={showcpassword ? faEyeSlash : faEye}
                            className="text-slate-600"
                          />
                        </button>
                        <ErrorMessage
                          name="cpassword"
                          component="p"
                          className="invalid"
                        />
                      </div> */}
                      <div className="relative viewform">
                        <label htmlFor="phone">
                          Contact No. <span className="text-red-700 ">*</span>
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
                      <div className="relative md:col-span-2 pointer-events-none">
                        <label htmlFor="web3address">Web3 Wallet Address</label>
                        <p className="mb-1 -mt-1 text-sm font-medium text-blue-950">
                          Currently supporting BNB Smart Chain Network
                          Addressses.
                        </p>
                        <p className="text-xs font-medium">
                          This address is automatically linked to your E-Mail
                          account.
                          <br />
                          This optional Web3 wallet allows secure sign-in
                          (without email), digital asset transactions, and
                          loyalty reward redemption. In addition, it can be used
                          for Tamperproof Digital Product Certificates and NFT
                          purchases (applicable to Digital Artists).
                        </p>
                        <Field
                          readOnly
                          type="text"
                          name="web3address"
                          id="web3address"
                          placeholder="Enter Web3 Wallet Address"
                          className="pointer-events-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="relative">
                          <label
                            className="gap-20 text-sm text-slate-600 pt-2"
                            htmlFor="subscribe"
                          >
                            <Field
                              type="checkbox"
                              name="subscribe"
                              id="subscribe"
                            />
                            Subscribe to our newsletter
                          </label>
                          <ErrorMessage
                            name="subscribe"
                            component="p"
                            className="invalidcheckbox"
                          />
                        </div>
                        <div className="relative mb-3">
                          <label
                            className="gap-20 text-sm text-slate-600 pt-2"
                            htmlFor="agree"
                          >
                            <Field type="checkbox" name="agree" id="agree" />
                            <span>
                              Yes, I agree to the{" "}
                              <Link
                                target="_blank"
                                href="/user-terms-conditions"
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
                      <div className="flex items-center justify-center mb-6 md:col-span-2">
                        <button type="submit" className="buttonprimary">
                          {" "}
                          Register as a customer
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

                <div>
                  <p className="text-center text-sm text-slate-600 ">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-primary font-medium">
                      Sign in
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
    </>
  );
};

export default Register;
