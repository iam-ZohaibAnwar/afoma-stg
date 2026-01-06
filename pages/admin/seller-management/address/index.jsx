import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const AdminSellerDetail = dynamic(() => import("@/components/AdminSellerDetail"), { ssr: false });
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import toast from "react-hot-toast";
import { object, string } from "yup";
import countryData from "country-data";
import countryList from "country-list";
import { State } from "country-state-city";

const Address = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();

  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(true);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);

  const handleBack = () => {
    router.back();
  };
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);

    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/change-status/${editData?._id}`,
      data: {
        status: menuItem,
        userRole: menuItem == "Approved" ? "seller" : "customer",
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
        toast.success("Status Updated");
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
      });
  };

  const onEditClick = (id) => {
    router.push(`/admin/seller-management/basic-information?id=${id}`);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
  };
  const onEdit = (id) => {
    router.push(`/admin/seller-management/address?id=${id}`);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
  };

  const onSellerClick = (id) => {
    router.push(`/admin/seller-management/seller-details?id=${id}`);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/admin/seller-management/payment-information?id=${id}`);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };
  const onCommissionEdit = (id) => {
    router.push(`/admin/seller-management/commission?id=${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };

  const onPoliciesEdit = (id) => {
    router.push(`/admin/seller-management/seller-policies?id=${id}`);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [prevCountry, setPrevCountry] = useState("");
  const [prevRegion, setPrevRegion] = useState("");
  useEffect(() => {
    if (country) {
      const countryCode = fetchCountryCode(country);
      if (countryCode) {
        setCountryCode(countryCode);
      }
      setStatesListData(countryCode);
    }
  }, [country]);

  const selectCountry = (val) => {
    setCountry(val);
    const countryCode = fetchCountryCode(val); // Call fetchCountryCode function
    setCountryCode(countryCode); // Update countryCode state
    setStatesListData(countryCode);
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
        // //
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
    status: selectedMenuItem,
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
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // //

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
          status: selectedMenuItem,
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
          router.push(
            `/admin/seller-management/seller-details?id=${response.data._id}`
          );
          setSubmitting(false);
          toast.success("Seller Address Updated");
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
          status: selectedMenuItem,
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
          setSubmitting(false);
          toast.success("Seller Detail Updated");
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
        <>
          <div className="w-full overflow-auto bg-orange-50 rounded  my-8">
            {!loading && editData ? (
              <div>
                <div className="flex items-center justify-end gap-4 mb-6">
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full ${
                          selectedMenuItem === "Approved"
                            ? "bg-green-800 text-white"
                            : selectedMenuItem === "Disapproved"
                            ? "bg-red-700 text-white"
                            : "bg-gray-500 text-white"
                        } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                      >
                        {selectedMenuItem}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="9.211"
                          height="5.411"
                          viewBox="0 0 9.211 5.411"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="9.211"
                            height="5.411"
                            viewBox="0 0 9.211 5.411"
                          >
                            <path
                              d="M24.23,44.615a.383.383,0,0,1-.272-.113l-3.846-3.846a.385.385,0,0,1,.544-.544l3.574,3.574L27.8,40.112a.385.385,0,1,1,.544.544L24.5,44.5a.383.383,0,0,1-.272.113Z"
                              transform="translate(-19.625 -39.579)"
                              fill="#fff"
                              stroke="#fff"
                              strokeWidth="0.75"
                            />
                          </svg>
                        </svg>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-200"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                        <div className="py-2">
                          <Menu.Item>
                            <p
                              className={`${
                                selectedMenuItem === "Approved"
                                  ? "hover:bg-orange-100 hover:text-primary"
                                  : "hover:bg-orange-100 productCategoryListhover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Approved")}
                            >
                              Approved
                            </p>
                          </Menu.Item>
                          <Menu.Item>
                            <p
                              className={`${
                                selectedMenuItem === "Disapproved"
                                  ? "hover:bg-orange-100 hover:text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Disapproved")}
                            >
                              Disapproved
                            </p>
                          </Menu.Item>
                          <Menu.Item>
                            <p
                              className={`${
                                selectedMenuItem === "Pending"
                                  ? "hover:bg-orange-100 hover:text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Pending")}
                            >
                              Pending
                            </p>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div>
                  <AdminSellerDetail />
                </div>
                <div className="border-[#D8D8D8] border mt-8 rounded">
                  <div className="relative font-medium text-slate-500 bg-orange-100 border-b flex overflow-auto">
                    <button
                      className={`text-blue-950 py-[18px] px-6 transition-all ease-in-out min-w-[max-content] ${
                        isEditClickActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onEditClick(editData._id)}
                    >
                      Basic Information
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isEditActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onEdit(editData._id)}
                    >
                      Address
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isSellerClickActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onSellerClick(editData._id)}
                    >
                      Seller Details
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isInfoEditActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onInfoEdit(editData._id)}
                    >
                      Payment Information
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isPoliciesEditActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onPoliciesEdit(editData._id)}
                    >
                      Seller Policies
                    </button>
                    {/* <button
                    className={`text-blue-950 py-[18px] px-6  transition-all ease-in-out ${
                      isCommissionEdit ? "border-b border-primary text-primary" : ""
                    }`}
                    onClick={() => onCommissionEdit(editData._id)}
                  >
                    Commission
                  </button> */}
                  </div>
                  <div className="md:p-6 p-4 bg-orange-50">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="st-form grid md:gap-6 gap-4 md:grid-cols-3 mb-9 ">
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
                                Country <span className="text-red-700 ">*</span>
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

                            <div className="relative country-select w-full">
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
        </>
      </Layout>
    </>
  );
};

export default Address;
