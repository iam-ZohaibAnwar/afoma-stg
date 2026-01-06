import Link from "next/link";
import { useEffect, useState } from "react";
import AdminInfoHeader from "./AdminInfoHeader";
import AdminProductSidebar from "./AdminProductSidebar";
import Auth from "./Auth";
import SellerInfoHeader from "./SellerInfoHeader";
import SellerSidebar from "./SellerSidebar";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import AffiliateSidebar from "./AffiliateSidebar";
import AffiliateInfoHeader from "./AffiliateHeaderInfo";
import { useSidebar } from "@/context/sidebarContext";
import { decodeJwtPayload, isJwtExpired } from "@/utils/jwtLite";

const Layout = ({ children, userType }) => {
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState();
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();


  useEffect(() => {
    setLoading(true);
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
    setUserRole(decoded?.role);
    setLoading(false);
  }, []);

  return (
    <Auth>
      {loading ? (
        "Loading..."
      ) : (
        userType!=="from-settings"?
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
        </div>:
        <div>
          {children}
        </div>
      )}
    </Auth>
  );
};
export default Layout;
