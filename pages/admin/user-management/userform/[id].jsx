import Layout from "@/components/Layout";
import { genderList, userPermission, userRole } from "@/lib/select-option";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminUserMgmtEdit = (values, errors) => {
  const [editData, setEditData] = useState();

  const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [selectedUserPermission, setSelectedUserPermission] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [filePath, setFilePath] = useState([""]);
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code

  const selectRegion = (val) => {
    setRegion(val);
  };

  const selectCountry = (val) => {
    setCountry(val);
  };

  const handleBack = () => {
    router.back();
  };

  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`,
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
        setSelectedGender(response.data.gender);
        setSelectedUserRole(response.data.userRole);
        setSelectedUserPermission(response.data?.fullAccess || false);
        setCountry(response.data.country);
        setRegion(response.data.state);
        setMobileNumber(response.data.phone);
        setFilePath(response.data.userProfile);
        setStatesListData(response.data.countryCode);
        setLoading(false);
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

  const onImageUpload = (e) => {
    let formData = new FormData();
    formData.append("userProfile", e.target.files[0]);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/upload-profile`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userData?.accessToken}`,
      },
      data: formData,
    };
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then((res) => {
        setFilePath(res.data.imageUrl);
      })
      .catch((err) => {});
  };

  const router = useRouter();

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  const initialValues = {
    firstName: editData?.firstName,
    lastName: editData?.lastName,
    DOB: editData?.DOB ? new Date(editData.DOB) : null,
    gender: selectedGender,
    email: editData?.email,
    // password: editData?.password,
    phone: editData?.phone,
    userRole: selectedUserRole,
    fullAccess: selectedUserPermission,
    country: country,
    state: region,
    city: editData?.city,
    streetAddress: editData?.streetAddress,
    ZipCode: editData?.ZipCode,
    userProfile: filePath,
    web3address: editData?.web3address,
    networkType: editData?.networkType,
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
      <Layout userType="admin">
        <section>
          <div className="viewOnly pb-24">
            <h3
              className={`text-2xl xl:tracking-[-0.48px] mb-8 text-blue-950 noto-font`}
            >
              Basic Information
            </h3>
            {!loading ? (
              <Formik initialValues={initialValues}>
                {({ setFieldValue, handleChange }) => (
                  <Form className="st-form">
                    <div>
                      <div className="relative pointer-events-none mb-4 viewImage">
                        <label htmlFor="userProfile">Profile Photo</label>
                        {filePath ? (
                          <div className="mb-4 flex gap-2">
                            <div className="relative h-28 w-28 rounded-md overflow-hidden">
                              <Image
                                src={filePath}
                                alt={filePath}
                                fill
                                className="object-cover"
                              />
                            </div>{" "}
                            {/* <span>
                              <button
                                type="button"
                                className="bg-red-100 hover:bg-red-200 h-9 w-9 rounded-full"
                                onClick={() => setFilePath("")}
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </button>
                            </span> */}
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              name="userProfile"
                              id="userProfile"
                              className={`block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
                                errors.userProfile &&
                                touched.userProfile &&
                                submitCount > 0
                                  ? "border-red-600"
                                  : "border-gray-300"
                              }`}
                              onChange={(e) => onImageUpload(e)}
                            />
                            {errors.userProfile &&
                            touched.userProfile &&
                            submitCount > 0 ? (
                              <span className="text-xs text-red-600 mt-1">
                                {errors.userProfile}
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 grid-cols-1 md:gap-6 gap-4 mb-4">
                      <div className="relative">
                        <div>
                          {" "}
                          <label htmlFor="firstName">First Name</label>
                        </div>
                        <div className="mt-3">
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            readOnly
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
                          <label htmlFor="lastName">Last Name</label>
                        </div>
                        <div className="mt-3">
                          {" "}
                          <Field
                            type="text"
                            name="lastName"
                            readOnly
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

                      <div className="relative">
                        <div>
                          {" "}
                          <label htmlFor="DOB">Date of Birth</label>
                        </div>
                        <div className="mt-3 ">
                          <Field
                            type="date"
                            name="DOB"
                            readOnly
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

                      <div className="relative viewform">
                        <label htmlFor="gender">Gender</label>
                        <Select
                          name="title"
                          id="title"
                          options={genderList}
                          placeholder="Select gender"
                          className="st-react-select pointer-events-none"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedGender(selectedOption?.value);
                            handleChange("property_type")(
                              selectedOption?.value
                            );
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
                          {" "}
                          <label htmlFor="email">Email Address</label>
                        </div>
                        <div className="mt-3">
                          {" "}
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            readOnly
                            placeholder="Enter email id"
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      </div>

                      {/* <div>
                        <div className="relative ">
                          <label htmlFor="password">Password</label>
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            readOnly
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            className="absolute right-4 bottom-3.5 pointer-events-none"
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
                        <div className="flex items-center justify-end gap-1.5 mt-2">
                          <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
                          <button className="text-xs text-slate-600">
                            Change Password
                          </button>
                        </div>
                      </div> */}

                      <div className="relative viewform">
                        <label htmlFor="phone">Contact No.</label>
                        <PhoneInput
                          country={`in`}
                          countryCode={`in`}
                          value={mobileNumber}
                          // required
                          onChange={(value) =>
                            setMobileNumber("phone", `+${value}`)
                          }
                          className="pointer-events-none"
                          id="phone"
                          type="text"
                          inputProps={{
                            className: ` ${
                              errors.moNumber &&
                              touched.moNumber &&
                              submitCount > 0
                                ? "border-red-600"
                                : "border-slate-300"
                            }`,
                          }}
                        />
                      </div>

                      <div className="relative viewform">
                        <label htmlFor="userRole">User Role</label>
                        <Select
                          name="userRole"
                          id="userRole"
                          options={userRole}
                          placeholder="Select user role"
                          className="st-react-select pointer-events-none"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedUserRole(selectedOption?.value);
                            handleChange("userRole")(selectedOption?.value);
                          }}
                          defaultValue={
                            editData?.userRole && editData?.userRole !== ""
                              ? {
                                  value: editData?.userRole,
                                  label:
                                    editData?.userRole === "seller"
                                      ? "Seller"
                                      : editData?.userRole === "customer"
                                      ? "Customer"
                                      : editData?.userRole === "admin"
                                      ? "Admin"
                                      : editData?.userRole === "affiliate"
                                      ? "Affiliate"
                                      : null,
                                }
                              : null
                          }
                        />
                      </div>
                      {editData?.userRole == "admin" && (
                        <div className="relative viewform">
                          <label htmlFor="fullAccess">Full Access</label>
                          <Select
                            name="fullAccess"
                            id="fullAccess"
                            options={userPermission}
                            placeholder="Select full access"
                            className="st-react-select pointer-events-none"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              setSelectedUserPermission(
                                selectedOption?.value || false
                              );
                            }}
                            defaultValue={
                              editData?.userRole && editData?.userRole !== ""
                                ? {
                                    value: editData?.fullAccess || false,
                                    label:
                                      editData?.fullAccess === true
                                        ? "True"
                                        : editData?.fullAccess === false
                                        ? "False"
                                        : "False",
                                  }
                                : null
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-span-3 my-4">
                      <h3
                        className={`text-lg md:text-2xl xl:tracking-[-0.48px] mt-5 noto-font`}
                      >
                        Address
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-3 grid-cols-1 md:gap-6 gap-4 mb-4">
                      <div className="relative country-select w-full">
                        <label htmlFor="country">Country</label>
                        <CountryDropdown
                          value={country}
                          name="country"
                          id="country"
                          className="pointer-events-none"
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
                      {/* <div className="relative viewform">
                      <label htmlFor="city">City</label>
                      <Select
                        name="title"
                        id="title"
                        options={titleNameList}
                        placeholder="Select city"
                        className="st-react-select "
                        classNamePrefix="react-select"
                        defaultValue={() => {
                          if (initialValues.title && initialValues.title != "")
                            return {
                              value: initialValues.title,
                              label: initialValues.title,
                            };
                          else return "";
                        }}
                        // onChange={(selectedOption) => {
                        //   handleChange("title")(selectedOption?.value);
                        // }}
                      />
                    </div> */}
                      <div className="relative">
                        <label htmlFor="city">City</label>
                        <Field
                          type="text"
                          name="city"
                          id="city"
                          readOnly
                          placeholder="Enter city"
                        />
                      </div>

                      <div className="relative">
                        <div>
                          <label htmlFor="streetAddress">Street Address</label>
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="streetAddress"
                            id="streetAddress"
                            readOnly
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
                          <label htmlFor="ZipCode">Zip/Postal Code</label>
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="ZipCode"
                            id="ZipCode"
                            readOnly
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

                    <div className="flex items-baseline justify-start gap-3 mt-4 col-span-3 mb-7">
                      <div>
                        <h1 className={`text-xl text-blue-950 font-medium   `}>
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
                          loyalty reward redemption. In addition, it can be used
                          for Tamperproof Digital Product Certificates and NFT
                          purchases (applicable to Digital Artists).
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 grid-cols-1 md:gap-6 gap-4 mb-4">
                      <div className="relative pointer-events-none">
                        <label htmlFor="networkType">Network Type</label>
                        <div>
                          {" "}
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
                      </div>
                      <div className="relative pointer-events-none">
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
                  </Form>
                )}
              </Formik>
            ) : (
              <p>Loading...</p>
            )}
            <div className="mt-10">
              <button
                type="button"
                className={` flex gap-2 items-center text-primary `}
                onClick={handleBack}
              >
                <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" /> Back
              </button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AdminUserMgmtEdit;
