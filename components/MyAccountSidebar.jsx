import { useSidebar } from "@/context/sidebarContext";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import {
  faBagShopping,
  faHeart,
  faUser,
  faWallet,
} from "@fortawesome/pro-light-svg-icons";
import { faArrowRightFromBracket, faCircleDollar } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { Noto_Serif } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const MyAccountSidebar = () => {
  const router = useRouter();
  const path = router.pathname;
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || (userData && !userData.accessToken)) {
      router.push("/sign-in");
    }
  }, [router.pathname]);

  const onLogOutClick = () => {
    clearThirdWebAuthTokens();
    window.location.href = "/";
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

  return (
    <>
      <div className="bg-orange-50 shrink-0 h-full mb-4">
        <h1
          className={`text-2xl xl:text-3xl text-blue-950 mb-4 xl:mb-6 noto-font `}
        >
          My Account
        </h1>
        <div>
          <ul className="flex lg:flex-col gap-3 overflow-scroll md:overflow-hidden lg:overflow-hidden xl:overflow-hidden text-slate-400 text-sm font-medium ">
            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer  shrink-0 ${
                path.includes("/my-account/account-details")
                  ? "text-primary  bg-orange-100 pointer-events-none"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-4.5" />
                </div>

                <Link href="/my-account/account-details" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    My Account Details
                  </p>
                </Link>
              </div>
            </li>

            {/* <li
              className={`opacity-50 relative text-blue-950  px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0`}
              title="Coming soon..."
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    className="h-5 w-4.5"
                  />
                </div>
                <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                Reset Password
              </div>
            </li> */}

            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer  shrink-0 ${
                path.includes("/my-account/my-orders")
                  ? "text-primary bg-orange-100 "
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faBagShopping} className="h-6 w-5" />
                </div>
                <Link href="/my-account/my-orders" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    My Orders
                  </p>
                </Link>
              </div>
            </li>

            {/* <li
              className={`opacity-50 relative text-blue-950  px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0`}
              title="Coming soon..."
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faBagShopping} className="h-6 w-5" />
                </div>
                <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                My Orders
              </div>
            </li> */}

            {/* <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer  shrink-0 ${
                path.includes("/my-account/downloads")
                  ? "text-primary bg-orange-100 pointer-events-none"
                  : ""
              }`}
            >
               <div className="flex gap-3">
              <div className="w-6 text-center">
              <FontAwesomeIcon icon={faCircleDown} className="h-6 w-5" /></div>
              <Link href="/my-account/downloads" legacyBehavior>
                <p>
                  <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                  Downloads
                </p>
              </Link>
              </div>
            </li> */}
            {/* 
            <li
              className={`opacity-50 relative text-blue-950  px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0`}
              title="Coming soon..."
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faCircleDown} className="h-6 w-5" />
                </div>
                <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                Downloads
              </div>
            </li> */}

            {/* <li
              className={`relative text-blue-950 hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0 ${
                path.includes("/my-account/wish-list")
                  ? "text-primary bg-orange-100 pointer-events-none"
                  : ""
              }`}
            >
              <div className="flex gap-3">
              <div className="w-6 text-center">
              <FontAwesomeIcon icon={faHeart} className="h-5 w-6" /></div>

              <Link href="/my-account/wish-list" legacyBehavior>
                <p>
                  <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                  Wish List
                </p>
              </Link>
              </div>
            </li> */}

            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer  shrink-0 ${
                path.includes("/my-account/my-wallet")
                  ? "text-primary bg-orange-100 "
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faWallet} className="h-6 w-5" />
                </div>
                <Link href="/my-account/my-wallet">
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    My Rewards
                  </p>
                </Link>
              </div>
            </li>

            <li
              className={`relative text-blue-950  hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer  shrink-0 ${
                path.includes("/my-account/earning")
                  ? "text-primary bg-orange-100 "
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faCircleDollar} className="h-6 w-5" />
                </div>
                <Link href="/my-account/earning">
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Earnings
                  </p>
                </Link>
              </div>
            </li>

            <li
              className={`opacity-50 relative text-blue-950  px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0`}
              title="Coming soon..."
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faHeart} className="h-5 w-6" />
                </div>
                <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                Wish List
              </div>
            </li>

            {/* <li
              className={`relative text-blue-950 hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full xl:rounded flex items-center gap-4 cursor-pointer shrink-0 ${
                path.includes("/my-account/my-reward-points")
                  ? "text-primary bg-orange-100 pointer-events-none"
                  : ""
              }`}
            >
            <div className="flex gap-3">
              <div className="w-6 text-center">
              <FontAwesomeIcon icon={faCircleStar} className="h-5 w-5" /></div>

              <Link href="/my-account/my-reward-points" legacyBehavior>
                <p>
                  <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                  Reward Points
                </p>
              </Link>
              </div>
            </li> */}

            {/* <li
              className={`opacity-50 relative text-blue-950 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0`}
              title="Coming soon..."
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faCircleStar} className="h-5 w-5" />
                </div>
                <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                Reward Points
              </div>
            </li> */}

            {/* <li
              className={`relative text-blue-950 hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0 ${
                path.includes("/my-account/my-crypto-details")
                  ? "text-primary bg-orange-100 pointer-events-none"
                  : ""
              }`}
            >
             <div className="flex gap-3">
              <div className="w-6 text-center">
              <FontAwesomeIcon icon={faWallet} className="h-5 w-4.5" /></div>

              <Link href="/my-account/my-crypto-details" legacyBehavior>
                <p>
                  <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                  My Crypto
                </p>
              </Link>
              </div>
            </li> */}
            <li
              className={`opacity-50 relative text-blue-950 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer shrink-0`}
              title="Coming soon..."
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon icon={faWallet} className="h-5 w-4.5" />
                </div>
                <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                My Crypto
              </div>
            </li>

            <li
              className={`relative text-blue-950 hover:text-primary hover:bg-orange-100 px-4 py-3 xl:p-3 rounded-full lg:rounded flex items-center gap-4 cursor-pointer  shrink-0 ${
                path.includes("/logout")
                  ? "text-primary bg-orange-100 pointer-events-none"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="w-6 text-center">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="text-sm xl:text-lg xl:mt-2"
                  />
                </div>
                <button onClick={onLogOutClick}>
                  <span className="top-0 left-0 w-full h-full xl:text-lg">
                    Logout
                  </span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyAccountSidebar;
