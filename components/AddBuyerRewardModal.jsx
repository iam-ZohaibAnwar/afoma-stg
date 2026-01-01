import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AddBuyerRewardModal = ({ isOpen, onClose, onSave, editData }) => {
  const [rows, setRows] = useState([{ purchasing_amount: '', reward_token: '' }]);
  const [ratingCriteria, setRatingCriteria] = useState([]);
  const [purchasingCriteria, setPurchasingCriteria] = useState([]);

  // Populate rows dynamically when editData is provided
  useEffect(() => {
    if (isOpen && editData) {
      editData.criteria.forEach((data) => {
          if (data.type === "rating") {
              setRatingCriteria(data.data.length ? data.data : [{ rating: "1", reward_token: "" }]);
          } else if (data.type === "purchasing") {
            setPurchasingCriteria(data.data.length ? data.data : [{ purchasing: "", reward_token: "" }]);
          }
      });
  } else if (!editData) {
      // Reset criteria for new reward
      setRatingCriteria([{ rating: "1", reward_token: "" }]);
      setPurchasingCriteria([{ purchasing: "", reward_token: "" }]);
  }
  }, [editData, isOpen]);

  // Add new empty row
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, { purchasing_amount: '', reward_token: '' }]);
  };

  const addRatingRow = () => {
    setRatingCriteria([...ratingCriteria, { rating: "", reward_token: "" }]);
  };

  const addPurchasingRow = () => {
    setPurchasingCriteria([...purchasingCriteria, { sales: "", reward_token: "" }]);
  };

  const handleRatingChange = (index, field, value) => {
    const updated = [...ratingCriteria];
    updated[index][field] = value;
    setRatingCriteria(updated);
  };

  const handlePurchaseChange = (index, field, value) => {
    const updated = [...purchasingCriteria];
    updated[index][field] = value;
    setPurchasingCriteria(updated);
  };

  const handleDeletePurchaseRow = () => {
    setPurchasingCriteria((prevPurchaseCriteria) =>  prevPurchaseCriteria.slice(0, -1));;
  };

  const handleDeleteRatingRow = () => {
    setRatingCriteria((prevRatingCriteria) => prevRatingCriteria.slice(0, -1));
  };

  const handleSave = async (values) => {
    try {
      // Format the data for API submission
      const formattedRatingData = {
        type: "rating",
        data: ratingCriteria.filter((row) => row.rating || row.reward_token), // Remove empty rows
      };

      const formattedPurchaseData = {
        type: "purchasing",
        data: purchasingCriteria.filter((row) => row.purchasing || row.reward_token), // Remove empty rows
      };

      const criteria = [formattedRatingData, formattedPurchaseData];

      // Save to API
      const response =  await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/reward-management/create`, {
        _id: editData?._id,
        type: "Buyer",
        criteria: criteria,
      }, {
        headers: {
          'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm',
        },
      });

      // Call the onSave function to update parent state
      onSave({ ...criteria, ...response.data }); // Assuming the API returns the saved data

      // Close the modal
      onClose();
      toast.success("Reward saved successfully!");
    } catch (error) {
      console.error('Error saving buyer rewards:', error);
      toast.error('Error saving buyer rewards. Please try again.');
    }
  };

  const handleRemoveRow = () => {
    // Remove the row at the given index
    const updatedRows = rows.slice(0, -1)
    setRows(updatedRows);
  };

  // Only show modal if it's open
  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-orange-50 p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-blue-950 mb-4">
            {editData ? "Edit Buyer Reward" : "Add Buyer Reward"}
          </h2>

          {/* Rating Criteria Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-950 mb-2">Review Criteria</h3>
            <div className="grid grid-cols-2 gap-4 mb-2 font-bold">
              <div>For Every Review Created</div>
              <div>Number of Tokens Rewarded</div>
            </div>
            {ratingCriteria.map((item, index) => (
              <div className="grid grid-cols-2 gap-4 mb-2" key={index}>
                <input
                  type="number"
                  placeholder="Enter Rating"
                  className="bg-grey-100 inputfield disabled:bg-gray-300 disabled:text-gray-600"
                  value={item.rating}
                  onChange={(e) => handleRatingChange(index, "rating", e.target.value)}
                  disabled={item.rating}
                />
                <input
                  type="number"
                  placeholder="Token Against Rating"
                  className="bg-orange-100 inputfield"
                  value={item.reward_token}
                  onChange={(e) => handleRatingChange(index, "reward_token", e.target.value)}
                />
              </div>
            ))}
            {/* <div className="flex justify-end items-center space-x-2">
              {ratingCriteria.length > 0 && (
                <button
                  type="button"
                  className="bg-red-500 text-white w-8 h-8 flex justify-center items-center text-xl rounded-full"
                  onClick={handleDeleteRatingRow}
                >
                  -
                </button>
              )}
              <button
                type="button"
                className="bg-green-500 text-white w-8 h-8 flex justify-center items-center text-xl rounded-full"
                onClick={addRatingRow}
              >
                +
              </button>
            </div> */}
          </div>

          {/* Sales Criteria Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-950 mb-2">Purchase Criteria</h3>
            <div className="grid grid-cols-2 gap-4 mb-2 font-bold">
              <div>Purchase (Amount In CAD)</div>
              <div>Number of Tokens Rewarded</div>
            </div>
            {purchasingCriteria.map((item, index) => (
              <div className="grid grid-cols-2 gap-4 mb-2" key={index}>
                <input
                  type="number"
                  placeholder="Enter CAD Amount"
                  className="bg-orange-100 inputfield"
                  value={item.purchasing}
                  onChange={(e) => handlePurchaseChange(index, "purchasing", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Token Against CAD Amount"
                  className="bg-orange-100 inputfield"
                  value={item.reward_token}
                  onChange={(e) => handlePurchaseChange(index, "reward_token", e.target.value)}
                />
              </div>
            ))}
            {/* <div className="flex justify-end items-center space-x-2">
              {purchasingCriteria.length > 0 && (
                <button
                  type="button"
                  className="bg-red-500 text-white w-8 h-8 flex justify-center items-center text-xl rounded-full"
                  onClick={handleDeletePurchaseRow}
                >
                  -
                </button>
              )}
              <button
                type="button"
                className="bg-green-500 text-white w-8 h-8 flex justify-center items-center text-xl rounded-full"
                onClick={addPurchasingRow}
              >
                +
              </button>
            </div> */}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-4">
            <button type="button" className="px-3 py-2 bg-gray-400 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="buttonprimary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
  
};

export default AddBuyerRewardModal;
