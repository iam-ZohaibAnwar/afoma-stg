import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const SellerInfo = ({
  product,
  seller,
  productCount,
  isOpenPolicy,
  setIsOpenPolicy,
  showChatButton,
  handleChatWithSeller
}) => {
  if (!product?.seller) return null;

  return (
    <div>
      <p className="text-blue-950 font-semibold mb-3">Meet your seller</p>

      <Link href={`/shop/${product?.seller?.storeSlug}`}>
        <p className="font-medium text-blue-950 mb-3">
          {product?.seller?.storeTitle || ""}
        </p>
      </Link>

      <div className={`flex gap-2 items-center mb-2 ${product?.seller?.city && product?.seller?.state && product?.seller?.country ? "" : "hidden"}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15.302"
          height="15.305"
          viewBox="0 0 11.931 15.702"
        >
          <path
            id="Location"
            d="M3.334,5.716A2.381,2.381,0,1,1,5.716,8.1,2.381,2.381,0,0,1,3.334,5.716ZM5.716,3.81A1.905,1.905,0,1,0,7.621,5.716,1.907,1.907,0,0,0,5.716,3.81Zm5.716,1.905c0,2.6-3.483,7.234-5.01,9.145a.9.9,0,0,1-1.411,0C3.456,12.949,0,8.317,0,5.716a5.716,5.716,0,0,1,11.431,0ZM5.716.476A5.239,5.239,0,0,0,.476,5.716a5.662,5.662,0,0,0,.53,2.072A18.936,18.936,0,0,0,2.337,10.3a48.764,48.764,0,0,0,3.045,4.266,.423.423,0,0,0,.667,0A48.879,48.879,0,0,0,9.094,10.3a19.113,19.113,0,0,0,1.331-2.51,5.69,5.69,0,0,0,.53-2.072A5.239,5.239,0,0,0,5.716.476Z"
            transform="translate(0.25 0.25)"
            fill="#172554"
            stroke="#172554"
            strokeWidth="0.5"
          />
        </svg>
        <p className="text-blue-950 text-sm">
          {product?.seller?.city && product?.seller?.state && product?.seller?.country
            ? `${product?.seller.city}, ${product?.seller.state}, ${product?.seller.country}`
            : ""}
        </p>
      </div>

      {productCount > 0 && (
        <div className="flex gap-2 items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15.302"
            height="15.305"
            viewBox="0 0 15.302 15.305"
          >
            <path
              id="Product"
              d="M19.011,7.664,11.756,4.037a.346.346,0,0,0-.309,0L4.191,7.664A.345.345,0,0,0,4,7.974v7.256a.346.346,0,0,0,.191.309l7.256,3.628a.346.346,0,0,0,.309,0l7.256-3.628a.346.346,0,0,0,.191-.309V7.974A.346.346,0,0,0,19.011,7.664ZM11.6,4.732l6.483,3.242L16.7,8.667,10.214,5.425Zm2.332,5.317L7.45,6.807l1.991-1,6.483,3.242Zm.259.643,2.073-1.037v2.57l-.663-.474a.345.345,0,0,0-.485.084l-.925,1.337Zm-7.515-3.5,6.483,3.242-1.559.78L5.118,7.974ZM4.691,8.533l6.565,3.282V18.3L4.691,15.015ZM11.947,18.3V11.815l1.555-.777v3.242a.346.346,0,0,0,.63.2l1.355-1.957.924.66a.345.345,0,0,0,.546-.281V9.31l1.555-.777v6.483Z"
              transform="translate(-3.95 -3.948)"
              fill="#172554"
              stroke="#172554"
              strokeWidth="0.1"
            />
          </svg>
          <p className="text-blue-950 text-sm">{productCount} products</p>
        </div>
      )}

      {/* Cancellation & Return Policies */}
      {seller?.storePolicy && (seller?.storePolicy?.cancellationPolicy || seller?.storePolicy?.returnPolicy) && (
        <div className="w-full pb-2 mb-4 border-t border-zinc-200 mt-6">
          <div
            className="flex justify-between items-center py-2 border-b border-gray-300 cursor-pointer"
            onClick={() => setIsOpenPolicy(!isOpenPolicy)}
          >
            <h3 className="text-blue-950 font-semibold mb-1 mt-1">
              Cancel & Return Policies
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
              className={`transition-transform duration-300 ${isOpenPolicy ? "rotate-180" : ""}`}
            >
              <path d="M12 15.586L6.707 10.293 5.293 11.707 12 18.414 18.707 11.707 17.293 10.293z"></path>
            </svg>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ${isOpenPolicy ? "max-h-96 opacity-100 pb-2 mb-4 border-b border-zinc-200" : "max-h-0 opacity-0"}`}>
            <div className="py-3">
              {seller?.storePolicy?.cancellationPolicy && (
                <>
                  <h4 className="text-md font-semibold text-blue-950">
                    Cancellation Policy
                  </h4>
                  <p className="text-gray-700 text-sm">
                    I accept order cancellations within {seller?.storePolicy?.cancellationPolicyTime} hours of purchase.
                  </p>
                </>
              )}

              {seller?.storePolicy?.returnPolicy && (
                <>
                  <h4 className="text-md font-semibold text-blue-950 mt-3">
                    Return Policy
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {seller?.storePolicy?.returnPolicyDetails}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat with Seller Button */}
      {showChatButton && (
        <div className="pb-4 mb-4 border-b border-zinc-200">
          <button
            type="button"
            className="w-full text-black px-4 py-2 border border-slate-200 cursor-pointer font-medium flex items-center justify-center"
            onClick={handleChatWithSeller}
          >
            Chat with Seller
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerInfo;
