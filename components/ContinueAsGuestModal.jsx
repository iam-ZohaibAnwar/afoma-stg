import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CountryDropdown } from "react-country-region-selector";
import countryData from "country-data";
import { State } from "country-state-city";

const GuestFormModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [statesList, setStatesList] = useState([]);

  useEffect(() => {
    if (country) {
      const countryCode = fetchCountryCode(country);
      if (countryCode) {
        setStatesListData(countryCode);
      }
    }
  }, [country]);

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
  const validationSchema2 = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    streetAddress: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    ZipCode: Yup.string().required("Postal Code is required"),
    phone: Yup.string().required("Phone Number is required"),
  });

  const initialValues2 = {
    name: "",
    email: "",
    streetAddress: "",
    country: "",
    state: "",
    city: "",
    ZipCode: "",
    phone: "",
  };

  const selectCountry = (val) => {
    setCountry(val);
  };

  const selectRegion = (val) => {
    setRegion(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md bg-orange-100 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2 border-b border-orange-200 sticky top-0 bg-orange-100 z-10">
          <h2 className="text-blue-950 text-2xl font-semibold">Continue as Guest</h2>
          <button
            className="text-gray-600 hover:text-red-600 text-2xl"
            onClick={() => onClose(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="overflow-y-auto max-h-[80vh] p-6">
          <div className="w-full max-w-md mx-auto px-4">
            <Formik
              initialValues={initialValues2}
              validationSchema={validationSchema2}
              onSubmit={onSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="grid gap-5">

                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="w-full rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:bg-orange-100 focus:bg-orange-100"
                    />
                    <ErrorMessage name="name" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="w-full rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="email" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="streetAddress" className="block mb-1 text-sm font-medium">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="streetAddress"
                      id="streetAddress"
                      className="w-full rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="streetAddress" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* ✅ Country */}
                  <div>
                    <label htmlFor="country" className="block mb-1 text-sm font-medium">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <CountryDropdown
                      value={values.country}
                      name="country"
                      id="country"
                      defaultOptionLabel="Select country"
                      onChange={(country) => {
                        selectCountry(country);
                        setFieldValue("country", country);
                      }}
                      classes="w-full box-border rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="country" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* State */}
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

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block mb-1 text-sm font-medium">
                      City <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="city"
                      id="city"
                      className="w-full rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="city" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label htmlFor="ZipCode" className="block mb-1 text-sm font-medium">
                      Postal Code <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="ZipCode"
                      id="ZipCode"
                      className="w-full rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="ZipCode" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      id="phone"
                      className="w-full rounded-md border border-gray-300 bg-orange-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="phone" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="buttonprimary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium flex items-center gap-2 justify-center mx-auto"
                    >
                      {isSubmitting ? "Submitting..." : "Continue"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="7.477"
                        height="13.14"
                        viewBox="0 0 7.477 13.14"
                      >
                        <path
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestFormModal;
