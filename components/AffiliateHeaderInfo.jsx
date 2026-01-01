import { faBars } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { Noto_Serif } from "next/font/google";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import WalletConnectButton from "./WalletConnectButton";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AffiliateInfoHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Module Name");
  const [isDisabled, setDisabled] = useState(true);
  const [connectedWallet, setConnectedWallet] = React.useState(null);
  const [bypassingThirdWeb, setBypassingThirdWeb] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  const handleMenuItemClick = (value) => {
    setSelectedValue(value);
  };
  const onLogOutClick = () => {
    clearThirdWebAuthTokens();
    window.location.href = "/";
  };  
  
  useEffect(() => {
    const isBypass = JSON.parse(localStorage.getItem("bypassthirdweb"));
    if(isBypass) setBypassingThirdWeb(true);

    const isThirdWeb = localStorage.getItem("thirdweb:active-wallet-id");

    if(connectedWallet || isThirdWeb) setBypassingThirdWeb(false);
  },[connectedWallet])



  return (
    <>
      <div className="max-w-screen-2xl mx-auto flex justify-between gap-10 items-center mb-8 2xl:gap-20">
        <div>
          <div className={`flex items-center`}>
            <button
              className="flex items-center lg:hidden mr-3 text-2xl"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <FontAwesomeIcon
                icon={faBars}
                width={22}
                className="cursor-pointer"
              />
            </button>
            <h1
              className={`md:text-3xl text-1xl text-blue-950 font-medium noto-font`}
            >
              Hi, {userData?.firstName}
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-end gap-9 shrink-0">
          {/* <div
            title="Coming soon..."
            className={`opacity-50  flex items-center border border-zinc-200 rounded-[3px] md:flex hidden`}
          >
            <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px] hover:cursor-not-allowed pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17.732"
                height="17.732"
                viewBox="0 0 17.732 17.732"
              >
                <path
                  id="magnifying-glass-light"
                  d="M16.578,15.84l-4.624-4.624A6.815,6.815,0,0,0,6.768,0a6.8,6.8,0,1,0,4.418,11.956L15.81,16.58a.659.659,0,0,0,.4.152.523.523,0,0,0,.369-.892ZM6.8,12.549A5.752,5.752,0,1,1,12.549,6.8,5.741,5.741,0,0,1,6.8,12.549Z"
                  transform="translate(0.5 0.5)"
                  fill="#fff"
                  stroke="#fff"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <input
              type="text"
              className=" border-none p-2 border-zinc-200 focus:ring-zinc-200 focus:border-zinc-200 outline-none hover:cursor-not-allowed pointer-events-none"
              placeholder="Search..."
            /> */}
          {/* <button className="px-3 pt-2.5 pb-3 bg-orange-100 gap-1.5 text-sm text-primary cursor-pointer text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center rounded-tr-[3px] rounded-br-[3px] hover:cursor-not-allowed pointer-events-none">
                Module Name
                <FontAwesomeIcon icon={faAngleDown} className=" h-[18px]" />
                <FontAwesomeIcon
                  icon={faPipe}
                  className="text-gray-500  h-[18px] ml-1.5"
                />
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-gray-500 h-[18px] ml-1.5 "
                />
              </button> */}
          {/* <Menu
                as="div"
                className="relative inline-block text-left bg-orange-100"
              >
                <div className="flex items-center">
                  <Menu.Button className="px-3 pt-2.5 pb-3 w-[190px] gap-1.5 text-sm text-primary cursor-pointer  hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-start rounded-tr-[3px] rounded-br-[3px]">
                    {selectedValue}
                    <FontAwesomeIcon icon={faAngleDown} className=" h-[18px]" />
                  </Menu.Button>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-gray-500 h-[18px] mr-3 cursor-pointer"
                  />
                </div>
                <Transition
                  as={Fragment}
                  // ... (rest of your Transition properties)
                >
                  <Menu.Items className="absolute mt-2  w-52 origin-top-right  divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <button
                              onClick={() => handleMenuItemClick("Dashboard")}
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              Dashboard
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <button
                              onClick={() => handleMenuItemClick("My Account")}
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              My Account
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <button
                              onClick={() =>
                                handleMenuItemClick("Order Management")
                              }
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              Order Management
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/seller/product">
                            <button
                              onClick={() =>
                                handleMenuItemClick("Product Management")
                              }
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              Product Management
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <button
                              onClick={() => handleMenuItemClick("Earnings")}
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              Earnings
                            </button>
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <button
                              onClick={() => handleMenuItemClick("Review")}
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              Review
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <button
                              onClick={() => handleMenuItemClick("Settings")}
                              className={`hover:bg-orange-100 text-slate-600 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2`}
                            >
                              Settings
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu> */}
          {/* </div> */}
          <div>
            {" "}
              <div className="flex items-center gap-4 p-3.5 text-blue-950">
                {/* My Wallet Button */}
                <button
                  type="button"
                  onClick={() => document.querySelector('.nabeel')?.click()}
                  className="relative hover:text-primary text-sm xl:text-lg"
                >
                  {!bypassingThirdWeb ? "My Wallet" : "Wallet Sign-In"}
                  <WalletConnectButton className="nabeel hidden" setConnectedWallet={setConnectedWallet} />
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogOutClick}
                  className="relative hover:text-primary text-sm xl:text-lg"
                >
                  Logout
                </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateInfoHeader;
