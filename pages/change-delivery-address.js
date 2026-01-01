import ConfirmModal from "@/components/ConfirmModal";
import Footer from "@/components/Footer";
import Footer2 from "@/components/Footer2";
import Miniheader from "@/components/Miniheader";
import Modal from "@/components/NewAddressModal";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";

//const noto = Noto_Serif({ subsets: ["latin"] });

const ChangeDeliveryAddress = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [selectedEditAddress, setSelectedEditAddress] = useState(undefined);
  const [selectedDeleteAddress, setSelectedDeleteAddress] = useState(undefined);
  const [addresses, setAddresses] = useState(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.userId) {
      try {
        const response = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              Authorization: `Bearer ${userData?.accessToken}`,
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`);
        if (response && response.data) {
          const mapAddresses =
            response && response.data && response.data.address
              ? [{ ...response.data, isDefault: true }]
                  .concat(response.data.address)
                  .map((address, index) => {
                    return { ...address, id: index + 1 };
                  })
              : [];
          setAddresses(mapAddresses);
          setSelectedAddressAction(mapAddresses);
        }
      } catch (error) {
        resetDate();
        console.error("Error fetching data:", error);
      }
    }
  };

  const submitAddress = async (address) => {
    resetDate();
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.userId) {
      try {
        const currentUser = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              Authorization: `Bearer ${userData?.accessToken}`,
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`);
        if (currentUser && currentUser.data) {
          let data = [];
          if (address && address.id) {
            const index = addresses.findIndex((item) => item.id === address.id);
            if (index !== -1) {
              addresses[index] = address;
              data = addresses.filter((item) => !item.isDefault);
            } else {
              data = currentUser.data.address.concat(address);
            }
          } else {
            data = currentUser.data.address.concat(address);
          }
          if (data && data.length > 0) {
            const sanitizedData = data.map(({ id, ...rest }) => rest);
            const response = await axios
              .create({
                headers: {
                  "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                  Authorization: `Bearer ${userData?.accessToken}`,
                },
              })
              .put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`,
                { address: sanitizedData } // Pass address in the request body
              );
            if (response && response.data) {
              const mapAddresses =
                response && response.data && response.data.address
                  ? [{ ...response.data, isDefault: true }]
                      .concat(response.data.address)
                      .map((address, index) => {
                        return { ...address, id: index + 1 };
                      })
                  : [];
              setAddresses(mapAddresses);
              setSelectedAddressAction(mapAddresses);
            }
          }
        }
      } catch (error) {
        resetDate();
        console.error("Error fetching data:", error);
      }
    }
  };

  const deleteAddress = async (address) => {
    const selectedAddress = JSON.parse(
      localStorage.getItem("selected-delivery-address")
    );
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.userId && address && address.id) {
      try {
        let data = addresses.filter(
          (item) => item.id != address.id && !item.isDefault
        );
        const sanitizedData = data.map(({ id, ...rest }) => rest);
        setSelectedDeleteAddress(undefined);
        setSelectedEditAddress(undefined);
        setIsModalOpen(false);
        const response = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              Authorization: `Bearer ${userData?.accessToken}`,
            },
          })
          .put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId}`,
            { address: sanitizedData } // Pass address in the request body
          );
        if (response && response.data) {
          const mapAddresses =
            response && response.data && response.data.address
              ? [{ ...response.data, isDefault: true }]
                  .concat(response.data.address)
                  .map((address, index) => {
                    return { ...address, id: index + 1 };
                  })
              : [];
          if (
            selectedAddress &&
            address &&
            address._id === selectedAddress._id
          ) {
            localStorage.removeItem("selected-delivery-address");
          }
          setAddresses(mapAddresses);
          setSelectedAddressAction(mapAddresses);
        }
      } catch (error) {
        resetDate();
        console.error("Error fetching data:", error);
      }
    }
  };

  const setSelectedAddressAction = (mapAddresses) => {
    const selectedAddress = JSON.parse(
      localStorage.getItem("selected-delivery-address")
    );
    if (selectedAddress && selectedAddress._id) {
      setSelectedAddress(selectedAddress._id);
    } else {
      setSelectedAddress(
        mapAddresses && mapAddresses.length > 0
          ? mapAddresses[0]._id
          : undefined
      );
    }
  };

  function resetDate() {
    setSelectedDeleteAddress(undefined);
    setSelectedEditAddress(undefined);
    setIsModalOpen(false);
    setSelectedAddress(undefined);
    setAddresses(undefined);
  }

  const dispatchHere = (address) => {
    if (address && address.id) {
      localStorage.setItem(
        "selected-delivery-address",
        JSON.stringify(address)
      );
      router.push(`/cart`);
    }
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
      <div className="relative">
        <section>
          <Miniheader />
        </section>

        <section>
          <div className="max-w-screen-xl mx-auto px-4 py-6">
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
              <div className="hover:text-primary flex items-center gap-1.5">
                <Link href="/">
                  <span>Home</span>
                </Link>
                <FontAwesomeIcon icon={faAngleRight} size="sm" />
              </div>
              <div className="hover:text-primary flex items-center gap-1.5">
                <Link href="/cart">
                  <span>Cart</span>
                </Link>
                <FontAwesomeIcon icon={faAngleRight} size="sm" />
              </div>
              <span className="text-primary ">Delivery Address</span>
            </div>
          </div>
        </section>
        <section>
          <div className="max-w-screen-sm mx-auto px-4   pt-5 pb-8 md:pb-16 xl:pb-24 ">
            <div className="mb-6 xl:mb-8">
              <h1
                className={`text-2xl xl:text-4xl text-start text-blue-950 xl:tracking-[-0.9px] mb-6 noto-font`}
              >
                Choose a delivery address
              </h1>
            </div>
            <div>
              {addresses === undefined ? (
                <div className="text-center py-4">Loading...</div>
              ) : addresses.length > 0 ? (
                addresses.map((item) => (
                  <div
                    key={item.id}
                    className="flex md:flex-row flex-col items-center md:gap-[100px] gap-[10px] justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        id={`address-${item.id}`}
                        name="address"
                        value={item.id}
                        checked={selectedAddress === item._id}
                        onChange={() => setSelectedAddress(item._id)}
                        className={`md:w-7 md:h-7 cursor-pointer ${
                          selectedAddress === item._id
                            ? "text-black"
                            : "text-gray-400"
                        } border-gray-300 focus:ring-black mt-1`}
                      />

                      <div className="ml-3">
                        {item.isDefault && (
                          <span className="inline-block px-2 py-1 mb-1 text-xs font-semibold text-white bg-blue-950 rounded-full">
                            Default
                          </span>
                        )}
                        <span className="block text-[20px] capitalize font-light text-gray-700">
                          <div className="text-[16px] md:text-[20px]">
                            <b>
                              {item.firstName} {item.lastName}
                            </b>
                          </div>
                          <div className="text-[16px]">
                            {item.streetAddress} {item.city} {item.state}{" "}
                            {item.ZipCode} {item.country}
                          </div>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          dispatchHere(item);
                        }}
                        className="mb-3 px-2 py-3 text-white bg-primary rounded-full hover:bg-gray-800 min-w-[170px] disabled:opacity-40"
                        disabled={selectedAddress !== item._id}
                      >
                        Ship Here
                      </button>
                      {!item.isDefault && (
                        <div className="flex space-x-6">
                          <button
                            className="text-blue-950 text-sm hover:underline "
                            onClick={() => {
                              setSelectedEditAddress(item);
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDeleteAddress(item);
                              setIsConfirmModalOpen(true);
                            }}
                            className="text-blue-950 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No address found</div>
              )}
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="text-blue-950 text-[16px] md:text-[20px] cursor-pointer flex item-center font-medium mt-4"
            >
              + Add a new Address
            </div>
          </div>
        </section>

        <section className="mt-[150px]">
          <Footer />
        </section>
        {isModalOpen ? (
          <Modal
            selectedAddress={selectedEditAddress}
            isOpen={isModalOpen}
            onSubmit={(newAddress) => submitAddress(newAddress)}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          ""
        )}

        {/* Pass dynamic props to the ConfirmModal */}
        <ConfirmModal
          isOpen={
            isConfirmModalOpen &&
            selectedDeleteAddress &&
            selectedDeleteAddress.id &&
            !selectedDeleteAddress.isDefault
          }
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
          onConfirm={() => {
            deleteAddress(selectedDeleteAddress);
          }}
          header="Delete Delivery Address"
          message="Are you sure you want to delete this delivery address?"
          confirmText="Yes, Delete"
          bgClass="bg-red-500"
        />
      </div>
    </>
  );
};

export default ChangeDeliveryAddress;
