import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faAngleLeft, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";

//const noto = Noto_Serif({ subsets: ["latin"] });

const ProductVariation = () => {
  const [productCategoryList, setProductCategoryList] = useState(null);
  const [displayAttributCta, setDisplayAttributCta] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [displayVariationTable, setDisplayVariationTable] = useState(false);
  const [variations, setVariations] = useState();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [priceInSelectedCurrency, setPriceInSelectedCurrency] = useState("");
  const [currencyRate, setCurrencyRate] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldScroll = urlParams.get('scroll') === 'save' || urlParams.get('scroll') === 'update';

    if (!shouldScroll) return;

    const scrollToSave = () => {
      const wrapper = document.getElementById("save-button-wrapper");
      if (wrapper) {
        console.log("Scrolling to Save Button");
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn("Save wrapper not found");
      }
    };

    // Delay scroll until image is loaded and layout is stable
    if (variations.length > 0) {
      // Delay slightly to let DOM paint (esp. validation divs)
      setTimeout(scrollToSave, 300);
    }
  }, [variations]); // will rerun when imagePath is set

  const fetchCurrencyRate = async () => {
    try {
      editData?.currency ? setSelectedCurrency(editData?.currency) : "";
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
      );

      const currencyOptions = Object.keys(data).map((key) => ({
        value: key,
        label: `${key.toUpperCase()} - ${data[key]}`,
      }));
      setCurrencies(currencyOptions);
    } catch (error) {
      console.error("Error fetching currency rate:", error);
      return null;
    }
  };
  // Handle price change in selected currency
  const handlePriceChange = async (price) => {
    if (price) {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedCurrency?.toLowerCase()}.json`
      );
      setPriceInSelectedCurrency(parseFloat(price));

      if (selectedCurrency && data[selectedCurrency?.toLowerCase()]["cad"]) {
        setCurrencyRate(data[selectedCurrency?.toLowerCase()]["cad"] || 1);
        const cadPrice =
          parseFloat(price) * data[selectedCurrency?.toLowerCase()]["cad"];
        return parseFloat(cadPrice).toFixed(2);
      }
    }
    return "";
  };

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
        setSelectedCurrency(response.data?.currency);
        setPriceInSelectedCurrency(response.data?.currencyPrice);
        setCurrencyRate(response.data?.currencyRate);
        setEditData(response);
        if (response.data.variations.length > 0) {
          const allKeys = Object.keys(response.data.variations[0]);
          const notAttribute = ["image","price","inventory","quantity","finalPrice","totalPrice", "currencyPrice"]
          const attributes = allKeys.filter(key => !notAttribute.includes(key));
          // const attributes = allKeys.slice(0, allKeys.length - 5);
          setSelectedAttributes(attributes);
          setVariations(
            response.data.variations.map((variation) => {
              return {
                ...variation,
                image:
                  variation && variation.image ? variation.image : undefined,
              };
            })
          );
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
      fetchCurrencyRate();
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/variations/${id}`,
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
        setEditData(
          response.data && response.data.product
            ? response.data.product
            : undefined
        ); // Update the local state with the new data
        router.push(
          `/seller/product/customizable-product/product-variations?id=${response.data.product._id}&scroll=save`
        );
        toast.success("Product Updated");
        // window.location.reload(true);
        setSubmitting(false);
      })
      .catch(function (error) {
        console.error(error);
        resetForm();
        setSubmitting(false);
      });
  };
  const getAllData = (id) => {
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

  const getImageLabel = (imageUrl) => {
    if (imageUrl && editData && editData.images.length > 0) {
      let imageFound = editData.images.find(
        (image) => image.imageUrl === imageUrl
      );
      return imageFound?.altText || "No label available";
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
        <div className="flex items-center gap-3 mb-11">
          <h1 className={`text-2xl text-blue-950   noto-font `}>
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
                  <div className="st-form customform flex flex-wrap gap-6 mb-10 h-full items-end">
                    <div className="relative w-full md:w-[550px] z-10">
                      <label htmlFor="attributeName">
                        Select Attribute <span className="text-red-700">*</span>
                      </label>
                      <Select
                        isMulti
                        name="attributeName"
                        id="attributeName"
                        options={productCategoryList}
                        placeholder="Select attribute"
                        className="st-react-select overflow-visible mt-1"
                        classNamePrefix="react-select"
                        onChange={(selectedOptions) => {
                          const values = (selectedOptions || []).map(
                            (option) => option.value
                          );
                          setSelectedAttributes(values);
                        }}
                      />
                    </div>
                    <button type="submit" className="buttonprimary">
                      Create variation
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="mb-6">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary group"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure? By clicking on 'ok' you will lose your added record(s) and you will need to add them again!"
                  )
                ) {
                  setSelectedAttributes([]);
                  setDisplayVariationTable(false);
                  setDisplayAttributCta(true);
                  setVariations([]);
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
                <g id="Group_40799" data-name="Group 40799">
                  <path
                    id="Path_3134"
                    d="M12.641,1.588,11.459.405A1.387,1.387,0,0,0,9.5.405L.7,9.2A.389.389,0,0,0,.6,9.4L.006,12.6a.382.382,0,0,0,.445.445l3.192-.591a.389.389,0,0,0,.2-.106l8.8-8.8A1.385,1.385,0,0,0,12.641,1.588ZM.859,12.188l.358-1.931L2.79,11.83Zm2.715-.655L1.514,9.473,9.037,1.949,11.1,4.01ZM12.1,3.007l-.463.463L9.577,1.409,10.04.946a.622.622,0,0,1,.878,0L12.1,2.128A.621.621,0,0,1,12.1,3.007Z"
                  />
                </g>
              </svg>
              Change Attribute(s)
            </button>
          </div>
        )}

        {/* VARIATIONS EDITOR */}
        {displayVariationTable && !loading && (
          <Formik
            enableReinitialize
            initialValues={{ variations: variations }}
            onSubmit={variatonSubmit}
          >
            {({ values, setFieldValue, isSubmitting, handleChange }) => (
              <Form>
                {/* DESKTOP TABLE (md and up) */}
                <div className="hidden md:block mt-6">
                  <div className="overflow-x-auto w-full">
                    <table className="text-sm w-full table-auto border-separate border-spacing-0 bg-orange-50 z-10 h-full rounded-md border border-[#4755694D]">
                      <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                        <tr className="flex justify-around items-center h-full">
                          {selectedAttributes
                            ?.filter((attr) => attr !== "image")
                            .map((attr, index) => (
                              <th
                                className="mx-3 flex-1 capitalize min-w-[220px]"
                                key={index}
                              >
                                {attr}
                              </th>
                            ))}
                          <th className="mx-3 flex-1 min-w-[220px]">Inventory</th>
                          <th className="mx-3 flex-1 min-w-[220px]">Quantity</th>
                          {selectedCurrency && (
                            <th className="mx-3 flex-1 min-w-[220px]">
                              Currency Price
                            </th>
                          )}
                          {editData?.images?.length ? (
                            <th className="mx-3 flex-1 min-w-[220px]">Image</th>
                          ) : null}
                          <th className="mx-3 flex-1 min-w-[220px]">
                            CAD Price
                          </th>
                          <th className="mx-3 flex-1 min-w-[220px]">Action</th>
                        </tr>
                      </thead>

                      <FieldArray name="variations">
                        {({ remove, push }) => (
                          <>
                            <tbody className="st-form parent">
                              {values?.variations?.length > 0 &&
                                values.variations.map((row, index) => (
                                  <tr
                                    className="flex justify-around items-center tableform child h-full my-2"
                                    key={index}
                                  >
                                    {selectedAttributes
                                      ?.filter((attr) => attr !== "image")
                                      .map((attr, key) => (
                                        <td
                                          className="text-blue-950 mx-3 flex-1 min-w-[120px]"
                                          key={key}
                                        >
                                          <Field
                                            type="text"
                                            name={`variations.${index}.${attr}`}
                                            id={`variations.${index}.${attr}`}
                                            placeholder={attr}
                                            className="w-full border border-slate-300 rounded px-2 py-1"
                                          />
                                        </td>
                                      ))}

                                    {/* Inventory Select */}
                                    <td className="text-blue-950 mx-3 flex-1 min-w-[120px]">
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
                                        placeholder="Stock"
                                        className="st-react-select w-full"
                                        classNamePrefix="react-select"
                                        menuPlacement="auto"
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menu: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                            position: "absolute",
                                          }),
                                          menuList: (base) => ({
                                            ...base,
                                            maxHeight: "none",
                                          }),
                                        }}
                                        defaultValue={
                                          variations && variations.length
                                            ? {
                                              value:
                                                variations[index]?.inventory,
                                              label:
                                                variations[index]?.inventory,
                                            }
                                            : undefined
                                        }
                                        onChange={(selectedOption) => {
                                          const inventoryValue =
                                            selectedOption?.label ?? "";
                                          setFieldValue(
                                            `variations.${index}.inventory`,
                                            inventoryValue
                                          );
                                          const isOutOfStock =
                                            inventoryValue === "Out of Stock";
                                          if (isOutOfStock) {
                                            setFieldValue(
                                              `variations.${index}.quantity`,
                                              ""
                                            );
                                          }
                                        }}
                                      />
                                    </td>

                                    {/* Quantity */}
                                    <td className="text-blue-950 mx-3 flex-1 min-w-[120px]">
                                      <Field
                                        type="text"
                                        name={`variations.${index}.quantity`}
                                        id={`variations.${index}.quantity`}
                                        placeholder="Quantity"
                                        disabled={
                                          values.variations[index]?.inventory ===
                                          "Out of Stock"
                                        }
                                        className="w-full border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100"
                                      />
                                    </td>

                                    {/* Currency price */}
                                    {selectedCurrency && (
                                      <td className="text-blue-950 mx-3 flex-1 min-w-[140px]">
                                        <Field
                                          type="text"
                                          name={`variations.${index}.currencyPrice`}
                                          id={`variations.${index}.currencyPrice`}
                                          placeholder="Currency price"
                                          className="w-full border border-slate-300 rounded px-2 py-1"
                                          onChange={async (e) => {
                                            const val = e.target.value;
                                            handleChange(
                                              `variations.${index}.currencyPrice`
                                            )(val);
                                            const price =
                                              await handlePriceChange(val);
                                            handleChange(
                                              `variations.${index}.price`
                                            )(price);
                                          }}
                                        />
                                      </td>
                                    )}

                                    {/* Image select */}
                                    {editData?.images?.length ? (
                                      <td className="text-blue-950 mx-3 flex-1 min-w-[160px]">
                                        <Select
                                          name={`variations.${index}.image`}
                                          id={`variations.${index}.image`}
                                          options={editData.images.map(
                                            (image) => ({
                                              value: image.imageUrl,
                                              label: image.altText,
                                            })
                                          )}
                                          placeholder="Image"
                                          className="st-react-select w-full"
                                          classNamePrefix="react-select"
                                          menuPlacement="auto"
                                          menuPortalTarget={document.body}
                                          styles={{
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                              position: "absolute",
                                            }),
                                            menuList: (base) => ({
                                              ...base,
                                              maxHeight: "none",
                                            }),
                                          }}
                                          defaultValue={
                                            variations && variations.length
                                              ? {
                                                value: variations[index]?.image,
                                                label: getImageLabel(
                                                  variations[index]?.image
                                                ),
                                              }
                                              : undefined
                                          }
                                          onChange={(selectedOption) => {
                                            const imageValue =
                                              selectedOption?.value ?? "";
                                            setFieldValue(
                                              `variations.${index}.image`,
                                              imageValue
                                            );
                                          }}
                                        />
                                      </td>
                                    ) : null}

                                    {/* CAD price */}
                                    <td className="text-blue-950 mx-3 flex-1 min-w-[120px]">
                                      <Field
                                        type="text"
                                        name={`variations.${index}.price`}
                                        id={`variations.${index}.price`}
                                        placeholder="Price"
                                        required
                                        className="w-full border border-slate-300 rounded px-2 py-1"
                                      />
                                    </td>

                                    {/* Actions */}
                                    <td className="mx-3 flex-1 min-w-[100px]">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
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
                              onClick={() =>
                                push({
                                  inventory: "In Stock",
                                  quantity: "",
                                  price: "",
                                  currencyPrice: "",
                                  image: "",
                                })
                              }
                            >
                              <FontAwesomeIcon icon={faPlus} />
                              Add
                            </button>
                          </>
                        )}
                      </FieldArray>
                    </table>
                  </div>
                </div>

                {/* MOBILE CARD VIEW (below md) */}
                <div className="block md:hidden mt-6 space-y-4">
                  <FieldArray name="variations">
                    {({ remove, push }) => (
                      <>
                        {values.variations?.length > 0 &&
                          values.variations.map((row, index) => (
                            <div
                              key={index}
                              className="rounded-md border border-slate-300 bg-orange-50 p-4 space-y-3"
                            >
                              {/* Selected attributes */}
                              {selectedAttributes
                                .filter((attr) => attr !== "image")
                                .map((attr) => (
                                  <div
                                    key={attr}
                                    className="flex flex-col gap-1 text-sm"
                                  >
                                    <span className="text-slate-600 capitalize">
                                      {attr}
                                    </span>
                                    <Field
                                      type="text"
                                      name={`variations.${index}.${attr}`}
                                      placeholder={attr}
                                      className="border border-slate-300 rounded px-2 py-1 h-12 bg-orange-50"
                                    />
                                  </div>
                                ))}

                              {/* Inventory */}
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="text-slate-600">Inventory</span>
                                <Select
                                  name={`variations.${index}.inventory`}
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
                                  placeholder="Stock"
                                  className="st-react-select w-full"
                                  classNamePrefix="react-select"
                                  menuPlacement="auto"
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menu: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      position: "absolute",
                                    }),
                                    menuList: (base) => ({
                                      ...base,
                                      maxHeight: "none",
                                    }),
                                  }}
                                  defaultValue={
                                    variations && variations.length
                                      ? {
                                        value: variations[index]?.inventory,
                                        label: variations[index]?.inventory,
                                      }
                                      : undefined
                                  }
                                  onChange={(selectedOption) => {
                                    const inventoryValue =
                                      selectedOption?.label ?? "";
                                    setFieldValue(
                                      `variations.${index}.inventory`,
                                      inventoryValue
                                    );
                                    const isOutOfStock =
                                      inventoryValue === "Out of Stock";
                                    if (isOutOfStock) {
                                      setFieldValue(
                                        `variations.${index}.quantity`,
                                        ""
                                      );
                                    }
                                  }}
                                />
                              </div>

                              {/* Quantity */}
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="text-slate-600">Quantity</span>
                                <Field
                                  type="text"
                                  name={`variations.${index}.quantity`}
                                  placeholder="Quantity"
                                  disabled={
                                    values.variations[index]?.inventory ===
                                    "Out of Stock"
                                  }
                                  className="border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100 bg-orange-50 h-12"
                                />
                              </div>

                              {/* Currency price */}
                              {selectedCurrency && (
                                <div className="flex flex-col gap-1 text-sm">
                                  <span className="text-slate-600">
                                    Currency Price
                                  </span>
                                  <Field
                                    type="text"
                                    name={`variations.${index}.currencyPrice`}
                                    placeholder="Currency price"
                                    className="border border-slate-300 rounded px-2 py-1 bg-orange-50 h-12"
                                    onChange={async (e) => {
                                      const val = e.target.value;
                                      handleChange(
                                        `variations.${index}.currencyPrice`
                                      )(val);
                                      const price = await handlePriceChange(val);
                                      handleChange(
                                        `variations.${index}.price`
                                      )(price);
                                    }}
                                  />
                                </div>
                              )}

                              {/* Image select */}
                              {editData?.images?.length ? (
                                <div className="flex flex-col gap-1 text-sm">
                                  <span className="text-slate-600">Image</span>
                                  <Select
                                    name={`variations.${index}.image`}
                                    options={editData.images.map((image) => ({
                                      value: image.imageUrl,
                                      label: image.altText,
                                    }))}
                                    placeholder="Image"
                                    className="st-react-select w-full"
                                    classNamePrefix="react-select"
                                    menuPlacement="auto"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        position: "absolute",
                                      }),
                                      menuList: (base) => ({
                                        ...base,
                                        maxHeight: "none",
                                      }),
                                    }}
                                    defaultValue={
                                      variations && variations.length
                                        ? {
                                          value: variations[index]?.image,
                                          label: getImageLabel(
                                            variations[index]?.image
                                          ),
                                        }
                                        : undefined
                                    }
                                    onChange={(selectedOption) => {
                                      const imageValue =
                                        selectedOption?.value ?? "";
                                      setFieldValue(
                                        `variations.${index}.image`,
                                        imageValue
                                      );
                                    }}
                                  />
                                </div>
                              ) : null}

                              {/* CAD price */}
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="text-slate-600">CAD Price</span>
                                <Field
                                  type="text"
                                  name={`variations.${index}.price`}
                                  placeholder="Price"
                                  required
                                  className="border border-slate-300 rounded px-2 py-1 bg-orange-50 h-12"
                                />
                              </div>

                              {/* Delete */}
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    remove(index);
                                  }}
                                >
                                  <span className="text-blue-950 text-sm underline hover:text-primary">
                                    Delete
                                  </span>
                                </button>
                              </div>
                            </div>
                          ))}

                        <button
                          type="button"
                          className="bg-transparent text-slate-600 text-sm flex gap-2 items-center py-3"
                          onClick={() =>
                            push({
                              inventory: "In Stock",
                              quantity: "",
                              price: "",
                              currencyPrice: "",
                              image: "",
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          Add
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex flex-wrap items-center mt-12 gap-5">
                  <div id="save-button-wrapper">
                    <button
                      type="button"
                      className="flex gap-2 items-center text-primary"
                      onClick={handleBack}
                    >
                      <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />
                      Back
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="buttonprimary disabled:opacity-50"
                  >
                    Save
                  </button>

                  <div>
                    <button
                      type="button"
                      className="text-primary ease-in transition-colors hover:text-orange-50 disabled:cursor-progress rounded-sm hover:bg-primary font-medium py-2 px-3 border border-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:text-primary"
                      onClick={handleDraftItemClick}
                      disabled={
                        editData?._id == null ||
                        ["Approved", "Review"].includes(
                          editData?.productStatus ?? ""
                        )
                      }
                    >
                      Submit for approval
                    </button>
                  </div>

                  {isSubmitting && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                        strokeDasharray="141.37 49.12"
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
