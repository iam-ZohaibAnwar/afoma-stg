import {
  faArrowRightFromBracket,
  faBagShopping,
  faBoxTaped,
  faChartSimple,
  faChartTreeMap,
  faDiagramSubtask,
  faGlobe,
  faObjectsColumn,
  faSitemap,
  faStar,
  faStore,
  faTag,
  faUser,
  faGear,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import { faBagsShopping, faGiftCard, faTrophyStar, } from "@fortawesome/pro-regular-svg-icons";
import { decodeJwtPayload, isJwtExpired } from "@/utils/jwtLite";
import { faShippingFast, faTrophy, faWallet } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useSidebar } from "@/context/sidebarContext";

const AdminProductSidebar = ({ }) => {
  const [openMainNav, setOpenMainNav] = useState(false);
  const [openCategoryNav, setOpenCategoryNav] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const [fullAccess, setfullAccess] = useState(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const onLogOutClick = async () => {
    clearThirdWebAuthTokens(); // Clear authentication tokens or any relevant data
    window.location.href = "/"; // Redirect to home page with a hard refresh
  };

  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Example: if url is home, don't close; otherwise close
      if (url === "/") return;
      setSidebarOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, setSidebarOpen]);


  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.accessToken) {
      const decoded = decodeJwtPayload(userData.accessToken);
      if (!decoded || isJwtExpired(decoded)) {
        clearThirdWebAuthTokens();
        window.location.href = "/sign-in";
        return;
      }
      setfullAccess(decoded?.fullAccess);
    }
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div
      ref={sidebar}
      className={`bg-orange-100 shrink-0 h-full mx-auto p-6 2xl:pl-20 2xl:pr-12 flex flex-col gap-20 justify-between overflow-y-scroll scrollbar absolute lg:shadow-none shadow-lg left-0 top-0 z-[9] duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <Image
              src={
                "/assets/AFOMA New Logo (940 x 300 px).png"
              }
              alt="AFOMA_Marketplace"
              width={270}
              height={42}
              loading="lazy"
              className="w-[209px] lg:w-[270px]"
            />
          </Link>
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden ml-6"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="">
          <ul className="text-slate-400 text-sm">
            <li
              className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/dashboard")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon
                    icon={faObjectsColumn}
                    className="text-2xl"
                  />
                </div>

                <Link href="/admin/dashboard" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">Dashboard</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>

            <li
              className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/my-orders")
                  ? "text-primary bg-orange-50"
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faBagsShopping} className="text-xl" />
                </div>

                <Link href="/admin/my-orders" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">My Orders</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            <li
              className={`relative text-blue-950 mb-2  hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/seller-management")
                  ? "text-primary bg-orange-50"
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faStore} className="text-2xl" />
                </div>
                <Link href="/admin/seller-management" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">
                      Seller Management
                    </span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>

            <li
              className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/order-management")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faBagShopping} className="text-2xl" />
                </div>

                <Link href="/admin/order-management" legacyBehavior>
                  <p>
                    <span className="w-full h-full xl:text-lg">
                      Order Management
                    </span>

                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>

            <li
              className={`relative mb-2 text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/product")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faBoxTaped} className="text-2xl" />
                </div>

                <Link href="/admin/product">
                  <span className=" w-full h-full xl:text-lg">
                    Product Management
                  </span>
                  <span className="absolute top-0 left-0 h-full w-full"></span>
                </Link>
              </div>
            </li>
            <li
              className={`relative mb-2 text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/attribute")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faTag} className="text-2xl" />
                </div>
                <button onClick={() => setOpenMainNav(!openMainNav)}>
                  <span className=" w-full h-full xl:text-lg">Attribute</span>
                  <span className="absolute top-0 left-0 h-full w-full"></span>
                </button>
              </div>
            </li>
            <div
              className={`w-full  origin-top ml-5 ${
                openMainNav ? "scale-y-100 h-fit" : "scale-y-0 h-0"
              }`}
            >
              <li
                className={`relative mb-2 text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[315px] ${
                  path.includes("/admin/attribute/global-attribute-management")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="w-6">
                  <FontAwesomeIcon icon={faGlobe} className="text-2xl" />
                </div>

                <Link href="/admin/attribute/global-attribute-management">
                  <span className=" w-full h-full xl:text-lg">
                    Global Attribute
                  </span>
                  <span className="absolute top-0 left-0 h-full w-full"></span>
                </Link>
              </li>
            </div>
            <li
              className={`relative mb-2 text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/categories")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faChartTreeMap} className="text-2xl" />
                </div>
                <button onClick={() => setOpenCategoryNav(!openCategoryNav)}>
                  <span className=" w-full h-full xl:text-lg">Category</span>
                  <span className="absolute top-0 left-0 h-full w-full"></span>
                </button>
              </div>
            </li>
            <div
              className={`w-full  origin-top ml-5 ${
                openCategoryNav ? "scale-y-100 h-fit" : "scale-y-0 h-0"
              }`}
            >
              <li
                className={`relative mb-2 text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[315px] ${
                  path.includes("/admin/categories/parent-category")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    {" "}
                    <FontAwesomeIcon icon={faSitemap} className="text-2xl" />
                  </div>

                  <Link href="/admin/categories/parent-category">
                    <span className=" w-full h-full xl:text-lg">
                      Parent Category
                    </span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </Link>
                </div>
              </li>

              <li
                className={`relative mb-2 text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[315px] ${
                  path.includes("/admin/categories/sub-category")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    {" "}
                    <FontAwesomeIcon
                      icon={faDiagramSubtask}
                      className="text-2xl"
                    />
                  </div>

                  <Link href="/admin/categories/sub-category">
                    <span className=" w-full h-full xl:text-lg">
                      Sub Category
                    </span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </Link>
                </div>
              </li>
              <li
                className={`relative mb-2 text-blue-950 hover:text-primary group hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[315px] ${
                  path.includes("/admin/categories/child-category")
                    ? "text-primary bg-orange-50 group"
                    : ""
                } `}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      className={`fill-blue-950 group-hover:fill-primary ${
                        path.includes("/admin/categories/child-category")
                          ? "fill-primary "
                          : ""
                      }`}
                      viewBox="0 0 28 28"
                    >
                      <defs>
                        <clipPath id="a">
                          <rect
                            width="28"
                            height="28"
                            transform="translate(1483 2410)"
                            strokeWidth="1"
                          />
                        </clipPath>
                      </defs>
                      <g transform="translate(-1483 -2410)" clipPath="url(#a)">
                        <g transform="translate(1482.279 2408.75)">
                          <path
                            d="M13.779,4.107A2.28,2.28,0,0,0,11.5,6.386v6.325a2.279,2.279,0,0,0,2.279,2.279h7.814a2.279,2.279,0,0,0,2.279-2.279V7.875A2.281,2.281,0,0,0,21.593,5.6H19.037a.324.324,0,0,1-.212-.078l-1.005-.862a2.284,2.284,0,0,0-1.483-.548H13.779Zm0,1.953h2.556a.324.324,0,0,1,.212.078L17.553,7a2.277,2.277,0,0,0,1.483.548h2.556a.325.325,0,0,1,.326.326v4.837a.325.325,0,0,1-.326.326H13.779a.326.326,0,0,1-.326-.326V6.386A.326.326,0,0,1,13.779,6.06Z"
                            transform="translate(2.57 0.864)"
                            fillRule="evenodd"
                          />
                          <path
                            d="M13.779,14.393A2.279,2.279,0,0,0,11.5,16.672V23a2.279,2.279,0,0,0,2.279,2.279h7.814A2.281,2.281,0,0,0,23.872,23V18.161a2.279,2.279,0,0,0-2.279-2.279H19.037a.331.331,0,0,1-.212-.078l-1.005-.862a2.277,2.277,0,0,0-1.483-.548H13.779Zm0,1.953h2.556a.324.324,0,0,1,.212.078l1.005.861a2.278,2.278,0,0,0,1.483.55h2.556a.325.325,0,0,1,.326.326V23a.325.325,0,0,1-.326.326H13.779A.326.326,0,0,1,13.453,23V16.672a.326.326,0,0,1,.326-.326Z"
                            transform="translate(2.57 3.973)"
                            fillRule="evenodd"
                          />
                          <path
                            d="M11.791,23.39H6.581a1.629,1.629,0,0,1-1.628-1.628V2.227A.977.977,0,1,0,3,2.227V21.762a3.581,3.581,0,0,0,3.581,3.581h5.209a.977.977,0,1,0,0-1.953Z"
                            transform="translate(0 0)"
                            fillRule="evenodd"
                          />
                          <path
                            d="M11.791,7.75H3.977a.977.977,0,0,0,0,1.953h7.814a.977.977,0,1,0,0-1.953Z"
                            transform="translate(0 1.965)"
                            fillRule="evenodd"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>

                  <Link href="/admin/categories/child-category">
                    <span className=" w-full h-full xl:text-lg">
                      Child Category
                    </span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </Link>
                </div>
              </li>
            </div>

            {fullAccess && (
              <li
                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                  path.includes("/admin/user-management")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    <FontAwesomeIcon icon={faUser} className="text-2xl" />
                  </div>

                  <div>
                    {" "}
                    <Link href="/admin/user-management" legacyBehavior>
                      <p>
                        <span className=" w-full h-full xl:text-lg">
                          User Management
                        </span>
                        <span className="absolute top-0 left-0 h-full w-full"></span>
                      </p>
                    </Link>
                  </div>
                </div>
              </li>
            )}
            {fullAccess && (
              <li
                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                  path.includes("/admin/commission")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    <FontAwesomeIcon icon={faUser} className="text-2xl" />
                  </div>

                  <div>
                    {" "}
                    <Link href="/admin/commission" legacyBehavior>
                      <p>
                        <span className=" w-full h-full xl:text-lg">
                          Commission
                        </span>
                        <span className="absolute top-0 left-0 h-full w-full"></span>
                      </p>
                    </Link>
                  </div>
                </div>
              </li>
            )}
            <li
              className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/review")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faStar} className="text-2xl" />
                </div>

                <Link href="/admin/review" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">Review</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            <li
              className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/coupons")
                  ? "text-primary bg-orange-50"
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faGiftCard} className="text-xl" />
                </div>
                <Link href="/admin/coupons" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">Coupons</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/report")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faChartSimple} className="text-2xl" />
                </div>

                <Link href="/admin/report" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">Report</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/my-wallet")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faWallet} className="text-2xl" />
                </div>

                <Link href="/admin/my-wallet" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">My Rewards</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/afoma-rewards")
                  ? "text-primary bg-orange-50 "
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faTrophyStar} className="text-2xl" />
                </div>

                <Link href="/admin/afoma-rewards" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">AFOMA Rewards</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            <li
              className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                path.includes("/admin/settings")
                  ? "text-primary bg-orange-50"
                  : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-7">
                  <FontAwesomeIcon icon={faGear} className="text-xl" />
                </div>

                <Link href="/admin/settings" legacyBehavior>
                  <p>
                    <span className=" w-full h-full xl:text-lg">Settings</span>
                    <span className="absolute top-0 left-0 h-full w-full"></span>
                  </p>
                </Link>
              </div>
            </li>
            {/* {fullAccess && (
              <li
                className={`relative text-blue-950  hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                  path.includes("/admin/shipping-config")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    <FontAwesomeIcon
                      icon={faShippingFast}
                      className="text-2xl"
                    />
                  </div>

                  <Link href="/admin/shipping-config" legacyBehavior>
                    <p>
                      <span className=" w-full h-full xl:text-lg">
                        Shipping Config
                      </span>
                      <span className="absolute top-0 left-0 h-full w-full"></span>
                    </p>
                  </Link>
                </div>
              </li>
            )} */}
            {/* {fullAccess && (
              <li
                className={`relative text-blue-950  hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
                  path.includes("/admin/reward-management")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7">
                    <FontAwesomeIcon icon={faTrophy} className="text-2xl" />
                  </div>

                  <Link href="/admin/reward-management" legacyBehavior>
                    <p>
                      <span className=" w-full h-full xl:text-lg">
                        Reward Management
                      </span>
                      <span className="absolute top-0 left-0 h-full w-full"></span>
                    </p>
                  </Link>
                </div>
              </li>
            )} */}
          </ul>
        </div>
      </div>
      <div
        className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${
          path.includes("/logout")
            ? "text-primary bg-orange-50 pointer-events-none"
            : ""
        }`}
      >
        <button onClick={onLogOutClick} className="flex items-center gap-4">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="text-2xl"
          />

          <span className=" w-full h-full text-sm xl:text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminProductSidebar;
