import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const AddBuyerRewardModal = dynamic(() => import("@/components/AddBuyerRewardModal"), { ssr: false });
const AddSellerRewardModal = dynamic(() => import("@/components/AddSellerRewardModal"), { ssr: false });
import { useRef } from "react";
import toast from "react-hot-toast";
import Select from "react-select";

const RewardForm = ({ handleBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buyerRewards, setBuyerRewards] = useState([]);
  const [threshold, setThreshold] = useState([]);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [sellerRewards, setSellerRewards] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editBuyerReward, setEditBuyerReward] = useState(null);
  const [editSellerReward, setEditSellerReward] = useState(null);
  const [sellerModalCriteria, setSellerModalCriteria] = useState({
    ratings: [],
    sales: [],
  });
  const [openBuyerDropdown, setOpenBuyerDropdown] = useState(null);
  const [openSellerDropdown, setOpenSellerDropdown] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupAirDrop, setShowPopupAirDrop] = useState(false);
  const [redeemThreshold, setRedeemThreshold] = useState(""); // For the first input
  const [maxRedeemToken, setMaxRedeemToken] = useState(""); // For the second input
  const [thresholdId, setThresholdId] = useState(null); // To store the _id for updates
  const [airDropToken, setAirDropToken] = useState(""); // For the AirDrop input
  const [users, setUsers] = useState([]); // For the first input
  const [userOptions, setUserOptions] = useState([]); // For the first input
  const [formData, setFormData] = useState({
    airDropToken: "",
    users: [],
  });

  // Refs to track dropdown elements
  const buyerDropdownRef = useRef(null);
  const sellerDropdownRef = useRef(null);

  // Fetch rewards data
  const fetchRewards = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reward-management/all`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );

      const buyers = [];
      const sellers = [];
      const threshold = [];

      data.forEach((reward) => {
        if (reward.type === "Buyer") {
          buyers.push(reward);
        } else if (reward.type === "Seller") {
          sellers.push(reward);
        } else {
          threshold.push(reward);
        }
      });

      setBuyerRewards(buyers);
      setSellerRewards(sellers);
      setThreshold(threshold);

      // If threshold exists, pre-fill values
      if (threshold.length > 0) {
        const existingThreshold = threshold[0]; // Assuming there's only one threshold
        setThresholdId(existingThreshold._id);
        setRedeemThreshold(
          existingThreshold.criteria[0]?.redeemThreshold || ""
        );
        setMaxRedeemToken(existingThreshold.criteria[0]?.maxRedeemToken || "");
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );

      // Map users to include firstName + lastName and set user ID in value
      const userOptions = data.map((user) => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`,
      }));
      setUsers(data);
      setUserOptions(userOptions);
    } catch (err) {}
  };

  useEffect(() => {
    fetchRewards(); // Fetch data on component mount
    fetchUsers();
  }, []);

  const handleOpenBuyerModal = (reward = null) => {
    setEditBuyerReward(reward); // Set the reward to edit (or null for adding new)
    setIsModalOpen(true);
    setOpenBuyerDropdown(null);
  };

  const handleOpenSellerModal = (reward = null) => {
    // Reset to initial state when opening the modal
    setEditSellerReward(reward);
    setIsSellerModalOpen(true);
    setOpenSellerDropdown(null);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buyerDropdownRef.current &&
        !buyerDropdownRef.current.contains(event.target) &&
        sellerDropdownRef.current &&
        !sellerDropdownRef.current.contains(event.target)
      ) {
        // Close both dropdowns if clicked outside either
        setOpenBuyerDropdown(null);
        setOpenSellerDropdown(null);
      }
      // If the click is outside just one dropdown, close that one
      else if (
        buyerDropdownRef.current &&
        !buyerDropdownRef.current.contains(event.target)
      ) {
        setOpenBuyerDropdown(null);
      } else if (
        sellerDropdownRef.current &&
        !sellerDropdownRef.current.contains(event.target)
      ) {
        setOpenSellerDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, []); // Empty dependency array to only run once on mount

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditBuyerReward(null); // Reset the edit state
    setEditSellerReward(null); // Reset edit state
  };

  const handleSaveRewards = async (savedReward) => {
    if (editBuyerReward) {
      // Update Buyer Rewards in state
      setBuyerRewards((prevRewards) =>
        prevRewards.map((reward) =>
          reward._id === editBuyerReward._id
            ? { ...reward, ...savedReward }
            : reward
        )
      );
    } else if (editSellerReward) {
      // Update Seller Rewards in state
      setSellerRewards((prevRewards) =>
        prevRewards.map((reward) =>
          reward._id === editSellerReward._id
            ? { ...reward, ...savedReward }
            : reward
        )
      );
    } else {
      // Add a new reward to the relevant state
      if (savedReward.type === "Buyer") {
        setBuyerRewards((prevRewards) => [...prevRewards, savedReward]);
      } else if (savedReward.type === "Seller") {
        setSellerRewards((prevRewards) => [...prevRewards, savedReward]);
      }
    }

    // Fetch updated data from the backend to ensure consistency
    await fetchRewards();

    // Reset modal and edit state
    setIsModalOpen(false);
    setEditBuyerReward(null);
    setEditSellerReward(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reward-management/${id}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );

      // Update state to remove the deleted reward
      setBuyerRewards((prevRewards) =>
        prevRewards.filter((reward) => reward._id !== id)
      );
      setSellerRewards((prevRewards) =>
        prevRewards.filter((reward) => reward._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete reward:", error);
    }
  };

  const toggleBuyerDropdown = (index) => {
    setOpenBuyerDropdown(openBuyerDropdown === index ? null : index);
  };

  const toggleSellerDropdown = (index) => {
    setOpenSellerDropdown(openSellerDropdown === index ? null : index);
  };

  // Seller Modal Handlers
  const handleCloseSellerModal = () => setIsSellerModalOpen(false);
  const handleSaveSellerRewards = (savedReward) => {
    if (editSellerReward) {
      // Update Seller Rewards in state
      setSellerRewards((prevRewards) =>
        prevRewards.map((reward) =>
          reward._id === editSellerReward._id
            ? { ...reward, ...savedReward }
            : reward
        )
      );
    } else {
      if (savedReward.type === "Seller") {
        setSellerRewards((prevRewards) => [...prevRewards, savedReward]);
      }
    }
    setIsSellerModalOpen(false); // Close modal after save
  };

  const handleSave = async () => {
    // Format data to be sent
    const formattedData = [
      {
        redeemThreshold: Number(redeemThreshold),
        maxRedeemToken: Number(maxRedeemToken),
      },
    ];

    try {
      // Save to API
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reward-management/create/threshold`,
        {
          _id: thresholdId || null, // Include _id only for updates
          type: "Threshold",
          criteria: formattedData,
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );

      // Close popup and clear form state after saving
      setShowPopup(false);
      toast.success("Threshold saved successfully!");
    } catch (error) {
      console.error("Error saving threshold:", error);
      toast.error("Failed to save threshold.");
    }
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [], // Store only values (e.g., user ids)
    }));
  };

  const handleSaveAirDrop = async () => {
    if (airDropToken && formData.users) {
      let web3Addresses = [];
      for (let id of formData.users) {
        let web3address = users.find((user) => {
          if (user._id == id) return user.web3address;
        });
        web3Addresses.push(web3address);
      }
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/rewards/air-drop`,
          {
            users: web3Addresses,
            tokens: Number(airDropToken),
          },
          {
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          }
        );

        // Close popup and clear form state after saving
        setShowPopupAirDrop(false);
        toast.success("Token sent successfully!");
      } catch (err) {
        toast.error("Something Went Wrong");
      }
    } else {
      toast.error("Enter Both Values");
    }
  };

  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      setFormData({
        ...formData,
        selectAll: true,
        users: userOptions.map((user) => user.value), // Select all user IDs
      });
    } else {
      setFormData({
        ...formData,
        selectAll: false,
        users: [], // Clear selection
      });
    }
  };

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
      </Head>

      <Layout>
        <div className="flex justify-end items-center gap-2 mt-2">
          {/* Add Popup Button */}
          <button
            type="button"
            className="buttonprimary flex gap-2 items-center justify-center"
            onClick={() => setShowPopup(true)} // Open the popup when clicked
          >
            Add Threshold
          </button>
          <button
            type="button"
            className="buttonprimary flex gap-2 items-center justify-center"
            onClick={() => setShowPopupAirDrop(true)} // Open the popup when clicked
          >
            Air Drop
          </button>
        </div>
        {/* Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-orange-50  p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-medium text-blue-950 mb-4">
                Threshold
              </h2>
              <form>
                {/* Input Field 1 */}
                <div className="mb-4">
                  <label
                    htmlFor="redeemThreshold"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Redeem Threshold
                  </label>
                  <input
                    type="number"
                    id="redeemThreshold"
                    value={redeemThreshold}
                    onChange={(e) => setRedeemThreshold(e.target.value)} // Update state
                    className="bg-orange-100 mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Input Field 2 */}
                <div className="mb-4">
                  <label
                    htmlFor="maxRedeemToken"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Max Redeem Token
                  </label>
                  <input
                    type="number"
                    id="maxRedeemToken"
                    value={maxRedeemToken}
                    onChange={(e) => setMaxRedeemToken(e.target.value)} // Update state
                    className="bg-orange-100 mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-400 text-gray-700 rounded-lg hover:bg-gray-500"
                    onClick={() => setShowPopup(false)} // Close popup on cancel
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="buttonprimary px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleSave} // Save action
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPopupAirDrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-orange-50 p-6 rounded-lg shadow-lg w-90">
              <h2 className="text-lg font-medium text-blue-950 mb-4">
                Air Drop Tokens
              </h2>
              <form>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.selectAll} // Track the state of "Select All"
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      className="bg-orange-100"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Select All Users
                    </span>
                  </label>
                </div>
                {/* Multi-Select for Users */}
                <div className="mb-4">
                  <label
                    htmlFor="selectUsers"
                    className="block text-sm font-medium bg-orange-50"
                  >
                    Select Users
                  </label>
                  <Select
                    isMulti
                    isDisabled={formData.selectAll} // Disable the dropdown when "Select All" is checked
                    options={userOptions} // Array of options like [{ value: user.id, label: user.firstName + ' ' + user.lastName }]
                    value={
                      formData.selectAll
                        ? userOptions // When "Select All" is checked, show all options as selected
                        : formData.users
                        ? formData.users.map((id) =>
                            userOptions.find((user) => user.value === id)
                          )
                        : []
                    } // Format selected users correctly
                    onChange={(selectedOptions) =>
                      handleMultiSelectChange(selectedOptions, "users")
                    }
                    placeholder="Select users"
                    className="bg-orange-100"
                  />
                </div>

                {/* Input Field for Token */}
                <div className="mb-4">
                  <label
                    htmlFor="airDropToken"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Token
                  </label>
                  <input
                    type="number"
                    id="airDropToken"
                    onChange={(e) => setAirDropToken(e.target.value)}
                    className="bg-orange-100 mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-400 text-gray-700 rounded-lg hover:bg-gray-500"
                    onClick={() => setShowPopupAirDrop(false)} // Close popup on cancel
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="buttonprimary px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleSaveAirDrop} // Save action
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex items-baseline justify-start gap-3 mt-7 mb-7 st-form">
          <h1 className="text-xl text-blue-950 font-medium">
            Reward Information
          </h1>
        </div>
        {/* Add Buyer and Seller Reward Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Add Buyer Reward Button */}
          <button
            type="button"
            className="buttonprimary w-full sm:w-auto flex gap-2 items-center justify-center"
            onClick={() => handleOpenBuyerModal()} // Open modal to add new buyer reward
          >
            Add Buyer Reward
          </button>

          {/* Add Seller Reward Button */}
          <button
            type="button"
            className="buttonprimary w-full sm:w-auto flex gap-2 items-center justify-center"
            onClick={() => handleOpenSellerModal()} // Open modal to add new seller reward
          >
            Add Seller Reward
          </button>
        </div>

        {/* Modal Component */}
        <AddBuyerRewardModal
          isOpen={isModalOpen} // Control modal visibility
          onClose={handleCloseModal} // Close modal when clicking cancel or saving
          onSave={handleSaveRewards} // Pass function to handle saving rewards
          editData={editBuyerReward} // Pass the reward being edited
        />

        {/* Add Seller Reward Modal */}
        <AddSellerRewardModal
          isOpen={isSellerModalOpen}
          onClose={handleCloseSellerModal}
          onSave={handleSaveSellerRewards}
          editData={editSellerReward}
        />
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Left Column - Buyer Section */}
            <div className="w-full sm:w-1/2">
              {buyerRewards.length > 0 && (
                <h2 className="text-lg font-medium text-blue-950 mb-4">
                  Buyer Rewards
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4">
                {buyerRewards.map((reward, index) => (
                  <div
                    key={reward._id}
                    className="tier-box p-4 border rounded-md bg-gray-50 shadow-sm relative"
                  >
                    {/* Dropdown Button with 3 dots */}
                    <div className="absolute top-2 right-2">
                      <button
                        className="text-blue-950 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                        onClick={() => toggleBuyerDropdown(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12h12M6 6h12m-6 12h6"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu for Buyer Rewards */}
                      {openBuyerDropdown === index && (
                        <div
                          ref={buyerDropdownRef}
                          className="absolute right-0 mt-2 w-28 bg-orange-100 border rounded-md shadow-lg z-10"
                        >
                          <div className="bg-orange-50 py-2 border rounded-md">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                              onClick={() => handleOpenBuyerModal(reward)}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                              onClick={() => handleDelete(reward._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reward Information */}
                    <div className="text-blue-950 font-semibold mb-2">
                      {/* {reward.criteria && reward.criteria.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="font-bold text-left">Purchasing Amount</div>
                                            <div className="font-bold text-left">Reward Tokens</div>

                                            {reward.criteria.map((cri, idx) => (
                                                <div key={idx} className="contents">
                                                    <div className="text-left">{cri.purchasing_amount}</div>
                                                    <div className="text-left">{cri.reward_token}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No criteria available</p>
                                    )} */}
                      {reward.criteria && reward.criteria.length > 0 ? (
                        <>
                          {reward.criteria.map((cri, idx) => (
                            <div key={idx} className="mb-4">
                              {cri.type === "rating" && (
                                <>
                                  <h3 className="font-bold text-left mb-2">
                                    Rating Criteria
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="font-bold text-left">
                                      Rating
                                    </div>
                                    <div className="font-bold text-left">
                                      Reward Tokens
                                    </div>

                                    {cri.data.map((item, subIdx) => (
                                      <div key={subIdx} className="contents">
                                        <div className="text-left">
                                          {item.rating}
                                        </div>
                                        <div className="text-left">
                                          {item.reward_token}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                              {cri.type === "purchasing" &&
                                cri.data.length > 0 && (
                                  <>
                                    <h3 className="font-bold text-left mb-2">
                                      Purchase Criteria
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="font-bold text-left">
                                        Purchase
                                      </div>
                                      <div className="font-bold text-left">
                                        Reward Tokens
                                      </div>

                                      {cri.data.map((item, subIdx) => (
                                        <div key={subIdx} className="contents">
                                          <div className="text-left">
                                            {item.purchasing}
                                          </div>
                                          <div className="text-left">
                                            {item.reward_token}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <p>No criteria available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Seller Section */}
            <div className="w-full sm:w-1/2">
              {sellerRewards.length > 0 && (
                <h2 className="text-lg font-medium text-blue-950 mb-4 text-left sm:text-right">
                  Seller Rewards
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4">
                {sellerRewards.map((reward, index) => (
                  <div
                    key={reward._id}
                    className="tier-box p-4 border rounded-md bg-gray-50 shadow-sm relative"
                  >
                    {/* Dropdown Button with 3 dots */}
                    <div className="absolute top-2 right-2">
                      <button
                        className="text-blue-950 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                        onClick={() => toggleSellerDropdown(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12h12M6 6h12m-6 12h6"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu for Seller Rewards */}
                      {openSellerDropdown === index && (
                        <div
                          ref={sellerDropdownRef}
                          className="absolute right-0 mt-2 w-28 bg-orange-50 border rounded-md shadow-lg z-10"
                        >
                          <div className="bg-orange-50 py-2 border rounded-md ">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                              onClick={() => handleOpenSellerModal(reward)}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                              onClick={() => handleDelete(reward._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reward Information */}
                    <div className="text-blue-950 font-semibold mb-2">
                      {reward.criteria && reward.criteria.length > 0 ? (
                        <>
                          {reward.criteria.map((cri, idx) => (
                            <div key={idx} className="mb-4">
                              {cri.type === "rating" && (
                                <>
                                  <h3 className="font-bold text-left mb-2">
                                    Rating Criteria
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="font-bold text-left">
                                      Rating
                                    </div>
                                    <div className="font-bold text-left">
                                      Reward Tokens
                                    </div>

                                    {cri.data.map((item, subIdx) => (
                                      <div key={subIdx} className="contents">
                                        <div className="text-left">
                                          {item.rating}
                                        </div>
                                        <div className="text-left">
                                          {item.reward_token}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                              {cri.type === "sales" && cri.data.length > 0 && (
                                <>
                                  <h3 className="font-bold text-left mb-2">
                                    Sales Criteria
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="font-bold text-left">
                                      Sales
                                    </div>
                                    <div className="font-bold text-left">
                                      Reward Tokens
                                    </div>

                                    {cri.data.map((item, subIdx) => (
                                      <div key={subIdx} className="contents">
                                        <div className="text-left">
                                          {item.sales}
                                        </div>
                                        <div className="text-left">
                                          {item.reward_token}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <p>No criteria available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RewardForm;
