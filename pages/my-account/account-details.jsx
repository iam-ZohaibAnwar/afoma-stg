import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const MyAccountSidebar = dynamic(() => import("@/components/MyAccountSidebar"), { ssr: false });
import { genderList } from "@/lib/select-option";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { object, string } from "yup";

import countryData from "country-data";
import { State } from "country-state-city";
//const noto = Noto_Serif({ subsets: ["latin"] });

const Account_Details = ({ cart, addToCart }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [mobileNumber, setmobileNumber] = useState();

  const [editData, setEditData] = useState();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [prevCountry, setPrevCountry] = useState("");
  const [prevRegion, setPrevRegion] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [countryChanged, setCountryChanged] = useState(false);
  const [regionChanged, setRegionChanged] = useState(false);
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code

  const selectCountry = (val) => {
    setCountry(val);
    const code = countryData.countries.all.find(
      (country) => country.name === val
    )?.alpha2;
    setCountryCode(code || "");
    setStatesListData(code || "");
    setRegion(""); // Clear region when country changes
    setRegionCode(""); // Clear region code when country changes
    // Update the validation schema dynamically if country changes
    setPrevCountry(prevCountry); // Update the previous country value
  };

  const selectRegion = (val) => {
    setRegion(val);
    const states = State.getStatesOfCountry(countryCode);
    const selectedState = states.find((state) => state.name === val);
    setRegionCode(selectedState ? selectedState.isoCode : "");
  };

  useEffect(() => {
    if (editData) {
      setPrevCountry(editData.country);
    }
  }, [editData]);

  useEffect(() => {
    if (editData) {
      setCountry(editData.country);
      setRegion(editData.state);
      setCountryCode(
        countryData.countries.all.find(
          (country) => country.name === editData.country
        )?.alpha2 || ""
      );
      setStatesListData(
        countryData.countries.all.find(
          (country) => country.name === editData.country
        )?.alpha2 || ""
      );
      setRegionCode(editData.stateCode || "");
    }
  }, [editData]);

  const setStatesListData = (countryCode) => {
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode);
      setStatesList(states);
    } else {
      setStatesList([]);
    }
  };

  const getData = () => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`,
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
      },
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        if (response.data.userRole === "customer") {
          // User is a customer, update state with data
          setEditData(response.data);
          setUserRole(response.data.userRole);
          setSelectedGender(response.data.gender);
          setCountry(response.data.country);
          setRegion(response.data.state);
          setmobileNumber(response.data.phone);
          setLoading(false);
        } else {
          // User is not a customer, show a message or take appropriate action
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const initialValues = {
    firstName: editData?.firstName || "",
    lastName: editData?.lastName || "",
    DOB: editData?.DOB ? new Date(editData.DOB) : null,
    gender: selectedGender || "",
    email: editData?.email || "",
    // password: editData?.password || "",
    phone: mobileNumber || "",
    country: country,
    state: region,
    city: editData?.city || "",
    streetAddress: editData?.streetAddress || "",
    ZipCode: editData?.ZipCode || "",
    countryCode: countryCode || editData?.countryCode,
    stateCode: regionCode || editData?.stateCode,
    web3address: editData?.web3address,
    networkType: editData?.networkType,
  };

  const validationSchema = object({
    firstName: string().required("Required"),
    lastName: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
    // password: string().required("Required"),
    phone: string().required("Required"),
    country: string().required("Required"),
    state: string().required("Required"),
    city: string().required("Required"),
    streetAddress: string().required("Required"),
    ZipCode: string().required("Required"),
  });

  // //
  const handleSubmit = async (values, { setSubmitting }) => {
    // //
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "PUT", // Assuming you are using a PUT request for editing
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`,
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          DOB: values?.DOB,
          gender: selectedGender,
          email: values?.email,
          phone: values.phone,
          web3address: values?.web3address,
          country: country,
          state: region,
          city: values?.city,
          streetAddress: values?.streetAddress,
          ZipCode: values?.ZipCode,
          countryCode: countryCode,
          stateCode: regionCode,
        },
      };

      const response = await axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .request(options);
      //

      toast.success("Account details updated successfully!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          ...response.data, // Spread the updated user data
          accessToken: userData?.accessToken, // Keep the existing token
        })
      );
    } catch (error) {
      console.error("Error updating account details: ", error);
      toast.error("Error updating account details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const DatePickerComponent = ({ field, form, ...props }) => (
    <ReactDatePicker
      selected={field.value ? new Date(field.value) : null}
      onChange={(date) => form.setFieldValue(field.name, date)}
      placeholderText={field.value ? "" : "Pick a date"} // Conditionally set placeholder text
      dateFormat="yyyy-MM-dd"
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={15} // adjust as needed
      {...props}
    />
  );
  return (
    <>
      <Head>
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
        <Header cart={cart} addToCart={addToCart}/>
      </section>

      <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-4 lg:mt-6 lg:mb-6 max-w-screen-xl mx-auto px-4">
        <Link href="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} size="sm" />
        <Link href="/my-account/account-details" className="text-primary">
          My account
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 px-4 mb-10">
        <div className="col-span-2">
          <MyAccountSidebar />
        </div>
        <div className="col-span-4">
          {!loading ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                errors,
                setFieldValue,
                touched,
                submitCount,
                handleChange,
              }) => (
                <Form className="st-form">
                  <div className="p-4 md:p-6 rounded bg-orange-100">
                    <h1
                      className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font `}
                    >
                      My Account Details
                    </h1>
                    <div className="border border-b text-slate-600/30 mb-9"></div>
                    <p className="text-blue-950 text-lg xl:text-xl xl:font-semibold mb-9">
                      Account Information
                    </p>
                    <div className="flex flex-col gap-3 xl:grid md:grid md:grid-cols-3 md:gap-6 xl:grid-cols-3 mb-6 lg:mb-6 view-form">
                      <div className="relative">
                        <div>
                          {" "}
                          <label htmlFor="firstName">
                            First Name <span className="text-red-700 ">*</span>
                          </label>
                        </div>
                        <div className="mt-3">
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter first name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div>
                          <label htmlFor="lastName">
                            Last Name <span className="text-red-700 ">*</span>
                          </label>
                        </div>
                        <div className="mt-3">
                          {" "}
                          <Field
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter last name"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="relative ">
                          <label htmlFor="email">
                            Email id <span className="text-red-700 ">*</span>
                          </label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email id"
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>

                      <div className="relative viewform">
                        <label htmlFor="phone">Contact No.</label>
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
                        <label htmlFor="gender">Gender</label>
                        <Select
                          name="gender"
                          id="gender"
                          options={genderList}
                          placeholder="Select gender"
                          className="st-react-select"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedGender(selectedOption?.value);
                            handleChange("gender")(selectedOption?.value);
                          }}
                          defaultValue={
                            selectedGender && selectedGender !== ""
                              ? {
                                  value: selectedGender,
                                  label:
                                    selectedGender === "male"
                                      ? "Male"
                                      : selectedGender === "female"
                                      ? "Female"
                                      : selectedGender === "other"
                                      ? "Other"
                                      : null,
                                }
                              : null
                          }
                        />
                      </div>

                      <div className="relative">
                        <div>
                          <label htmlFor="DOB">Date of Birth</label>
                        </div>
                        <div className="mt-3">
                          {" "}
                          <Field
                            type="date"
                            name="DOB"
                            id="DOB"
                            placeholder="Pick a date"
                            component={DatePickerComponent}
                          />
                          <ErrorMessage
                            name="DOB"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>

                      {/* <div className="flex gap-2 xl:gap-5 flex-col xl:flex-row md:flex-row items-center md:justify-between col-span-3 ">
                    <div className="flex items-center justify-start gap-1.5">
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className="h-3.5 w-3.5 text-primary"
                      />
                      <button className="text-sm text-slate-600">
                        Subscribed to General newsletter
                      </button>
                    </div>
                    <div className="flex items-center md:gap-5 xl:gap-5 gap-14">
                      <div className="flex items-center justify-end gap-1.5 ">
                        <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
                        <button className="text-xs text-slate-600 cursor-pointer">
                          Edit Details
                        </button>
                      </div>
                      <div className="flex items-center justify-end gap-5 ">
                        <button className="text-xs text-slate-600">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div> */}

                      {/* <div className="flex items-center justify-start col-span-3">
                    <button
                      type="submit"
                      className="buttonprimary flex gap-2 items-center "
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
                  </div> */}
                    </div>

                    {/* <p className="text-blue-950 text-xl mb-6">Address Book</p> */}

                    {/* <div className="flex flex-col gap-5 xl:grid md:grid lg:gap-12 md:gap-12 md:grid-cols-3 mb-6 lg:mb-12">
                  <div>
                    <p className="text-blue-950 mb-3 text-base">
                      Default Billing Address
                    </p>
                    <div className="flex gap-2.5 items-center mb-3">
                      <div className="p-3.5 rounded flex items-center gap-2.5 bg-orange-100">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-sm text-slate-600 cursor-pointer"
                        />
                        <p className="text-slate-600 text-xs ">Add address</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-blue-950 mb-3 text-base">
                      Default Shipping Address
                    </p>
                    <div className="flex gap-2.5 items-center mb-3">
                      <div className="p-3.5 rounded flex items-center gap-2.5 bg-orange-100">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-sm text-slate-600 cursor-pointer"
                        />
                        <p className="text-slate-600 text-xs ">Add address</p>
                      </div>
                    </div>
                  </div>
                </div> */}
                    {/* Password  */}
                    {/* <p className="text-blue-950 text-lg xl:text-xl xl:font-semibold mb-9">
                    Password
                  </p>

                  <div className="mb-6 lg:mb-12">
                    {showPasswordField ? (
                      <div className=" flex items-center justify-center gap-2">
                        <div className="relative">
                          <label htmlFor="password">Password </label>
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            onChange={(e) => setPasswordValue(e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-4 bottom-3.5 "
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                              className="text-slate-600"
                            />
                          </button>
                        </div>
                        <div
                          className="buttonprimary"
                          type="button"
                          onClick={handleMenuItemClick}
                        >
                          Save
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center  gap-1.5  mb-3">
                         
                        </div>
                        <button
                          className="buttonprimary"
                        
                          onClick={handleTogglePasswordField}
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div> */}

                    <p className="text-blue-950 text-lg xl:text-xl xl:font-semibold mb-9">
                      Address
                    </p>
                    <div className="flex flex-col gap-3 xl:grid md:grid md:grid-cols-3 md:gap-6 xl:grid-cols-3 mb-6 lg:mb-6 view-form">
                      <div className="relative country-select w-full">
                        <label htmlFor="country">
                          Country <span className="text-red-700 ">*</span>
                        </label>

                        <CountryDropdown
                          value={country}
                          name="country"
                          id="country"
                          defaultOptionLabel={"Select country"}
                          onChange={(selectedCountry) => {
                            selectCountry(selectedCountry);
                            setFieldValue("country", selectedCountry); // Update Formik field value
                          }}
                        />
                        <ErrorMessage
                          name="country"
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
                        <div>
                          <label htmlFor="streetAddress">
                            Street Address{" "}
                            <span className="text-red-700 ">*</span>
                          </label>
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="streetAddress"
                            id="streetAddress"
                            placeholder="Enter street address"
                          />
                          <ErrorMessage
                            name="streetAddress"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div>
                          {" "}
                          <label htmlFor="ZipCode">
                            Zip/Postal Code{" "}
                            <span className="text-red-700 ">*</span>
                          </label>
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="ZipCode"
                            id="ZipCode"
                            placeholder="Enter zip/postal code"
                          />
                          <ErrorMessage
                            name="ZipCode"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>
                      <div className="flex items-baseline md:col-span-3 justify-start gap-3 ">
                        <div>
                          <h1 className="text-blue-950 text-lg xl:text-xl xl:font-semibold">
                            Web3 Wallet Information
                          </h1>
                          <p className="mb-1 mt-1 text-sm font-medium text-blue-950">
                            Currently supporting BNB Smart Chain Network
                            Addressses.
                          </p>
                          <p className="text-xs font-medium">
                            This address is automatically linked to your E-Mail
                            account.
                            <br />
                            This optional Web3 wallet allows secure sign-in
                            (without email), digital asset transactions, and
                            loyalty reward redemption. In addition, it can be
                            used for Tamperproof Digital Product Certificates
                            and NFT purchases (applicable to Digital Artists).
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-6 lg:mb-12">
                      <div className="relative col-span-1 pointer-events-none">
                        <label htmlFor="networkType">Network Type</label>
                        <Field
                          type="text"
                          name="networkType"
                          id="networkType"
                          placeholder="Binance Network"
                        />
                        <ErrorMessage
                          name="networkType"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative col-span-2 pointer-events-none">
                        <div>
                          <label htmlFor="web3address">Wallet Address</label>
                        </div>
                        <div>
                          {" "}
                          <Field
                            type="text"
                            name="web3address"
                            id="web3address"
                            placeholder="Enter wallet address"
                          />
                          <ErrorMessage
                            name="web3address"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-start col-span-3">
                      <button
                        type="submit"
                        className="buttonprimary flex gap-2 items-center "
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
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <section className="overflow-hidden">
        <Footer />
      </section>
    </>
  );
};

export default Account_Details;
