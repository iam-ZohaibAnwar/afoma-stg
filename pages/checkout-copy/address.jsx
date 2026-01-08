import dynamic from "next/dynamic";
import { faAngleDown, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { Fragment } from "react";
//import { Noto_Serif } from "next/font/google";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import Select from "react-select";
import { stateNameList, titleNameList } from "@/lib/select-option";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";

const Miniheader = dynamic(() => import("@/components/Miniheader"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });
import { useState } from "react";
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Address = () => {
  const [selectedValue, setSelectedValue] = useState("1");
  const handleSizeItemClick = (value) => {
    setSelectedSize(value);
  };
  const handleMenuItemClick = (value) => {
    setSelectedValue(value);
  };
  const initialValues = {
    fname: "",
    lname: "",
    company: "",
    city: "",
    street: "",
    zipcode: "",
    moNumber: "",
    information: "",
  };

  const validationSchema = object({
    fname: string().required("Required"),
    lname: string().required("Required"),
    company: string().required("Required"),
    city: string().required("Required"),
    street: string().required("Required"),
    zipcode: string().required("Required"),
    moNumber: yup.string().required("Required"),
    information: string().required("Required"),
  });

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
        <Miniheader />
      </section>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
            <div className="hover:text-primary flex items-center gap-1.5">
              <Link href="/">
                {" "}
                <span>Home</span>
              </Link>
              <FontAwesomeIcon icon={faAngleRight} size="sm" />
            </div>
            <span className="text-primary ">Checkout</span>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-screen-md xl:max-w-screen-lg mx-auto px-4   pt-5 pb-8 md:pb-16 xl:pb-24 ">
          <div className="mb-6 xl:mb-16">
            <h1
              className={`text-4xl xl:text-5xl text-center text-blue-950 xl:tracking-[-0.9px] mb-6 noto-font`}
            >
              Checkout
            </h1>
            <div className="flex items-center justify-center gap-[90px] xl:gap-[107px] relative">
              <div className="absolute top-1/2 border border-blue-950/50 border-dashed w-[280px] xl:w-[299px] h-px z-0"></div>
              <div className="text-sm text-primary py-1.5 px-3 border border-primary rounded-full z-10 bg-orange-50">
                1
              </div>
              <div className="text-sm text-slate-600 py-1.5 px-3 border border-slate-600 rounded-full z-10 bg-orange-50">
                2
              </div>
              <div className="text-sm text-slate-600 py-1.5 px-3 border border-slate-600 rounded-full z-10 bg-orange-50">
                3
              </div>
            </div>
          </div>
          <div className="xl:relative xl:flex xl:gap-24 items-start  xl:flex-row">
            <div className="mb-6 md:mb-12 xl:mb-0 xl:w-[514px]">
              <h2
                className={`text-blue-950 text-2xl xl:text-3xl mb-6 noto-font`}
              >
                Shipping Address
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                // onSubmit={() => //}
              >
                {({ values, errors, touched, submitCount, setFieldValue }) => (
                  <Form className="st-form ">
                    <div className="grid gap-4 lg:gap-6 md:grid-cols-2 ">
                      <div className="relative">
                        <label htmlFor="fname">First Name</label>
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
                        <label htmlFor="lname">Last Name</label>
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
                        <label htmlFor="company">Company</label>
                        <Field
                          type="text"
                          name="company"
                          id="company"
                          placeholder="Enter company name"
                        />
                        <ErrorMessage
                          name="company"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="country">Country</label>
                        <Select
                          name="title"
                          id="title"
                          options={titleNameList}
                          className="st-react-select"
                          classNamePrefix="react-select"
                          defaultValue={() => {
                            if (
                              initialValues.title &&
                              initialValues.title != ""
                            )
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
                      </div>
                      <div className="relative">
                        <label htmlFor="country">State/Province</label>
                        <Select
                          name="state"
                          id="state"
                          options={stateNameList}
                          className="st-react-select"
                          classNamePrefix="react-select"
                          defaultValue={() => {
                            if (
                              initialValues.state &&
                              initialValues.state != ""
                            )
                              return {
                                value: initialValues.state,
                                label: initialValues.state,
                              };
                            else return "";
                          }}
                          // onChange={(selectedOption) => {
                          //   handleChange("title")(selectedOption?.value);
                          // }}
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="city">City</label>
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
                      <div className="relative md:col-span-2">
                        <label htmlFor="street">Street Address</label>
                        <Field
                          as="textarea"
                          rows="3"
                          name="street"
                          id="street"
                          placeholder="Enter street address"
                        />
                        <ErrorMessage
                          name="street"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="zipcode">Zip/Postal Code</label>
                        <Field
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          placeholder="Enter zip/postal code"
                        />
                        <ErrorMessage
                          name="zipcode"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative">
                        <div className="relative viewform">
                          <label htmlFor="moNumber">Contact No.</label>
                          <PhoneInput
                            country={`in`}
                            value={values.moNumber}
                            // required
                            onChange={(value) =>
                              setFieldValue("moNumber", `+${value}`)
                            }
                            id="moNumber"
                            type="text"
                            inputProps={{
                              className: ` ${
                                errors?.moNumber &&
                                touched?.moNumber &&
                                submitCount > 0
                                  ? "border-red-600"
                                  : "border-slate-300"
                              }`,
                            }}
                          />
                          {errors?.moNumber &&
                            touched?.moNumber &&
                            submitCount > 0 && (
                              <span className="absolute -top-5 right-0 text-sm text-red-600">
                                {errors?.moNumber}
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="relative md:col-span-2 xl:mb-5">
                        <label htmlFor="information">
                          Additional information
                          <span className="ml-2 text-sm text-slate-600/70">
                            (optional)
                          </span>
                        </label>
                        <Field
                          type="text"
                          name="information"
                          id="information"
                          placeholder="Type here..."
                        />
                        <ErrorMessage
                          name="information"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <h2
                          className={`text-blue-950 text-2xl xl:text-3xl  noto-font`}
                        >
                          Shipping Methods
                        </h2>
                      </div>
                      <div className="md:col-span-2 flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14.172"
                          height="12.956"
                          viewBox="0 0 14.172 12.956"
                        >
                          <g
                            id="Duty_charges_may_apply_for_international_shipping"
                            data-name="Duty charges may apply for international shipping"
                            transform="translate(0 -20.882)"
                          >
                            <g
                              id="Group_40795"
                              data-name="Group 40795"
                              transform="translate(0 20.882)"
                            >
                              <path
                                id="Path_3131"
                                data-name="Path 3131"
                                d="M218.953,333.382a.728.728,0,1,0,0,1.457.729.729,0,0,0,0-1.457Z"
                                transform="translate(-211.867 -324.278)"
                                fill="#475569"
                              />
                              <path
                                id="Path_3132"
                                data-name="Path 3132"
                                d="M13.827,32.567a2.487,2.487,0,0,0,.006-2.517l-4.562-7.9a2.514,2.514,0,0,0-4.364,0L.338,30.056a2.523,2.523,0,0,0,2.185,3.782h9.113A2.509,2.509,0,0,0,13.827,32.567ZM12.836,32a1.377,1.377,0,0,1-1.2.7H2.52a1.358,1.358,0,0,1-1.189-.682,1.379,1.379,0,0,1,0-1.39L5.9,22.714a1.372,1.372,0,0,1,2.383,0l4.565,7.907A1.36,1.36,0,0,1,12.836,32Z"
                                transform="translate(0 -20.882)"
                                fill="#475569"
                              />
                              <path
                                id="Path_3133"
                                data-name="Path 3133"
                                d="M218.287,157.2a.792.792,0,0,0-.562.8c.017.23.032.463.05.693.05.877.1,1.736.149,2.613a.534.534,0,0,0,.545.513.545.545,0,0,0,.545-.53c0-.181,0-.347.017-.53.032-.562.067-1.125.1-1.687.017-.364.05-.728.067-1.092a.9.9,0,0,0-.067-.364A.73.73,0,0,0,218.287,157.2Z"
                                transform="translate(-211.382 -153.205)"
                                fill="#475569"
                              />
                            </g>
                          </g>
                        </svg>
                        <span className="text-slate-600 text-sm">
                          Duty charges may apply for international shipping
                        </span>
                      </div>
                      <div className="relative md:col-span-2 mb-2">
                        <label htmlFor="shipment">Select shipment method</label>
                        <Select
                          name="shipment"
                          id="shipment"
                          options={stateNameList}
                          className="st-react-select"
                          classNamePrefix="react-select"
                          defaultValue={() => {
                            if (
                              initialValues.shipment &&
                              initialValues.shipment != ""
                            )
                              return {
                                value: initialValues.shipment,
                                label: initialValues.shipment,
                              };
                            else return "";
                          }}
                          // onChange={(selectedOption) => {
                          //   handleChange("title")(selectedOption?.value);
                          // }}
                        />
                      </div>
                      <div className="flex justify-between items-center md:col-span-2 mb-6">
                        <h3 className="text-blue-950">Shipping amount:</h3>
                        <h3 className="text-blue-950">$0.00</h3>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="buttonprimary flex gap-2 items-center "
                        >
                          Next
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
            </div>
            <div className="bg-orange-100 rounded p-6 xl:px-[30px] xl:py-[36px] xl:sticky xl:top-10">
              <h2
                className={`text-blue-950 text-2xl xl:text-3xl mb-[22px] noto-font`}
              >
                Order Summary
              </h2>
              <h6 className="text-blue-950 font-semibold mb-6">
                1 item in cart
              </h6>
              <div className="flex gap-5 mb-5 pb-7 flex-col md:flex-row border-b border-slate-600/30">
                <div>
                  <div className="shrink-0 mb-3">
                    <Image
                      src="/assets/checkout/mask-group-407.png"
                      alt="Order Summary"
                      width="130"
                      height="130"
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <Link href="#">
                      <div className="flex items-center gap-1 group text-slate-600 hover:text-primary">
                        <svg
                          id="Remove_icon"
                          data-name="Remove icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="10.601"
                          height="13.047"
                          viewBox="0 0 10.601 13.047"
                          className="fill-slate-600 group-hover:fill-primary"
                        >
                          <path
                            id="Path_3135"
                            data-name="Path 3135"
                            d="M57.581,1.631H55.339V1.223A1.225,1.225,0,0,0,54.116,0H52.485a1.225,1.225,0,0,0-1.223,1.223v.408H49.019A1.02,1.02,0,0,0,48,2.65V4.077a.408.408,0,0,0,.408.408h.223l.352,7.4A1.222,1.222,0,0,0,50.2,13.047H56.4a1.222,1.222,0,0,0,1.222-1.165l.352-7.4h.223a.408.408,0,0,0,.408-.408V2.65A1.02,1.02,0,0,0,57.581,1.631Zm-5.5-.408a.408.408,0,0,1,.408-.408h1.631a.408.408,0,0,1,.408.408v.408H52.077ZM48.815,2.65a.2.2,0,0,1,.2-.2h8.562a.2.2,0,0,1,.2.2V3.67h-8.97ZM56.8,11.843a.407.407,0,0,1-.407.388H50.2a.407.407,0,0,1-.407-.388l-.35-7.358h7.707Z"
                            transform="translate(-48)"
                          />
                          <path
                            id="Path_3136"
                            data-name="Path 3136"
                            d="M240.408,214.116a.408.408,0,0,0,.408-.408v-5.3a.408.408,0,1,0-.815,0v5.3A.408.408,0,0,0,240.408,214.116Z"
                            transform="translate(-235.107 -202.7)"
                          />
                          <path
                            id="Path_3137"
                            data-name="Path 3137"
                            d="M320.408,214.116a.408.408,0,0,0,.408-.408v-5.3a.408.408,0,1,0-.815,0v5.3A.408.408,0,0,0,320.408,214.116Z"
                            transform="translate(-313.069 -202.7)"
                          />
                          <path
                            id="Path_3138"
                            data-name="Path 3138"
                            d="M160.408,214.116a.408.408,0,0,0,.408-.408v-5.3a.408.408,0,0,0-.815,0v5.3A.408.408,0,0,0,160.408,214.116Z"
                            transform="translate(-157.146 -202.7)"
                          />
                        </svg>
                        <span className=" text-xs">Remove</span>
                      </div>
                    </Link>
                    <Link href="#">
                      <div className="flex items-center gap-1 group text-slate-600 hover:text-primary">
                        <svg
                          id="Edit_icon"
                          data-name="Edit icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="13.047"
                          height="13.047"
                          viewBox="0 0 13.047 13.047"
                          className="fill-slate-600 group-hover:fill-primary"
                        >
                          <g
                            id="Group_40799"
                            data-name="Group 40799"
                            transform="translate(0 0)"
                          >
                            <path
                              id="Path_3134"
                              data-name="Path 3134"
                              d="M12.641,1.588,11.459.405A1.387,1.387,0,0,0,9.5.405L.7,9.2A.389.389,0,0,0,.6,9.4L.006,12.6a.382.382,0,0,0,.445.445l3.192-.591a.389.389,0,0,0,.2-.106l8.8-8.8A1.385,1.385,0,0,0,12.641,1.588ZM.859,12.188l.358-1.931L2.79,11.83Zm2.715-.655L1.514,9.473,9.037,1.949,11.1,4.01ZM12.1,3.007l-.463.463L9.577,1.409,10.04.946a.622.622,0,0,1,.878,0L12.1,2.128A.621.621,0,0,1,12.1,3.007Z"
                              transform="translate(0 0)"
                            />
                          </g>
                        </svg>

                        <span className=" text-xs">Edit</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div>
                  <h6 className="text-blue-950 xl:text-lg mb-2">
                    Banded Weave Loafers
                  </h6>
                  <p className="text-blue-950 text-xs mb-4">
                    by Clarissa Rebello
                  </p>
                  <div className="flex gap-2 items-center mb-3">
                    <p className="text-blue-950">Qty:</p>
                    <Menu as="div" className="relative inline-block text-left">
                      <div className="">
                        <Menu.Button className="p-[3px] bg-orange-50 flex items-center rounded-sm">
                          <p className="text-blue-950 bg-white py-2.5 px-5">
                            {selectedValue}
                          </p>
                          <div className="px-2.5">
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className="text-blue-950"
                            />
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        // ... (rest of your Transition properties)
                      >
                        <Menu.Items className="absolute mt-2  w-full origin-top-right  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleMenuItemClick("1")}
                                  className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                >
                                  1
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleMenuItemClick("2")}
                                  className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                >
                                  2
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleMenuItemClick("3")}
                                  className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                >
                                  3
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div>
                    <p className="text-blue-950 text-sm">
                      Shoe size:{" "}
                      <span className="font-semibold">European 43</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-3.5">
                <p className="text-base text-blue-950">Item total</p>
                <p className="text-base text-blue-950">CA$87.00</p>
              </div>
              <div className="flex justify-between mb-5 pb-5 border-b border-slate-600/30">
                <p className="text-base text-blue-950">Shipping charges </p>
                <p className="text-base text-blue-950">CA$87.00</p>
              </div>
              <div className="flex justify-between ">
                <p className="text-base text-blue-950">Total (1 item)</p>
                <p className="text-lg font-medium text-blue-950">CA$90.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer2 />
      </section>
    </>
  );
};

export default Address;
