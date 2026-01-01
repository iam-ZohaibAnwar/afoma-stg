import Layout from "@/components/Layout";
import SellerDetail from "@/components/SellerDetail";
import { faPen } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
const Address = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code

  const selectRegion = (val) => {
    setRegion(val);
  };

  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(true);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
  const [isDisabled, setDisabled] = useState(true);

  const onEditClick = (id) => {
    router.push(`/seller/my-account/basic-information/${id}#basicInformation`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/basic-information/${id}#basicInformation`;
    }, 3000);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onEdit = (id) => {
    router.push(`/seller/my-account/address/${id}#address`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/address/${id}#address`;
    }, 3000);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onSellerClick = (id) => {
    router.push(`/seller/my-account/seller-details/${id}#sellerDetail`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-details/${id}#sellerDetail`;
    }, 3000);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/seller/my-account/payment-information/${id}#paymentInfo`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/payment-information/${id}#paymentInfo`;
    }, 3000);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };

  const onCommissionEdit = (id) => {
    router.push(`/seller/my-account/commission/${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };


  const onPoliciesEdit = (id) => {
    router.push(`/seller/my-account/seller-policies/${id}#policies`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-policies/${id}#policies`;
    }, 3000);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };


  const selectCountry = (val) => {
    setCountry(val);
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
        setStatesListData(response.data.countryCode);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  const setStatesListData = (countryCode) => {
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode);
      setStatesList(states);
    } else {
      setStatesList([]);
    }
  };

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

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
  };

  const handleSubmit = (id) => {
    router.push(`/seller/my-account/seller-details/${id}`);
  };

  const onClickSubmit = (id) => {
    router.push(`/seller/my-account/address?id=${id}`);
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
          {editData ? (
            <div className="mb-8">
              <div className="flex justify-end mb-5 group">
                <button
                  className=" text-slate-600 group-hover:text-primary flex items-center   gap-1.5"
                  onClick={() => onClickSubmit(editData._id)}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className=" group-hover:text-primary"
                  />
                  Edit
                </button>
              </div>
              <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 my-8">
                <div>
                  <div>
                    <SellerDetail />
                  </div>

                  <div className="border-[#D8D8D8] border mt-8 rounded">
                    <div className="w-full overflow-auto rounded-md bg-orange-100">
                      <table className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b ">
                        <tr className="w-full">
                          <th className="w-[194px]">
                            <button
                              id="basicInformation"
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
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
                              className={`text-blue-950 py-[18px] px-6  transition-all font-medium ease-in-out ${
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
                              className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${
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
                              className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${
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
                        // validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ values }) => (
                          <Form className="viewOnly">
                            <div className="st-form grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-9 ">
                              <div className="relative">
                                <div>
                                  <label htmlFor="streetAddress">
                                    Street Address
                                  </label>
                                </div>
                                <div>
                                  <Field
                                    type="text"
                                    name="streetAddress"
                                    id="streetAddress"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
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
                                <label htmlFor="country">Country</label>

                                <CountryDropdown
                                  value={country}
                                  name="country"
                                  id="country"
                                  disabled={isDisabled}
                                  className={` ${
                                    isDisabled ? "cursor-not-allowed " : ""
                                  }`}
                                  defaultOptionLabel={"Select country"}
                                  onChange={(val) => selectCountry(val)}
                                />
                              </div>

                              <div className="relative country-select">
                                <label htmlFor="state">State/Province</label>

                                <select
                                  name="state"
                                  id="state"
                                  value={region}
                                  disabled
                                  onChange={(event) => {
                                    const selectedValue = event.target.value;
                                    selectRegion(selectedValue);
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
                              </div>

                              <div className="relative">
                                <label htmlFor="city">City</label>
                                <Field
                                  type="text"
                                  name="city"
                                  id="city"
                                  disabled={isDisabled}
                                  className={` ${
                                    isDisabled ? "cursor-not-allowed " : ""
                                  }`}
                                  placeholder="Enter city"
                                />
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="ZipCode">
                                    Zip/Postal Code
                                  </label>
                                </div>
                                <div>
                                  <Field
                                    type="text"
                                    name="ZipCode"
                                    id="ZipCode"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
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
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="flex items-center gap-4 pb-9">
                      <div className="flex items-center justify-start pl-6">
                        <button
                          className="buttonprimary flex gap-2 items-center "
                          onClick={() => handleSubmit(editData._id)}
                        >
                          Next
                        </button>
                      </div>
                      <div id="address">
                        <button
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
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </>
      </Layout>
    </>
  );
};

export default Address;
