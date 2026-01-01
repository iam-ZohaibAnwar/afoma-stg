import { data } from "autoprefixer";
import axios from "axios";
import countryData from "country-data";

export const getGeoIP = async (isLogin, userLoginCountry) => {
  try {
    // Retrieve existing user info from localStorage
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    // Fetch current user's geo information
    const geoResponse = await fetchGeoInfo();

    // If no IP stored or IP has changed, update user info
    if (!storedUserInfo.ip || storedUserInfo.ip !== geoResponse.ip) {
      await updateUserInfo(geoResponse, isLogin, userLoginCountry);
    } else if (isLogin) {
      // If user is logging in, prioritize login country
      await updateUserInfoForLogin(userLoginCountry, geoResponse.ip);
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
      ip: data.query,
      country: data.country,
      currency: data.currency_code,
    };
  } catch (error) {
    console.error("Error fetching geo information:", error);
    throw error;
  }
};

// Update user info when IP changes or no data is stored
const updateUserInfo = async (geoData, isLogin, userLoginCountry) => {
  try {
    const currencyRate = await fetchCurrencyRate("CAD", geoData.currency);

    const userInfo = {
      ip: geoData.ip,
      country: geoData.country,
      currency: geoData.currency || 1,
      currencyRate,
      surCharge: await fetchSurcharge(geoData.country),
    };

    // If logged in, prioritize login country
    if (isLogin && userLoginCountry) {
      await updateUserInfoForLogin(userLoginCountry, geoData.ip);
    } else {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
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

// export const getGeoIP = async (loginIn, userLoginCountry) => {
//     const userInfoStored = JSON.parse(localStorage.getItem("userInfo"))
//     const options = {
//       method: "GET",
//       url: `http://ip-api.com/json/?fields=currency,country,countryCode,query`,
//     };
//     let response = await axios.request(options);

//     if(response.data.query !== userInfoStored?.ip){
//       const curOptions = {
//         method: "GET",
//         url: `https://api.frankfurter.dev/v1/latest?base=CAD&symbols=${response?.data?.currency}`,
//       };
//       let currencyRes = await axios.request(curOptions);
//       let userInfo = {
//         ip : response.data.query,
//         country: response.data.country,
//         currency: response.data.currency,
//         currencyRate : currencyRes.data.rates[response?.data?.currency]
//       }
//       const surCharge = getSurchargeObj(response.data.country)
//       userInfo.surCharge = surCharge
//       localStorage.setItem("userInfo", JSON.stringify(userInfo))
//     }else if(loginIn) {
//       const country = countryData?.countries.all.find((c) => c.name.toLowerCase() === userLoginCountry?.toLowerCase());
//       const curOptions = {
//         method: "GET",
//         url: `https://api.frankfurter.dev/v1/latest?base=CAD&symbols=${country?.currencies[0]}`,
//       };
//       let currencyRes = await axios.request(curOptions);
//       let userInfo = {
//         ip : response.data.query,
//         country: userLoginCountry,
//         currency: country.currencies[0],
//         currencyRate: currencyRes.data.rates[country?.currencies[0]]
//       }
//       const surCharge = getSurchargeObj(userLoginCountry)
//       userInfo.surCharge = surCharge
//       localStorage.setItem("userInfo", JSON.stringify(userInfo))
//     }
//   }

// export const getSurchargeObj = async (userLoginCountry) => {
//       const options = {
//         method: "GET",
//         url: `${process.env.NEXT_PUBLIC_BASE_URL}/shipping-config/user-surcharge?userCountry=${userLoginCountry}`,
//         headers: {
//             "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
//         },
//       };
//       let response = await axios.request(options);
//       return response?.data
//   }
