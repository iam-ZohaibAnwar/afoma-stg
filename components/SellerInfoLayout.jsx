import React from "react";
import Sidebar from "./Sidebar";
import SellerInfoHeader from "./SellerInfoHeader";

const SellerInfoLayout = ({ children }) => {
  return (
    <div className="flex items-start justify-center h-full">
      <Sidebar />
      <div className="max-w-screen-2xl mx-auto bg-orange-50">
        <SellerInfoHeader />
        <div className="max-w-screen-2xl mx-auto ">{children}</div>
      </div>
    </div>
  );
};

export default SellerInfoLayout;
