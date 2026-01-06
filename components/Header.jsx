import {
  faAngleDown,
  faArrowRightFromBracket,
  faUserCircle,
  faWallet
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import { Fragment, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import WalletConnectButton from "@/components/WalletConnectButton/index.jsx";
import { useSidebar } from "@/context/sidebarContext";
import NotificationDropdown from "./NotificationDropdown";
import { initSocket  } from "../utils/socket";

const Header = ({ cart, addToCart  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("CAD");
  const [selectedImage, setSelectedImage] = useState("/assets/header/CA.png");
  const [myAccount, setMyAccount] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(/* your disabling logic here */);
  const [connectedWallet, setConnectedWallet] = React.useState(null);

  const [fashion, setFashion] = useState(false);
  const [jewellery, setJewellery] = useState(false);
  const [home, setHome] = useState(false);
  const [toys, setToys] = useState(false);
  const [art, setArt] = useState(false);
  const [stationary, setStationary] = useState(false);
  const [care, setCare] = useState(false);
  const [bypassingThirdWeb, setBypassingThirdWeb] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const router = useRouter();
  const path = router.pathname;


  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let socket = initSocket(userId);
    // Join personal room
    socket.emit("join", { userId });

    // Get initial unread count
    socket.emit("get_unread_total", { userId }, (res) => {
      if (res?.total !== undefined) setUnread(res.total);
    });

    // Listen for live updates
    socket.on("unread_total", ({ total }) => {
      setUnread(total);
    });

    return () => {
      socket.off("unread_total");
    };
  }, [userId]);

  useEffect(() => {
    const isBypass = JSON.parse(localStorage.getItem("bypassthirdweb"));
    if (isBypass) setBypassingThirdWeb(true);

    const isThirdWeb = localStorage.getItem("thirdweb:active-wallet-id");

    if(connectedWallet || isThirdWeb) setBypassingThirdWeb(false);
  }, [connectedWallet])

  useEffect(() => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    let decoded = {}
    if(userData && userData.accessToken){
      try{
        decoded = jwt.verify(userData.accessToken, process.env.NEXT_PUBLIC_ACCESS_KEY);
      }catch(err){
        clearThirdWebAuthTokens()
        window.location.href = "/sign-in"
      }
    }
    if (router.isReady && userData) {
      setMyAccount(true);
      setUserId(userData.userId);
      setUserRole(decoded.role);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router.isReady]);

  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      const encodedSearch = encodeURIComponent(searchValue.trim());
      router.push(`/search?q=${encodedSearch}&ref=search_bar`);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const onLogOutClick = async () => {
    clearThirdWebAuthTokens();
    window.location.href = "/";
  };

  return (
    <>
      {!connectedWallet ? (<WalletConnectButton className={"nabeel"} setConnectedWallet={setConnectedWallet}/>) : ""}
      <section className="lg:hidden headerr">
        <div className="max-w-scree-xl mx-auto px-4 py-4 ">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Image
                  src={
                    "/assets/AFOMA New Logo (940 x 300 px).png"
                  }
                  alt="AFOMA_Marketplace"
                  width={105}
                  height={18}
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="flex gap-3 items-center ">
              <div className={` md:flex  w-[300px] hidden `}>
                <input
                  type="text"
                  placeholder=" Find your unique creation here!"
                  className={`text-slate-600 py-3 w-full px-5 rounded-tl focus:ring-zinc-200   focus:border-zinc-200 rounded-bl border border-zinc-200 lg:width-[338px] xl:w-[438px] text-sm bg-white `}
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <div
                  className={`bg-primary p-3 -ml-1 rounded-tr rounded-br `}
                  onClick={handleSearch}
                  style={{ cursor: "pointer" }}
                >
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
              </div>
              <div className="hidden md:block">
                {/* <Link href="#" className="buttonprimarytwo">
                  Connect Wallet
                </Link> */}
                <Link
                  href={isDisabled ? null : ""}
                  title={isDisabled ? "" : "Coming soon..."}
                  className={`text-primary ease-in transition-colors  disabled:cursor-progress rounded-sm  text-sm font-medium py-2.5 px-3 border border-primary opacity-50  ${isDisabled}`}
                >
                  Connect Wallet
                </Link>
              </div>

              <div className="flex gap-2 xl:gap-3 items-center">
                {!loading && userId ? (
                  <div>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center  text-blue-950 text-sm font-medium ">
                          Account
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="ml-2 h-4 w-3 text-blue-950 hover:text-blue-950 "
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition as={Fragment}>
                        <Menu.Items className="absolute mt-2 right-0 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                          <div className="px-3 py-1">
                            <Menu.Item>
                              <button className="text-blue-950 relative hover:opacity-50 hover:cursor-not-allowed">
                                <div className="flex gap-2 flex-row items-center">
                                  <FontAwesomeIcon
                                    icon={faUserCircle}
                                    size="xl"
                                  />
                                  <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm hover:text-primary">
                                    My Menu
                                  </p>
                                </div>
                                {userRole === "customer" && (
                                  <Link href={`/my-account/account-details`}
                                    onClick={() => setSidebarOpen(true)}>
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                                {userRole === "seller" && (
                                  <Link
                                    href={
                                      "/seller/dashboard"
                                    }
                                    onClick={() => setSidebarOpen(true)}
                                  >
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                                {userRole === "admin" && (
                                  <Link href={"/admin/dashboard"}
                                    onClick={() => setSidebarOpen(true)}>
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                                {userRole === "affiliate" && (
                                  <Link href={"/affiliate/dashboard"}
                                    onClick={() => setSidebarOpen(true)}>
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                              </button>
                            </Menu.Item>
                            <Menu.Item>
                              
                              <button className="text-blue-950 relative hover:opacity-50" onClick={()=>{
                               document.querySelector('.nabeel')?.click();
                               }}>
                                <div className="flex gap-2 flex-row items-center">
                                  <FontAwesomeIcon
                                    icon={faWallet}
                                    size="xl"
                                  />
                                  <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-1 py-2 text-sm hover:text-primary">
                                    {!bypassingThirdWeb ? "My Wallet": "Wallet Sign-In"}

                                    <WalletConnectButton className={"nabeel"} setConnectedWallet={setConnectedWallet}/>
                                   
                                  </p>
                                </div>
                              </button>
                            </Menu.Item>
                            <Menu.Item>
                              <button className="text-blue-950 relative hover:opacity-50 hover:cursor-not-allowed">
                                <div
                                  className={`${
                                    path.includes("/logout") ? "" : ""
                                  }`}
                                >
                                  <button
                                    onClick={onLogOutClick}
                                    className="flex items-center gap-2"
                                  >
                                    <FontAwesomeIcon
                                      icon={faArrowRightFromBracket}
                                      size="xl"
                                    />

                                    <span className=" group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm ">
                                      Logout
                                    </span>
                                  </button>
                                </div>
                              </button>
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div>
                    <Link
                      className="flex items-center  text-blue-950 text-sm font-medium "
                      href="/sign-in"
                    >
                      Sign in / Register
                    </Link>
                  </div>
                )}
              </div>

              {/* <Link
                href={isDisabled ? null : ""}
                className={`relative opacity-50 ${isDisabled}`}
                title="Coming soon..."
              >
                <svg
                  id="shopping-cart"
                  xmlns="http://www.w3.org/2000/svg"
                  width="23.273"
                  height="20.455"
                  viewBox="0 0 23.273 20.455"
                >
                  <path
                    id="Path_2297"
                    data-name="Path 2297"
                    d="M7.5,13.637H19.864a.682.682,0,0,0,.656-.495L23.247,3.6a.682.682,0,0,0-.656-.869H5.926L5.438.534A.682.682,0,0,0,4.773,0H.682a.682.682,0,0,0,0,1.364H4.226L6.688,12.442A2.045,2.045,0,0,0,7.5,16.364H19.864a.682.682,0,1,0,0-1.364H7.5a.682.682,0,0,1,0-1.363ZM21.687,4.091,19.35,12.273H8.047L6.229,4.091Zm0,0"
                    transform="translate(0 0)"
                    fill="#172554"
                  />
                  <path
                    id="Path_2298"
                    data-name="Path 2298"
                    d="M150,362.046A2.046,2.046,0,1,0,152.046,360,2.048,2.048,0,0,0,150,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,152.046,361.364Zm0,0"
                    transform="translate(-143.182 -343.636)"
                    fill="#172554"
                  />
                  <path
                    id="Path_2299"
                    data-name="Path 2299"
                    d="M362,362.046A2.046,2.046,0,1,0,364.046,360,2.048,2.048,0,0,0,362,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,364.046,361.364Zm0,0"
                    transform="translate(-345.545 -343.636)"
                    fill="#172554"
                  />
                </svg>
                {Object.keys(cart).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white h-4 w-4 rounded-full flex items-center justify-center p-1.5 text-xs">
                    {Object.keys(cart).length}
                  </span>
                )}
              </Link> */}

              <div>
                <div className="flex items-center justify-between py-2.5 ">
                  <button onClick={() => setIsOpen((prev) => !prev)}>
                    <span
                      className={`block h-[2px] w-6 bg-slate-950 rounded-sm transition-all ease-in-out duration-100 ${
                        isOpen && "relative rotate-45 top-[6px]"
                      }`}
                    ></span>
                    <span
                      className={`block h-[2px] w-6 bg-slate-950 rounded-sm transition-all ease-in-out duration-100 my-1 ${
                        isOpen && "opacity-0"
                      }`}
                    ></span>
                    <span
                      className={`block h-[2px] w-6 bg-slate-950 rounded-sm transition-all ease-in-out duration-100 ${
                        isOpen && "relative -rotate-45 bottom-[6px]"
                      }`}
                    ></span>
                  </button>
                </div>
                <div>
                  <div
                    className={`fixed z-50 top-0 h-screen bottom-0  py-6 left-0 w-full bg-orange-50 font-medium transition-all ease-in-out delay-100 duration-500 overflow-x-hidden px-5   text-slate-950 ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                  >
                    <div className="flex items-center justify-end py-2.5 ">
                      <button onClick={() => setIsOpen((prev) => !prev)}>
                        <span
                          className={`block h-[2px] w-6 bg-slate-950 rounded-sm transition-all ease-in-out duration-100 ${
                            isOpen && "relative rotate-45 top-[6px]"
                          }`}
                        ></span>
                        <span
                          className={`block h-[2px] w-6 bg-slate-950 rounded-sm transition-all ease-in-out duration-100 my-1 ${
                            isOpen && "opacity-0"
                          }`}
                        ></span>
                        <span
                          className={`block h-[2px] w-6 bg-slate-950 rounded-sm transition-all ease-in-out duration-100 ${
                            isOpen && "relative -rotate-45 bottom-[6px]"
                          }`}
                        ></span>
                      </button>
                    </div>
                    <ul className="flex flex-col gap-5 py-5 border-b border-gray-500/30 mb-6">
                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(!fashion);
                            setJewellery(false);
                            setHome(false);
                            setToys(false);
                            setArt(false);
                            setStationary(false);
                            setCare(false);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link href={"/category/fashion"} onClick={() => setIsOpen((prev) => !prev)}>Fashion</Link>
                          </p>
                          <div className="shrink-0 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={fashion ? "-rotate-180" : "rotate-0"}
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          className={`${
                            fashion ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link href={"/category/fashion/for-men"}>
                                For Men
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link href={"/category/fashion/for-women"}>
                                For Women
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link href={"/category/fashion/for-kids"}>
                                For Kids
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link href={"/category/fashion/for-unisex"}>
                                For Unisex
                              </Link>
                            </p>
                          </div>
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/fashion"> Fashion</Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/fashion">
                                    Men’s Clothing
                                  </Link>
                                </p>

                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/fashion">
                                    Women’s Clothing
                                  </Link>
                                </p>

                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/fashion">
                                    Kid&apos;s Clothing
                                  </Link>
                                </p>

                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}

                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(false);
                            setJewellery(!jewellery);
                            setHome(false);
                            setToys(false);
                            setArt(false);
                            setStationary(false);
                            setCare(false);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link href={"/category/jewelry-and-accessories"} onClick={() => setIsOpen((prev) => !prev)}>
                              Jewelry & Accessories
                            </Link>
                          </p>
                          <div className="shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={jewellery ? "-rotate-180" : "rotate-0"}
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          className={`${
                            jewellery ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/jewelry-and-accessories/necklaces-and-pendants"
                                }
                              >
                                {" "}
                                Necklaces & Pendants
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/jewelry-and-accessories/earrings"
                                }
                              >
                                Earrings
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/jewelry-and-accessories/bracelets-and-bangles"
                                }
                              >
                                {" "}
                                Bracelets & Bangles
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={"/category/jewelry-and-accessories/rings"}
                              >
                                Rings
                              </Link>
                            </p>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/jewelry-and-accessories/handbags-and-purses"
                                }
                              >
                                {" "}
                                Handbags & Purses
                              </Link>
                            </p>
                          </div>
                          {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/jewelry-and-accessories/hats-and-headpieces"
                                }
                              >
                                Hats & Headpieces
                              </Link>
                            </p>
                          </div> */}
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/jewelry-and-accessories/brooches-and-pins"
                                }
                              >
                                {" "}
                                Brooches & Pins
                              </Link>
                            </p>
                          </div>
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/jewelry-and-accessories">
                                Jewelery & Accessories
                              </Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/jewelry-and-accessories">
                                    {" "}
                                    Necklaces & Pendants
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/jewelry-and-accessories">
                                    Earrings
                                  </Link>
                                </p>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/jewelry-and-accessories">
                                    {" "}
                                    Bracelets & Bangles
                                  </Link>
                                </p>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/jewelry-and-accessories">
                                    Rings
                                  </Link>
                                </p>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/jewelry-and-accessories">
                                    {" "}
                                    Handbags & Purses
                                  </Link>
                                </p>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/jewelry-and-accessories">
                                    Hats & Headpieces
                                  </Link>
                                </p>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}

                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(false);
                            setJewellery(false);
                            setHome(!home);
                            setToys(false);
                            setArt(false);
                            setStationary(false);
                            setCare(false);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link href={"/category/home-and-living"} onClick={() => setIsOpen((prev) => !prev)}>
                              Home & Living
                            </Link>
                          </p>
                          <div className="shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={home ? "-rotate-180" : "rotate-0"}
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          className={`${
                            home ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/home-and-living/handcrafted-decor"
                                }
                              >
                                Handcrafted Decor
                              </Link>
                            </p>
                            {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/home-and-living/handcrafted-decor/ceramics-and-pottery"
                                  }
                                >
                                  Ceramics & Pottery
                                </Link>
                              </p>
                              <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/handcrafted-decor/wooden-artifacts"
                                    }
                                  >
                                    Wooden Artifacts
                                  </Link>
                                </p>
                              </div>
                              <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/handcrafted-decor/sculptures-and-figurines"
                                    }
                                  >
                                    Sculptures & Figurines
                                  </Link>
                                </p>
                              </div>
                              <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/handcrafted-decor/metal-work"
                                    }
                                  >
                                    Metal Work
                                  </Link>
                                </p>
                              </div>
                            </div> */}
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={"/category/home-and-living/home-decor"}
                              >
                                Home Decor
                              </Link>
                            </p>
                            <div onClick={() => setIsOpen((prev) => !prev)}>
                              {/* <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4 ">
                                <Link
                                  href={
                                    "/category/home-and-living/home-decor/cushions-and-throws"
                                  }
                                >
                                  Cushions & Throws
                                </Link>
                              </p> */}
                              {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/home-decor/wall-art"
                                    }
                                  >
                                    Wall Art
                                  </Link>
                                </p>
                              </div> */}
                              {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/home-decor/candles-and-candle-holders"
                                    }
                                  >
                                    {" "}
                                    Candles & Candle Holders
                                  </Link>
                                </p>
                              </div> */}
                              {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/home-decor/tabletop-decor"
                                    }
                                  >
                                    Tabletop Decor
                                  </Link>
                                </p>
                              </div> */}
                              {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                                <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                  <Link
                                    href={
                                      "/category/home-and-living/home-decor/planters-vases"
                                    }
                                  >
                                    Planters & Vases
                                  </Link>
                                </p>
                              </div> */}
                            </div>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/home-and-living/food-and-related"
                                }
                              >
                                Food & Related
                              </Link>
                            </p>
                            {/* <div onClick={() => setIsOpen((prev) => !prev)}>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4 ">
                                <Link
                                  href={
                                    "/category/home-and-living/food-and-related/tea-coffee-condiments-and-spices"
                                  }
                                >
                                  Tea, Coffee, Condiments & Spices
                                </Link>
                              </p>
                            </div> */}
                          </div>
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/home-and-living">
                                Home & Living
                              </Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/home-and-living">
                                    Handcrafted Decor
                                  </Link>
                                </p>
                                <div>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living">
                                      Ceramics & Pottery
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living">
                                      Wooden Artifacts
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living">
                                      Sculptures & Figurines
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living">
                                      Metal Work
                                    </Link>
                                  </p>

                                </div>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/home-and-living#homedecor">
                                    Home Decor
                                  </Link>
                                </p>
                                <div>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4 ">
                                    <Link href="/category/home-and-living#homedecor">
                                      Cushions & Throws
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living#homedecor">
                                      Wall Art
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living#homedecor">
                                      {" "}
                                      Candles & Candle Holders
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living#homedecor">
                                      Tabletop Decor
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/home-and-living#homedecor">
                                      Planters & Vases
                                    </Link>
                                  </p>

                                </div>
                              </div>

                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}

                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(false);
                            setJewellery(false);
                            setHome(false);
                            setToys(!toys);
                            setArt(false);
                            setStationary(false);
                            setCare(false);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link href={"/category/toys-and-games"} onClick={() => setIsOpen((prev) => !prev)}>
                              Toys & Games
                            </Link>
                          </p>
                          <div className="shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={toys ? "-rotate-180" : "rotate-0"}
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          className={`${
                            toys ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2  text-blue-950 text-sm hover:text-primary">
                              <Link href={"/category/toys-and-games/toys"}>
                                Toys
                              </Link>
                            </p>
                            <div>
                              {/* <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/toys/baby-and-toddler-toys"
                                  }
                                >
                                  Baby & Toddler Toys
                                </Link>
                              </p>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/toys/stuffed-animals-and-plushies"
                                  }
                                >
                                  Stuffed Animals & Plushies
                                </Link>
                              </p>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/toys/learning-and-school"
                                  }
                                >
                                  Learning & School
                                </Link>
                              </p>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/toys/dolls-and-action-figures"
                                  }
                                >
                                  Dolls & Action Figures
                                </Link>
                              </p>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/toys/pet-toys"
                                  }
                                >
                                  Pet Toys
                                </Link>
                              </p>
                            </div>
                          </div>
                          <div onClick={() => setIsOpen((prev) => !prev)}>
                            <p className="pt-3 pl-2  text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/toys-and-games/games-and-puzzles"
                                }
                              >
                                Games & Puzzles
                              </Link>
                            </p>
                            <div>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/games-and-puzzle/board-games"
                                  }
                                >
                                  Board Games
                                </Link>
                              </p>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/toys-and-games/games-and-puzzle/puzzles"
                                  }
                                >
                                  Puzzles
                                </Link>
                              </p> */}
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/toys-and-games">
                                Toys & Games
                              </Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2  text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/toys-and-games">
                                    Toys
                                  </Link>
                                </p>
                                <div>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games">
                                      Baby & Toddler Toys
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games">
                                      Stuffed Animals & Plushies
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games">
                                      Learning & School
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games">
                                      Dolls & Action Figures
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games">
                                      Pet Toys
                                    </Link>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="pt-3 pl-2  text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/toys-and-games#games">
                                    Games & Puzzles
                                  </Link>
                                </p>
                                <div>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games#games">
                                      Board Games
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/toys-and-games#games">
                                      Puzzles
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}

                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(false);
                            setJewellery(false);
                            setHome(false);
                            setToys(false);
                            setArt(!art);
                            setStationary(false);
                            setCare(false);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link href={"/category/art-and-collectibles"} onClick={() => setIsOpen((prev) => !prev)}>
                              Art & Collectibles
                            </Link>
                          </p>
                          <div className="shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={art ? "-rotate-180" : "rotate-0"}
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          onClick={() => setIsOpen((prev) => !prev)}
                          className={`${
                            art ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/paintings"
                                }
                              >
                                {" "}
                                Paintings
                              </Link>
                            </p>
                          </div>
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/drawings-and-illustrations"
                                }
                              >
                                {" "}
                                Drawings & Illustrations
                              </Link>
                            </p>
                          </div> */}

                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/digital-art"
                                }
                              >
                                Digital Art
                              </Link>
                            </p>
                          </div>
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/photography"
                                }
                              >
                                Photography
                              </Link>
                            </p>
                          </div>
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/textile-and-fiber-art"
                                }
                              >
                                Textile & Fiber Art
                              </Link>
                            </p>
                          </div>
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={"/category/art-and-collectibles/standees"}
                              >
                                Standees
                              </Link>
                            </p>
                          </div> */}
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/keychains"
                                }
                              >
                                Keychains
                              </Link>
                            </p>
                          </div>
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={"/category/art-and-collectibles/charms"}
                              >
                                Charms
                              </Link>
                            </p>
                          </div>
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={"/category/art-and-collectibles/prints"}
                              >
                                Prints
                              </Link>
                            </p>
                          </div> */}
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/art-and-collectibles">
                                Art & Collectibles
                              </Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/art-and-collectibles">
                                    {" "}
                                    Paintings
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/art-and-collectibles">
                                    {" "}
                                    Drawings & Illustrations
                                  </Link>
                                </p>
                              </div>

                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/art-and-collectibles">
                                    Digital Art
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/art-and-collectibles">
                                    Photography
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/art-and-collectibles">
                                    Textile & Fiber Art
                                  </Link>
                                </p>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}

                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(false);
                            setJewellery(false);
                            setHome(false);
                            setToys(false);
                            setArt(false);
                            setStationary(!stationary);
                            setCare(false);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link
                              href={
                                "/category/stationery-and-paper-goods"
                              } onClick={() => setIsOpen((prev) => !prev)}
                            >
                              Stationery & Paper Goods
                            </Link>
                          </p>
                          <div className="shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={
                                stationary ? "-rotate-180" : "rotate-0"
                              }
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          onClick={() => setIsOpen((prev) => !prev)}
                          className={`${
                            stationary ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/notebooks-and-journals"
                                }
                              >
                                Notebooks & Journals
                              </Link>
                            </p>
                          </div>
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/greeting-cards"
                                }
                              >
                                Greeting Cards
                              </Link>
                            </p>
                          </div>

                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/stickers-and-labels"
                                }
                              >
                                Stickers & Labels
                              </Link>
                            </p>
                          </div>
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/paper-art-and-prints"
                                }
                              >
                                Paper Art and Prints
                              </Link>
                            </p>
                          </div> */}
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/art-and-collectibles/colouring-books"
                                }
                              >
                                {" "}
                                Colouring Books
                              </Link>
                            </p>
                          </div> */}
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/stationery-and-paper-goods">
                                Stationery & Paper Goods
                              </Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/stationery-and-paper-goods">
                                    Notebooks & Journals
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/stationery-and-paper-goods">
                                    Greeting Cards
                                  </Link>
                                </p>
                              </div>

                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/stationery-and-paper-goods">
                                    Stickers & Labels
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/stationery-and-paper-goods">
                                    Paper Art and Prints
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/stationery-and-paper-goods">
                                    {" "}
                                    Colouring Books
                                  </Link>
                                </p>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}

                      <li>
                        <div
                          className="flex gap-2 items-center "
                          onClick={() => {
                            setFashion(false);
                            setJewellery(false);
                            setHome(false);
                            setToys(false);
                            setArt(false);
                            setStationary(false);
                            setCare(!care);
                          }}
                        >
                          <p className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                            <Link
                              href={"/category/personal-care-and-bath-products"} onClick={() => setIsOpen((prev) => !prev)}
                            >
                              Personal Care & Bath Products
                            </Link>
                          </p>
                          <div className="shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.381"
                              height="8.152"
                              viewBox="0 0 14.381 8.152"
                              className={care ? "-rotate-180" : "rotate-0"}
                            >
                              <path
                                id="FAQ_dropdown_icon"
                                data-name="FAQ dropdown icon"
                                d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                transform="translate(-19.625 -39.625)"
                                fill="#172554"
                                stroke="#172554"
                                strokeWidth="0.75"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          onClick={() => setIsOpen((prev) => !prev)}
                          className={`${
                            care ? "h-fit" : "h-0"
                          }  overflow-hidden transition-all ease-in-out`}
                        >
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/bath-bombs"
                                }
                              >
                                {" "}
                                Bath Bombs
                              </Link>
                            </p>
                          </div> */}
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/handmade-soap"
                                }
                              >
                                Handmade Soap
                              </Link>
                            </p>
                          </div>

                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/body-scrubs"
                                }
                              >
                                Body Scrubs
                              </Link>
                            </p>
                          </div> */}
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/bath-soaks-and-salts"
                                }
                              >
                                Bath Soaks & Salts
                              </Link>
                            </p>
                          </div> */}
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/lotions-and-body-butters"
                                }
                              >
                                Lotions & Body Butters
                              </Link>
                            </p>
                          </div>
                          <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/oils"
                                }
                              >
                                Oils
                              </Link>
                            </p>
                            <div>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/personal-care-and-bath-products/body-oils"
                                  }
                                >
                                  Body Oils
                                </Link>
                              </p>
                              {/* <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/personal-care-and-bath-products/bath-bombs"
                                  }
                                >
                                  Bath Oils
                                </Link>
                              </p> */}
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/personal-care-and-bath-products/hair-oils"
                                  }
                                >
                                  Hair Oils
                                </Link>
                              </p>
                              {/* <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/personal-care-and-bath-products/massage-oils"
                                  }
                                >
                                  Massage Oils
                                </Link>
                              </p> */}
                            </div>
                          </div>
                          {/* <div>
                            <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                              <Link
                                href={
                                  "/category/personal-care-and-bath-products/baby-and-child-care"
                                }
                              >
                                Baby & Child Care
                              </Link>
                            </p>
                            <div>
                              <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                <Link
                                  href={
                                    "/category/personal-care-and-bath-products/teething"
                                  }
                                >
                                  Teething
                                </Link>
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </li>

                      {/* <li>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="text-blue-950 font-medium text-base flex gap-2 items-center hover:text-primary">
                              <Link href="/category/personal-care-and-bath-products">
                                Personal Care & Bath Products
                              </Link>
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={` hover:text-primary${
                                  open ? "rotate-180 transform" : ""
                                } h-4 w-4 text-blue-950`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    {" "}
                                    Bath Bombs
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    Handmade Soap
                                  </Link>
                                </p>
                              </div>

                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    Body Scrubs
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    Bath Soaks & Salts
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    Lotions & Body Butters
                                  </Link>
                                </p>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    Oils
                                  </Link>
                                </p>
                                <div>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/personal-care-and-bath-products">
                                      Body Oils
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/personal-care-and-bath-products">
                                      Bath Oils
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/personal-care-and-bath-products">
                                      Hair Oils
                                    </Link>
                                  </p>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/personal-care-and-bath-products">
                                      Massage Oils
                                    </Link>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="pt-3 pl-2 text-blue-950 text-sm hover:text-primary">
                                  <Link href="/category/personal-care-and-bath-products">
                                    Baby & Child Care
                                  </Link>
                                </p>
                                <div>
                                  <p className="text-slate-600 text-sm pt-2 hover:text-primary pl-4">
                                    <Link href="/category/personal-care-and-bath-products">
                                      Teething
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </li> */}
                    </ul>

                    {/* <p className="text-blue-950 font-medium mb-5">
                    <Link href="/my-account/wish-list">Wishlist</Link>
                  </p> */}
                    <p className="text-blue-950 font-medium mb-5 ">
                      <Link
                        // href="/my-account/wish-list"
                        href={isDisabled ? null : "#"}
                        title={isDisabled ? "" : "Coming soon..."}
                        className={`opacity-50 ${
                          isDisabled ? "cursor-not-allowed" : ""
                        }`}
                        disabled={isDisabled}
                      >
                        Wishlist
                      </Link>
                    </p>

                    <p className="text-blue-950 font-medium mb-5">
                      <Link href="/blogs">Blogs</Link>
                    </p>

                    <div className="flex items-center gap-1 mb-5">
                      {!loading && userId ? (
                        <div>
                          <button className="text-blue-950 relative">
                            <FontAwesomeIcon icon={faUserCircle} size="xl" />
                            {userRole === "customer" && (
                              <Link href={`/my-account/account-details`}>
                                <span className="absolute top-0 left-0 h-full w-full"></span>
                              </Link>
                            )}
                            {userRole === "seller" && (
                              <Link
                                href={
                                  "/seller/my-account/basic-information/view"
                                }
                              >
                                <span className="absolute top-0 left-0 h-full w-full"></span>
                              </Link>
                            )}
                            {userRole === "admin" && (
                              <Link href={"/admin/product"}>
                                <span className="absolute top-0 left-0 h-full w-full"></span>
                              </Link>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Link
                            className="flex items-center  text-blue-950 text-sm font-medium"
                            href="/sign-in"
                          >
                            Sign in / Register
                          </Link>
                        </div>
                      )}

                      {/* {!loading && userId ? (
                      <div>
                        <button
                          className="text-blue-950 relative "
                          title="Coming soon..."
                        >
                          <FontAwesomeIcon icon={faUserCircle} size="xl" />
                          {userRole === "customer" && (
                            <Link href={`/my-account/account-details`}>
                              <span className="absolute top-0 left-0 h-full w-full"></span>
                            </Link>
                          )}
                          {userRole === "seller" && (
                            <Link href={"/seller/my-account/basic-information/view"}>
                              <span className="absolute top-0 left-0 h-full w-full"></span>
                            </Link>
                          )}
                          {userRole === "admin" && (
                            <Link href={"/admin/product"}>
                              <span className="absolute top-0 left-0 h-full w-full"></span>
                            </Link>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button
                              className={`flex items-center text-blue-950 text-sm font-medium opacity-50 ${
                                loading || !userId
                                  ? "hover: hover:cursor-not-allowed"
                                  : "cursor-pointer "
                              }`}
                              disabled={loading || !userId}
                              title={loading || !userId ? "Coming soon..." : ""}
                            >
                              Sign in / Register
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className="ml-2 h-4 w-3 text-blue-950 hover:text-blue-950 "
                                aria-hidden="true"
                              />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            // ... (rest of your Transition properties)
                          >
                            <Menu.Items className="absolute mt-2 right-0 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                              <div className="px-1 py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href="/sign-in"
                                      className={`group flex w-full items-center gap-2 text-blue-950 hover:text-primary font-medium rounded-md px-2 py-2 text-sm`}
                                    >
                                      Sign in / Register
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href="/register"
                                      className={`group flex w-full hover:text-primary items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                    >
                                      Register as Customer
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href="/join-as-a-seller"
                                      className={`group hover:text-primary flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                    >
                                      Register as Seller
                                    </Link>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    )} */}
                    </div>

                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        {/* <Menu.Button className="flex items-center gap-2 text-blue-950 text-sm font-medium">
                        <Image
                          src={selectedImage}
                          alt={selectedValue}
                          width={24}
                          height={24}
                        />
                        {selectedValue}
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                          aria-hidden="true"
                        />
                      </Menu.Button> */}
                        <Menu.Button
                          className={`flex items-center gap-2 text-blue-950 text-sm font-medium  opacity-50 ${
                            isDisabled ? "cursor-not-allowed " : ""
                          }`}
                          disabled={isDisabled}
                          title={isDisabled ? "" : "Coming soon..."}
                        >
                          <Image
                            src={selectedImage}
                            alt={selectedValue || "Afoma_Marketplace"}
                            width={24}
                            height={24}
                            loading="lazy"
                          />
                          {selectedValue}
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      {!isDisabled ? null : (
                        <Transition
                          as={Fragment}
                          // ... (rest of your Transition properties)
                        >
                          <Menu.Items className="absolute mt-2  w-40 origin-top-right bottom-8 divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                            <div className="px-1 py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "Ind",
                                        "/assets/header/IN.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/IN.png"}
                                      alt="India"
                                      width={24}
                                      height={24}
                                      loading="lazy"
                                    />
                                    Ind
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "US",
                                        "/assets/header/US.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/US.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                      loading="lazy"
                                    />
                                    US
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      )}
                    </Menu>

                    <div className="mt-9 md:hidden">
                      {/* <Link href="#" className="buttonprimarytwo">
                      Connect Wallet
                    </Link> */}
                      <Link
                        href={isDisabled ? null : ""}
                        title={isDisabled ? "" : "Coming soon..."}
                        className={`text-primary ease-in transition-colors  disabled:cursor-progress rounded-sm  text-sm font-medium py-2.5 px-3 border border-primary opacity-50  ${isDisabled}`}
                      >
                        Connect Wallet
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`w-full flex items-center justify-start gap-4 pt-4 md:hidden`}>
            {/* Notification Icon */}
            {!loading && userId ? (
                <div className="relative w-6 h-8 flex items-center justify-center">
      <NotificationDropdown addToCart={addToCart} cart={cart} />
    </div>
            ) : ""}

            <Link href="/cart" className="relative">
              <svg
                id="shopping-cart"
                xmlns="http://www.w3.org/2000/svg"
                width="23.273"
                height="20.455"
                viewBox="0 0 23.273 20.455"
              >
                <path
                  id="Path_2297"
                  data-name="Path 2297"
                  d="M7.5,13.637H19.864a.682.682,0,0,0,.656-.495L23.247,3.6a.682.682,0,0,0-.656-.869H5.926L5.438.534A.682.682,0,0,0,4.773,0H.682a.682.682,0,0,0,0,1.364H4.226L6.688,12.442A2.045,2.045,0,0,0,7.5,16.364H19.864a.682.682,0,1,0,0-1.364H7.5a.682.682,0,0,1,0-1.363ZM21.687,4.091,19.35,12.273H8.047L6.229,4.091Zm0,0"
                  transform="translate(0 0)"
                  fill="#172554"
                />
                <path
                  id="Path_2298"
                  data-name="Path 2298"
                  d="M150,362.046A2.046,2.046,0,1,0,152.046,360,2.048,2.048,0,0,0,150,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,152.046,361.364Zm0,0"
                  transform="translate(-143.182 -343.636)"
                  fill="#172554"
                />
                <path
                  id="Path_2299"
                  data-name="Path 2299"
                  d="M362,362.046A2.046,2.046,0,1,0,364.046,360,2.048,2.048,0,0,0,362,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,364.046,361.364Zm0,0"
                  transform="translate(-345.545 -343.636)"
                  fill="#172554"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white h-4 w-4 rounded-full flex items-center justify-center p-1.5 text-xs">
                {Object.keys(cart || {}).length}
              </span>
            </Link>
            {!loading && userId ? (
              <Link href="/chat" className="relative" title="Chats">
               <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="22" 
                  viewBox="0 0 24 22" 
                  fill="none"
                >
                  <path 
                    d="M2 3H22C22.5523 3 23 3.44772 23 4V18C23 18.5523 22.5523 19 22 19H2C1.44772 19 1 18.5523 1 18V4C1 3.44772 1.44772 3 2 3Z" 
                    stroke="#172554" 
                    stroke-width="2"
                  />
                  <path 
                    d="M2 4L12 11L22 4" 
                    stroke="#172554" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  />
                </svg>

                {unread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white h-4 w-4 rounded-full flex items-center justify-center p-1.5 text-xs">
                    {unread}
                  </span>
                )}
              </Link>
            ) : ""}
          </div>
          <div className={`w-full flex  pt-4 md:hidden`}>
            <input
              type="text"
              placeholder=" Find your unique creation here!"
              className={`text-slate-600 py-3 w-full px-5 rounded-tl focus:ring-zinc-200   focus:border-zinc-200 rounded-bl border border-zinc-200 lg:width-[338px] xl:w-[438px] text-sm bg-white `}
              value={searchValue}
              onChange={handleInputChange}
            />
            <div
              className={`bg-primary p-3 -ml-1 rounded-tr rounded-br `}
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            >
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
          </div>
        </div>
      </section>

      <section className="hidden lg:block headerr">
        <div>
          <div className="max-w-screen-xl mx-auto px-4 py-7">
            <div className="flex lg:gap-3  xl:gap-8 items-center justify-between">
              <Link href="/">
                <Image
                  src={
                    "/assets/AFOMA New Logo (940 x 300 px).png"
                  }
                  alt="AFOMA_Marketplace"
                  width={209}
                  height={35}
                  loading="lazy"
                />
              </Link>

              {/* <div className="xl:w-[458px] flex">
                <input
                  type="text"
                  placeholder=" Find your unique creation here!"
                  className="text-slate-600 py-3 px-5 rounded-tl rounded-bl border border-zinc-200 lg:width-[338px] xl:w-[438px] text-sm bg-white"
                ></input>

                <div className="bg-primary p-3 -ml-1 rounded-tr rounded-br">
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
              </div> */}
              <div className={`xl:w-[448px] flex`}>
                <input
                  type="text"
                  placeholder=" Find your unique creation here!"
                  className={`text-slate-600 py-3 px-5 rounded-tl focus:ring-zinc-200   focus:border-zinc-200 rounded-bl border border-zinc-200 lg:width-[48px] xl:w-[438px] text-sm bg-white `}
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <div
                  className={`bg-primary p-3 -ml-1 rounded-tr rounded-br `}
                  onClick={handleSearch}
                  style={{ cursor: "pointer" }}
                >
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
              </div>

              <div className="flex gap-4 xl:gap-6 items-center">
                {!loading && userId ? (
                  <div>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center  text-blue-950 text-sm font-medium ">
                          Account
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="ml-2 h-4 w-3 text-blue-950 hover:text-blue-950 "
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition as={Fragment}>
                        <Menu.Items className="absolute mt-2 right-0 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                          <div className="px-3 py-1">
                            <Menu.Item>
                              <button className="text-blue-950 relative hover:opacity-50 hover:cursor-not-allowed">
                                <div className="flex gap-2 flex-row items-center">
                                  <FontAwesomeIcon
                                    icon={faUserCircle}
                                    size="xl"
                                  />
                                  <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm hover:text-primary">
                                    My Menu
                                  </p>
                                </div>

                                {userRole === "customer" && (
                                  <Link href={`/my-account/account-details`}
                                    onClick={() => setSidebarOpen(true)}>
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                                {userRole === "seller" && (
                                  <Link
                                    href={
                                      "/seller/dashboard"
                                    }
                                    onClick={() => setSidebarOpen(true)}
                                  >
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                                {userRole === "admin" && (
                                  <Link href={"/admin/dashboard"}
                                  onClick={() => setSidebarOpen(true)}>
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                                {userRole === "affiliate" && (
                                  <Link href={"/affiliate/dashboard"}
                                  onClick={() => setSidebarOpen(true)}>
                                    <span className="absolute top-0 left-0 h-full w-full"></span>
                                  </Link>
                                )}
                              </button>
                            </Menu.Item>
                            <Menu.Item>
                              
                              <button className="text-blue-950 relative hover:opacity-50" onClick={()=>{
                               document.querySelector('.nabeel')?.click();
                               }}>
                                <div className="flex gap-2 flex-row items-center">
                                  <FontAwesomeIcon
                                    icon={faWallet}
                                    size="xl"
                                  />
                                  <p className="group flex w-full items-center gap-1 text-blue-950 font-medium rounded-md px-1 py-2 text-sm hover:text-primary">
                                    {!bypassingThirdWeb ? "My Wallet": "Wallet Sign-In"}

                                    <WalletConnectButton className={"nabeel"} setConnectedWallet={setConnectedWallet}/>
                                   
                                  </p>
                                </div>
                              </button>
                            </Menu.Item>
                            <Menu.Item>
                              <button className="text-blue-950 relative hover:opacity-50 hover:cursor-not-allowed">
                                <div
                                  className={`${
                                    path.includes("/logout") ? "" : ""
                                  }`}
                                >
                                  <button
                                    onClick={onLogOutClick}
                                    className="flex items-center gap-2"
                                  >
                                    <FontAwesomeIcon
                                      icon={faArrowRightFromBracket}
                                      size="xl"
                                    />

                                    <span className=" group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm ">
                                      Logout
                                    </span>
                                  </button>
                                </div>
                              </button>
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div>
                    <Link
                      className="flex items-center  text-blue-950 text-sm font-medium "
                      href="/sign-in"
                    >
                      Sign in / Register
                    </Link>
                  </div>
                )}

                <Link href="/blogs">
                  <p className="text-blue-950 text-sm font-medium">Blogs</p>{" "}
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  <div>
                    <div></div>
                  </div>
                  <div>
                    {/* <Menu as="div" className="relative inline-block text-left">
                      <div className="w-[95px]">
                        <Menu.Button className="flex items-center gap-2 text-blue-950 text-sm font-medium">
                          <Image
                            src={selectedImage}
                            alt={selectedValue}
                            width={24}
                            height={24}
                          />
                          {selectedValue}
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                        <Menu.Button
                          className={`flex items-center gap-2 text-blue-950 text-sm font-medium opacity-50 ${
                            isDisabled ? "cursor-not-allowed " : ""
                          }`}
                          disabled={isDisabled}
                          title={isDisabled ? "" : "Coming soon..."}
                        >
                          <Image
                            src={selectedImage}
                            alt={selectedValue}
                            width={24}
                            height={24}
                          />
                          {selectedValue}
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      {!isDisabled ? null : (
                        <Transition as={Fragment}>
                          <Menu.Items className="absolute mt-2 right-0 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                            <div className="px-1 py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "INR",
                                        "/assets/header/IN.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/IN.png"}
                                      alt="India"
                                      width={24}
                                      height={24}
                                    />
                                    INR
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "US",
                                        "/assets/header/US.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/US.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    US
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "EUR",
                                        "/assets/header/EU.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/EU.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    EUR
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "GHS",
                                        "/assets/header/GH.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/GH.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    GHS
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "KES",
                                        "/assets/header/KE.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/KE.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    KES
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "NGN",
                                        "/assets/header/NG.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/NG.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    NGN
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "GBP",
                                        "/assets/header/GB.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/GB.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    GBP
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "CAD",
                                        "/assets/header/CA.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/header/CA.png"}
                                      alt="US"
                                      width={24}
                                      height={24}
                                    />
                                    CAD
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "CAD",
                                        "/assets/homepage/Canada_country.png"
                                      )
                                    }
                                    className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                                  >
                                    <Image
                                      src={"/assets/homepage/Canada_country.png"}
                                      alt="CAD"
                                      width={24}
                                      height={24}
                                    />
                                    CAD
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      )}
                    </Menu> */}
                  </div>
                </div>

                {/* <Link href="/my-account/wish-list">
                  <svg
                    id="like_1_"
                    data-name="like (1)"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.563"
                    height="15.516"
                    viewBox="0 0 17.563 15.516"

                  > */}
                {/* <Link
                  // href="/my-account/wish-list"
                  href={isDisabled ? null : "#"}
                  title={isDisabled ? "" : "Coming soon..."}
                >
                  <svg
                    id="like_1_"
                    data-name="like (1)"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.563"
                    height="15.516"
                    viewBox="0 0 17.563 15.516"
                    className={`opacity-50`}
                    disabled={isDisabled}
                  >
                    <g
                      id="Group_26207"
                      data-name="Group 26207"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Path_2296"
                        data-name="Path 2296"
                        d="M16.281,31.36a4.424,4.424,0,0,0-7.063.508,6.734,6.734,0,0,0-.437.709,6.728,6.728,0,0,0-.437-.709,4.424,4.424,0,0,0-7.063-.508A5.323,5.323,0,0,0,0,34.9a6.519,6.519,0,0,0,1.8,4.277,39.973,39.973,0,0,0,4.494,4.2c.68.579,1.382,1.178,2.131,1.833l.022.02a.515.515,0,0,0,.678,0l.022-.02c.748-.655,1.451-1.254,2.131-1.833a39.968,39.968,0,0,0,4.494-4.2,6.519,6.519,0,0,0,1.8-4.277A5.324,5.324,0,0,0,16.281,31.36ZM10.606,42.589c-.586.5-1.189,1.013-1.825,1.566-.636-.553-1.239-1.066-1.825-1.566C3.387,39.547,1.029,37.538,1.029,34.9a4.3,4.3,0,0,1,1.024-2.855,3.435,3.435,0,0,1,2.612-1.176,3.469,3.469,0,0,1,2.839,1.6,6.1,6.1,0,0,1,.788,1.566.515.515,0,0,0,.978,0,6.1,6.1,0,0,1,.788-1.566,3.4,3.4,0,0,1,5.451-.423A4.3,4.3,0,0,1,16.533,34.9C16.533,37.538,14.175,39.547,10.606,42.589Z"
                        transform="translate(0 -29.836)"
                        fill="#172554"
                      />
                    </g>
                  </svg>
                </Link> */}

                {/* Notification Icon */}
                {!loading && userId ? (
                <NotificationDropdown addToCart={addToCart} cart={cart}></NotificationDropdown>
                ) : ""}

                <Link href="/cart" className="relative">
                  <svg
                    id="shopping-cart"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.273"
                    height="20.455"
                    viewBox="0 0 23.273 20.455"
                  >
                    <path
                      id="Path_2297"
                      data-name="Path 2297"
                      d="M7.5,13.637H19.864a.682.682,0,0,0,.656-.495L23.247,3.6a.682.682,0,0,0-.656-.869H5.926L5.438.534A.682.682,0,0,0,4.773,0H.682a.682.682,0,0,0,0,1.364H4.226L6.688,12.442A2.045,2.045,0,0,0,7.5,16.364H19.864a.682.682,0,1,0,0-1.364H7.5a.682.682,0,0,1,0-1.363ZM21.687,4.091,19.35,12.273H8.047L6.229,4.091Zm0,0"
                      transform="translate(0 0)"
                      fill="#172554"
                    />
                    <path
                      id="Path_2298"
                      data-name="Path 2298"
                      d="M150,362.046A2.046,2.046,0,1,0,152.046,360,2.048,2.048,0,0,0,150,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,152.046,361.364Zm0,0"
                      transform="translate(-143.182 -343.636)"
                      fill="#172554"
                    />
                    <path
                      id="Path_2299"
                      data-name="Path 2299"
                      d="M362,362.046A2.046,2.046,0,1,0,364.046,360,2.048,2.048,0,0,0,362,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,364.046,361.364Zm0,0"
                      transform="translate(-345.545 -343.636)"
                      fill="#172554"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white h-4 w-4 rounded-full flex items-center justify-center p-1.5 text-xs">
                    {Object.keys(cart||{}).length}
                  </span>
                </Link>
                {!loading && userId ? (
                <Link href="/chat" className="relative" title="Chats">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="22" 
                    viewBox="0 0 24 22" 
                    fill="none"
                  >
                    <path 
                      d="M2 3H22C22.5523 3 23 3.44772 23 4V18C23 18.5523 22.5523 19 22 19H2C1.44772 19 1 18.5523 1 18V4C1 3.44772 1.44772 3 2 3Z" 
                      stroke="#172554" 
                      stroke-width="2"
                    />
                    <path 
                      d="M2 4L12 11L22 4" 
                      stroke="#172554" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    />
                  </svg>

                  {unread > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white h-4 w-4 rounded-full flex items-center justify-center p-1.5 text-xs">
                      {unread}
                    </span>
                  )}
                </Link>
                 ): ""}
                {/* <Link
                  href={isDisabled ? null : ""}
                  className={`relative opacity-50  ${isDisabled}`}
                  title="Coming soon..."
                >
                  <svg
                    id="shopping-cart"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.273"
                    height="20.455"
                    viewBox="0 0 23.273 20.455"
                  >
                    <path
                      id="Path_2297"
                      data-name="Path 2297"
                      d="M7.5,13.637H19.864a.682.682,0,0,0,.656-.495L23.247,3.6a.682.682,0,0,0-.656-.869H5.926L5.438.534A.682.682,0,0,0,4.773,0H.682a.682.682,0,0,0,0,1.364H4.226L6.688,12.442A2.045,2.045,0,0,0,7.5,16.364H19.864a.682.682,0,1,0,0-1.364H7.5a.682.682,0,0,1,0-1.363ZM21.687,4.091,19.35,12.273H8.047L6.229,4.091Zm0,0"
                      transform="translate(0 0)"
                      fill="#172554"
                    />
                    <path
                      id="Path_2298"
                      data-name="Path 2298"
                      d="M150,362.046A2.046,2.046,0,1,0,152.046,360,2.048,2.048,0,0,0,150,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,152.046,361.364Zm0,0"
                      transform="translate(-143.182 -343.636)"
                      fill="#172554"
                    />
                    <path
                      id="Path_2299"
                      data-name="Path 2299"
                      d="M362,362.046A2.046,2.046,0,1,0,364.046,360,2.048,2.048,0,0,0,362,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,364.046,361.364Zm0,0"
                      transform="translate(-345.545 -343.636)"
                      fill="#172554"
                    />
                  </svg>
                  {Object.keys(cart).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white h-4 w-4 rounded-full flex items-center justify-center p-1.5 text-xs">
                      {Object.keys(cart).length}
                    </span>
                  )}
                </Link> */}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP NAVBAR*/}
        <div className="bg-orange-100">
          <div className="max-w-screen-xl mx-auto px-4 py-4">
            <>
              <ul className="flex justify-between gap-6 relative items-center">
                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group${
                            open
                              ? "  border-b-[3px]   border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/fashion"> Fashion</Link>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0  top-10  w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/fashion/for-men">
                                        For Men
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/fashion/for-women">
                                        {" "}
                                        For Women
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/fashion/for-kids">
                                        For Kids
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/fashion/for-unisex">
                                        For Unisex
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>

                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group ${
                            open
                              ? "  border-b-[3px]  border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/jewelry-and-accessories">
                              Jewelry & Accessories
                            </Link>

                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-10  top-10  pb-12 w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/necklaces-and-pendants">
                                        Necklaces & Pendants
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm  hover:text-primary"
                                  >
                                    Hats & Caps
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Hair Accessories
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Cosmetic & Toiletry Bags
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Scarves
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Wallets
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Bags & Purses
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Keychains
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/earrings">
                                        Earrings
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/bracelets-and-bangles">
                                        {" "}
                                        Bracelets & Bangles
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/rings">
                                        {" "}
                                        Rings
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/handbags-and-purses">
                                        Handbags & Purses
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/hats-and-headpieces">
                                        Hats & Headpieces
                                      </Link>
                                    </p>
                                  </li>
                                </ul> */}
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/jewelry-and-accessories/brooches-and-pins">
                                       Brooches & Pins
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>

                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group${
                            open
                              ? "  border-b-[3px]   border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/home-and-living">
                              Home & Living
                            </Link>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-50 pb-12 top-10  w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/home-and-living/handcrafted-decor">
                                        Handcrafted Decor
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/home-and-living/handcrafted-decor/ceramics-and-pottery">
                                        Ceramics & Pottery
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/home-and-living/handcrafted-decor/wooden-artifacts">
                                        Wooden Artifacts
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/home-and-living/handcrafted-decor/sculptures-and-figurines">
                                        Sculptures & Figurines
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/home-and-living/handcrafted-decor/metal-work">
                                        Metal Work
                                      </Link>
                                    </p>
                                  </li> */}
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Vases
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Kitchen
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Dining
                                  </Link>
                                </li>
                                <li className=" mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm"
                                  >
                                    Gourds
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Planters
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Baskets
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Mugs
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/home-and-living/home-decor">
                                        Home Decor
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary"
                                    >
                                      <Link href="/category/home-and-living/home-decor/cushions-and-throws">
                                        Cushions & Throws
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary"
                                    >
                                      <Link href="/category/home-and-living/home-decor/wall-art">
                                        Wall Art
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary"
                                    >
                                      <Link href="/category/home-and-living/candles-and-candle-holders">
                                        Candles & Candle Holders
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary"
                                    >
                                      <Link href="/category/home-and-living/home-decor/tabletop-decor">
                                        Tabletop Decor
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary"
                                    >
                                      <Link href="/category/home-and-living/home-decor/planters-vases">
                                        Planters & Vases
                                      </Link>
                                    </p>
                                  </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/home-and-living/food-and-related">
                                        Food & Related
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                    <p className="text-gray-500 font-medium text-sm hover:text-primary">
                                      <Link href="/category/home-and-living/food-and-related/tea-coffee-condiments-and-spices">
                                        Tea, Coffee, Condiments & Spices
                                      </Link>
                                    </p>
                                  </li> */}
                                </ul>
                                {/* <ul>
                                <li>
                                  <p className="text-blue-950 font-medium text-sm mb-4">
                                    Bath & Beauty
                                  </p>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Makeup & Cosmetics
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Skin Care
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Hair Care
                                  </Link>
                                </li>
                              </ul>
                              <ul>
                                <li>
                                  <p className="text-blue-950 mb-4 font-medium text-sm ">
                                    Rugs
                                  </p>
                                </li>
                              </ul>
                              <ul>
                                <li>
                                  <p className="text-blue-950 mb-4 font-medium text-sm ">
                                    Pet Supplies
                                  </p>
                                </li>
                              </ul>
                              <ul>
                                <li>
                                  <p className="text-blue-950 mb-4 font-medium text-sm ">
                                    Furniture
                                  </p>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Bedroom Furniture
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Dining Room Furniture
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Kids&apos; Furniture
                                  </Link>
                                </li>
                                <li className="mb-2.">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm  hover:text-primary"
                                  >
                                    Living Room Furniture
                                  </Link>
                                </li>
                              </ul> */}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>

                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group${
                            open
                              ? "  border-b-[3px]  border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/toys-and-games">
                              Toys & Games
                            </Link>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-50 pb-12 top-10  w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/toys-and-games/toys">
                                        Toys
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/toys/baby-and-toddler-toys">
                                        {" "}
                                        Baby & Toddler Toys
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/toys/stuffed-animals-and-plushies">
                                        Stuffed Animals & Plushies
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/toys/learning-and-school">
                                        Learning & School
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/toys/dolls-and-action-figures">
                                        Dolls & Action Figures
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/toys/pet-toys">
                                        Pet Toys
                                      </Link>
                                    </p>
                                  </li> */}
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4">
                                      <Link href="/category/toys-and-games/games-and-puzzles">
                                        Games & Puzzles
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/games-and-puzzles/board-games">
                                        Board Games
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/toys-and-games/games-and-puzzles/puzzles">
                                        Puzzles
                                      </Link>
                                    </p>
                                  </li>
                                </ul> */}
                                {/* <ul>
                                <li>
                                  <p className="text-blue-950 font-medium text-sm mb-4">
                                    Games
                                  </p>
                                </li>
                              </ul> */}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>

                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group${
                            open
                              ? "  border-b-[3px]  border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/art-and-collectibles">
                              Art & Collectibles
                            </Link>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-50 pb-12 top-10  w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/art-and-collectibles/paintings">
                                        {" "}
                                        Paintings
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                  {/* <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Digital
                                  </Link>
                                </li> */}
                                {/* </ul> */}
                                {/* <ul> */}
                                  {/* <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/art-and-collectibles/drawings-and-illustrations">
                                        Drawings & Illustrations
                                      </Link>
                                    </p>
                                  </li> */}
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Oil
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Watercolor
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm mb-2.5 hover:text-primary"
                                  >
                                    Acrylic
                                  </Link>
                                </li> */}
                                {/* </ul> */}
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/art-and-collectibles/digital-art">
                                        {" "}
                                        Digital Art
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Pencil
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Charcoal
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Colored Pencils
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Chalk
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Pastel
                                  </Link>
                                </li> */}
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/art-and-collectibles/photography">
                                        Photography
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/art-and-collectibles/textile-and-fiber-art">
                                        Textile & Fiber Art
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/art-and-collectibles/standees">
                                        Standees
                                      </Link>
                                    </p>
                                  </li>
                                </ul> */}
                                <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/art-and-collectibles/keychains">
                                        Keychains
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/art-and-collectibles/charms">
                                        Charms
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/art-and-collectibles/prints">
                                        Prints
                                      </Link>
                                    </p>
                                  </li>
                                </ul> */}
                                {/* <ul>
                                <li>
                                  <p className="text-blue-950 mb-4 font-medium text-sm">
                                    Colouring
                                  </p>
                                </li>
                              </ul> */}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>

                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group${
                            open
                              ? "  border-b-[3px]   border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/stationery-and-paper-goods">
                              Stationery & Paper Goods
                            </Link>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-10  top-10  w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/stationery-and-paper-goods/notebooks-and-journals">
                                        Notebooks & Journals
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >


                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/stationery-and-paper-goods/greeting-cards">
                                        Greeting Cards
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/stationery-and-paper-goods/stickers-and-labels">
                                        Stickers & Labels
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/stationery-and-paper-goods/paper-art-and-prints">
                                        Paper Art and Prints
                                      </Link>
                                    </p>
                                  </li> */}
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                {/* </ul> */}
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/stationery-and-paper-goods/colouring-books">
                                        {" "}
                                        Colouring Books
                                      </Link>
                                    </p>
                                  </li> */}
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Clothing
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Shoes
                                  </Link>
                                </li> */}
                                {/* </ul> */}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>

                <li>
                  <Popover className="">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`focus:outline-none group${
                            open
                              ? "  border-b-[3px]   border-primary w-full"
                              : ""
                          }`}
                        >
                          <p
                            className={`inline-flex items-center group gap-1.5 focus:outline-none hover:text-primar
                                ${
                                  open
                                    ? "text-primary   font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                          >
                            <Link href="/category/personal-care-and-bath-products">
                              Personal Care & Bath Products
                            </Link>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={` hover:text-primary
                                ${
                                  open
                                    ? "text-primary  font-medium text-sm"
                                    : "text-blue-950  font-medium text-sm"
                                }
                               `}
                            />
                          </p>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-50 pb-12 top-10  w-full z-[99]">
                            <div className="overflow-hidden rounded-lg shadow-md">
                              <div className="bg-orange-100 flex gap-10 justify-center pt-5 pb-2">
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 text-sm font-medium mb-4 hover:text-primary">
                                      <Link href="/category/personal-care-and-bath-products/bath-bombs">
                                        {" "}
                                        Bath Bombs
                                      </Link>
                                    </p>
                                  </li> */}
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Ceramics & Pottery
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Wooden Artifacts
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Sculptures & Figurines
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Metal Work
                                  </Link>
                                </li> */}
                                {/* </ul> */}
                                <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/personal-care-and-bath-products/handmade-soap">
                                        {" "}
                                        Handmade Soap
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Cushions & Throws
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Wall Art
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Candles & Candle Holders
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Tabletop Decor
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Planters & Vases
                                  </Link>
                                </li> */}
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 font-medium text-sm mb-4 hover:text-primary">
                                      <Link href="/category/personal-care-and-bath-products/body-scrubs">
                                        {" "}
                                        Body Scrubs
                                      </Link>
                                    </p>
                                  </li> */}
                                  {/* <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Makeup & Cosmetics
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Skin Care
                                  </Link>
                                </li>
                                <li className="mb-2.5">
                                  <Link
                                    href="#"
                                    className="text-gray-500 font-medium text-sm hover:text-primary"
                                  >
                                    Hair Care
                                  </Link>
                                </li> */}
                                {/* </ul> */}
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary ">
                                      <Link href="/category/personal-care-and-bath-products/bath-soaks-and-salts">
                                        {" "}
                                        Bath Soaks & Salts
                                      </Link>
                                    </p>
                                  </li>
                                </ul> */}
                                <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary ">
                                      <Link href="/category/personal-care-and-bath-products/lotions-and-body-butters">
                                        {" "}
                                        Lotions & Body Butters
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary ">
                                      <Link href="/category/personal-care-and-bath-products/oils">
                                        {" "}
                                        Oils
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/personal-care-and-bath-products/oils/body-oils">
                                        Body Oils
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/personal-care-and-bath-products/oils/bath-oils">
                                        Bath Oils
                                      </Link>
                                    </p>
                                  </li> */}
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary "
                                    >
                                      <Link href="/category/personal-care-and-bath-products/oils/hair-oils">
                                        Hair Oils
                                      </Link>
                                    </p>
                                  </li>
                                  {/* <li className="mb-2.">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm  hover:text-primary"
                                    >
                                      <Link href="/category/personal-care-and-bath-products/oils/massage-oils">
                                        Massage Oils
                                      </Link>
                                    </p>
                                  </li> */}
                                </ul>
                                {/* <ul>
                                  <li>
                                    <p className="text-blue-950 mb-4 font-medium text-sm hover:text-primary">
                                      <Link href="/category/personal-care-and-bath-products/baby-and-child-care">
                                        Baby & Child Care
                                      </Link>
                                    </p>
                                  </li>
                                  <li className="mb-2.5">
                                    <p
                                      // href="#"
                                      className="text-gray-500 font-medium text-sm hover:text-primary"
                                    >
                                      <Link href="/category/personal-care-and-bath-products/baby-and-child-care/teething">
                                        Teething
                                      </Link>
                                    </p>
                                  </li>
                                </ul> */}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </li>
              </ul>
            </>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
