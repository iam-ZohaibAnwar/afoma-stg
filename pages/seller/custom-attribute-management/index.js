import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const [customAttribute, setCustomAttribute] = useState();
  const [editIndex, setEditIndex] = useState();
  const [editData, setEditData] = useState(false);
  const [attributes, setAttributes] = useState();
  const [validation, setValidation] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    if (!customAttribute) {
      setValidation("Required");
    } else {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      // //

      if (editData) {
        // //
        const options = {
          method: "PUT",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/attributes/updateAttributes//${userData?.sellerId}`,
          data: {
            updatedAttributeValue: customAttribute,
            indexToUpdate: editIndex,
          },
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        };
        axios
          .request(options)
          .then(function (response) {
            // //
            setCustomAttribute("");
            setEditData(false);
            setEditIndex(null);
            toast.success("Attribute Updated");
            fetchData();
            setLoading(false);
          })
          .catch(function (error) {
            console.error(error);
            toast.error("Something went wrong");
            setCustomAttribute("");
            setEditData(false);
            setEditIndex(null);
            setLoading(false);
          });
      } else {
        // //
        axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/attributes/update/${userData?.sellerId}`,
            {
              attributes: customAttribute,
            }
          )
          .then(function (response) {
            // //
            setCustomAttribute("");
            toast.success("Attribute Added");
            // Fetch the updated data after successful submission
            fetchData();
            setLoading(false);
          })
          .catch(function (error) {
            // //
            setCustomAttribute("");
            toast.error("Something went wrong");
            setLoading(false);
          });
      }
    }
  };

  const fetchData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/attributes/single/${userData?.sellerId}`
      )
      .then((res) => {
        // //
        const attributeList = res.data.map((person) => ({
          personId: person._id,
          value: [...person.attributes],
        }));
        setAttributes(attributeList[0]?.value);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Delete function
  const handleDelete = (attributeName) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    const options = {
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/attributes/delete/${userData?.sellerId}`,
      data: { attributes: attributeName },
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
        // Update state after successful deletion
        toast.success("Attribute Deleted");
        fetchData();
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something went wrong");
      });
  };

  // Initial data fetching
  useEffect(() => {
    fetchData();
  }, []);

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
        <>
          <div className="flex justify-between items-center mb-9">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Add New Attribute
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20 mb-8 ">
            <div className="st-form md:w-80">
              <div className="grid gap-6">
                <div className="relative">
                  <div>
                    <label htmlFor="customAttributeName">
                      Attribute Name <span className="text-red-700 ">*</span>
                    </label>
                  </div>
                  <div>
                    {validation && <p className="invalid">{validation}</p>}
                    <input
                      type="text"
                      name="customAttributeName"
                      id="customAttributeName"
                      placeholder="Enter attribute name"
                      value={customAttribute}
                      required
                      onChange={(e) => {
                        setCustomAttribute(e.target.value);
                        setValidation(null);
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-start">
                  <button
                    type="submit"
                    className="buttonprimary flex gap-2 items-center"
                    onClick={onSubmit}
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            {attributes && attributes.length > 0 && (
              <div className="md:w-[524px] overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-9">
                <table className="text-sm md:w-[524px] table-fixed border-separate border-spacing-0 bg-orange-50 ">
                  <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                    <tr>
                      <th className="px-5 w-[180px] lg:w-[300px] py-5 font-medium">
                        Attribute Name
                      </th>

                      <th className="px-5  font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributes?.map((attributeName, index) => (
                      <tr key={index}>
                        <td className="px-5 py-6 text-blue-950">
                          {attributeName}
                        </td>
                        <td className="px-5 w-[120px]">
                          <button
                            className="underline text-blue-950 hover:text-primary"
                            onClick={() => {
                              setCustomAttribute(attributeName);
                              setEditIndex(index);
                              setEditData(true);
                            }}
                          >
                            Edit
                          </button>{" "}
                          <button
                            className="underline text-blue-950 hover:text-primary"
                            onClick={() => handleDelete(attributeName)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>{" "}
        {/* <>
          <div className="mt-16 md:mt-40 lg:mt-80">
            <ComingSoonSeller />
          </div>
        </> */}
      </Layout>
    </>
  );
};

export default Index;
