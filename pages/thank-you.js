import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Thank_You = ({ cart, addToCart }) => {
  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans
"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="Join AFOMA Marketplace - a unique platform for artists and artisans to sell crafts globally. Be first for exclusive deals and promotions."
        ></meta>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </Head>
      <section>
        <Header cart={cart} addToCart={addToCart} />
      </section>

      <section>
        <div className="py-12 md:py-20 xl:py-30 px-4">
          <h1
            className={`text-blue-950 text-3xl md:text-6xl xl:text-9xl text-center mb-3 noto-font`}
          >
            Thank You!
          </h1>
          <p className="text-blue-950 text-center text-sm xl:text-base font-medium mb-4">
            Together, let’s build a thriving business for all creators.
          </p>
          <p className="max-w-[768px] mx-auto text-blue-950 text-center text-sm xl:text-base font-medium mb-8 md:mb-12">
            If your order includes a downloadable product, you can access and
            download it by visiting the &quot;My Orders&quot; section in your
            “My Account” profile.
          </p>
          <div className="flex md:flex-row flex-col md:gap-6 gap-4 items-center justify-center">
            <Link href="/" className="buttonprimary">
              Go to Home
            </Link>
            <Link href="/" className="buttonprimarythre">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
};

export default Thank_You;
