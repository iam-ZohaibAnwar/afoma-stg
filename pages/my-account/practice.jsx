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
  const [mobileNumber, setMobileNumber] = useState("");

  const [editData, setEditData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [regionCode, setRegionCode] = useState("");
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
  };

  const selectRegion = (val) => {
    setRegion(val);
    const states = State.getStatesOfCountry(countryCode);
    const selectedState = states.find((state) => state.name === val);
    setRegionCode(selectedState ? selectedState.isoCode : "");
  };

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

  const getData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`,
        headers: {
          Authorization: `Bearer ${userData?.accessToken}`,
        },
      };
      const response = await axios(options);
      if (response.data.userRole === "customer") {
        setEditData(response.data);
        setUserRole(response.data.userRole);
        setSelectedGender(response.data.gender);
        setMobileNumber(response.data.phone);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const initialValues = {
    firstName: editData?.firstName || "",
    lastName: editData?.lastName || "",
    DOB: editData?.DOB ? new Date(editData.DOB) : null,
    gender: selectedGender || "",
    email: editData?.email || "",
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
    phone: string().required("Required"),
    country: string().required("Required"),
    state: string().required("Required"),
    city: string().required("Required"),
    streetAddress: string().required("Required"),
    ZipCode: string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "PUT",
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

      const response = await axios(options);
      toast.success("Account details updated successfully!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          ...response.data,
          accessToken: userData?.accessToken,
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
      placeholderText={field.value ? "" : "Pick a date"}
      dateFormat="yyyy-MM-dd"
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={15}
      {...props}
    />
  );

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
        />
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
              {({ errors, setFieldValue, touched, submitCount }) => (
                <Form className="st-form">
                  <div className="p-4 md:p-6 rounded bg-orange-100">
                    <h1
                      className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font`}
                    >
                      My Account Details
                    </h1>
                    <div className="border border-b text-slate-600/30 mb-9"></div>
                    <p className="text-blue-950 text-lg xl:text-xl xl:font-semibold mb-9">
                      Account Information
                    </p>

                    <p className="text-blue-950 text-lg xl:text-xl xl:font-semibold mb-9">
                      Address
                    </p>
                    <div className="flex flex-col gap-3 xl:grid md:grid md:grid-cols-3 md:gap-6 xl:grid-cols-3 mb-6 lg:mb-12 view-form">
                      <div className="relative country-select w-full">
                        <label htmlFor="country">
                          Country <span className="text-red-700">*</span>
                        </label>
                        <CountryDropdown
                          value={country}
                          name="country"
                          id="country"
                          defaultOptionLabel="Select country"
                          onChange={(country) => {
                            selectCountry(country);
                            setFieldValue("country", country);
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
                          State/Province <span className="text-red-700">*</span>
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
                          City <span className="text-red-700">*</span>
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
                        <label htmlFor="streetAddress">
                          Street Address <span className="text-red-700">*</span>
                        </label>
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

                      <div className="relative">
                        <label htmlFor="ZipCode">
                          Zip/Postal Code{" "}
                          <span className="text-red-700">*</span>
                        </label>
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

                    <div className="flex items-center justify-start col-span-3">
                      <button
                        type="submit"
                        className="buttonprimary flex gap-2 items-center"
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
