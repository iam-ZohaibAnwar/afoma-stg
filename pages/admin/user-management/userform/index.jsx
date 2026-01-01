import Layout from "@/components/Layout";
import { genderList, userRole, userPermission } from "@/lib/select-option";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { faCircleInfo, faTrashCan } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import countryList from "country-list";
import { State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { boolean, mixed, object, string } from "yup";
import countryData from "country-data";
//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminUserMgmtEdit = (values, errors, id) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Approved");
  const [selectedSeller, setSellerList] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [editData, setEditData] = useState();

  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState();
  // const [showPassword, setShowPassword] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [selectedUserPermission, setSelectedUserPermission] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [prevCountry, setPrevCountry] = useState("");
  const [prevRegion, setPrevRegion] = useState("");
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code

  useEffect(() => {
    if (country) {
      if(country?.toLowerCase() == "canary islands"){
        setCountryCode("IC")
        setStatesList([{"name":"Santa Cruz de Tenerife"}, {"name":"Las Palmas"}]);
      }else{
        const countryCode = fetchCountryCode(country);
        if (countryCode) {
          setCountryCode(countryCode);
        }
        setStatesListData(countryCode);
      }
    }
  }, [country]);

  const selectCountry = (val) => {
    if(val?.toLowerCase() == "canary islands"){
      setCountry(val);
      setCountryCode("IC"); // Update countryCode state
      setStatesList([{"name":"Santa Cruz de Tenerife"}, {"name":"Las Palmas"}]);
    }else{
      setCountry(val);
      const countryCode = fetchCountryCode(val); // Call fetchCountryCode function
      setCountryCode(countryCode); // Update countryCode state
      setStatesListData(countryCode);
    }
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
    if(val == "Santa Cruz de Tenerife" || val == "Las Palmas"){
      setRegion(val)
      val == "Santa Cruz de Tenerife" ? setRegionCode("TF") : setRegionCode("LP")
    }else{
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
  const [mobileNumber, setMobileNumber] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const handleTogglePasswordField = () => {
    setShowPasswordField(!showPasswordField);
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
        setFilePath(response.data.userProfile);
        setMobileNumber(response.data.phone);
        // setSelectedInventory(response.data.inventoryList);

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
    firstName: editData?.firstName,
    lastName: editData?.lastName,
    DOB: editData?.DOB ? new Date(editData.DOB) : null,
    gender: editData?.gender || selectedGender,
    email: editData?.email,
    phone: mobileNumber,
    userRole: editData?.userRole || selectedUserRole,
    fullAccess: selectedUserPermission,
    country: country,
    state: region,
    city: editData?.city,
    streetAddress: editData?.streetAddress,
    ZipCode: editData?.ZipCode,
    userProfile: filePath,
    web3address: editData?.web3address,
    networkType: editData?.networkType,
    countryCode: countryCode || editData?.countryCode,
    stateCode: regionCode || editData?.stateCode,
  };
  const validationSchema = object({
    firstName: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
    // password: string().required("Required"),
    userRole: mixed().required("Required"),
    fullAccess: boolean(),
    lastName: string().required("Required"),
    city: string().required("Required"),
    country: string().required("Required"),
    state: string().required("Required"),
    ZipCode: string().required("Required"),
    streetAddress: string().required("Required"),
  });
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

  // const handleMenuItemClick = () => {
  //   const userData = JSON.parse(localStorage.getItem("user"));
  //   // //
  //   const options = {
  //     method: "PUT",
  //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-password/${editData?._id}`,
  //     data: {
  //       password: passwordValue,
  //       userRole: userData?.role,
  //     },
  //   };

  //   axios
  //     .create({
  //       headers: {
  //         "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //       },
  //     })
  //     .request(options)
  //     .then(function (response) {
  //       // //
  //       toast.success("Password Updated");
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //       toast.error("Something Went Wrong");
  //     });
  // };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // //

    if (editData?._id) {
      setSubmitting(true);
      // //
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/byAdmin/${editData?._id}`,
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          DOB: values?.DOB,
          gender: selectedGender,
          email: values?.email,
          web3address: values?.web3address,
          phone: mobileNumber,
          userRole: selectedUserRole,
          fullAccess: selectedUserPermission || false,
          country: country,
          state: region,
          city: values?.city,
          streetAddress: values?.streetAddress,
          ZipCode: values?.ZipCode,
          userProfile: filePath,
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

          setSubmitting(false);
          toast.success("User Updated");
          router.push(`/admin/user-management`);
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
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          DOB: values?.DOB,
          gender: selectedGender,
          email: values?.email,
          // password: values?.password,
          phone: mobileNumber,
          userRole: selectedUserRole,
          fullAccess: selectedUserPermission || false,
          country: country,
          state: region,
          city: values?.city,
          streetAddress: values?.streetAddress,
          ZipCode: values?.ZipCode,
          userProfile: filePath,
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

          setSubmitting(false);
          toast.success("New User Added");
          router.push(`/admin/user-management`);
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
  
  const countryOptions = Object.values(Object.values(countryData)[6])
  .filter((co) => co && co.name) // Remove undefined and entries without a name
  .map((co) => ({
    value: co.name, // Use the country name as both value and label
    label: co.name, // Same for label
  }));

  const uniqueCountryOptions = [
    ...new Set(countryOptions.map((option) => option.value)),
  ].map((value) => {
    return countryOptions.find((option) => option.value === value);
  });
  uniqueCountryOptions.push({"value":"Canary Islands", "label": "Canary Islands"})

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
          <div className="pb-24">
            <h3
              className={`text-2xl text-blue-950 xl:tracking-[-0.48px] mb-8 noto-font`}
            >
              Basic Information
            </h3>
            {!loading ? (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  setFieldValue,
                  handleChange,
                  errors,
                  touched,
                  submitCount,
                  isSubmitting,
                }) => (
                  <Form className="st-form">
                    <div>
                      <div className="relative mb-6">
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
                            <span>
                              <button
                                type="button"
                                className="bg-red-100 hover:bg-red-200 h-9 w-9 rounded-full"
                                onClick={() => setFilePath("")}
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </button>
                            </span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
                      <div className="relative">
                        <div>
                          {" "}
                          <label htmlFor="DOB">Date of Birth</label>
                        </div>
                        <div className="mt-3 ">
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
                      <div className="relative viewform">
                        <label htmlFor="gender">Gender</label>
                        <Select
                          name="title"
                          id="title"
                          options={genderList}
                          placeholder="Select gender"
                          className="st-react-select"
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
                          <label htmlFor="email">
                            Email Address{" "}
                            <span className="text-red-700 ">*</span>
                          </label>
                        </div>
                        <div className="">
                          {" "}
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
                      {/* <div>
                        {showPasswordField ? (
                          <div className="flex items-end gap-2 w-full">
                            <div className="relative w-full">
                              <label htmlFor="password">Password</label>
                              <Field
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Enter password"
                                style={{ height: "49px" }}
                                onChange={(e) =>
                                  setPasswordValue(e.target.value)
                                }
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
                              style={{ height: "49px" }}
                              onClick={handleMenuItemClick}
                            >
                              Save
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center  gap-1.5  mb-3">
                              <p className="text-blue-950">Password</p>
                            </div>
                            <button
                              className="buttonprimary w-full"
                              onClick={handleTogglePasswordField}
                            >
                              Change Password
                            </button>
                          </div>
                        )}
                      </div> */}
                      <div className="relative viewform">
                        <label htmlFor="phone">Contact No.</label>
                        <PhoneInput
                          country={`ca`}
                          countryCode={`ca`}
                          value={mobileNumber}
                          // required
                          onChange={(value) => setMobileNumber(`+${value}`)}
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
                        <label htmlFor="userRole">
                          User Role <span className="text-red-700 ">*</span>
                        </label>
                        <Select
                          name="userRole"
                          id="userRole"
                          options={userRole}
                          placeholder="Select user role"
                          className="st-react-select"
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
                        <ErrorMessage
                          name="fullAccess"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      {editData?.userRole == "admin" && (
                        <div className="relative viewform">
                          <label htmlFor="fullAccess">
                            Full Access <span className="text-red-700 "></span>
                          </label>
                          <Select
                            name="fullAccess"
                            id="fullAccess"
                            options={userPermission}
                            placeholder="Select full access"
                            className="st-react-select"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              setSelectedUserPermission(selectedOption?.value);
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
                          <ErrorMessage
                            name="fullAccess"
                            component="p"
                            className="invalid"
                          />
                        </div>
                      )}
                    </div>
                    <h3
                      className={`text-2xl xl:tracking-[-0.48px] text-blue-950 mt-4 mb-4 noto-font`}
                    >
                      Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      <div className="relative country-select w-full">
                        <label htmlFor="country">
                          Country <span className="text-red-700 ">*</span>
                        </label>
                        {/* <CountryDropdown
                          value={country}
                          name="country"
                          id="country"
                          defaultOptionLabel={"Select country"}
                          // onChange={(val) => selectCountry(val)}
                          onChange={(country) => {
                            selectCountry(country);
                            setFieldValue("country", country);
                          }}
                        /> */}
                        {/* <Select
                          options={uniqueCountryOptions}
                          value={country}
                          onChange={(country) => {
                            selectCountry(country?.value);
                            setFieldValue("country", country?.value);
                          }}
                          placeholder="countires"
                          className="bg-orange-50 w-full mb-4"
                        /> */}
                        <select
                          name="country"
                          id="country"
                          value={country}
                          onChange={(event) => {
                            const selectedValue = event.target.value;
                            setCountry(selectedValue);
                            setFieldValue("country", selectedValue);
                          }}
                          className="st-select"
                        >
                          <option value="" disabled>
                            Select Country
                          </option>
                          {uniqueCountryOptions.map(({ value }) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
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
                    </div>
                    <div className="flex items-baseline justify-start gap-3 mt-4 mb-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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

                    <div className="flex gap-4 items-center mt-8">
                      <div>
                        <button
                          type="submit"
                          className="buttonprimary"
                          disabled={isSubmitting}
                        >
                          {" "}
                          Save
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
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AdminUserMgmtEdit;
