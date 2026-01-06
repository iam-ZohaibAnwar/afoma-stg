import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { sellerRole, userRole } from "@/lib/select-option";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import countryList from "country-list";
import { State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { object, string } from "yup";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminUserMgmtEdit = (values, errors, id) => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [showPassword, setShowPassword] = useState(false);
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code

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

  const fetchCountryCode = (countryName) => {
    const countryCode = countryList.getCode(countryName);
    return countryCode;
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
  const handleBack = () => {
    router.back();
  };
  const validationSchema = object({
    fname: string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    lname: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
    password: string().required("Required").min(5),
    phone: string().required("Required"),
    city: string().required("Required"),
    countryName: string().required("Required"),
    state: string().required("Required"),
    zipCode: string().required("Required"),
    address: string().required("Required"),
    storeTitle: string().required("Required"),
  });

  const initialValues = {
    fname: "",
    lname: "",
    email: "",
    password: "",
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
  };

  const router = useRouter();
  const onSubmit = (values, { resetForm, setFieldValue }) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        {
          enableProduct: false,
          firstName: values.fname,
          lastName: values.lname,
          email: values.email,
          phone: values.phone,
          password: values.password,
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
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then(function (response) {
        toast.success("Added Successful.");
        router.push(`/admin/seller-management`);
        resetForm();
      })
      .catch(function (error) {
        if (error?.response?.status == 403) {
          toast.error("User already exist.");
        } else {
          toast.error("Something went wrong.");
        }
      });
  };
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
      <Layout userType="admin">
        <section>
          <div className="pb-24">
            <h3
              className={`md:text-2xl text-lg xl:tracking-[-0.48px] mb-8 noto-font`}
            >
              Basic Information
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                errors,
                setFieldValue,
                handleChange,
                touched,
                submitCount,
                isSubmitting,
              }) => (
                <Form className="st-form">
                  <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 lg:mb-12">
                    <div className="relative">
                      <label htmlFor="fname">
                        First Name <span className="text-red-700 ">*</span>
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
                    </div>
                    <div className="relative md:col-span-3">
                      <label htmlFor="web3address">Web3 Wallet Address</label>
                      <p className="mb-1 -mt-1 text-sm font-medium text-blue-950">
                        Currently supporting BNB Smart Chain Network Addressses.
                      </p>
                      <Field
                        type="text"
                        name="web3address"
                        id="web3address"
                        placeholder="Enter Web3 Wallet Address"
                      />
                    </div>
                    <div className="relative">
                      <div>
                        {" "}
                        <label htmlFor="storeTitle">
                          Shop Title <span className="text-red-700 ">*</span>
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
                    <div className="relative">
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
                    </div>
                    <div className="relative viewform">
                      <label htmlFor="userRole">
                        User Role <span className="text-red-700 ">*</span>
                      </label>
                      <Select
                        name="userRole"
                        id="userRole"
                        options={sellerRole}
                        placeholder="Select user role"
                        className="st-react-select"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) => {
                          handleChange("userRole")(selectedOption?.value);
                        }}
                        defaultValue={
                          userRole && userRole !== ""
                            ? {
                                value: userRole,
                                label: userRole === "seller" ? "Seller" : null,
                              }
                            : null
                        }
                      />
                      <ErrorMessage
                        name="userRole"
                        component="p"
                        className="invalid"
                      />
                    </div>

                    <div className="relative country-select xl:w-full">
                      <label htmlFor="countryName">
                        Country <span className="text-red-700 ">*</span>
                      </label>

                      <CountryDropdown
                        value={country}
                        name="countryName"
                        id="countryName"
                        defaultOptionLabel={"Select country"}
                        // onChange={(val) => selectCountry(val)
                        onChange={(country) => {
                          selectCountry(country);
                          setFieldValue("countryName", country);
                        }}
                      />
                      <ErrorMessage
                        name="countryName"
                        component="p"
                        className="invalid"
                      />
                    </div>

                    <div className="relative country-select xl:w-full">
                      <label htmlFor="state">
                        State/Province <span className="text-red-700 ">*</span>
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
                                errors.phone && touched.phone && submitCount > 0
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
                        Zip/Postal Code <span className="text-red-700 ">*</span>
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

                    <div className="relative md:col-span-3">
                      <label htmlFor="address">
                        Street Address <span className="text-red-700 ">*</span>
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
                  </div>

                  <div className="flex gap-4 items-center">
                    <button
                      type="submit"
                      className="buttonprimary flex gap-2 items-center"
                      disabled={isSubmitting}
                    >
                      Save
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
                    <div>
                      <div>
                        <button
                          type="button"
                          className={` flex gap-2 items-center text-primary `}
                          onClick={handleBack}
                        >
                          <FontAwesomeIcon
                            icon={faAngleLeft}
                            className="h-[8px]"
                          />{" "}
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AdminUserMgmtEdit;
