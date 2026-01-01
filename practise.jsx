import React, { Fragment, useEffect, useState } from "react";
////import { Noto_Serif } from "next/font/google";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { object, string } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { productCategoryList } from "@/lib/select-option";
import Layout from "@/components/Layout";
import axios from "axios";
import { faAngleLeft, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";

////const noto = Noto_Serif({ subsets: ["latin"] });

const ProductVariation = () => {
  const [productCategoryList, setProductCategoryList] = useState(null);
  const [displayAttributCta, setDisplayAttributCta] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [displayVariationTable, setDisplayVariationTable] = useState(false);
  const [variations, setVariations] = useState();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const handleBack = () => {
    router.back();
  };

  const getAllData = (id) => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setEditData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getAllData(id);
    }
  }, [router?.query]);
  const getData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/global-attribute/all/${userData?.sellerId}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        const { global, local } = response.data;
        const newArray = [...global, ...local].map((item) => ({
          value: item,
          label: item,
        }));
        setProductCategoryList(newArray);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getVariations = (id) => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        if (response.data.variations.length > 0) {
          const allKeys = Object.keys(response.data.variations[0]);
          const attributes = allKeys.slice(0, allKeys.length - 3);
          setSelectedAttributes(attributes);
          setEditData(response.data);
          setVariations(response.data.variations);
        } else {
          setDisplayAttributCta(true);
          setDisplayVariationTable(false);
        }

        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const { id } = router.query;

    if (router?.isReady && id) {
      setDisplayVariationTable(true);
      setDisplayAttributCta(false);
      getVariations(id);
    }

    if (displayAttributCta) {
      getData();
    }
  }, [router.isReady, id]);

  const attributeSubmit = () => {
    setDisplayVariationTable(true);
    setDisplayAttributCta(false);
  };

  const variatonSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
      data: { variations: values.variations },
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        router.push(
          `/seller/product/customizable-product/product-variations?id=${response.data._id}`
        );
        setSubmitting(false);
      })
      .catch(function (error) {
        console.error(error);
        resetForm();
        setSubmitting(false);
      });
  };
  const handleDraftItemClick = () => {
    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/status/${editData?._id}`,
      data: {
        productStatus: "Review",
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
        toast.success("Submitted to review");
        router.push(`/seller/product`);
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
      });
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
      <Layout userType="seller">
        <div className="flex items-center gap-3 mb-11">
          <h1 className={`text-2xl text-blue-950    `}>
            Customization
          </h1>
          <div className="mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16.063"
              height="16.063"
              viewBox="0 0 14.063 14.063"
            >
              <g id="info" opacity="0.59">
                <g id="Group_40783" data-name="Group 40783">
                  <g id="Group_40782" data-name="Group 40782">
                    <path
                      id="Path_3128"
                      data-name="Path 3128"
                      d="M7.031,0a7.031,7.031,0,1,0,7.031,7.031A7.027,7.027,0,0,0,7.031,0Zm0,13.081a6.05,6.05,0,1,1,6.05-6.05A6.057,6.057,0,0,1,7.031,13.081Z"
                      fill="#475569"
                    />
                  </g>
                </g>
                <g
                  id="Group_40785"
                  data-name="Group 40785"
                  transform="translate(6.319 5.861)"
                >
                  <g id="Group_40784" data-name="Group 40784">
                    <path
                      id="Path_3129"
                      data-name="Path 3129"
                      d="M230.772,213.4c-.416,0-.713.176-.713.435v3.526c0,.222.3.444.713.444.4,0,.722-.222.722-.444v-3.526C231.494,213.573,231.17,213.4,230.772,213.4Z"
                      transform="translate(-230.059 -213.397)"
                      fill="#475569"
                    />
                  </g>
                </g>
                <g
                  id="Group_40787"
                  data-name="Group 40787"
                  transform="translate(6.273 3.686)"
                >
                  <g id="Group_40786" data-name="Group 40786">
                    <path
                      id="Path_3130"
                      data-name="Path 3130"
                      d="M229.134,134.208a.667.667,0,1,0,.75.657A.717.717,0,0,0,229.134,134.208Z"
                      transform="translate(-228.375 -134.208)"
                      fill="#475569"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {displayAttributCta ? (
          <div className="z-10">
            <Formik initialValues={{ fname: "" }} onSubmit={attributeSubmit}>
              {() => (
                <Form>
                  <div className="st-form customform flex flex-wrap gap-6  mb-10 h-full items-end">
                    <div className="relative w-[300px] md:w-[550px] z-10">
                      <label htmlFor="attributeName">
                        Select Attribute{" "}
                        <span className="text-red-700 ">*</span>
                      </label>{" "}
                      <Select
                        isMulti={true}
                        name="attributeName"
                        id="attributeName"
                        options={productCategoryList}
                        placeholder="Select attribute"
                        className="st-react-select overflow-visible"
                        classNamePrefix="react-select"
                        // defaultValue={() => {
                        //   if (initialValues.title && initialValues.title != "")
                        //     return {
                        //       value: initialValues.title,
                        //       label: initialValues.title,
                        //     };
                        //   else return "";
                        // }}
                        onChange={(selectedOptions) => {
                          setSelectedAttributes(
                            selectedOptions.map((option) => option.value)
                          );
                        }}
                      />
                    </div>
                    <button type="submit" className="buttonprimary">
                      Create variaton
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="mb-6">
            <button
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary group"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure? By clicking on 'ok' you will loose your added record(s) and you will need to add them again!"
                  )
                ) {
                  setSelectedAttributes(null);
                  setDisplayVariationTable(false);
                  setDisplayAttributCta(true);
                  setVariations(null);
                }
              }}
            >
              <svg
                id="Edit_icon"
                data-name="Edit icon"
                xmlns="http://www.w3.org/2000/svg"
                width="13.047"
                height="13.047"
                viewBox="0 0 13.047 13.047"
                className="fill-[#475569] group-hover:fill-[#1F628E]"
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
              Change Attribute(s)
            </button>
          </div>
        )}

        {displayVariationTable && !loading && (
          <Formik
            initialValues={{ variations: variations }}
            onSubmit={variatonSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <div>
                  <table className="text-sm w-full table-auto border-separate border-spacing-0 bg-orange-50 z-10 h-full rounded-md border border-[#4755694D] mt-6">
                    <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                      <tr className="flex gap-12 items-center">
                        {selectedAttributes?.map((attr, index) => (
                          <th
                            className={`w-[140px] ${
                              index == 0 ? "pl-7 py-5" : ""
                            }`}
                            key={index}
                          >
                            {attr}
                          </th>
                        ))}
                        <th
                          className={` w-[160px] ${
                            selectedAttributes.length == 0 && "pl-7 py-5"
                          }`}
                        >
                          Inventory
                        </th>
                        <th className=" w-[100px]">Quantity</th>
                        <th className=" w-[100px]">Price</th>
                        <th className=" w-[109px]">Action</th>
                      </tr>
                    </thead>

                    <FieldArray name="variations">
                      {({ remove, push }) => (
                        <>
                          <tbody className="st-form  parent">
                            {values?.variations?.length > 0 &&
                              values?.variations.map((add, index) => (
                                <tr
                                  className="flex gap-12 items-center tableform child"
                                  key={index}
                                >
                                  {selectedAttributes.map((attr, key) => (
                                    <td
                                      className={`text-blue-950 w-[140px] ${
                                        key == 0 && "pl-7 py-5"
                                      }`}
                                      key={key}
                                    >
                                      <Field
                                        type="text"
                                        name={`variations.${index}.${attr}`}
                                        id={`variations.${index}.${attr}`}
                                        placeholder={attr}
                                      />
                                    </td>
                                  ))}
                                  <td
                                    className={`text-blue-950 w-[160px]  ${
                                      selectedAttributes.length === 0 &&
                                      "pl-7 py-5"
                                    }`}
                                  >
                                    <Select
                                      name={`variations.${index}.inventory`}
                                      id={`variations.${index}.inventory`}
                                      options={[
                                        {
                                          value: "In Stock",
                                          label: "In Stock",
                                        },
                                        {
                                          value: "Out of Stock",
                                          label: "Out of Stock",
                                        },
                                      ]}
                                      placeholder="stock"
                                      className="st-react-select"
                                      classNamePrefix="react-select"
                                      defaultValue={() => {
                                        if (variations && variations !== "") {
                                          return {
                                            value: variations[index]?.inventory,
                                            label: variations[index]?.inventory,
                                          };
                                        } else return "";
                                      }}
                                      onChange={(selectedOption) => {
                                        const inventoryValue =
                                          selectedOption.label;
                                        setFieldValue(
                                          `variations.${index}.inventory`,
                                          inventoryValue
                                        );

                                        // Check if the selected inventory is "Out of Stock" and disable quantity accordingly
                                        const isOutOfStock =
                                          inventoryValue === "Out of Stock";
                                        if (isOutOfStock) {
                                          // Disable quantity field
                                          setFieldValue(
                                            `variations.${index}.quantity`,
                                            ""
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="text-blue-950 w-[100px]">
                                    <Field
                                      type="text"
                                      name={`variations.${index}.quantity`}
                                      id={`variations.${index}.quantity`}
                                      placeholder="Quantity"
                                      disabled={
                                        values.variations[index]?.inventory ===
                                        "Out of Stock"
                                      }
                                    />
                                  </td>
                                  <td className="text-blue-950 w-[100px]">
                                    <Field
                                      type="text"
                                      name={`variations.${index}.price`}
                                      id={`variations.${index}.price`}
                                      placeholder="Price"
                                    />
                                  </td>
                                  <td className=" w-[100px]">
                                    <button
                                      onClick={() => {
                                        // Prevent default redirection
                                        event.preventDefault();
                                        // Remove the element at the current index
                                        remove(index);
                                      }}
                                    >
                                      <span className="text-blue-950 text-sm underline hover:text-primary">
                                        Delete
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                          <button
                            type="button"
                            className="bg-transparent text-slate-600 text-sm pl-7 flex gap-2 items-center py-4"
                            onClick={() => push()}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            Add
                          </button>
                        </>
                      )}
                    </FieldArray>
                  </table>
                </div>
                <div className="flex flex-wrap items-center mt-12  gap-5">
                  <div>
                    {" "}
                    <button
                      type="button"
                      className={` flex gap-2 items-center text-primary `}
                      onClick={handleBack}
                    >
                      <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                      Back
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="buttonprimary disabled:opacity-50"
                  >
                    Save as draft
                  </button>
                  <div>
                    <button
                      type="button"
                      className="text-primary ease-in transition-colors hover:text-orange-50 disabled:cursor-progress rounded-sm hover:bg-primary  font-medium py-2 px-3 border border-primary  disabled:opacity-50 disabled:hover:bg-transparent disabled:text-primary"
                      onClick={handleDraftItemClick}
                      disabled={
                        editData?._id == null ||
                        ["Approved", "Disapproved", "Review"].includes(
                          editData?.productStatus
                        )
                      }
                    >
                      Submit for approval
                    </button>
                  </div>

                  {isSubmitting && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="31px"
                      height="31px"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        stroke="#1F628E"
                        strokeWidth="10"
                        r="30"
                        strokeDasharray="141.37166941154067 49.12388980384689"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          repeatCount="indefinite"
                          dur="1s"
                          values="0 50 50;360 50 50"
                          keyTimes="0;1"
                        />
                      </circle>
                    </svg>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Layout>
    </>
  );
};

export default ProductVariation;
