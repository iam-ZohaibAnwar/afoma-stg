import Footer2 from "@/components/Footer2";
import Miniheader from "@/components/Miniheader";
import { faAngleRight, faCheck } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Confirm = () => {
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
        <Miniheader />
      </section>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
            <div className="hover:text-primary flex items-center gap-1.5">
              <Link href="/">
                {" "}
                <span>Home</span>
              </Link>
              <FontAwesomeIcon icon={faAngleRight} size="sm" />
            </div>
            <span className="text-primary ">Checkout</span>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 pt-5 pb-8 md:pb-16 xl:pb-24 ">
          <div className="mb-6 xl:mb-16">
            <h1
              className={`text-4xl xl:text-5xl text-center text-blue-950 xl:tracking-[-0.9px] mb-6 noto-font`}
            >
              Checkout
            </h1>
            <div className="flex items-center justify-center gap-[90px] xl:gap-[107px] relative">
              <div className="absolute top-1/2 border border-blue-950/50 border-dashed w-[270px] xl:w-[299px] h-px z-0"></div>
              <div className="text-sm text-primary py-2.5 px-2 border border-primary rounded-full z-10 bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13.013"
                  height="9.063"
                  viewBox="0 0 13.013 9.063"
                >
                  <path
                    id="check-regular"
                    d="M12.758,96.155a.694.694,0,0,1,0,.984l-7.667,7.67a.694.694,0,0,1-.984,0L.155,100.859a.7.7,0,1,1,.984-.984l3.456,3.456,7.176-7.176a.694.694,0,0,1,.984,0Z"
                    transform="translate(0.05 -95.95)"
                    fill="#fff7ed"
                  />
                </svg>
              </div>
              <div className="text-sm text-primary py-2.5 px-2 border border-primary rounded-full z-10 bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13.013"
                  height="9.063"
                  viewBox="0 0 13.013 9.063"
                >
                  <path
                    id="check-regular"
                    d="M12.758,96.155a.694.694,0,0,1,0,.984l-7.667,7.67a.694.694,0,0,1-.984,0L.155,100.859a.7.7,0,1,1,.984-.984l3.456,3.456,7.176-7.176a.694.694,0,0,1,.984,0Z"
                    transform="translate(0.05 -95.95)"
                    fill="#fff7ed"
                  />
                </svg>
              </div>
              <div className="text-sm text-primary py-1.5 px-3 border border-primary rounded-full z-10 bg-orange-50">
                3
              </div>
            </div>
          </div>
          <div>
            <h1
              className={`text-2xl xl:text-3xl text-blue-950  mb-6 xl:mb-9 noto-font`}
            >
              Thank You!
            </h1>
            <p className="text-blue-950 xl:text-lg mb-5">
              Your order <span className="font-bold">#1025789523</span> has been
              confirmed.
            </p>
          </div>
          <div className="bg-orange-100 rounded p-6 flex flex-col md:flex-row flex-wrap gap-6 lg:gap-12 xl:gap-20 relative">
            <div className="hidden xl:block xl:absolute top-[60px] left-6 right-6 xl:h-[2px] bg-slate-600/30"></div>
            <div className="flex flex-col gap-4 xl:gap-6">
              <h6 className="text-blue-950 font-semibold xl:text-lg  xl:pb-4">
                Order details
              </h6>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="shrink-0 ">
                  <Image
                    src="/assets/checkout/mask-group-407.png"
                    alt="Order Summary"
                    width="130"
                    height="130"
                  />
                </div>

                <div>
                  <h6 className="text-blue-950 xl:text-lg mb-2">
                    Banded Weave Loafers
                  </h6>
                  <p className="text-blue-950 text-xs mb-4">
                    by Clarissa Rebello
                  </p>
                  <div className="flex gap-2 items-center mb-3">
                    <p className="text-blue-950">Qty:</p>
                    <p className="text-blue-950">1</p>
                  </div>
                  <div>
                    <p className="text-blue-950 text-sm">
                      Shoe size:{" "}
                      <span className="font-semibold">European 43</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              <h6 className="text-blue-950 font-semibold xl:text-lg xl:pb-4">
                Delivery by
              </h6>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div>
                  <h6 className="text-blue-950 ">5 August, 2023</h6>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h6 className="text-blue-950 font-semibold xl:text-lg shrink-0 xl:pb-4">
                Ship to
              </h6>
              <div>
                <h6 className="text-blue-950 mb-2">Clarissa Rebello</h6>
                <h6 className="text-blue-950 mb-2">Street name</h6>
                <h6 className="text-blue-950 mb-2">
                  Tornonto, Ontario M5A 2V8
                </h6>
                <h6 className="text-blue-950 mb-2">Canada</h6>
                <h6 className="text-blue-950 mb-2">7025907864</h6>
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              <h6 className="text-blue-950 font-semibold xl:text-lg xl:pb-4">
                Payment details
              </h6>

              <div>
                <h6 className="text-blue-950 text-sm mb-2">CA$90.00</h6>
                <h6 className="text-blue-950 mb-2">PayPal - id</h6>
                <h6 className="text-blue-950 mb-2">Tornonto, Ontario</h6>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer2 />
      </section>
    </>
  );
};

export default Confirm;
