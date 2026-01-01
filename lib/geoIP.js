import { calculateSurcharge } from "@/utils/pricingUtils";
import { data } from "autoprefixer";
import axios from "axios";
import countryData from "country-data";

export const getGeoIP = async (userLoginCountry = null) => {
  try {
    // Retrieve existing user info from localStorage
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    // Fetch current user's geo information
    const geoResponse = await fetchGeoInfo();

    if((!storedUserInfo.ip && userLoginCountry) || (userLoginCountry)){
        // If user is logging in, prioritize login country
        await updateUserInfoForLogin(userLoginCountry, geoResponse.ip);
    } else if (!storedUserInfo.ip || (!userLoginCountry && storedUserInfo.ip != geoResponse.ip)) {
      await updateUserInfo(geoResponse);
    }
  } catch (error) {
    console.error("Error in getGeoIP:", error);
  }
};

// Fetch user's geo information using IP-API
const fetchGeoInfo = async () => {
  try {
    const { data } = await axios.get(
      "https://ipwhois.app/json/"
    );
    return {
      ip: data.ip,
      country: data.country,
      currency: data.currency_code,
    };
  } catch (error) {
    console.error("Error fetching geo information:", error);
    throw error;
  }
};

// Update user info when IP changes or no data is stored
const updateUserInfo = async (geoData) => {
  try {
    const currencyRate = await fetchCurrencyRate("CAD", geoData.currency);

    const userInfo = {
      ip: geoData.ip,
      country: geoData.country,
      currency: geoData.currency || 1,
      currencyRate,
      surCharge: await fetchSurcharge(geoData.country),
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    changeCartPrice(false)
  } catch (error) {
    console.error("Error updating user info:", error);
  }
};

// Update user info based on login country
const updateUserInfoForLogin = async (userLoginCountry, currentIP) => {
  try {
    const country = countryData?.countries.all.find(
      (c) => c.name.toLowerCase() === userLoginCountry?.toLowerCase()
    );

    if (country) {
      const currencyRate = await fetchCurrencyRate("CAD", country.currencies[0]);

      const userInfo = {
        ip: currentIP,
        country: userLoginCountry,
        currency: country.currencies[0],
        currencyRate : currencyRate || 1,
        surCharge: await fetchSurcharge(userLoginCountry),
      };

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      changeCartPrice()
    }
  } catch (error) {
    console.error("Error updating user info for login:", error);
  }
};

// Fetch currency exchange rate using Frankfurter API
const fetchCurrencyRate = async (base, target) => {
  try {
    const { data } = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base?.toLowerCase()}.json`
    );

    return data[base?.toLowerCase()][target?.toLowerCase()];
  } catch (error) {
    console.error("Error fetching currency rate:", error);
    return null;
  }
};

// Fetch surcharge object for a given country
const fetchSurcharge = async (country) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/shipping-config/user-surcharge?userCountry=${country}`,
      {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching surcharge:", error);
    return null;
  }
};

export const changeCartPrice = async (isDispatchEvent = true) => {
  let storedCart = JSON.parse(localStorage.getItem("cart")) || {};
  if (storedCart) {
    let keys = Object.keys(storedCart)
    for (let key of keys) {
      let item = storedCart[key];
      item.productData = calculateSurcharge([item?.productData])?.[0]
    }
  }
  localStorage.removeItem("cart")
  localStorage.setItem("cart", JSON.stringify(storedCart))
  window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: isDispatchEvent }));
}