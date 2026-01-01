import { useEffect, useState } from "react";
import { ErrorMessage, Formik, Form, Field } from "formik";
import Layout from "@/components/Layout";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
//import { Noto_Serif } from "next/font/google";
import Select from "react-select";
//const noto = Noto_Serif({ subsets: ["latin"] });

const ShippingConfig = () => {
  const [initialValues, setInitialValues] = useState({
    domestic: {
      flat_rate: false,
      afoma_shipping: false,
      hand_delivery: false,
      hand_delivery_options: { free_delivery: false, fee_rate: null },
      flat_rate_options: {
        free_shipping: false,
        is_flat_rate: false,
        flat_rate_rate: null,
        additional_cost: null,
        is_flat_weighted: false,
        flat_rate_0_1: null,
        flat_rate_1_5: null,
        flat_rate_5_A: null,
      },
    },
    international: {
      flat_rate: false,
      afoma_shipping: false,
      hand_delivery: false,
      hand_delivery_options: { free_delivery: false, fee_rate: null },
      flat_rate_options: {
        free_shipping: false,
        is_flat_rate: false,
        flat_rate_rate: null,
        additional_cost: null,
        is_flat_weighted: false,
        flat_rate_0_1: null,
        flat_rate_1_5: null,
        flat_rate_5_A: null,
      },
    },
  });
  const [showModalDomestic, setShowModalDomestic] = useState(false);
  const [showModalInternational, setShowModalInternational] = useState(false);

  const [isFreeDeliveryDomestic, setIsFreeDeliveryDomestic] = useState(false);
  const [isFreeDeliveryInternational, setIsFreeDeliveryInternational] =
    useState(false);

  const [showModalFlatRateDomestic, setShowModalFlatRateDomestic] =
    useState(false);
  const [flatRateDomesticEnable, setFlatRateDomesticEnable] = useState(false);
  const [showModalFlatRateInternational, setShowModalFlatRateInternational] = useState(false);
  const [faltRateInternationalEnable, setFaltRateInternationalEnable] =
    useState(false);
  const [editData, setEditData] = useState();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("cad");
  const [conversionRate, setConversionRate] = useState("1");
  const [conversionRateCAD, setConversionRateCAD] = useState("1");
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [flatWeightedRateDomesticEnable, setFlatWeightedRateDomesticEnable] =
    useState(false);
  const [
    flatWeightedRateInternationalEnable,
    setFlatWeightedRateInternationalEnable,
  ] = useState(false);

  useEffect(() => {
    fetchCurrencyRate();
    fetchShippingConfig();
    setLoading(true);
  }, []);

  const fetchShippingConfig = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/shipping-config/${user?.sellerId}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        convertPricesIntoCurrency(response.data);
        setEditData(response.data);
        handleIsEditData(response.data);
        if (response.data.currency) setSelectedCurrency(response.data.currency);
        setConversionRateCAD(response.data.conversion_rate);
        setLoading(false);
      })
      .catch(function (error) {
        // toast.error(error);
        setLoading(false);
      });
  };

  const handleIsEditData = (data) => {
    if (
      data?.domestic?.flat_rate &&
      data?.domestic?.flat_rate_options?.is_flat_rate
    ) {
      setFlatRateDomesticEnable(true);
    }

    if (
      data?.international?.flat_rate &&
      data?.international?.flat_rate_options?.is_flat_rate
    ) {
      setFaltRateInternationalEnable(true);
    }

    if (
      data?.domestic?.hand_delivery &&
      data?.domestic?.hand_delivery_options?.free_delivery
    ) {
      setIsFreeDeliveryDomestic(true);
    }

    if (
      data?.international?.hand_delivery &&
      data?.international?.hand_delivery_options?.free_delivery
    ) {
      setIsFreeDeliveryInternational(true);
    }
  };

  const handleSaveShippingOptions = async (values) => {
    const someChecked =
      !!values.domestic.hand_delivery ||
      !!values.domestic.flat_rate ||
      !!values.international.hand_delivery ||
      !!values.international.flat_rate;

    if (!someChecked) {
      toast.error("Please enable at least one shipping option");
      return;
    }

    if (!checkValidation(values)) return;
    // Add your additional logic here
    if (!values.international.hand_delivery) {
      values.international.hand_delivery_options = {
        free_delivery: false,
        fee_rate: null,
      };
    } else if (values.international.hand_delivery_options?.free_delivery) {
      values.international.hand_delivery_options.fee_rate = null;
    }

    // Handle Domestic Hand Delivery
    if (!values.domestic.hand_delivery) {
      values.domestic.hand_delivery_options = {
        free_delivery: false,
        fee_rate: null,
      };
    } else if (values.domestic.hand_delivery_options?.free_delivery) {
      values.domestic.hand_delivery_options.fee_rate = null;
    }

    // Handle International Flat Rate
    if (!values.international.flat_rate) {
      values.international.flat_rate_options = {
        free_shipping: false,
        is_flat_rate: false,
        flat_rate_rate: null,
        is_flat_weighted: false,
        flat_rate_0_1: null,
        flat_rate_1_5: null,
        flat_rate_5_A: null,
      };
    } else if (values.international.flat_rate_options?.is_flat_rate) {
      Object.assign(values.international.flat_rate_options, {
        is_flat_weighted: false,
        flat_rate_0_1: null,
        flat_rate_1_5: null,
        flat_rate_5_A: null,
      });
    } else if (values.international.flat_rate_options?.is_flat_weighted) {
      values.international.flat_rate_options.flat_rate_rate = null;
      values.international.flat_rate_options.additional_cost = null;
      values.international.flat_rate_options.is_flat_rate = null;
    }

    // Handle Domestic Flat Rate
    if (!values?.domestic?.flat_rate) {
      values.domestic.flat_rate_options = {
        free_shipping: false,
        is_flat_rate: false,
        flat_rate_rate: null,
        is_flat_weighted: false,
        flat_rate_0_1: null,
        flat_rate_1_5: null,
        flat_rate_5_A: null,
      };
    } else if (values?.domestic?.flat_rate_options?.is_flat_rate) {
      Object.assign(values.domestic.flat_rate_options, {
        is_flat_weighted: false,
        flat_rate_0_1: null,
        flat_rate_1_5: null,
        flat_rate_5_A: null,
      });
    } else if (values.domestic.flat_rate_options?.is_flat_weighted) {
      values.domestic.flat_rate_options.flat_rate_rate = null;
      values.domestic.flat_rate_options.additional_cost = null;
      values.domestic.flat_rate_options.is_flat_rate = null;
    }

    await convertPricesIntoCAD(values);

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/shipping-config/create`,
      data: {
        domestic: values.domestic,
        international: values.international,
        sellerId: user.sellerId,
        currency: selectedCurrency,
        conversion_rate: conversionRateCAD,
      },
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    if (editData?._id) {
      options.data._id = editData._id;
    }
    axios
      .request(options)
      .then(function (response) {
        setIsSaved(true);
        setShowModalFlatRateDomestic(false);
        setShowModalFlatRateInternational(false);
        fetchShippingConfig();
        toast.success("Shipping Config Saved");
      })
      .catch(function (error) {
        toast.error("Something Went Wrong");
      });
  };

  const checkValidation = (values) => {
    const flatRateOptions = values.domestic.flat_rate_options;
    if (
      values.domestic.flat_rate &&
      !flatRateOptions.free_shipping &&
      !flatRateOptions.is_flat_rate &&
      !Number(flatRateOptions.flat_rate_rate) > 0 &&
      ![
        flatRateOptions.flat_rate_0_1,
        flatRateOptions.flat_rate_1_5,
        flatRateOptions.flat_rate_5_A,
      ].every((rate) => Number(rate) > 0)
    ) {
      toast.error(
        "Please select any flat rate option or disable flat rate shipping"
      );
      return false;
    }

    if (
      values.domestic.flat_rate &&
      flatRateOptions.is_flat_rate &&
      (
        Number(flatRateOptions.flat_rate_rate) <= 0 ||
        Number(flatRateOptions.additional_cost) <= 0
      )
    ) {
      toast.error("Please Enter Flat Rate Value or Disable Flat Rate Option");
      return false;
    }

    if (
      values.domestic.flat_rate &&
      values.domestic.flat_rate_options.is_flat_weighted &&
      ![
        flatRateOptions.flat_rate_0_1,
        flatRateOptions.flat_rate_1_5,
        flatRateOptions.flat_rate_5_A,
      ].every((rate) => Number(rate) > 0)
    ) {
      toast.error(
        "Please Enter All Weighted Values or Disable Weighted Option"
      );
      return false;
    }

    if (
      values.domestic.hand_delivery &&
      !values.domestic?.hand_delivery_options?.free_delivery &&
      !(Number(values.domestic?.hand_delivery_options?.fee_rate) > 0)
    ) {
      toast.error("Please Select Any Option or Disable Hand Delivery");
      return false;
    }

    if (!values.international.afoma_shipping) {
      const flatRateOptions = values.international.flat_rate_options;
      if (
        values.international.flat_rate &&
        !flatRateOptions.free_shipping &&
        !flatRateOptions.is_flat_rate &&
        !Number(flatRateOptions.flat_rate_rate) > 0 &&
        ![
          flatRateOptions.flat_rate_0_1,
          flatRateOptions.flat_rate_1_5,
          flatRateOptions.flat_rate_5_A,
        ].every((rate) => Number(rate) > 0)
      ) {
        toast.error(
          "Please select any flat rate option or disable flat rate shipping"
        );
        return false;
      }

      if (
        values.international.flat_rate &&
        flatRateOptions.is_flat_rate &&
        (
          Number(flatRateOptions.flat_rate_rate) <= 0 ||
          Number(flatRateOptions.additional_cost) <= 0
        )
      ) {
        toast.error("Please Enter Flat Rate Value or Disable Flat Rate Option");
        return false;
      }

      if (
        values.international.flat_rate &&
        values.international.flat_rate_options.is_flat_weighted &&
        ![
          flatRateOptions.flat_rate_0_1,
          flatRateOptions.flat_rate_1_5,
          flatRateOptions.flat_rate_5_A,
        ].every((rate) => Number(rate) > 0)
      ) {
        toast.error(
          "Please Enter All Weighted Values or Disable Weighted Option"
        );
        return false;
      }

      if (
        values.international.hand_delivery &&
        !values.international?.hand_delivery_options?.free_delivery &&
        !(Number(values.international?.hand_delivery_options?.fee_rate) > 0)
      ) {
        toast.error("Please Select Any Option or Disable Hand Delivery");
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (editData) {
      setInitialValues({
        domestic: {
          flat_rate: editData?.domestic?.flat_rate || false,
          afoma_shipping: editData?.domestic?.afoma_shipping || false,
          hand_delivery: editData?.domestic?.hand_delivery || false,
          hand_delivery_options: {
            free_delivery:
              editData?.domestic?.hand_delivery_options?.free_delivery || false,
            fee_rate:
              editData?.domestic?.hand_delivery_options?.fee_rate || null,
          },
          flat_rate_options: {
            free_shipping:
              editData?.domestic?.flat_rate_options?.free_shipping || false,
            is_flat_rate:
              editData?.domestic?.flat_rate_options?.is_flat_rate || false,
            flat_rate_rate:
              editData?.domestic?.flat_rate_options?.flat_rate_rate?.toFixed(
                2
              ) || null,
            additional_cost:
              editData?.domestic?.flat_rate_options?.additional_cost?.toFixed(
                2
              ) || null,
            is_flat_weighted:
              editData?.domestic?.flat_rate_options?.is_flat_weighted || false,
            flat_rate_0_1:
              editData?.domestic?.flat_rate_options?.flat_rate_0_1?.toFixed(
                2
              ) || null,
            flat_rate_1_5:
              editData?.domestic?.flat_rate_options?.flat_rate_1_5?.toFixed(
                2
              ) || null,
            flat_rate_5_A:
              editData?.domestic?.flat_rate_options?.flat_rate_5_A?.toFixed(
                2
              ) || null,
          },
        },
        international: {
          flat_rate: editData?.international?.flat_rate || false,
          afoma_shipping: editData?.international?.afoma_shipping || false,
          hand_delivery: editData?.international?.hand_delivery || false,
          hand_delivery_options: {
            free_delivery:
              editData?.international?.hand_delivery_options?.free_delivery ||
              false,
            fee_rate:
              editData?.international?.hand_delivery_options?.fee_rate?.toFixed(
                2
              ) || null,
          },
          flat_rate_options: {
            free_shipping:
              editData?.international?.flat_rate_options?.free_shipping ||
              false,
            is_flat_rate:
              editData?.international?.flat_rate_options?.is_flat_rate || false,
            flat_rate_rate:
              editData?.international?.flat_rate_options?.flat_rate_rate?.toFixed(
                2
              ) || null,
            additional_cost:
              editData?.international?.flat_rate_options?.additional_cost?.toFixed(
                2
              ) || null,
            is_flat_weighted:
              editData?.international?.flat_rate_options?.is_flat_weighted ||
              false,
            flat_rate_0_1:
              editData?.international?.flat_rate_options?.flat_rate_0_1?.toFixed(
                2
              ) || null,
            flat_rate_1_5:
              editData?.international?.flat_rate_options?.flat_rate_1_5?.toFixed(
                2
              ) || null,
            flat_rate_5_A:
              editData?.international?.flat_rate_options?.flat_rate_5_A?.toFixed(
                2
              ) || null,
          },
        },
      });
    }
  }, [editData]); // When editData changes, update initialValues

  const fetchCurrencyRate = async () => {
    try {
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

  const convertPricesIntoCAD = async (values) => {
    if (conversionRateCAD) {
      if (
        values.domestic?.flat_rate &&
        values.domestic?.flat_rate_options?.is_flat_rate
      ) {
        values.domestic.flat_rate_options.flat_rate_rate =
          values.domestic.flat_rate_options.flat_rate_rate * conversionRateCAD;

        values.domestic.flat_rate_options.additional_cost =
        values.domestic.flat_rate_options.additional_cost * conversionRateCAD;
      }

      if (
        values.domestic?.flat_rate &&
        !values.domestic?.flat_rate_options?.is_flat_rate
      ) {
        values.domestic.flat_rate_options.flat_rate_0_1 =
          values.domestic.flat_rate_options.flat_rate_0_1 * conversionRateCAD;
        values.domestic.flat_rate_options.flat_rate_1_5 =
          values.domestic.flat_rate_options.flat_rate_1_5 * conversionRateCAD;
        values.domestic.flat_rate_options.flat_rate_5_A =
          values.domestic.flat_rate_options.flat_rate_5_A * conversionRateCAD;
      }

      if (
        values.domestic?.hand_delivery &&
        values.domestic?.hand_delivery_options?.fee_rate
      ) {
        values.domestic.hand_delivery_options.fee_rate =
          values.domestic.hand_delivery_options.fee_rate * conversionRateCAD;
      }

      if (!values.international.afoma_shipping) {
        if (
          values.international?.flat_rate &&
          values.international?.flat_rate_options?.is_flat_rate
        ) {
          values.international.flat_rate_options.flat_rate_rate =
            values.international.flat_rate_options.flat_rate_rate *
            conversionRateCAD;

          values.international.flat_rate_options.additional_cost =
            values.international.flat_rate_options.additional_cost *
            conversionRateCAD;
        }

        if (
          values.international?.flat_rate &&
          !values.international?.flat_rate_options?.is_flat_rate
        ) {
          values.international.flat_rate_options.flat_rate_0_1 =
            values.international.flat_rate_options.flat_rate_0_1 *
            conversionRateCAD;
          values.international.flat_rate_options.flat_rate_1_5 =
            values.international.flat_rate_options.flat_rate_1_5 *
            conversionRateCAD;
          values.international.flat_rate_options.flat_rate_5_A =
            values.international.flat_rate_options.flat_rate_5_A *
            conversionRateCAD;
        }

        if (
          values.international?.hand_delivery &&
          values.international?.hand_delivery_options?.fee_rate
        ) {
          values.international.hand_delivery_options.fee_rate =
            values.international.hand_delivery_options.fee_rate *
            conversionRateCAD;
        }
      }
    }
    return values;
  };

  const convertToCAD = async (currency) => {
    if (currency != "cad") {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency?.toLowerCase()}.json`
      );

      if (currency && data[currency?.toLowerCase()]["cad"]) {
        const rate = data[currency?.toLowerCase()]["cad"];
        setConversionRateCAD(rate);
        return rate;
      }
    }
    setConversionRateCAD(1);
    return 1;
  };

  const convertPricesIntoCurrency = (data) => {
    if (data?.currency && data?.conversion_rate) {
      if (
        data.domestic?.flat_rate &&
        data.domestic?.flat_rate_options?.is_flat_rate
      ) {
        data.domestic.flat_rate_options.flat_rate_rate =
          data.domestic.flat_rate_options.flat_rate_rate / data.conversion_rate;
        data.domestic.flat_rate_options.additional_cost =
          data.domestic.flat_rate_options.additional_cost / data.conversion_rate;
      }

      if (
        data.domestic?.flat_rate &&
        !data.domestic?.flat_rate_options?.is_flat_rate
      ) {
        data.domestic.flat_rate_options.flat_rate_0_1 =
          data.domestic.flat_rate_options.flat_rate_0_1 / data.conversion_rate;
        data.domestic.flat_rate_options.flat_rate_1_5 =
          data.domestic.flat_rate_options.flat_rate_1_5 / data.conversion_rate;
        data.domestic.flat_rate_options.flat_rate_5_A =
          data.domestic.flat_rate_options.flat_rate_5_A / data.conversion_rate;
      }

      if (
        data.domestic?.hand_delivery &&
        data.domestic?.hand_delivery_options?.fee_rate
      ) {
        data.domestic.hand_delivery_options.fee_rate =
          data.domestic.hand_delivery_options.fee_rate / data.conversion_rate;
      }

      if (!data.international.afoma_shipping) {
        if (
          data.international?.flat_rate &&
          data.international?.flat_rate_options?.is_flat_rate
        ) {
          data.international.flat_rate_options.flat_rate_rate =
            data.international.flat_rate_options.flat_rate_rate /
            data.conversion_rate;
          data.international.flat_rate_options.additional_cost =
            data.international.flat_rate_options.additional_cost /
            data.conversion_rate;
        }

        if (
          data.international?.flat_rate &&
          !data.international?.flat_rate_options?.is_flat_rate
        ) {
          data.international.flat_rate_options.flat_rate_0_1 =
            data.international.flat_rate_options.flat_rate_0_1 /
            data.conversion_rate;
          data.international.flat_rate_options.flat_rate_1_5 =
            data.international.flat_rate_options.flat_rate_1_5 /
            data.conversion_rate;
          data.international.flat_rate_options.flat_rate_5_A =
            data.international.flat_rate_options.flat_rate_5_A /
            data.conversion_rate;
        }

        if (
          data.international?.hand_delivery &&
          data.international?.hand_delivery_options?.fee_rate
        ) {
          data.international.hand_delivery_options.fee_rate =
            data.international.hand_delivery_options.fee_rate /
            data.conversion_rate;
        }
      }
    }
  };

  const roundToTwo = (num) =>
    parseFloat((Math.round((num + Number.EPSILON) * 100) / 100)?.toFixed(2));

  const changePricesIntoCurrency = (data, rate) => {
    if (
      data.domestic?.flat_rate &&
      data.domestic?.flat_rate_options?.is_flat_rate
    ) {
      data.domestic.flat_rate_options.flat_rate_rate = roundToTwo(
        data.domestic.flat_rate_options.flat_rate_rate * rate
      );

      data.domestic.flat_rate_options.additional_cost = roundToTwo(
        data.domestic.flat_rate_options.additional_cost * rate
      );
    }

    if (
      data.domestic?.flat_rate &&
      !data.domestic?.flat_rate_options?.is_flat_rate
    ) {
      data.domestic.flat_rate_options.flat_rate_0_1 = roundToTwo(
        data.domestic.flat_rate_options.flat_rate_0_1 * rate
      );
      data.domestic.flat_rate_options.flat_rate_1_5 = roundToTwo(
        data.domestic.flat_rate_options.flat_rate_1_5 * rate
      );
      data.domestic.flat_rate_options.flat_rate_5_A = roundToTwo(
        data.domestic.flat_rate_options.flat_rate_5_A * rate
      );
    }

    if (
      data.domestic?.hand_delivery &&
      data.domestic?.hand_delivery_options?.fee_rate
    ) {
      data.domestic.hand_delivery_options.fee_rate = roundToTwo(
        data.domestic.hand_delivery_options.fee_rate * rate
      );
    }

    if (!data.international.afoma_shipping) {
      if (
        data.international?.flat_rate &&
        data.international?.flat_rate_options?.is_flat_rate
      ) {
        data.international.flat_rate_options.flat_rate_rate = roundToTwo(
          data.international.flat_rate_options.flat_rate_rate * rate
        );

        data.international.flat_rate_options.additional_cost = roundToTwo(
          data.international.flat_rate_options.additional_cost * rate
        );
      }

      if (
        data.international?.flat_rate &&
        !data.international?.flat_rate_options?.is_flat_rate
      ) {
        data.international.flat_rate_options.flat_rate_0_1 = roundToTwo(
          data.international.flat_rate_options.flat_rate_0_1 * rate
        );
        data.international.flat_rate_options.flat_rate_1_5 = roundToTwo(
          data.international.flat_rate_options.flat_rate_1_5 * rate
        );
        data.international.flat_rate_options.flat_rate_5_A = roundToTwo(
          data.international.flat_rate_options.flat_rate_5_A * rate
        );
      }

      if (
        data.international?.hand_delivery &&
        data.international?.hand_delivery_options?.fee_rate
      ) {
        data.international.hand_delivery_options.fee_rate = roundToTwo(
          data.international.hand_delivery_options.fee_rate * rate
        );
      }
    }
  };

  const getCurrencyRate = async (fromCurrency, toCurrency) => {
    if (fromCurrency) {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency?.toLowerCase()}.json`
      );

      if (
        fromCurrency &&
        data[fromCurrency?.toLowerCase()][toCurrency?.toLowerCase()]
      ) {
        const rate =
          data[fromCurrency?.toLowerCase()][toCurrency?.toLowerCase()];
        setConversionRate(rate);
        changeThePrices(rate);
      }
    } else {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${toCurrency?.toLowerCase()}.json`
      );

      if (toCurrency && data[toCurrency?.toLowerCase()]["cad"]) {
        const rate = data[toCurrency?.toLowerCase()]["cad"];
        setConversionRate(rate);
        changeThePrices(rate);
      }
    }
    return;
  };

  const changeThePrices = async (rate) => {
    const updatedData = { ...editData };
    changePricesIntoCurrency(updatedData, rate);
    setInitialValues({
      ...initialValues, // Keep other values unchanged
      domestic: {
        ...initialValues.domestic,
        hand_delivery_options: {
          ...initialValues.domestic.hand_delivery_options,
          fee_rate:
            updatedData.domestic?.hand_delivery_options?.fee_rate || null,
        },
        flat_rate_options: {
          ...initialValues.domestic.flat_rate_options,
          flat_rate_rate:
            updatedData.domestic?.flat_rate_options?.flat_rate_rate || null,
          additional_cost:
            updatedData.domestic?.flat_rate_options?.additional_cost || null,
          flat_rate_0_1:
            updatedData.domestic?.flat_rate_options?.flat_rate_0_1 || null,
          flat_rate_1_5:
            updatedData.domestic?.flat_rate_options?.flat_rate_1_5 || null,
          flat_rate_5_A:
            updatedData.domestic?.flat_rate_options?.flat_rate_5_A || null,
        },
      },
      international: {
        ...initialValues.international,
        hand_delivery_options: {
          ...initialValues.international.hand_delivery_options,
          fee_rate:
            updatedData.international?.hand_delivery_options?.fee_rate || null,
        },
        flat_rate_options: {
          ...initialValues.international.flat_rate_options,
          flat_rate_rate:
            updatedData.international?.flat_rate_options?.flat_rate_rate ||
            null,
          additional_cost:
            updatedData.international?.flat_rate_options?.additional_cost ||
            null,
          flat_rate_0_1:
            updatedData.international?.flat_rate_options?.flat_rate_0_1 || null,
          flat_rate_1_5:
            updatedData.international?.flat_rate_options?.flat_rate_1_5 || null,
          flat_rate_5_A:
            updatedData.international?.flat_rate_options?.flat_rate_5_A || null,
        },
      },
    });
  };

  return (
    <Layout userType="seller">
      {!loading && selectedCurrency && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="relative col-span-3 md:col-span-1 lg:col-span-1 mb-4">
            <label htmlFor="currency">
              Currency <span className="text-red-700">*</span>
            </label>
            <Select
              name="currency"
              id="currency"
              options={currencies}
              placeholder="Select Currency"
              className="st-react-select"
              classNamePrefix="react-select"
              onChange={(selectedOption) => {
                setSelectedCurrency(selectedOption?.value);
                convertToCAD(selectedOption?.value);
                getCurrencyRate(editData?.currency, selectedOption?.value);
                setShowCurrencyPopup(true);
                setIsSaved(false);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minWidth: "100%", // Ensure it maintains full width
                }),
              }}
              defaultValue={
                editData?.currency &&
                currencies.some((curr) => curr.value === editData.currency) && {
                  value: editData.currency,
                  label: `${currencies.find((curr) => curr.value === editData.currency)
                      ?.label
                    }`,
                }
              }
              isDisabled={!isSaved}
            />
          </div>
        </div>
      )}

      {showCurrencyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-orange-50 p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button - Higher z-index */}
            <button
              onClick={() => setShowCurrencyPopup(false)}
              className="absolute top-3 right-3 bg-orange-200 hover:bg-gray-400 text-gray-800 rounded-full w-8 h-8 flex justify-center items-center shadow-md transition-all z-50"
            >
              ✖
            </button>

            <p className="text-sm font-bold text-center mt-3">
              Due to your recent currency change, please ensure your Flat Rate
              or Weighted Shipping Rate is modified to reflect the rate and
              currency of your local shipping service.
              <br />
              <br />
              This also applies to your rate for Hand Delivery (if not offered
              for free).
            </p>
          </div>
        </div>
      )}

      {!loading ? (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values) => {
            handleSaveShippingOptions(values);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <Form className="bg-orange-100 p-6 rounded-lg shadow-md">
              {/* Domestic Shipping Section */}
              <h1
                className={`mt-8 md:text-3xl text-2xl text-blue-950 font-medium noto-font`}
              >
                Domestic Shipping
              </h1>
              <h6
                className={`mt-4 md:text-xl text-md text-blue-950 font-medium noto-font`}
              >
                Choose your domestic shipping method:
              </h6>
              <ul className="list-disc pl-5">
                <li
                  className={`mt-2 md:text-sm text-md text-blue-950 font-medium noto-font`}
                >
                  <strong>AFOMA Shipping –</strong> Let AFOMA handle
                  fulfillment.
                </li>
                <li
                  className={`mt-2 md:text-sm text-md text-blue-950 font-medium noto-font`}
                >
                  <strong>Seller-Managed Shipping –</strong> Set your own flat
                  rate, weighted shipping, or offer hand delivery for local
                  orders.
                </li>
                <li
                  className={`mt-2 md:text-sm text-md text-blue-950 font-medium noto-font`}
                >
                  <strong>Mix & Match –</strong> Combine AFOMA Shipping and
                  Seller-Managed Shipping to best suit your business needs.
                </li>
              </ul>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
                {/* AFOMA Shipping */}
                <div className="relative p-4 border border-black rounded-lg">
                  <h3 className="text-blue-950 text-lg font-semibold">
                    AFOMA Shipping
                  </h3>
                  <p className="text-sm text-gray-600">Shipping by AFOMA</p>
                  <label className="mt-2 flex items-center">
                    <Field
                      type="checkbox"
                      name="domestic.afoma_shipping"
                      className="mr-2"
                      disabled={user.countryCode !== "CA"}
                    />
                    <span className="text-sm text-slate-600">
                      AFOMA Shipping
                    </span>
                  </label>
                </div>

                {/* Flat Rate Shipping */}
                <div className="relative p-4 border border-black rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-blue-950 text-lg font-semibold">
                      Flat-Rate or Weighted Shipping
                    </h3>
                    {values?.domestic?.flat_rate && (
                      <button
                        type="button"
                        onClick={() => setShowModalFlatRateDomestic(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPencil}
                          className="text-gray-600 hover:text-blue-600 text-sm"
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Shipping Handled by Seller
                  </p>
                  <label className="mt-2 flex items-center">
                    <Field
                      type="checkbox"
                      name="domestic.flat_rate"
                      className="mr-2"
                      onChange={(e) => {
                        setFieldValue("domestic.flat_rate", e.target.checked);
                        if (e.target.checked){
                          setShowModalFlatRateDomestic(true);
                        }
                      }}
                    />
                    <span className="text-sm text-slate-600">
                      Flat-Rate Shipping
                    </span>
                  </label>
                </div>

                {/* Hand Delivery (Opens Modal) */}
                <div className="relative p-4 border border-black rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-blue-950 text-lg font-semibold">
                      Hand Delivery
                    </h3>
                    {values?.domestic?.hand_delivery && (
                      <button
                        type="button"
                        onClick={() => setShowModalDomestic(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPencil}
                          className="text-gray-600 hover:text-blue-600 text-sm"
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Delivery option for buyers and sellers in the same city.
                  </p>
                  <label className="mt-2 flex items-center">
                    <Field
                      type="checkbox"
                      name="domestic.hand_delivery"
                      className="mr-2"
                      onChange={(e) => {
                        setFieldValue("domestic.hand_delivery",e.target.checked);
                        if (e.target.checked) {
                          setShowModalDomestic(true);
                        }
                      }}
                    />
                    <span className="text-sm text-slate-600">
                      Hand Delivery
                    </span>
                  </label>
                </div>
              </div>

              {/* International Shipping Section */}
              <h1
                className={`mt-8 md:text-3xl text-2xl text-blue-950 font-medium noto-font`}
              >
                International Shipping
              </h1>
              <h6
                className={`mt-4 md:text-xl text-md text-blue-950 font-medium noto-font`}
              >
                Choose your international shipping method:
              </h6>
              <ul className="list-disc pl-5">
                <li
                  className={`mt-2 md:text-sm text-md text-blue-950 font-medium noto-font`}
                >
                  <strong>AFOMA Shipping –</strong> Let AFOMA handle
                  fulfillment.
                </li>
                <li
                  className={`mt-2 md:text-sm text-md text-blue-950 font-medium noto-font`}
                >
                  <strong>Seller-Managed Shipping –</strong> Set your own flat
                  rate, weighted shipping, or offer hand delivery for local
                  orders.
                </li>
              </ul>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
                {/* AFOMA Shipping */}
                <div className="relative p-4 border border-black rounded-lg">
                  <h3 className="text-blue-950 text-lg font-semibold">
                    AFOMA Shipping
                  </h3>
                  <p className="text-sm text-gray-600">Shipping by AFOMA</p>
                  <label className="mt-2 flex items-center">
                    <Field
                      type="checkbox"
                      name="international.afoma_shipping"
                      className={`mr-2 ${values?.international?.flat_rate ||
                          values?.international?.hand_delivery
                          ? "opacity-50 cursor-not-allowed"
                          : null
                        }`}
                      disabled={
                        values?.international?.flat_rate ||
                        values?.international?.hand_delivery
                      }
                    />
                    <span className="text-sm text-slate-600">
                      AFOMA Shipping
                    </span>
                  </label>
                </div>

                {/* Flat Rate Shipping International */}
                <div className="relative p-4 border border-black rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-blue-950 text-lg font-semibold">
                      Flat-Rate or Weighted Shipping
                    </h3>
                    {values?.international?.flat_rate && (
                      <button
                        type="button"
                        onClick={() => setShowModalFlatRateInternational(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPencil}
                          className="text-gray-600 hover:text-blue-600 text-sm"
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Shipping Handled by Seller
                  </p>
                  <label className="mt-2 flex items-center">
                    <Field
                      type="checkbox"
                      name="international.flat_rate"
                      className={`mr-2 ${values?.international?.afoma_shipping
                          ? "opacity-50 cursor-not-allowed"
                          : null
                        }`}
                      disabled={values?.international?.afoma_shipping}
                      onChange={(e) => {
                        setFieldValue("international.flat_rate",e.target.checked);
                        if (e.target.checked){
                          setShowModalFlatRateInternational(true);
                        }
                      }}
                    />
                    <span className="text-sm text-slate-600">
                      Flat-Rate Shipping
                    </span>
                  </label>
                </div>

                {/* Hand Delivery (Opens Modal) International*/}
                <div className="relative p-4 border border-black rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-blue-950 text-lg font-semibold">
                      Hand Delivery
                    </h3>
                    {values?.international?.hand_delivery && (
                      <button
                        type="button"
                        onClick={() => setShowModalInternational(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPencil}
                          className="text-gray-600 hover:text-blue-600 text-sm"
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Delivery option for buyers and sellers in the same city.
                  </p>
                  <label className="mt-2 flex items-center">
                    <Field
                      type="checkbox"
                      name="international.hand_delivery"
                      className={`mr-2 ${values?.international?.afoma_shipping
                          ? "opacity-50 cursor-not-allowed"
                          : null
                        }`}
                      disabled={values?.international?.afoma_shipping}
                      onChange={(e) => {
                        setFieldValue("international.hand_delivery",e.target.checked);
                        if (e.target.checked) setShowModalInternational(true);
                      }}
                    />
                    <span className="text-sm text-slate-600">
                      Hand Delivery
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="buttonprimary mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto block"
                onClick={handleSubmit}
              >
                Save Configuration
              </button>

              {/* Hand Delivery Modal Domestic */}
              {showModalDomestic && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                  <div className="bg-orange-50 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold flex justify-between items-center">
                      Hand Delivery Options
                    </h2>
                    <label className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={isFreeDeliveryDomestic}
                        onChange={(e) => {
                          setIsFreeDeliveryDomestic(e.target.checked);
                          values.domestic.hand_delivery_options.free_delivery =
                            e.target.checked;
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Free Delivery
                      </span>
                    </label>

                    {!isFreeDeliveryDomestic && (
                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Hand Delivery Fee
                        </label>
                        <Field
                          type="number"
                          name="domestic.hand_delivery_options.fee_rate"
                          className="bg-orange-50 border border-black-300 p-2 rounded w-full mt-2"
                          placeholder="Enter delivery rate"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="dashboard-button-cancel"
                          onClick={() => setShowModalDomestic(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="dashboard-button-primary"
                          onClick={() => {
                            setShowModalDomestic(false);
                            handleSubmit();
                          }}
                        >
                          Save
                          {/* {editingTier !== null ? "Update" : "Save"} */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hand Delivery Modal International */}
              {showModalInternational && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                  <div className="bg-orange-50 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold flex justify-between items-center">
                      Hand Delivery Options
                    </h2>
                    {/* <h2 className="text-xl font-bold">Hand Delivery Options</h2> */}
                    <label className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={isFreeDeliveryInternational}
                        onChange={(e) => {
                          setIsFreeDeliveryInternational(e.target.checked);
                          values.international.hand_delivery_options.free_delivery =
                            e.target.checked;
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Free Delivery
                      </span>
                    </label>

                    {!isFreeDeliveryInternational && (
                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Hand Delivery Fee
                        </label>
                        <Field
                          type="number"
                          name="international.hand_delivery_options.fee_rate"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter delivery rate"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="dashboard-button-cancel"
                          onClick={() => setShowModalInternational(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="dashboard-button-primary"
                          onClick={() => {
                            setShowModalInternational(false);
                            handleSubmit();
                          }}
                        >
                          Save
                          {/* {editingTier !== null ? "Update" : "Save"} */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Flat Rate Modal Domestic */}
              {showModalFlatRateDomestic && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                  <div className="bg-orange-50 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold flex justify-between items-center">
                      Flat Rate Options
                    </h2>
                    {/* <h2 className="text-xl font-bold">Flat Rate Options</h2> */}
                    <label className="mt-4 flex items-center">
                      <Field
                        type="checkbox"
                        name="domestic.flat_rate_options.free_shipping"
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Free Shipping
                      </span>
                    </label>

                    <label className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={flatRateDomesticEnable}
                        onChange={(e) => {
                          setFlatRateDomesticEnable(e.target.checked);
                          values.domestic.flat_rate_options.is_flat_rate =
                            e.target.checked;
                          if (!e.target.checked) {
                            values.domestic.flat_rate_options.flat_rate_rate = null;
                            values.domestic.flat_rate_options.additional_cost = null;
                          }
                        }}
                        disabled={flatWeightedRateDomesticEnable}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Set Flat Rate
                      </span>
                    </label>

                    <label className="mt-2 flex items-center">
                      <span className="text-sm text-slate-600">or</span>
                    </label>

                    <label className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={flatWeightedRateDomesticEnable}
                        onChange={(e) => {
                          setFlatWeightedRateDomesticEnable(e.target.checked);
                          values.domestic.flat_rate_options.is_flat_weighted =
                            e.target.checked;
                          if (!e.target.checked) {
                            values.domestic.flat_rate_options.flat_rate_0_1 =
                              null;
                            values.domestic.flat_rate_options.flat_rate_1_5 =
                              null;
                            values.domestic.flat_rate_options.flat_rate_5_A =
                              null;
                          }
                        }}
                        disabled={flatRateDomesticEnable}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Set Weighted Rate
                      </span>
                    </label>

                    {flatWeightedRateDomesticEnable && (
                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Enter Weight Cost
                        </label>
                        <span className="text-sm flex items-center justify-center pt-2">
                          0-1 KG
                        </span>
                        <Field
                          type="number"
                          name="domestic.flat_rate_options.flat_rate_0_1"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter Cost for 0-1 KG"
                        />
                        <span className="text-sm flex items-center justify-center pt-2">
                          1-5 KG
                        </span>
                        <Field
                          type="number"
                          name="domestic.flat_rate_options.flat_rate_1_5"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter Cost for 1-5 KG"
                        />
                        <span className="text-sm flex items-center justify-center pt-2">
                          5-Above KG
                        </span>
                        <Field
                          type="number"
                          name="domestic.flat_rate_options.flat_rate_5_A"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter Cost for 5 to above KG"
                        />
                      </div>
                    )}

                    {flatRateDomesticEnable && (
                      <div>
                        <div className="mt-4">
                          <label className="text-sm font-semibold">
                            Enter Flat Rate
                          </label>
                          <Field
                            type="number"
                            name="domestic.flat_rate_options.flat_rate_rate"
                            className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                            placeholder="Enter Flat Rate"
                          />
                        </div>

                        <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Enter Additional Amount
                        </label>
                        <Field
                          type="number"
                          name="domestic.flat_rate_options.additional_cost"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="For each additional item"
                        />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="dashboard-button-cancel"
                          onClick={() => setShowModalFlatRateDomestic(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="dashboard-button-primary"
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          Save
                          {/* {editingTier !== null ? "Update" : "Save"} */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Flat Rate Modal International */}
              {showModalFlatRateInternational && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                  <div className="bg-orange-50 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold flex justify-between items-center">
                      Flat Rate Options
                    </h2>
                    {/* <h2 className="text-xl font-bold">Flat Rate Options</h2> */}
                    <label className="mt-4 flex items-center">
                      <Field
                        type="checkbox"
                        name="international.flat_rate_options.free_shipping"
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Free Shipping
                      </span>
                    </label>
                    <label className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={faltRateInternationalEnable}
                        onChange={(e) => {
                          setFaltRateInternationalEnable(e.target.checked);
                          values.international.flat_rate_options.is_flat_rate =
                            e.target.checked;
                          if (!e.target.checked) {
                            values.international.flat_rate_options.flat_rate_rate = null;
                            values.international.flat_rate_options.additional_cost = null;
                          }
                        }}
                        isabled={flatWeightedRateInternationalEnable}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Set Flat Rate
                      </span>
                    </label>

                    <label className="mt-2 flex items-center">
                      <span className="text-sm text-slate-600">or</span>
                    </label>

                    <label className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={flatWeightedRateInternationalEnable}
                        onChange={(e) => {
                          setFlatWeightedRateInternationalEnable(
                            e.target.checked
                          );
                          values.international.flat_rate_options.is_flat_weighted =
                            e.target.checked;
                          if (!e.target.checked) {
                            values.international.flat_rate_options.flat_rate_0_1 =
                              null;
                            values.international.flat_rate_options.flat_rate_1_5 =
                              null;
                            values.international.flat_rate_options.flat_rate_5_A =
                              null;
                          }
                        }}
                        disabled={faltRateInternationalEnable}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">
                        Set Weighted Rate
                      </span>
                    </label>

                    {flatWeightedRateInternationalEnable && (
                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Enter Weight Cost
                        </label>
                        {/* <div> */}
                        <span className="text-sm flex items-center justify-center pt-2">
                          0-1 KG
                        </span>
                        <Field
                          type="number"
                          name="international.flat_rate_options.flat_rate_0_1"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter Cost For 0-1 KG"
                        />
                        <span className="text-sm flex items-center justify-center pt-2">
                          1-5 KG
                        </span>
                        <Field
                          type="number"
                          name="international.flat_rate_options.flat_rate_1_5"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter Cost For 1-5 KG"
                        />
                        <span className="text-sm flex items-center justify-center pt-2">
                          5-Above KG
                        </span>
                        <Field
                          type="number"
                          name="international.flat_rate_options.flat_rate_5_A"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="Enter Cost For 5 to above KG"
                        />
                        {/* </div> */}
                      </div>
                    )}

                    {faltRateInternationalEnable && (
                      <div>
                        <div className="mt-4">
                          <label className="text-sm font-semibold">
                            Enter Flat Rate
                          </label>
                          <Field
                            type="number"
                            name="international.flat_rate_options.flat_rate_rate"
                            className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                            placeholder="Enter Flat Rate"
                          />
                        </div>

                        <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Enter Additional Amount
                        </label>
                        <Field
                          type="number"
                          name="international.flat_rate_options.additional_cost"
                          className="bg-orange-50 border border-back-300 p-2 rounded w-full mt-2"
                          placeholder="For each additional item"
                        />
                        </div>
                      </div>

                    )}

                    <div className="flex justify-end gap-4 mt-6">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="dashboard-button-cancel"
                          onClick={() =>
                            setShowModalFlatRateInternational(false)
                          }
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="dashboard-button-primary"
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          Save
                          {/* {editingTier !== null ? "Update" : "Save"} */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
};

export default ShippingConfig;
