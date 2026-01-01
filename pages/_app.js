import { useEffect } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";
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

const inter = Inter({ subsets: ["latin"] });

const SESSION_TIMEOUT = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

export default function App({ Component, pageProps }) {
  const router = useRouter();

  let timeout;

  // Function to clear all data from localStorage except for cart
  const clearUserLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    localStorage.clear();
    if (savedCart) {
      localStorage.setItem("cart", savedCart);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    getGeoIP();

    // Function to clear timeout and start a new one
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        clearUserLocalStorage(); // Clear user data from localStorage
        window.location.href = "/sign-in"; // Redirect to sign-in page after clearing data
      }, SESSION_TIMEOUT);
    };

    // Set initial timeout when the app loads
    resetTimeout();

    // Reset timeout on route change
    const handleRouteChange = () => {
      resetTimeout();
    };

    // Event listener for route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    // Clean up the event listener and timeout on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      clearTimeout(timeout);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (window.fbqInitialized) return;
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '1175390007373383');
      fbq('track', 'PageView'); // fire global PageView once
      window.fbqInitialized = true; // flag to avoid duplicate init
    }
  }, []);

  return (
    <>
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

      {/* 🟧 GTM NoScript iframe (required for tracking without JS) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=GTM-WGRF95JB`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <div className={`${inter.className} relative`}>
        <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
        <ThirdwebProvider clientId={process.env.NEXT_THIRDWEB_CLIENT_ID}>
          <SidebarProvider>
            <CartProvider>
              <NavigationLoader />
              <Component {...pageProps} />
            </CartProvider>

            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=1175390007373383&ev=PageView&noscript=1"
              />
            </noscript>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "text-sm font-medium",
              }}
            />
          </SidebarProvider>
        </ThirdwebProvider>
      </div>
    </>
  );
}
