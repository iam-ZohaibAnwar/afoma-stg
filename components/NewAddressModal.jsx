import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import countryData from "country-data";
import { State } from "country-state-city";
import * as Yup from "yup";

export default function Modal({ selectedAddress, isOpen, onClose, onSubmit }) {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [countryCode, setCountryCode] = useState(""); // State to hold country code
  const [regionCode, setRegionCode] = useState(""); // State to hold region (state) code
  const [statesList, setStatesList] = useState([]); // State to hold region (state) code

  useEffect(() => {
    if (selectedAddress && selectedAddress.id) {
      selectCountry(selectedAddress.country);
      selectRegion(selectedAddress.state);
    }
  }, [selectedAddress]);

  const selectCountry = (val) => {
    setCountry(val);
    const code = countryData.countries.all.find(
      (country) => country.name === val
    )?.alpha2;
    setCountryCode(code || "");
    setRegion(""); // Clear region when country changes
    setRegionCode(""); // Clear region code when country changes
    setStatesListData(code);
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
    setRegionCode(selectedState ? selectedState.isoCode : "");
  };

  const initialValues = {
    id: selectedAddress ? selectedAddress.id : undefined,
    firstName: selectedAddress ? selectedAddress.firstName : "",
    lastName: selectedAddress ? selectedAddress.lastName : "",
    country: selectedAddress ? selectedAddress.country : "",
    state: selectedAddress ? selectedAddress.state : "",
    city: selectedAddress ? selectedAddress.city : "",
    streetAddress: selectedAddress ? selectedAddress.streetAddress : "",
    ZipCode: selectedAddress ? selectedAddress.ZipCode : "",
    countryCode: selectedAddress ? selectedAddress.countryCode : "",
    stateCode: selectedAddress ? selectedAddress.stateCode : "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    streetAddress: Yup.string().required("Required"),
    ZipCode: Yup.string().required("Required"),
  });

  const handleSubmit = (values) => {
    onSubmit({ ...values, countryCode: countryCode, stateCode: regionCode });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-orange-50 rounded-lg shadow-lg st-form max-h-[92vh] overflow-auto">
        <h2 className="text-xl font-semibold text-center">New Address</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, setFieldValue, touched, submitCount, handleChange }) => (
            <Form className="mt-4 space-y-2">
              <div className="relative">
                <div>
                  {" "}
                  <label htmlFor="firstName">
                    First Name <span className="text-red-700 ">*</span>
                  </label>
                </div>
                <div className="mt-0">
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
                <div className="mt-0">
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
                <ErrorMessage name="state" component="p" className="invalid" />
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
                <ErrorMessage name="city" component="p" className="invalid" />
              </div>

              <div className="relative">
                <div>
                  <label htmlFor="streetAddress">
                    Street Address <span className="text-red-700 ">*</span>
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
                    Zip/Postal Code <span className="text-red-700 ">*</span>
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
              <div className="flex justify-end gap-4 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
