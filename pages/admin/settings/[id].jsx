import dynamic from "next/dynamic";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const QuillEditor = dynamic(() => import("@/components/QuillEditor"), { ssr: false });
const ImageUploader = dynamic(() => import("@/components/UploadImages"), { ssr: false });
import AdminSellerMgmt from "../seller-management";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SettingsType = () => {
  const [settingType, setSettingType] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState(undefined);
  const router = useRouter();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [updateStatus, setUpdateStatus] = useState(false);

  const getData = (type) => {
    if(type=="csvs"){
      return
    }
    setResource(undefined);
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/type/${type}`,
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
        setLoading(false);
        if (
          response &&
          response.data &&
          response.data.settings &&
          response.data.settings.length
        ) {
          setResource(response.data.settings[0]);
          let contentParsed = {}
          try {
            contentParsed = JSON.parse(response.data.settings[0].content)
          } catch (error) {
            contentParsed = response.data.settings[0].content
          }
          setContent(contentParsed);
        }
      })
      .catch(function (error) {
        setResource({});
        setLoading(false);
      });
  };

  useEffect(() => {
    const { id } = router?.query;
    const { tab } = router?.query
    if(tab == "enable-disable") setUpdateStatus(true)
    if (router?.isReady && id) {
      setSettingType(id);
      getData(id);
    }
  }, [router?.query]);

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.userId) {
      let contentStr = ""
      try {
        contentStr = JSON.stringify(content)
      } catch (error) {
        contentStr = content
      }
      if (resource?._id) {
        setIsSubmitting(true);
        const options = {
          method: "PUT",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/${resource?._id}`,
          data: {
            type: resource.type,
            content: contentStr,
            createdBy: userData.userId,
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
            setIsSubmitting(false);
            toast.success("Settings Updated successfully");
          })
          .catch(function (error) {
            setIsSubmitting(false);
            toast.error("Something Went Wrong");
          });
      } else {
        setIsSubmitting(true);
        const options = {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
          data: {
            type: settingType,
            content: contentStr,
            createdBy: userData.userId,
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
            setIsSubmitting(false);
            toast.success("Settings Added successfully");
          })
          .catch(function (error) {
            setIsSubmitting(false);
            toast.error("Something Went Wrong");
          });
      }
    }
  };

  const getType = () => {
    switch (settingType) {
      case "terms-conditions":
        return "Terms and Conditions";
      default:
        return "Unknown";
    }
  };

  const handleEditorChange = (value) => {
    setContent(value);
  };


  const handleAddShop = (e, user) => {
    if (e.target.checked) {
      if (user?.id && content?.length < 3) {
        setContent([...content, user])
      } else {
        e.target.checked = false
      }
    } else {
      setContent(content.filter((item) => item?.id !== user?.id))
    }
  };


  const [selectedSchema, setSelectedSchema] = useState('');
  // const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!selectedSchema) {
      alert('Please select a schema');
      return;
    }

    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/downloadCSV/${selectedSchema}?from=${fromDate}&to=${toDate}`,
      }
      const response = await axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      // .then(function (response) {
      //   toast.success("Settings Added successfully");
      // })
      // .catch(function (error) {
      //   toast.error("Something Went Wrong");
      // });
      // const response = await fetch(`downloadCSV/buyers${selectedSchema}`);
      
      // if (!response.ok) {
      //   throw new Error('Failed to download CSV');
      // }
      
      var path = process.env.NEXT_PUBLIC_BASE_URL + `/csv/${selectedSchema}.csv`;
        // path = path + response.data.path;
        var a = document.createElement('A');
        a.href = path;
        a.download = response.path;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      toast.success("successfully");
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
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
        {settingType == "terms-conditions" && <>
          {!loading ? (
            <div className="bg-white rounded-lg px-6 py-6 shadow-md">
              <h1
                className={`text-2xl font-semibold mb-5 xl:text-2xl text-blue-950 noto-font `}
              >
                {getType()}
              </h1>
              <div className="">
                <QuillEditor value={content} onChange={handleEditorChange} />
              </div>
              <div className="mt-5 text-left">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content}
                  className="buttonprimary disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </>}

        {settingType == "csvs" && (
          <div className="flex justify-center items-center bg-orange-50 ">
            <div className="bg-orange-100 p-8 rounded-lg shadow-lg w-80">
              <h1 className="text-xl font-semibold mb-6 text-center">Download CSV</h1>

              {/* Select Schema Dropdown */}
              <div className="mb-4">
                <label htmlFor="schema" className="block text-gray-700 mb-2">Select Schema</label>
                <select
                  id="schema"
                  value={selectedSchema}
                  onChange={(e) => setSelectedSchema(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a Schema --</option>
                  <option value="buyers">Customers</option>
                  <option value="sellers">Sellers</option>
                  <option value="affiliate">Affilates</option>
                  <option value="subscribers">Subscribers</option>
                  <option value="guestusers">GuestUsers</option>

                </select>
              </div>

              {/* From Date */}
              <div className="mb-4">
                <label htmlFor="fromDate" className="block text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* To Date */}
              <div className="mb-4">
                <label htmlFor="toDate" className="block text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className={`w-full py-2 px-4 buttonprimary text-white rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-400`}
                disabled={loading}
              >
                {loading ? 'Downloading...' : 'Download CSV'}
              </button>
            </div>
          </div>
        )}


        {settingType == "shops" && !updateStatus&& <>
          <AdminSellerMgmt data={content} fromSettings={true} handleAddShop={handleAddShop} />
          <div className="mt-5 text-left">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content}
              className="buttonprimary disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </>}

        {settingType == "shops" && updateStatus && <>
          <AdminSellerMgmt data={content} fromSettings={true} isStatus={true} handleAddShop={handleAddShop} />
          <div className="mt-5 text-left">
            <button
              onClick={handleAddShop}
              disabled={isSubmitting || !content}
              className="buttonprimary disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </>}

        {settingType == "upload-images" && <ImageUploader data={resource} type={"upload-images"} />}
        {settingType == "upload-single-image" && <ImageUploader data={resource} type={"upload-single-image"} />}

        {settingType === "affiliate-commission" && (
          <>
            <div className="mt-5 text-left">
              <h2 className="text-lg font-semibold mb-2">Set Affiliate Commission (%)</h2>

              <div className="w-1/2">
                <input
                  type="number"
                  value={content}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty input to let user clear the field
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 9)) {
                      setContent(val);
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-md mb-4"
                  placeholder="Enter commission percentage"
                  min="0"
                  max="9"
                />
              </div>

              <div className="w-1/2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content}
                  className="buttonprimary disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>

          </>
        )}

        {settingType === "seller-referral-commission" && (
          <>
            <div className="mt-5 text-left">
              <h2 className="text-lg font-semibold mb-2">Set Seller Referral Commission (%)</h2>

              <div className="w-1/2">
                <input
                  type="number"
                  value={content}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty input to let user clear the field
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 9)) {
                      setContent(val);
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-md mb-4"
                  placeholder="Enter commission percentage"
                  min="0"
                  max="9"
                />
              </div>

              <div className="w-1/2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content}
                  className="buttonprimary disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>

          </>
        )}

        {settingType === "buyer-referral-commission" && (
          <>
            <div className="mt-5 text-left">
              <h2 className="text-lg font-semibold mb-2">Set Buyer Referral Commission (%)</h2>

              <div className="w-1/2">
                <input
                  type="number"
                  value={content}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty input to let user clear the field
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 9)) {
                      setContent(val);
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-md mb-4"
                  placeholder="Enter commission percentage"
                  min="0"
                  max="9"
                />
              </div>

              <div className="w-1/2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content}
                  className="buttonprimary disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>

          </>
        )}

        <div className="mt-5 text-left">
          <button
            onClick={() => {
              router.back();
            }}
            // disabled={isSubmitting || !content}
            className="buttonprimary disabled:opacity-50"
          >
            Back
          </button>
        </div>


      </Layout>
    </>
  );
};

export default SettingsType;
