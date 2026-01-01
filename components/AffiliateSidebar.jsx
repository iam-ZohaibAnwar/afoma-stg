import { useSidebar } from "@/context/sidebarContext";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import { faTruck, faWallet } from "@fortawesome/free-solid-svg-icons";
import {
    faArrowRightFromBracket,
    faBagShopping,
    faBoxTaped,
    faCircleDollar,
    faCommentsQuestion,
    faGear,
    faObjectsColumn,
    faSliders,
    faStar,
    faUserPen,
    faFileContract,
} from "@fortawesome/pro-light-svg-icons";
import { faBagsShopping, faGiftCard } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const AffiliateSidebar = ({ }) => {
    const router = useRouter();
    const path = router.pathname;
    const trigger = useRef(null);
    const sidebar = useRef(null);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    const { sidebarOpen, setSidebarOpen } = useSidebar();

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
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document.querySelector("body")?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <>
            <div
                ref={sidebar}
                className={`bg-orange-100 shrink-0 h-full mx-auto p-6 2xl:pl-20 2xl:pr-12 flex flex-col gap-20 justify-between overflow-y-scroll scrollbar absolute lg:shadow-none shadow-lg left-0 top-0 z-[9999] duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                        <ul className="text-slate-400 text-sm ">
                            <li
                                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/seller/dashboard")
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

                                    <Link href="/affiliate/dashboard" legacyBehavior>
                                        <p>
                                            <span className=" w-full h-full xl:text-lg">
                                                Dashboard
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </li>
                            {/* <li
                                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/affiliate/my-account")
                                    ? "text-primary bg-orange-50"
                                    : ""
                                    }`}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-7">
                                        <FontAwesomeIcon icon={faUserPen} className="text-xl" />
                                    </div>

                                    <Link
                                        href="/affiliate/my-account"
                                        legacyBehavior
                                    >
                                        <p>
                                            <span className=" w-full h-full xl:text-lg">
                                                My Account
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </li> */}
                            <li
                                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/affiliate/my-orders")
                                    ? "text-primary bg-orange-50"
                                    : ""
                                    }`}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-7">
                                        <FontAwesomeIcon
                                            icon={faBagsShopping}
                                            className="text-xl"
                                        />
                                    </div>

                                    <Link href="/affiliate/my-orders" legacyBehavior>
                                        <p>
                                            <span className=" w-full h-full xl:text-lg">
                                                My Orders
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/affiliate/coupons")
                                    ? "text-primary bg-orange-50"
                                    : ""
                                    }`}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-7">
                                        <FontAwesomeIcon icon={faGiftCard} className="text-xl" />
                                    </div>

                                    <Link href="/affiliate/coupons" legacyBehavior>
                                        <p>
                                            <span className=" w-full h-full xl:text-lg">Coupons</span>
                                            <span className="absolute top-0 left-0 h-full w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/affiliate/my-wallet")
                                        ? "text-primary bg-orange-50"
                                        : ""
                                    }`}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-7">
                                        <FontAwesomeIcon
                                            icon={faWallet}
                                            className="text-xl"
                                        />
                                    </div>

                                    <Link href="/affiliate/my-wallet" legacyBehavior>
                                        <p>
                                            <span className=" w-full h-full xl:text-lg">
                                                My Rewards
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </li>
                            <li
                                className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/affiliate/earning")
                                        ? "text-primary bg-orange-50"
                                        : ""
                                    }`}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="w-7">
                                        <FontAwesomeIcon
                                            icon={faCircleDollar}
                                            className="text-xl"
                                        />
                                    </div>

                                    <Link href="/affiliate/earning" legacyBehavior>
                                        <p>
                                            <span className=" w-full h-full xl:text-lg">
                                                Earnings
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className={`relative text-blue-950 mb-2 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer xl:w-[300px] 2xl:w-[335px] ${path.includes("/logout")
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
        </>
    );
};

export default AffiliateSidebar;
