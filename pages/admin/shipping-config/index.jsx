import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Select from "react-select";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const Modal = dynamic(() => import("@/components/ConfigModal"), { ssr: false }); // Assumes a Modal component exists
import countryData from "country-data";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminTier = () => {
  const [tiers, setTiers] = useState([]); // List of tiers
  const [isAdding, setIsAdding] = useState(false); // Modal visibility
  const [formData, setFormData] = useState({
    tierName: "",
    countires: [],
    surcharge: "",
  });
  const [editingTier, setEditingTier] = useState(null);
  const [matrix, setMatrix] = useState({}); // Shipping cost matrix
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false); // Matrix modal visibility
  const [isUpdate, setIsUpdate] = useState(null); // Shipping cost matrix
  const [matrixFocusTier, setMatrixFocusTier] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);
  const countryOptions = Object.values(Object.values(countryData)[6])
    .filter((co) => co && co.name) // Remove undefined and entries without a name
    .map((co) => ({
      value: co.name, // Use the country name as both value and label
      label: co.name, // Same for label
    }));

  const uniqueCountryOptions = [
    ...new Set(countryOptions.map((option) => option.value)),
  ].map((value) => {
    return countryOptions.find((option) => option.value === value);
  });

  const [formErrors, setFormErrors] = useState({
    tierName: false,
    countires: false,
    surcharge: false,
  });

  useEffect(() => {
    fetchShippingConfig();
  }, []);

  const fetchShippingConfig = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shipping-config/all`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );

      if (response.data) {
        const { tiers, matrix } = response.data;

        // Map tiers
        const mappedTiers = tiers.map((tier) => ({
          tierName: tier.tierName,
          countires: tier.countires.map((o) => ({ value: o, label: o })), // Prepare for react-select
          surcharge: tier.discountsurcharge || "", // Ensure a valid surcharge
        }));

        // Map matrix
        const mappedMatrix = matrix.reduce((acc, { from, to, surcharge }) => {
          if (!acc[from]) acc[from] = {};
          acc[from][to] = surcharge.toString(); // Ensure surcharge is string for input fields
          return acc;
        }, {});

        // Update state
        setTiers(mappedTiers);
        setMatrix(mappedMatrix);
        setIsUpdate(response.data._id); // Store the config ID for future updates
      } else {
        setTiers([]); // Reset tiers if no data is returned
        setMatrix({}); // Reset matrix if no data is returned
        console.warn("No data found in response.");
      }
    } catch (error) {
      console.error("Error fetching shipping config:", error);
      toast.error("Failed to fetch shipping configuration.");
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const updateMatrix = (newTiers) => {
    const newMatrix = {};

    newTiers.forEach((tier1) => {
      newMatrix[tier1.tierName] = {};
      newTiers.forEach((tier2) => {
        // Retain existing surcharges if they exist in the current matrix
        if (matrix[tier1.tierName]?.[tier2.tierName]) {
          newMatrix[tier1.tierName][tier2.tierName] =
            matrix[tier1.tierName][tier2.tierName];
        } else {
          // Set default surcharge to "0" for new combinations
          newMatrix[tier1.tierName][tier2.tierName] = "0";
        }
      });
    });

    setMatrix(newMatrix);
  };

  const handleAddTier = () => setIsAdding(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "", // True if empty, False if valid
    }));
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    setFormData((prev) => ({ ...prev, [field]: selectedOptions }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: selectedOptions.length === 0, // True if empty, False if valid
    }));
  };

  const handleSaveTier = () => {
    const errors = {
      tierName: !formData.tierName,
      countires: formData.countires.length === 0,
    };

    setFormErrors(errors);

    if (Object.values(errors).includes(true)) {
      return; // Do not proceed with saving if there are validation errors
    }

    if (formData.tierName && formData.countires.length > 0) {
      const updatedTiers =
        editingTier !== null
          ? tiers.map((tier, index) =>
              index === editingTier ? formData : tier
            )
          : [...tiers, formData];

      setTiers(updatedTiers);
      setFormData({ tierName: "", countires: [] });
      setIsAdding(false);
      setEditingTier(null);
      toast.custom("Click Save All to store in DB");
    } else {
    }
  };

  const handleEdit = (index) => {
    setEditingTier(index);
    setFormData(tiers[index]);
    setIsAdding(true);
  };

  const handleDelete = async (index) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
    updateMatrix(updatedTiers);
    if(!updatedTiers.length){
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/shipping-config/${isUpdate}`,
          {
            headers: {
              'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm',
            },
          }
        );
      } catch (error) {
        console.error('Failed to delete reward:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormErrors({
      tierName: false,
      countires: false,
    });
    setIsAdding(false);
    setEditingTier(null);
    setFormData({ tierName: "", countires: [] });
  };

  const handleMatrixChange = (tier1, tier2, value) => {
    setMatrix((prev) => ({
      ...prev,
      [tier1]: {
        ...prev[tier1],
        [tier2]: value, // Update only the specific field (tier1, tier2)
      },
    }));
  };

  const handleSaveMatrix = () => {
    const preparedMatrix = [];

    // Convert the `matrix` object to an array of objects
    tiers.forEach((originTier) => {
      tiers.forEach((destinationTier) => {
        const surcharge =
          matrix[originTier.tierName]?.[destinationTier.tierName];
        if (surcharge && surcharge.trim() !== "") {
          preparedMatrix.push({
            origin: originTier.tierName,
            destination: destinationTier.tierName,
            surcharge: parseFloat(surcharge), // Ensure surcharge is a number
          });
        }
      });
    });

    // Now send `preparedMatrix` to the server or update the state
    toast.success("Matrix saved successfully!");
    setIsMatrixModalOpen(false);
  };

  const handleCloseMatrixModal = () => {
    setIsMatrixModalOpen(false);
  };

  const handleOpenMatrixModalForTier = (tier) => {
    setMatrixFocusTier(tier.tierName); // Set the current destination tier
    setIsMatrixModalOpen(true); // Open the modal
  };

  const handleSaveAll = async () => {
    const preparedTiers = tiers.map((tier) => ({
      tierName: tier.tierName,
      countires: tier.countires.map((o) => o.value),
    }));

    const completedMatrix = {};
    tiers.forEach((tier1) => {
      if (!completedMatrix[tier1.tierName]) {
        completedMatrix[tier1.tierName] = {};
      }
      tiers.forEach((tier2) => {
        // Set surcharge to 0 if missing
        completedMatrix[tier1.tierName][tier2.tierName] =
          matrix[tier1.tierName]?.[tier2.tierName] || "0";
      });
    });

    // Flatten the matrix for saving
    const preparedMatrix = Object.entries(completedMatrix).flatMap(
      ([from, rates]) =>
        Object.entries(rates).map(([to, surcharge]) => ({
          from,
          to,
          surcharge: parseFloat(surcharge) || 0, // Ensure surcharge is a number
        }))
    );

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/shipping-config/create`,
      data: {
        tiers: preparedTiers,
        matrix: preparedMatrix,
      },
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    if (isUpdate) {
      options.data._id = isUpdate;
    }

    axios
      .request(options)
      .then(function (response) {
        toast.success("Shipping Config Saved");
      })
      .catch(function (error) {
        toast.error("Something Went Wrong");
      });
  };
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null); // Close dropdown if clicked outside
      }
    };

    // Attach event listener for clicks outside of the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Layout userType="admin">
      <div className="col-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-blue-950">Manage Tiers</h1>
          <div className="flex items-center justify-end gap-4">
            <button
              className="dashboard-button-primary"
              onClick={handleAddTier}
            >
              Add Tier
            </button>
          </div>
        </div>

        {/* Modal for Adding/Editing Tier */}
        <Modal isOpen={isAdding} onClose={handleCancel}>
          <div className="modal-content max-w-3xl">
            <h2 className="text-lg font-medium text-blue-950 mb-4">
              {editingTier !== null ? "Edit Tier" : "Add Tier"}
            </h2>
            {/* Form Fields */}
            <input
              type="text"
              name="tierName"
              value={formData.tierName}
              onChange={handleInputChange}
              placeholder="Tier Name"
              className={`bg-orange-50 w-full mb-4 border px-3 py-2 rounded-md ${
                formErrors.tierName ? "border-red-500" : ""
              }`}
            />
            <Select
              isMulti
              options={uniqueCountryOptions}
              value={formData.countires}
              onChange={(selectedOptions) =>
                handleMultiSelectChange(selectedOptions, "countires")
              }
              placeholder="countires"
              className="bg-orange-50 w-full mb-4"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderColor: formErrors.countires
                    ? "red"
                    : provided.borderColor, // Apply red border when there's an error
                  boxShadow: formErrors.countires
                    ? "0 0 0 0 red"
                    : provided.boxShadow, // Optional: adds a shadow for better visibility
                }),
              }}
            />
            <div className="flex justify-end gap-4">
              <div className="flex items-center justify-end gap-4">
                <button
                  className="dashboard-button-primary"
                  onClick={handleSaveTier}
                >
                  {editingTier !== null ? "Update" : "Save"}
                </button>
              </div>
              <div className="flex items-center justify-end gap-4">
                <button
                  className="dashboard-button-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Button to Open Matrix Modal */}

        {/* Display Tiers */}
        <div className="mt-6">
          <h2 className="text-lg font-medium text-blue-950 mb-4">Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="tier-box p-4 border rounded-md bg-gray-50 shadow-sm relative"
              >
                {/* Dropdown Button with 3 dots */}
                <div className="absolute top-2 right-2">
                  <button
                    className="text-blue-950 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleDropdown(index)}
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

                  {/* Dropdown Menu */}
                  {openDropdown === index && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-28 bg-orange-50 border rounded-md shadow-lg z-10"
                    >
                      <div className="py-2">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                          onClick={() => handleOpenMatrixModalForTier(tier)}
                        >
                          Matrix
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tier Information */}
                <h3 className="text-blue-950 font-semibold mb-2">
                  {tier.tierName}
                </h3>
                <p>{tier.countires.map((o) => o.label).join(", ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Matrix Modal for Editing */}
        <Modal isOpen={isMatrixModalOpen} onClose={handleCloseMatrixModal}>
          <div className="modal-content max-w-xl bg-orange-50 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-950 mb-4">
              Shipping Cost Matrix
            </h2>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full border-collapse border border-gray-300 table-auto">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-3 bg-orange-100 text-left w-1/3">
                      Origin
                    </th>
                    <th className="border border-gray-300 p-3 bg-orange-100 text-left w-1/3">
                      Destination
                    </th>
                    <th className="border border-gray-300 p-3 bg-orange-100 text-left w-1/3">
                      SurCharge
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier) => (
                    <tr key={tier.tierName} className="hover:bg-orange-100">
                      {/* Origin to Destination Description */}
                      <td className="border border-gray-300 p-3 font-medium text-blue-950 w-1/3">
                        {matrixFocusTier}
                      </td>

                      {/* Rate from the origin tier (matrixFocusTier) to the destination tier (tier) */}
                      <td className="border border-gray-300 p-3 text-center w-1/3">
                        {tier.tierName}
                      </td>

                      {/* Rate from the destination tier to the origin tier */}
                      <td className="border border-gray-300 p-3 text-center w-1/3">
                        <input
                          type="number"
                          value={matrix[matrixFocusTier]?.[tier.tierName] || ""}
                          onChange={(e) =>
                            handleMatrixChange(
                              matrixFocusTier,
                              tier.tierName,
                              e.target.value
                            )
                          }
                          className="bg-orange-100 w-full text-center border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-6 mt-6">
              <button
                className="dashboard-button-primary"
                onClick={handleSaveMatrix}
              >
                Save Matrix
              </button>
              <button
                className="px-6 py-2 bg-gray-400 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleCloseMatrixModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
        {tiers.length >= 1 && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="dashboard-button-primary"
              onClick={handleSaveAll}
            >
              Save All
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminTier;
