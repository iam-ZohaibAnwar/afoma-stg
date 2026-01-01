// // MyAccountNavigation.js
// import React from "react";
// import { useRouter } from "next/router";

// const MyAccountNavigation = ({ id }) => {
//   const router = useRouter();

//   const handleClick = (item) => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     router.push(`/seller/my-account/${item}?id=${userData?.sellerId}`);
//   };

//   return (
//     <div>
//       <ul>
//         <li>
//           <a
//             href="#"
//             id="basic-information"
//             onClick={() => handleClick("basic-information")}
//           >
//             Basic Information
//           </a>
//         </li>
//         <li>
//           <a href="#" id="address" onClick={() => handleClick("address")}>
//             Address
//           </a>
//         </li>
//         {/* Add more menu items as needed */}
//       </ul>
//     </div>
//   );
// };

// export default MyAccountNavigation;

// MyAccountNavigation.js
import React, { useState } from "react";

const MyAccountNavigation = ({ onSectionChange, activeSection }) => {
  const handleClick = (section) => {
    onSectionChange(section);
  };
  return (
    <div className="pt-8">
      <div className="w-full overflow-auto rounded-md bg-orange-100">
        <table
          table
          className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b "
        >
          <tr className="w-full">
            <th className="w-[auto]">
              <button
                className={`text-blue-950 py-[18px] px-6  font-medium  transition-all ease-in-out ${
                  activeSection === "basic-informations"
                    ? "border-b border-primary text-primary"
                    : ""
                }`}
                onClick={() => handleClick("basic-informations")}
              >
                {" "}
                Basic Information
              </button>
            </th>
            <th className="w-[117px]">
              <button
                className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                  activeSection === "address"
                    ? "border-b border-primary text-primary"
                    : ""
                }`}
                onClick={() => handleClick("address")}
              >
                Address
              </button>
            </th>
            <th className="w-[155px]">
              <button
                className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                  activeSection === "seller-detail"
                    ? "border-b border-primary text-primary"
                    : ""
                }`}
                onClick={() => handleClick("seller-detail")}
              >
                Seller Details
              </button>
            </th>
            <th className="w-[215px]">
              <button
                className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                  activeSection === "payment-information"
                    ? "border-b border-primary text-primary"
                    : ""
                }`}
                onClick={() => handleClick("payment-information")}
              >
                Payment Information
              </button>
            </th>
            {/* Other navigation buttons */}
          </tr>
        </table>
      </div>
    </div>
  );
};

export default MyAccountNavigation;
