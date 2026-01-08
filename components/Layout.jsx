import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Auth from "./Auth";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import { useSidebar } from "@/context/sidebarContext";
import { decodeJwtPayload, isJwtExpired } from "@/utils/jwtLite";

// Lazy load heavy sidebar and header components
const AdminProductSidebar = dynamic(() => import("./AdminProductSidebar"), { ssr: false });
const AdminInfoHeader = dynamic(() => import("./AdminInfoHeader"), { ssr: false });
const SellerSidebar = dynamic(() => import("./SellerSidebar"), { ssr: false });
const SellerInfoHeader = dynamic(() => import("./SellerInfoHeader"), { ssr: false });
const AffiliateSidebar = dynamic(() => import("./AffiliateSidebar"), { ssr: false });
const AffiliateInfoHeader = dynamic(() => import("./AffiliateHeaderInfo"), { ssr: false });

const Layout = ({ children, userType }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  useEffect(() => {
    // Use requestIdleCallback or setTimeout to avoid blocking render
    const checkAuth = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        let decoded = {};
        if (userData && userData.accessToken) {
          decoded = decodeJwtPayload(userData.accessToken) || {};
          if (isJwtExpired(decoded)) {
            clearThirdWebAuthTokens();
            window.location.href = "/sign-in";
            return;
          }
        }
        setUserRole(decoded?.role || null);
      } catch (error) {
        console.error("Auth check error:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    // Non-blocking auth check
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(checkAuth, { timeout: 100 });
      } else {
        setTimeout(checkAuth, 0);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Auth>
      {loading ? (
        "Loading..."
      ) : (
        userType !== "from-settings" ? (
        <div className="flex h-screen overflow-hidden">
          {userRole === "admin" && (
            <>
              <AdminProductSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <div className="relative w-full h-full overflow-auto bg-orange-50 p-4 md:p-6 2xl:p-10">
                <AdminInfoHeader
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <div className="max-w-screen-2xl mx-auto">{children}</div>
              </div>
            </>
          )}
          {userRole === "seller" && (
            <>
              <SellerSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <div className="relative w-full h-full overflow-auto bg-orange-50 p-4 md:p-6 2xl:p-10">
                <SellerInfoHeader
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <div className="max-w-screen-2xl mx-auto">{children}</div>
              </div>
            </>
          )}
          {userRole === "affiliate" && (
            <>
              <AffiliateSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <div className="relative w-full h-full overflow-auto bg-orange-50 p-4 md:p-6 2xl:p-10">
                <AffiliateInfoHeader
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <div className="max-w-screen-2xl mx-auto">{children}</div>
              </div>
            </>
          )}
          {userRole !== "admin" && userRole !== "seller" && userRole !== "affiliate" && (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <p className="text-lg">You don&apos;t have access to this page</p>
              <button className="buttonprimary relative">
                Back to homepage
                <Link href={"/"}>
                  <span className="absolute top-0 left-0 h-full w-full"></span>
                </Link>
              </button>
            </div>
          )}
        </div>
        ) : (
        <div>
          {children}
        </div>
        )
      )}
    </Auth>
  );
};
export default Layout;
