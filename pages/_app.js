import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import "@/styles/globals.css";

import { ThirdwebProvider } from "thirdweb/react";
import NavigationLoader from "@/components/NavigationLoader";
import { getGeoIP } from "@/lib/geoIP";
import Script from "next/script";

import { SidebarProvider } from "@/context/sidebarContext";
import { CartProvider } from "@/context/CartProvider";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SESSION_TIMEOUT = 1 * 60 * 60 * 1000; // 1 hour

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const timeoutRef = useRef(null);

  const clearUserLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      localStorage.clear();
      if (savedCart) localStorage.setItem("cart", savedCart);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // Run GeoIP without blocking initial paint
    const runGeo = () => getGeoIP();
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) window.requestIdleCallback(runGeo);
      else setTimeout(runGeo, 0);
    }

    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        clearUserLocalStorage();
        window.location.assign("/sign-in");
      }, SESSION_TIMEOUT);
    };

    resetTimeout();

    const handleRouteChange = () => resetTimeout();
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router.events]);

  // FB Pixel init once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.fbqInitialized) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", "1175390007373383");
    window.fbq("track", "PageView");
    window.fbqInitialized = true;
  }, []);

  return (
    <>
      {/* GTM */}
      <Script
        id="gtm-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
              j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WGRF95JB');
          `,
        }}
      />

      {/* GTM NoScript */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WGRF95JB"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* Recaptcha: do not block first paint */}
      <Script
        strategy="afterInteractive"
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      />

      <div className={`${inter.className} relative`}>
        <ThirdwebProvider clientId={process.env.NEXT_THIRDWEB_CLIENT_ID}>
          <SidebarProvider>
            <CartProvider>
              <NavigationLoader />
              <Component {...pageProps} />
            </CartProvider>

            {/* FB noscript pixel */}
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1175390007373383&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>

            <Toaster
              position="bottom-right"
              toastOptions={{ className: "text-sm font-medium" }}
            />
          </SidebarProvider>
        </ThirdwebProvider>
      </div>
    </>
  );
}
