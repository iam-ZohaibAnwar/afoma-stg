import Layout from "@/components/Layout";
import SellerDetail from "@/components/SellerDetail";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import countryData from "country-data";
import { State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import toast from "react-hot-toast";
import Select from "react-select";
import { object, string } from "yup";

const Address = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [prevCountry, setPrevCountry] = useState("");
  const [prevRegion, setPrevRegion] = useState("");
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

  const setStatesListData = (countryCode) => {
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode);
      setStatesList(states);
    } else {
      setStatesList([]);
    }
  };

  const selectCountry = (val) => {
    setCountry(val);
    const countryCode = fetchCountryCode(val); // Call fetchCountryCode function
    setCountryCode(countryCode); // Update countryCode state
    setStatesListData(countryCode);
    setRegion("");
  };

  const fetchCountryCode = (countryName) => {
    const countryInfo = countryData.countries.all.find(
      (c) => c.name === countryName
    );
    return countryInfo ? countryInfo.alpha2 : ""; // Use alpha2 for the country code
  };

  const selectRegion = (val) => {
    setRegion(val);
    const states = State.getStatesOfCountry(countryCode);
    const selectedState = states.find((state) => state.name === val);
    if (selectedState) {
      const stateCode = selectedState.isoCode;
      setRegionCode(stateCode);
    } else {
      setRegionCode("");
      setRegion("");
    }
  };

  useEffect(() => {
    setPrevCountry(country);
    setPrevRegion(region);
    if (!countryCode && editData?.country) {
      const prevCountryCode = fetchCountryCode(editData.country);
      setCountryCode(prevCountryCode);
    }
    if (!regionCode && editData?.state) {
      setRegionCode(editData?.stateCode);
    }
  }, [country, region]);

  //
  const handleBack = () => {
    router.back();
  };
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);
  const [isEditActive, setEditActive] = useState(true);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");

  const onEditClick = (id) => {
    router.push(`/seller/my-account/basic-information?id=${id}`);
    router.push(
      `/seller/my-account/basic-information?id=${id}#basicInformation`
    );
    setTimeout(() => {
      window.location.href = `/seller/my-account/basic-information?id=${id}#basicInformation`;
    }, 3000);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onEdit = (id) => {
    router.push(`/seller/my-account/address?id=${id}#address`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/address?id=${id}#address`;
    }, 3000);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onSellerClick = (id) => {
    router.push(`/seller/my-account/seller-details?id=${id}#sellerDetail`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-details?id=${id}#sellerDetail`;
    }, 3000);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/seller/my-account/payment-information?id=${id}#paymentInfo`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/payment-information?id=${id}#paymentInfo`;
    }, 3000);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };
  const onCommissionEdit = (id) => {
    router.push(`/seller/my-account/commission?id=${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };
  const onPoliciesEdit = (id) => {
    router.push(`/seller/my-account/seller-policies?id=${id}#policies`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-policies?id=${id}#policies`;
    }, 3000);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };

  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${id}`,
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
        setEditData(response.data);
        setCountry(response.data.country);
        setRegion(response.data.state);
        setSelectedMenuItem(response.data.status);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const router = useRouter();

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);
  const initialValues = {
    country: country,
    streetAddress: editData?.streetAddress,
    city: editData?.city,
    state: region,
    ZipCode: editData?.ZipCode,
    countryCode: countryCode || editData?.countryCode,
    stateCode: regionCode || editData?.stateCode,
  };
  const validationSchema = object({
    streetAddress: string().required("Required"),
    ZipCode: string().required("Required"),

    city: string().required("Required"),
    country: string().required("Required"),
    state: string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    if (editData?._id) {
      setSubmitting(true);
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${editData?._id}`,
        data: {
          country: country,
          streetAddress: values?.streetAddress,
          city: values?.city,
          state: region,
          ZipCode: values?.ZipCode,
          countryCode: countryCode,
          stateCode: regionCode,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // //
          router.push(
            `/seller/my-account/seller-details?id=${response.data._id}`
          );
          setSubmitting(false);
          toast.success("Seller Updated");
          // resetForm();
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
          // resetForm();
        });
    } else {
      setSubmitting(true);
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        data: {
          country: country,
          streetAddress: values?.streetAddress,
          city: values?.city,
          state: region,
          ZipCode: values?.ZipCode,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // //

          setSubmitting(false);
          toast.success("New Address Added");
          // resetForm();
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
          // resetForm();
        });
    }
  };
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
      <Layout userType="seller">
        <>
          <div className="pb-8">
            <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 ">
              {editData ? (
                <div>
                  <div>
                    <SellerDetail />
                  </div>

                  <div className="border-[#D8D8D8] border mt-8 rounded">
                    <div className=" overflow-auto rounded-md bg-orange-100">
                      <table className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b ">
                        <tr>
                          <th className="w-[194px]">
                            <button
                              id="basicInformation"
                              className={`text-blue-950 py-[18px] px-6  font-medium  transition-all ease-in-out ${
                                isEditClickActive
                                  ? "border-b border-primary text-primary"
                                  : ""
                              }`}
                              onClick={() => onEditClick(editData._id)}
                            >
                              Basic Information
                            </button>
                          </th>
                          <th className="w-[117px]">
                            <button
                              id="address"
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                                isEditActive
                                  ? "border-b border-primary text-primary"
                                  : ""
                              }`}
                              onClick={() => onEdit(editData._id)}
                            >
                              Address
                            </button>
                          </th>
                          <th className="w-[155px]">
                            <button
                              id="sellerDetail"
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                                isSellerClickActive
                                  ? "border-b border-primary text-primary"
                                  : ""
                              }`}
                              onClick={() => onSellerClick(editData._id)}
                            >
                              Seller Details
                            </button>
                          </th>
                          <th className="w-[215px]">
                            <button
                              id="paymentInfo"
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                                isInfoEditActive
                                  ? "border-b border-primary text-primary"
                                  : ""
                              }`}
                              onClick={() => onInfoEdit(editData._id)}
                            >
                              Payment Information
                            </button>
                          </th>
                          <th className="w-[215px]">
                          <button
                            id="paymentInfo"
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${
                              isPoliciesEditActive
                                ? "border-b border-primary text-primary"
                                : ""
                            }`}
                            onClick={() => onPoliciesEdit(editData._id)}
                          >
                            Seller Policies
                          </button>
                        </th>
                          {/* <button
                    className={`text-blue-950 py-[18px] px-6  transition-all ease-in-out ${
                      isCommissionEdit ? "border-b border-primary text-primary" : ""
                    }`}
                    onClick={() => onCommissionEdit(editData._id)}
                  >
                    Commission
                  </button> */}
                        </tr>
                      </table>
                    </div>
                    <div className="p-6 bg-orange-50">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ values, setFieldValue }) => (
                          <Form>
                            <div className="st-form grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-9 ">
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

                              <div className="relative country-select w-full">
                                <label htmlFor="country">
                                  Country{" "}
                                  <span className="text-red-700 ">*</span>
                                </label>

                                <CountryDropdown
                                  value={country}
                                  name="country"
                                  id="country"
                                  defaultOptionLabel={"Select country"}
                                  // onChange={(val) => selectCountry(val)}
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
                            </div>
                            <div className="flex gap-4 items-center">
                              <div className="flex items-center justify-start">
                                <button
                                  type="submit"
                                  className="buttonprimary flex gap-2 items-center "
                                >
                                  Save and next
                                </button>
                              </div>
                              <div className="">
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
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default Address;
