import Layout from "@/components/Layout";
import { Switch } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
//import { Noto_Serif } from "next/font/google";
import { faShop, faVoicemail } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Settings = () => {
  const [shop, setShop] = useState("");
  const [user, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [eventId, setEventId] = useState("");


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData)
    fetchSeller(userData)
  }, [])

  const fetchSeller = async (userData) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${userData?.sellerId}`, {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .then((res) => {
        setShop(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
  }

  const toggleShopStatus = () => {
    const updatedStatus = !shop.shop_status;

    setShop((prev) => ({ ...prev, shop_status: updatedStatus ? 1 : 0 }));
    // TODO: Call API to update status
    if (user?.sellerId) {
      updateShopStatus(updatedStatus)
    } else {
      toast.error("Something Went Wrong")
      const updatedStatus = !shop.shop_status;
      setShop((prev) => ({ ...prev, shop_status: updatedStatus ? 1 : 0 }));
    }
  };

  const updateShopStatus = async (status) => {
    await axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          Authorization: `Bearer ${user?.accessToken}`
        },
      })
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/seller-shop/update-status/${user?.sellerId}?shop_status=${status ? 1 : 0}`
      )
      .then(function (response) {
        toast.success("Update Status Successfully");
      })
      .catch(function (response) {
        const newError = response.response.data;
        const errorMessage = JSON.stringify(newError);
        toast.error(errorMessage);
      });
  }

  const handleSendEmail = async () => {
    if(!eventId || !couponCode){
      return toast.error("Please fill both information")
    }
      await axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          Authorization: `Bearer ${user?.accessToken}`
        },
      })
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/send-email/cart/${user?.sellerId}`,{
          eventId: eventId,
          couponCode: couponCode
        }
      )
      .then(function (response) {
        if(response?.data?.error){
          toast.error(response?.data?.error);
        }else{
          toast.success(response?.data?.message);
        }
      })
      .catch(function (response) {
        const newError = response.response.data;
        const errorMessage = JSON.stringify(newError);
        toast.error(errorMessage);
      });
    // your API call or logic here
    setShowModal(false);
    setCouponCode("");
    setEventId("");
  };

  return (
    <Layout userType="seller">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl text-blue-950 noto-font`}>
          Settings
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        <div className="md:col-span-1">
          <div className="rounded-lg bg-orange-100 px-5 py-5 shadow-md flex items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <FontAwesomeIcon icon={faShop} className="text-[50px]" />
              <div>
                <h3 className="text-lg font-semibold">{shop?.storeSlug}</h3>
                <p className="text-sm text-gray-700">
                  {shop.shop_status ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            <Switch
              checked={shop.shop_status}
              onChange={toggleShopStatus}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${shop.shop_status ? "bg-green-500" : "bg-gray-300"
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${shop.shop_status ? "translate-x-7" : "translate-x-1"
                  }`}
              />
            </Switch>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-lg bg-orange-100 px-5 py-5 shadow-md flex items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <FontAwesomeIcon icon={faVoicemail} className="text-[50px]" />
              <div>
                <h3 className="text-lg font-semibold">Send Email</h3>
                <p className="text-sm text-gray-700">to customer</p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Open
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-orange-100 rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Send Email</h2>
                
                <input
                  className="bg-orange-50 w-full border border-gray-300 rounded p-2 mb-4"
                  placeholder="Write your coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />

                <input
                  className="bg-orange-50 w-full border border-gray-300 rounded p-2 mb-4"
                  placeholder="Write ID you recieved in email"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="buttonprimary text-white px-4 py-2 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </Layout>
  );
};

export default Settings;
