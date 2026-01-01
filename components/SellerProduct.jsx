import React from "react";
import SellerInfoHeader from "./SellerInfoHeader";
import SellerSidebar from "./SellerSidebar";

const SellerProduct = ({ children }) => {
  return (
    <div className="flex items-start justify-start h-full gap-10 2xl:gap-24">
      <SellerSidebar />{" "}
      <div className=" bg-orange-50 pr-4">
        <SellerInfoHeader /> <div className="max-w-screen-2xl ">{children}</div>{" "}
      </div>{" "}
    </div>
  );
};

export default SellerProduct;
