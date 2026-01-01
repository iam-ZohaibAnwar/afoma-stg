import { faBars } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { Noto_Serif } from "next/font/google";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import WalletConnectButton from "./WalletConnectButton";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminInfoHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [isDisabled, setDisabled] = useState(true);
  const [connectedWallet, setConnectedWallet] = React.useState(null);
  const [bypassingThirdWeb, setBypassingThirdWeb] = useState(false);
  
  const router = useRouter();
  const path = router.pathname;

  const onLogOutClick = () => {
    clearThirdWebAuthTokens();
    window.location.href = "/"
  };
  
  useEffect(() => {
    const isBypass = JSON.parse(localStorage.getItem("bypassthirdweb"));
    if (isBypass) setBypassingThirdWeb(true);

    const isThirdWeb = localStorage.getItem("thirdweb:active-wallet-id");;

    if(connectedWallet || isThirdWeb) setBypassingThirdWeb(false);
  }, [connectedWallet])

  return (
    <>
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
              className={`opacity-50 items-center border border-zinc-200 rounded-[3px] md:flex hidden`}
              disabled
            >
              <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px]">
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
                className=" border-none p-2 border-zinc-200 focus:ring-zinc-200 focus:border-zinc-200 outline-none "
                placeholder="Search..."
                disabled
              />
            </div> */}
            <div>
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
            {/* <div title="Coming soon..." className={`opacity-50   `} disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.343"
                height="23.593"
                viewBox="0 0 21.343 23.593"
              >
                <g transform="translate(-17.806 0.15)">
                  <g transform="translate(17.958 0)">
                    <path
                      d="M35.992,14.731V10.305a7.745,7.745,0,0,0-5-7.225,2.629,2.629,0,0,0,.053-.515,2.566,2.566,0,1,0-5.132,0,2.747,2.747,0,0,0,.049.5,7.508,7.508,0,0,0-5,7.078v4.587a.3.3,0,0,1-.3.3,2.7,2.7,0,0,0-2.7,2.374,2.631,2.631,0,0,0,2.619,2.885h4.531a3.379,3.379,0,0,0,6.717,0h4.531A2.631,2.631,0,0,0,38.986,17.4a2.7,2.7,0,0,0-2.7-2.374A.3.3,0,0,1,35.992,14.731ZM28.478,1.5a1.065,1.065,0,0,1,1.063,1.063.918.918,0,0,1-.015.143,6.658,6.658,0,0,0-.774-.071,7.741,7.741,0,0,0-1.322.075.919.919,0,0,1-.015-.143A1.066,1.066,0,0,1,28.478,1.5Zm0,20.287a1.885,1.885,0,0,1-1.841-1.5h3.682A1.885,1.885,0,0,1,28.478,21.79Zm9.013-4.245a1.123,1.123,0,0,1-1.123,1.24H20.588a1.129,1.129,0,0,1-1.123-1.24,1.181,1.181,0,0,1,1.2-1.014,1.8,1.8,0,0,0,1.8-1.8V10.144a6.014,6.014,0,0,1,6.011-6.011c.075,0,.146,0,.222,0a6.147,6.147,0,0,1,5.789,6.169v4.426a1.8,1.8,0,0,0,1.8,1.8A1.184,1.184,0,0,1,37.491,17.545Z"
                      transform="translate(-17.958 0)"
                      fill="#172554"
                      stroke="#fff7ed"
                      strokeWidth="0.3"
                    />
                  </g>
                </g>
              </svg>
            </div> */}
          </div>
          {/* <div className="flex items-center justify-end gap-9 shrink-0">
            <div
              title={isDisabled ? "Coming soon..." : ""}
              className={`hover:opacity-50 hover:cursor-not-allowed flex items-center border border-zinc-200 rounded-[3px] ${
                isDisabled ? "cursor-not-allowed" : ""
              }`}
            >
              <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px]">
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
              />
              <button className="px-3 pt-2.5 pb-[11px] bg-orange-100 gap-1.5 text-sm text-primary cursor-pointer text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center rounded-tr-[3px] rounded-br-[3px] hover:cursor-not-allowed">
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
              </button>
            </div>
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.343"
                height="23.593"
                viewBox="0 0 21.343 23.593"
              >
                <g transform="translate(-17.806 0.15)">
                  <g transform="translate(17.958 0)">
                    <path
                      d="M35.992,14.731V10.305a7.745,7.745,0,0,0-5-7.225,2.629,2.629,0,0,0,.053-.515,2.566,2.566,0,1,0-5.132,0,2.747,2.747,0,0,0,.049.5,7.508,7.508,0,0,0-5,7.078v4.587a.3.3,0,0,1-.3.3,2.7,2.7,0,0,0-2.7,2.374,2.631,2.631,0,0,0,2.619,2.885h4.531a3.379,3.379,0,0,0,6.717,0h4.531A2.631,2.631,0,0,0,38.986,17.4a2.7,2.7,0,0,0-2.7-2.374A.3.3,0,0,1,35.992,14.731ZM28.478,1.5a1.065,1.065,0,0,1,1.063,1.063.918.918,0,0,1-.015.143,6.658,6.658,0,0,0-.774-.071,7.741,7.741,0,0,0-1.322.075.919.919,0,0,1-.015-.143A1.066,1.066,0,0,1,28.478,1.5Zm0,20.287a1.885,1.885,0,0,1-1.841-1.5h3.682A1.885,1.885,0,0,1,28.478,21.79Zm9.013-4.245a1.123,1.123,0,0,1-1.123,1.24H20.588a1.129,1.129,0,0,1-1.123-1.24,1.181,1.181,0,0,1,1.2-1.014,1.8,1.8,0,0,0,1.8-1.8V10.144a6.014,6.014,0,0,1,6.011-6.011c.075,0,.146,0,.222,0a6.147,6.147,0,0,1,5.789,6.169v4.426a1.8,1.8,0,0,0,1.8,1.8A1.184,1.184,0,0,1,37.491,17.545Z"
                      transform="translate(-17.958 0)"
                      fill="#172554"
                      stroke="#fff7ed"
                      strokeWidth="0.3"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div> */}
        </div>
      </>
    </>
  );
};

export default AdminInfoHeader;
