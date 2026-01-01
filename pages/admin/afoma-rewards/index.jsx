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
import Select from "react-select";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [walletBalance, setWalletBalance] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const itemsPerPage = 10;

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rewards/all`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      let filterRewards = [];
      if (
        response.data &&
        response.data.reversedRewards &&
        response.data.reversedRewards.length
      ) {
        filterRewards = response.data.reversedRewards
      }
      setRewards(filterRewards);
      fetchUsers()
    } catch (error) {
      console.error("Error fetching Rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async() => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      let users = []
      for(let user of response.data){
        users.push({
          label: `${user.firstName} ${user.lastName}`,
          value: user.web3address
        })
      }
      setUsers(users)
    } catch (error) {
      console.error("Error fetching Rewards:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRewards();
  }, []);

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

  const handleFetchTokenInWallet = () => {
      setShowPopup(true);
  };

  const handleViewSubmit = async () => {
    if (!selectedOption.value) {
      return toast.error("Invalid wallet address");
    }
    if(walletBalance){
      return toast.error("Already Balance There");
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rewards/get-balance/${selectedOption.value}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      toast.success("Successful!");
      setWalletBalance(response.data.balance)
    } catch (error) {
      console.error("Error during checking balance:", error);
      setWalletBalance("")
      setSelectedOption("");
      return toast.error("Please try again.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setWalletBalance("")
    setSelectedOption("");
  };

  const handleChange = (selected) => {
    setSelectedOption(selected);
    setWalletBalance("")  
  };

  return (
    <>
      <Head>
        <title>AFOMA Rewards - Decentralized Marketplace</title>
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
              AFOMA Rewards
            </h1>
            <div className="flex sm:flex-row flex-col sm:items-center justify-end gap-4">
              <div className="flex items-center border border-zinc-200 rounded-[3px]">
                <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px]">
                  <FontAwesomeIcon icon={faSearch} className="text-white" />
                </div>
                <input
                  type="text"
                  className="w-full border-none p-2 focus:outline-none h-[48px]"
                  placeholder="Search by Username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleFetchTokenInWallet}
                className={`px-6 py-2 rounded bg-primary text-white`}
              >
                View OMA Balance
              </button>
            </div>
          </div>

          {/* Redeem Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-orange-50 p-6 rounded-md shadow-md w-[470px]">
                <h2 className="text-xl font-medium mb-4">Select/Search User</h2>
                <div className="p-2 mb-4 focus:outline-none">
                <Select
                  options={users}
                  value={selectedOption}
                  onChange={handleChange}
                  placeholder="Search or select a wallet address"
                  className="st-react-select"
                  classNamePrefix="react-select"
                  isSearchable={true}
                />
                </div>
                {walletBalance ? (<h6 className="text-xl font-medium mt-4 mb-4">Wallet Balance Is: {walletBalance}</h6>) : ""}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={closePopup}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleViewSubmit}
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    View
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
                        {reward.reward_tokens?.toFixed(2) || 0}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {reward.reward_type?.join(", ") || ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {reward.redeem_tokens?.toFixed(2) || 0}
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
