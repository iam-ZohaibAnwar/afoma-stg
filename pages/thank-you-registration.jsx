import dynamic from "next/dynamic";
import React from "react";
//import { Noto_Serif } from "next/font/google";
import Link from "next/link";
import Head from "next/head";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });

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
      </Head>
      <section>
        <Header cart={cart} addToCart={addToCart} />
      </section>

      <section>
        <div className="py-12 md:py-20 xl:py-40">
          <h1
            className={`text-blue-950 text-3xl lg:text-9xl text-center mb-3 noto-font`}
          >
            Thank You!
          </h1>
          <div className="md:w-[698px] mx-auto mb-8 xl:mb-16">
            <p className="text-blue-950  text-center text-sm xl:text-base font-medium mb-8 xl:mb-16">
              Thank you for registering to join our artisan community. Your
              registration is pending approval. We will respond in less than 24
              hours via email.
            </p>
          </div>
          <div className="flex gap-5 items-center justify-center">
            <Link href="/" className="buttonprimary">
              Go to Home
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
