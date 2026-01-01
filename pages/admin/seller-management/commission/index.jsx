import Layout from "@/components/Layout";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");

  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `h${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${id}`,
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
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
        // //
        setEditData(response.data);
        setSelectedMenuItem(response.data.status);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const router = useRouter();
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);
  const initialValues = {
    accountHolderName: editData?.paymentInfo[0]?.accountHolderName,
    accountNumber: editData?.paymentInfo[0]?.accountNumber,
    swiftCode: editData?.paymentInfo[0]?.swiftCode,
    bankName: editData?.paymentInfo[0]?.bankName,
    ibanNumber: editData?.paymentInfo[0]?.ibanNumber,
  };

  const onEditClick = (id) => {
    router.push(`/admin/seller-management/basic-information?id=${id}`);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onEdit = (id) => {
    router.push(`/admin/seller-management/address?id=${id}`);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onSellerClick = (id) => {
    router.push(`/admin/seller-management/seller-details?id=${id}`);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/admin/seller-management/payment-information?id=${id}`);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };
  const onCommissionEdit = (id) => {
    router.push(`/admin/seller-management/commission?id=${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };
  return (
    <>
      {" "}
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
      <Layout userType="admin">
        <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 mt-8">
          {editData ? (
            <div>
              <div className="p-7 border border-[#D8D8D8]  bg-orange-50 flex items-start gap-6">
                {/*  2xl:pr-24 2xl:pl-20 2xl:pt-44*/}

                <div className="shrink-0">
                  {editData?.userProfile ? (
                    <Image
                      src={editData.userProfile}
                      alt="Fashion"
                      height={90}
                      width={90}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <Image
                      src="/assets/user.png"
                      alt="Fashion"
                      height={90}
                      width={90}
                      className="rounded-full shrink-0"
                    />
                  )}
                </div>

                <div>
                  <h1 className={`text-2xl text-blue-950 font-medium  `}>
                    {`${editData?.firstName} ${editData?.lastName}`}|{" "}
                    <span className="text-lg">{`${editData.uuid}`}</span>
                  </h1>

                  <div className="flex flex-wrap gap-9 mt-6">
                    <div>
                      <p className="text-sm text-blue-950">Phone No.</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {editData?.phone ? editData.phone : "(Not Added)"}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8]"></div>
                    <div>
                      <p className="text-sm text-blue-950">Email</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {`${editData.email}`}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8] "></div>
                    <div>
                      <p className="text-sm text-blue-950">Country</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {editData?.country
                          ? editData?.country?.name
                          : "(Not Added)"}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8] "></div>
                    <div>
                      <p className="text-sm text-blue-950">Seller Since</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {editData?.createdAt
                          ? editData.createdAt
                          : "(Not Added)"}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8] "></div>
                    <div>
                      <p className="text-sm text-blue-950">Shop URL</p>
                      <p className="text-base font-medium text-center text-primary mt-2 cursor-pointer">
                        {`${editData?.slug}`}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8] "></div>
                    <div>
                      <p className="text-sm text-blue-950">Facebook</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {editData?.facebook ? editData.facebook : "(Not Added)"}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8] "></div>
                    <div>
                      <p className="text-sm text-blue-950">Twitter</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {editData?.twitter ? editData.twitter : "(Not Added)"}
                      </p>
                    </div>
                    <div className="w-px bg-[#D8D8D8] "></div>
                    <div>
                      <p className="text-sm text-blue-950">Instagram</p>
                      <p className="text-base font-medium text-center text-blue-950 mt-2">
                        {editData?.instagram
                          ? editData.instagram
                          : "(Not Added)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative font-medium text-slate-500 bg-orange-100 border-b mt-8 flex overflow-auto">
                <button
                  className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                    isEditClickActive
                      ? "border-b border-primary text-primary"
                      : ""
                  }`}
                  onClick={() => onEditClick(editData._id)}
                >
                  Basic Information
                </button>

                <button
                  className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                    isEditActive ? "border-b border-primary text-primary" : ""
                  }`}
                  onClick={() => onEdit(editData._id)}
                >
                  Address
                </button>
                <button
                  className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                    isSellerClickActive
                      ? "border-b border-primary text-primary"
                      : ""
                  }`}
                  onClick={() => onSellerClick(editData._id)}
                >
                  Seller Details
                </button>
                <button
                  className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                    isInfoEditActive
                      ? "border-b border-primary text-primary"
                      : ""
                  }`}
                  onClick={() => onInfoEdit(editData._id)}
                >
                  Payment Information
                </button>
                <button
                  className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                    isCommissionEdit
                      ? "border-b border-primary text-primary"
                      : ""
                  }`}
                  onClick={() => onCommissionEdit(editData._id)}
                >
                  Commission
                </button>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Payment;
