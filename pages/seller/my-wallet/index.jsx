import Layout from "@/components/Layout";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemThreshold, setRedeemThreshold] = useState(500);
  const [maxRedeemToken, setMaxRedeemToken] = useState(1000);

  const router = useRouter();

  const itemsPerPage = 10;

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData?.userId) {
        throw new Error("User ID is not available.");
      }

      const threshold = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reward-management/Threshold`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      if(threshold.data && threshold.data.criteria && threshold.data.criteria.length){
        setMaxRedeemToken(Number(threshold.data.criteria[0].maxRedeemToken))
        setRedeemThreshold(Number(threshold.data.criteria[0].redeemThreshold))
      }else{
        setMaxRedeemToken(1000)
        setRedeemThreshold(500)
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rewards/${userData.userId}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      let filterRewards = [];
      if (
        response.data &&
        response.data.rewards &&
        response.data.rewards.length
      ) {
        filterRewards = response.data.rewards.filter((reward) => {
          return reward.userInfo._id == userData.userId;
        });
      }
      setRewards(filterRewards);
    } catch (error) {
      console.error("Error fetching Rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  },  [redeemThreshold, maxRedeemToken]);

  useEffect(() => {
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

  const totalTokens = rewards.reduce(
    (sum, reward) => sum + (Number(reward.reward_tokens) || 0),
    0
  );

  const searchedRewards = rewards.filter((reward) => {
    if (!searchTerm) return true;
    const username = `${reward.userInfo?.firstName || ""}`.toLowerCase();
    return username.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(searchedRewards.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRewards = searchedRewards.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => {
    setCurrentPage(page);
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  const handleRedeemClick = () => {
    if (totalTokens >= redeemThreshold) {
      setShowPopup(true);
    }
  };

  const handleRedeemSubmit = async () => {
    if (!redeemAmount || redeemAmount <= 0 || redeemAmount > totalTokens) {
      return toast.error("Invalid Redeem Amount");
    }

    if(redeemAmount > maxRedeemToken){
      return toast.error("Can Not Redeem More Then " + maxRedeemToken);
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rewards/redeem`,
        {
          userId: userData.userId,
          tokens: Number(redeemAmount),
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      toast.success("Redeem request successful!");
      setShowPopup(false);
      setRedeemAmount("");
      fetchRewards(); // Refresh rewards after redeem
    } catch (error) {
      console.error("Error during redeem:", error);
      return toast.error("Redeem failed. Please try again.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setRedeemAmount("");
  };

  const handleBuyOMA = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId || userData?.sellerId}`,
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
        window.open(`https://afoma.io?wallet=${response.data.web3address}&OMA=buy#OMA`, "_blank");
      })
      .catch(function (error) {
        toast.error(error.message)
      });
  }

  const handleSellOMA = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userData?.userId || userData?.sellerId}`,
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
        window.open(`https://afoma.io?wallet=${response.data.web3address}&OMA=sell#OMA`, "_blank");
      })
      .catch(function (error) {
        toast.error(error.message)
      });
  }

  return (
    <>
      <Head>
        <title>My Rewards - Decentralized Marketplace</title>
        <meta
          name="description"
          content="View and manage your rewards on the decentralized marketplace."
        />
      </Head>

      <Layout userType="seller">
        <div>
          <div className="sm:flex flex-col md:flex-row justify-between md:items-center mb-5">
            <h1
              className={`text-xl lg:text-2xl text-blue-950 font-medium mb-2 noto-font`}
            >
              My Rewards
            </h1>
            <div className="flex sm:flex-row flex-col sm:items-center justify-end gap-4">
              <button
                onClick={handleRedeemClick}
                disabled={totalTokens < redeemThreshold}
                className={`px-6 py-2 rounded ${
                  totalTokens >= redeemThreshold
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Redeem
              </button>

              <button
                onClick={handleBuyOMA}
                className="dashboard-button-primary"
              >
                Buy OMA
              </button>

              <button
                onClick={handleSellOMA}
                className="dashboard-button-primary"
              >
                Sell OMA
              </button>
            </div>
          </div>

          {/* Redeem Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-orange-50 p-6 rounded-md shadow-md w-[400px]">
                <h2 className="text-xl font-medium mb-4">Redeem Tokens</h2>
                <input
                  type="number"
                  className="bg-orange-100 w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none"
                  placeholder="Enter token amount"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={closePopup}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedeemSubmit}
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Table */}
          <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6">
            <table className="text-sm w-full border-separate border-spacing-0 bg-orange-50">
              <thead className="text-left font-medium text-white bg-blue-950 h-14">
                <tr>
                  <th className="px-5 py-3 border-b border-gray-200">Username</th>
                  <th className="pl-7 py-3 border-b border-gray-200">
                    To be Redeemed
                  </th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Reward Type
                  </th>
                  <th className="pl-7 py-3 border-b border-gray-200">
                    Already Redeemed
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm text-center border-b border-gray-200"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : currentRewards.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="pl-10 py-9 font-medium text-blue-950 text-sm text-center border-b border-gray-200"
                    >
                      No rewards available.
                    </td>
                  </tr>
                ) : (
                  currentRewards.map((reward) => (
                    <tr
                      key={reward._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {reward.userInfo?.firstName || "-"}
                      </td>
                      <td className="pl-7 py-4 border-b border-gray-200 text-blue-950">
                        {(reward.reward_tokens)?.toFixed(2) || 0}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {reward.reward_type?.join(", ") || ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {reward.redeem_tokens || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {searchedRewards.length > 0 && !loading && (
            <div className="bg-orange-50 mt-6">
              <div className="flex items-center justify-end gap-x-6 my-9">
                <button
                  className={`flex items-center gap-2 ${
                    currentPage === 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-primary"
                  }`}
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Previous
                </button>
                <button
                  className={`flex items-center gap-2 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-primary"
                  }`}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Rewards;
