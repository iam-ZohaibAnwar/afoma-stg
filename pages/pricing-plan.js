import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import dynamic from "next/dynamic";

const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Pricing = () => {
  const [faqOne, setFaqOne] = useState(false);
  const [faqTwo, setFaqTwo] = useState(false);
  const [faqThree, setFaqThree] = useState(false);
  const [faqFour, setFaqFour] = useState(false);
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
        <div className="max-w-screen-xl mx-auto px-4 py-6 ">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="209.353"
              height="41.999"
              viewBox="0 0 209.353 41.999"
            >
              <g id="Layer_x0020_1" transform="translate(0.01 -0.003)">
                <g id="_6WW" transform="translate(-0.01 0.003)">
                  <path
                    id="_2ndCol-6"
                    d="M1372.608,945.864a.737.737,0,0,0,.746.643h.164v.1H1371.3v-.1h.153a.412.412,0,0,0,.4-.429l-.46-5.134-2.144,4.767a5,5,0,0,0-.347,1.042h-.1l-2.614-5.666-.439,4.992a.412.412,0,0,0,.4.429h.153v.1h-1.98v-.1h.163a.722.722,0,0,0,.745-.643l.775-6.544h.092l2.849,6.157,2.787-6.157h.092l.786,6.544Zm100.091.745h-4.144v-.1h.143a.578.578,0,0,0,.592-.541v-4.849a.549.549,0,0,0-.592-.531h-.143v-.1h2.981a4.209,4.209,0,0,0,1.143-.164v1.154h-.113v-.153a.5.5,0,0,0-.51-.521h-2.113v2.594h1.735a.4.4,0,0,0,.418-.439v-.123h.113v1.43h-.113v-.134a.391.391,0,0,0-.387-.429h-1.766v2.594h1.592a1.592,1.592,0,0,0,1.623-1.154h.1l-.562,1.47Zm-8.942-2.573-.113,1.4a3.306,3.306,0,0,1-2.807,1.317,3.209,3.209,0,1,1,0-6.411,4.917,4.917,0,0,1,2.389.613l.224,1.45h-.092a2.3,2.3,0,0,0-2.532-1.756c-1.613,0-2.624,1.1-2.624,2.9a2.589,2.589,0,0,0,2.635,2.89,2.5,2.5,0,0,0,2.827-2.4h.092Zm-12.771.194-1.144-2.8-1.184,2.8Zm1.469,1.685a.937.937,0,0,0,.8.592h.072v.1h-2.093v-.1h.082a.422.422,0,0,0,.357-.613l-.562-1.358h-2.583l-.562,1.328a.428.428,0,0,0,.358.643h.082v.1h-1.949v-.1h.081a.924.924,0,0,0,.8-.592l2.113-4.523a5.457,5.457,0,0,0,.4-1.051h.092l2.521,5.574Zm-9.982-.776-.571,1.47h-4.145v-.1h.143a.578.578,0,0,0,.592-.541v-4.828a.592.592,0,0,0-.613-.552h-.123v-.1h2.114v.1h-.123a.581.581,0,0,0-.6.552v5.155h1.592a1.591,1.591,0,0,0,1.623-1.153h.113Zm-11.81-4.655c1.419,0,2.328.664,2.328,1.746a1.909,1.909,0,0,1-2.94,1.582v-.1a1.761,1.761,0,0,0,2.133-1.031,1.9,1.9,0,0,0,.071-.552c0-.827-.612-1.337-1.613-1.337h-.981v5.165a.566.566,0,0,0,.592.552h.134l.009.1h-2.123v-.1h.143a.576.576,0,0,0,.592-.541v-4.839a.563.563,0,0,0-.592-.541h-.143v-.1h2.389Zm-8.074-.01a4.282,4.282,0,0,0,1.144-.164v1.153h-.113V941.3a.5.5,0,0,0-.51-.521h-1.848v5.186a.587.587,0,0,0,.6.541h.112v.1h-2.1l.009-.1H1420a.588.588,0,0,0,.6-.552V940.78h-1.848a.5.5,0,0,0-.51.521v.163h-.113V940.31a4.192,4.192,0,0,0,1.133.164h3.328Zm-9.319,6.135h-4.144v-.1h.143a.578.578,0,0,0,.592-.541v-4.849a.55.55,0,0,0-.592-.531h-.143v-.1h2.981a4.209,4.209,0,0,0,1.143-.164v1.154h-.113v-.153a.5.5,0,0,0-.51-.521h-2.114v2.594h1.736a.4.4,0,0,0,.419-.439v-.123h.112v1.43h-.112v-.134a.391.391,0,0,0-.388-.429h-1.766v2.594h1.594a1.593,1.593,0,0,0,1.623-1.154h.1Zm-9.381-.521a1.041,1.041,0,0,0,.889.419v.1h-.378a1.947,1.947,0,0,1-1.5-.582l-2.246-2.46,2.2-2.582c.153-.184.02-.4-.224-.4h-.082v-.1h2.072v.1h-.041a1.363,1.363,0,0,0-.99.368l-2.225,2.379,2.531,2.756Zm-3.593-.132a.587.587,0,0,0,.6.551h.113v.1h-2.093v-.1h.123a.587.587,0,0,0,.6-.551v-4.818a.587.587,0,0,0-.6-.551h-.123v-.1h2.093v.1h-.113a.578.578,0,0,0-.6.531Zm-9.055-5.472c1.287,0,2.073.623,2.073,1.654a1.716,1.716,0,0,1-1.583,1.684,2.9,2.9,0,0,1,.786.8,14.064,14.064,0,0,0,.888,1.113c.418.47.7.766,1.266.776v.1h-.317a2.156,2.156,0,0,1-1.9-.9c-.112-.142-.918-1.3-1-1.4a1.489,1.489,0,0,0-1.03-.684v-.1s.245.01.582,0c.561-.01,1.2-.021,1.5-.878a1.588,1.588,0,0,0,.071-.583,1.256,1.256,0,0,0-1.357-1.256c-.572-.031-1.073,0-1.174-.01v5.155a.569.569,0,0,0,.581.552h.133l.01.1h-2.093v-.1h.142a.582.582,0,0,0,.583-.541v-4.849a.553.553,0,0,0-.583-.531h-.142v-.1h2.562Zm-9.249,3.747-1.144-2.8-1.184,2.8Zm1.469,1.685a.936.936,0,0,0,.8.592h.072v.1h-2.093v-.1h.082a.422.422,0,0,0,.357-.613l-.561-1.358h-2.583l-.562,1.328c-.153.408.112.643.357.643h.082v.1h-1.95v-.1h.082a.923.923,0,0,0,.8-.592l2.113-4.523a5.415,5.415,0,0,0,.4-1.051h.092l2.521,5.574Z"
                    transform="translate(-1314.113 -904.754)"
                    fill="#232323"
                  />
                  <path
                    id="_1stCol-6"
                    d="M149.993,11.022l1.418,1.417L149.993,13.9l-1.417-1.465,1.417-1.417ZM93.219,20.946A9.574,9.574,0,0,1,92.5,8.31l-.252-.255A9.913,9.913,0,0,0,106.1,22.043l-.252-.255a9.574,9.574,0,0,1-12.63-.842Zm13.469-14.07A9.932,9.932,0,0,0,93.923,6.4l.253.255a9.575,9.575,0,0,1,12.265.482l-2.2,2.278c-2.534-1.551-5.3-2.443-7.957-.485h0A5.087,5.087,0,0,0,94.5,14.508c.044.146.093.291.148.432a.164.164,0,0,0,.209.042.16.16,0,0,0,.073-.163,3.586,3.586,0,0,1-.152-.385A4.732,4.732,0,0,1,96.46,9.163c2.5-1.838,5.139-1.007,7.575.47l-.4.422a1.612,1.612,0,1,0,.574.6l.567-.543c.853.564,1.674,1.186,2.449,1.773q.68.5,1.294.965c.34.245.685.47,1.031.674a9.568,9.568,0,0,1-2.024,6.61l.253.255a9.915,9.915,0,0,0,2.14-6.656,11.6,11.6,0,0,0,1.549.707,11.456,11.456,0,1,1-4.051-8.95,14.229,14.229,0,0,0-.721,1.385l0,0Zm.431.936a9.5,9.5,0,0,1,2.394,5.338c-.291-.176-.569-.359-.827-.545-.413-.3-.839-.623-1.291-.964-.761-.578-1.57-1.187-2.409-1.747l2.134-2.081Zm2.772,5.558a9.862,9.862,0,0,0-2.518-5.806l.094-.092h0a12.1,12.1,0,0,0,1.271-.663,11.393,11.393,0,0,1,2.728,7.3,11.919,11.919,0,0,1-1.575-.737Zm9.14-1.986a4.909,4.909,0,0,1-3.194,3.11,6.491,6.491,0,0,1-3.543-.112c0-.055,0-.11,0-.164a12.218,12.218,0,0,0-2.858-7.863,12.154,12.154,0,0,0,1.77-1.507c.057-.059.611-.644,1.207-1.39a7.137,7.137,0,0,1,5.5,1.933A5.286,5.286,0,0,1,119.032,11.384ZM109.685,3.41C111.616,1.375,113.1.5,113.436.561c.058.26-.425,1.267-1.574,2.671a7.294,7.294,0,0,0-1.8.493.145.145,0,0,0-.082.192.148.148,0,0,0,.193.078,7.212,7.212,0,0,1,1.4-.42c-.239.271-.5.574-.792.88a11.7,11.7,0,0,1-1.728,1.46q-.36-.392-.754-.752a13.762,13.762,0,0,1,1.383-1.753Zm-1.341,2.959q-.5.294-1.028.538.248-.525.539-1.026Q108.107,6.118,108.344,6.369Zm9.783-1.179a7.418,7.418,0,0,0-5.462-2.022c.876-1.134,1.725-2.51,1.182-3.02-.967-.9-4.438,2.721-4.586,2.876a14.229,14.229,0,0,0-1.4,1.756,12.268,12.268,0,1,0,4.426,9.921,6.788,6.788,0,0,0,3.632.082A5.183,5.183,0,0,0,119.3,11.5a5.558,5.558,0,0,0-1.176-6.312Zm-14.789,5.17c-.592.615-1.293,1.34-1.592,1.65a1.2,1.2,0,0,1,1.592-1.65Zm-1.073,2.148,1.632-1.561a1.2,1.2,0,0,1-1.632,1.561Zm-7.608,7.034.233.011,1.347-1.284a1.615,1.615,0,1,0-.2-.19l-1.378,1.462Zm1.879-1.558,1.707-1.628a1.2,1.2,0,0,1-1.707,1.628Zm1.417-1.938L96.317,17.78a1.2,1.2,0,0,1,1.635-1.735Zm4.847,2.169A1.209,1.209,0,0,1,101.7,16.48l.1-.22.864.865a.193.193,0,0,0,.253,0,.178.178,0,0,0,0-.25l-.863-.863.216-.105a1.2,1.2,0,0,1,.521-.122,1.215,1.215,0,0,1,0,2.429Zm-4.474-6.262h0l-.1.219-.864-.865a.18.18,0,0,0-.251,0,.178.178,0,0,0,0,.251l.864.863-.218.1a1.2,1.2,0,0,1-.521.12,1.214,1.214,0,1,1,1.214-1.214,1.2,1.2,0,0,1-.121.519ZM102.8,15.43a1.56,1.56,0,0,0-.864.261l-.117.076-.05-.049-3.307-3.307.077-.117a1.546,1.546,0,0,0,.262-.863A1.57,1.57,0,1,0,97.232,13a1.553,1.553,0,0,0,.863-.262l.115-.077.1.1,3.256,3.258-.076.116a1.568,1.568,0,1,0,1.308-.7Zm-93.365-4.2h3.052v-.972H9.434Zm0,4.887h3.052v-.972H9.434ZM10.96,13.4l-.1-.1.1-.1.1.1Zm1.392-.127L10.96,11.88,9.539,13.3l1.416,1.417,1.125-1.083.272-.363ZM4.99,17.257l5.97-13.316L16.9,17.257ZM10.96,1.624-.01,26.17l.853.379,3.742-8.32h12.75l3.742,8.32.852-.379ZM48.469,24.175V2.065h15.8V3H49.441V24.175l.95.99-1.457,1.41-1.413-1.414Zm3.5-11.773h.939v3.052h-.939Zm-1.354,0h.973v3.052h-.973Zm3.368,1.057h7.445V14.4H53.983v-.938ZM149.992,19.9l11.7-18.581V26.452h-.939V4.612L149.992,21.7,139.234,4.612V26.452H138.3V1.315l11.7,18.581Zm1.526-4.9h-3.052v-.938h3.052Zm0,1.353h-3.052v-.938h3.052Zm45.329-5.118H199.9v-.972h-3.052Zm0,4.887H199.9v-.972h-3.052Zm1.525-2.716-.1-.1.1-.1.1.1Zm1.393-.127-1.393-1.392-1.421,1.42,1.417,1.417,1.125-1.083.272-.363ZM192.4,17.257l5.969-13.316,5.938,13.316Zm5.97-15.633L187.4,26.17l.853.379L192,18.229h12.75l3.743,8.32.853-.379L198.373,1.624Z"
                    transform="translate(0.01 -0.003)"
                    fillRule="evenodd"
                  />
                </g>
              </g>
            </svg>
          </Link>
        </div>
      </section>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 pt-6">
          {" "}
          <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
            <div className="hover:text-primary flex items-center gap-1.5">
              <Link href="/">
                {" "}
                <span>Home</span>
              </Link>
              <FontAwesomeIcon icon={faAngleRight} size="sm" />
            </div>
            <div className="hover:text-primary flex items-center gap-1.5">
              <Link href="/register-as-a-seller">
                {" "}
                <span>Register as a Seller</span>
              </Link>
              <FontAwesomeIcon icon={faAngleRight} size="sm" />
            </div>
            <span className="text-primary ">Checkout</span>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-3xl mx-auto px-4 md:px-0 py-8 md:py-16 xl:pb-32">
          <h1
            className={`text-4xl xl:text-5xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-center xl:mb-12 mb-5 noto-font `}
          >
            Free Product Listing for 1 Year!
          </h1>
          <div className="bg-blue-950 rounded-md p-6 md:p-[30px] flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <h4
                className={`text-xl md:text-2xl md:tracking-[-0.48px] text-orange-50 mb-3.5 noto-font`}
              >
                Simple Pricing Plan
              </h4>
              <p className="text-orange-50 text-sm mb-6 md:mb-9">
                Simplify your sales journey with our straightforward pricing
                plan, designed for you, the creator, to maximize your profit.
              </p>
              <Link href="#" className=" buttonprimary w-full">
                Get started for FREE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7.477"
                  height="13.14"
                  viewBox="0 0 7.477 13.14"
                >
                  <path
                    id="Down_Arrow_3_"
                    d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
                    transform="translate(-39.625 32.764) rotate(-90)"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="0.75"
                  />
                </svg>
              </Link>
            </div>
            <div className="bg-orange-50 rounded-md p-6 md:p-[30px] md:pr-8 md:w-[374px] shrink-0">
              <p className="text-sm font-medium text-blue-950 mb-6">
                Promotional offer:
              </p>
              <div className="flex justify-between mb-6">
                <div className="flex gap-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.102"
                    height="14.867"
                    viewBox="0 0 19.102 14.867"
                    className="mt-2"
                  >
                    <path
                      id="circle-check-regular"
                      d="M14.571,20.649a1.936,1.936,0,0,1-2.731,0L7.426,16.234A1.931,1.931,0,0,1,10.157,13.5l3.049,3.049,7.463-7.463A1.931,1.931,0,0,1,23.4,11.82Z"
                      transform="translate(-5.862 -7.345)"
                      fill="#1F628E"
                      stroke="#fff4e7"
                      strokeWidth="2"
                    />
                  </svg>
                  <div>
                    <h4 className="text-blue-950 text-xl md:text-2xl mb-1">
                      $0.10
                    </h4>
                    <p className="text-slate-600 text-sm">
                      product listing fee
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.102"
                    height="14.867"
                    viewBox="0 0 19.102 14.867"
                    className="mt-2"
                  >
                    <path
                      id="circle-check-regular"
                      d="M14.571,20.649a1.936,1.936,0,0,1-2.731,0L7.426,16.234A1.931,1.931,0,0,1,10.157,13.5l3.049,3.049,7.463-7.463A1.931,1.931,0,0,1,23.4,11.82Z"
                      transform="translate(-5.862 -7.345)"
                      fill="#1F628E"
                      stroke="#fff4e7"
                      strokeWidth="2"
                    />
                  </svg>
                  <div>
                    <h4 className="text-blue-950 text-xl md:text-2xl mb-1">
                      9%
                    </h4>
                    <p className="text-slate-600 text-sm">commission fee</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Unlimited product listing at $0 for 1 year (valid from xxxx to
                xxxxx)
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#FFF3E5]">
        <div className="max-w-screen-lg mx-auto px-4  py-8 md:py-20 ">
          <div className="flex flex-col gap-6 md:flex-row lg:gap-20 items-start mb-6 md:mb-12 xl:mb-20">
            <div>
              <h2
                className={`text-3xl xl:text-4xl xl:leading-[40px]  xl:tracking-[-0.72px] text-blue-950 mb-4 noto-font `}
              >
                Your Craft, Your Profit – Unleash Your Potential Now!
              </h2>
              <p className="text-slate-600 font-medium mb-6 md:mb-9">
                Be empowered. Earn your worth! Join us today and take home 90%
                of your sales.
              </p>
              <Link href="#" className=" buttonprimary">
                Start listing for free
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7.477"
                  height="13.14"
                  viewBox="0 0 7.477 13.14"
                >
                  <path
                    id="Down_Arrow_3_"
                    d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
                    transform="translate(-39.625 32.764) rotate(-90)"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="0.75"
                  />
                </svg>
              </Link>
            </div>
            <div className="bg-orange-100 rounded-sm p-6 md:w-[380px] lg:w-[430px] md:shrink-0 ">
              <svg
                id="quote"
                xmlns="http://www.w3.org/2000/svg"
                width="29.919"
                height="21.47"
                viewBox="0 0 29.919 21.47"
                className="mb-5"
              >
                <path
                  id="Path_2346"
                  data-name="Path 2346"
                  d="M.877,0H12.143a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877H7.386v7.573a.877.877,0,0,1-.877.877H3.693a.876.876,0,0,1-.831-.6L.045,12.42A.872.872,0,0,1,0,12.143V.877A.876.876,0,0,1,.877,0Zm0,0"
                  transform="translate(16.9)"
                  fill="#1F628E"
                />
                <path
                  id="Path_2347"
                  data-name="Path 2347"
                  d="M290.075,0h11.267a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877h-4.757v7.573a.877.877,0,0,1-.877.877h-2.817a.877.877,0,0,1-.832-.6l-2.817-8.45a.88.88,0,0,1-.045-.277V.877A.876.876,0,0,1,290.075,0Zm0,0"
                  transform="translate(-289.199)"
                  fill="#1F628E"
                />
              </svg>
              <p className="font-medium text-blue-950 mb-[18px]">
                &quot;Lorem ipsum dolor sit amet, consetetur nonyum sadipscing
                elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                dolore aliquyam.&quot;
              </p>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/assets/pricing-plan/quote-image-home-pg.png"}
                  alt="Clarissa Rebello"
                  height={39}
                  width={39}
                  quality={100}
                />
                <p className="text-blue-950 text-sm">Clarissa Rebello</p>
              </div>
            </div>
          </div>
          <div>
            <h4
              className={`text-2xl xl:text-3xl mb-6 xl:mb-11 text-blue-950 noto-font`}
            >
              How it Works - 3 Easy Steps
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-16">
              <div>
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.87"
                    height="28.405"
                    viewBox="0 0 29.87 28.405"
                  >
                    <g id="edit" transform="translate(-1.35 -0.85)">
                      <path
                        id="Path_2355"
                        data-name="Path 2355"
                        d="M12.907,2.35a5.4,5.4,0,1,0,5.4,5.4A5.4,5.4,0,0,0,12.907,2.35Zm-6.751,5.4A6.751,6.751,0,1,1,12.907,14.5,6.751,6.751,0,0,1,6.156,7.751Z"
                        transform="translate(1.631)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.3"
                        fillRule="evenodd"
                      />
                      <path
                        id="Path_2356"
                        data-name="Path 2356"
                        d="M16.3,14.335A23.831,23.831,0,0,0,3.142,17.041a.55.55,0,0,0-.292.486v4.958a.675.675,0,0,0,.675.675h7.426a.675.675,0,1,1,0,1.35H3.525A2.025,2.025,0,0,1,1.5,22.485V17.528a1.9,1.9,0,0,1,1.009-1.679,25.181,25.181,0,0,1,13.9-2.859.675.675,0,0,1-.112,1.346Z"
                        transform="translate(0 4.17)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.3"
                        fillRule="evenodd"
                      />
                      <path
                        id="Path_2357"
                        data-name="Path 2357"
                        d="M12.4,21.558a3.376,3.376,0,0,1,.958-1.935l8.306-8.306a3.376,3.376,0,0,1,4.774,4.774L18.127,24.4a3.375,3.375,0,0,1-1.935.958l-3.512.475a.675.675,0,0,1-.76-.759Zm1.913-.98a2.024,2.024,0,0,0-.575,1.161l-.356,2.634,2.634-.356a2.026,2.026,0,0,0,1.161-.575l8.307-8.307a2.025,2.025,0,1,0-2.864-2.864Z"
                        transform="translate(3.648 3.267)"
                        fill="#1F628E"
                        stroke="#1F628E"
                        strokeWidth="0.3"
                        fillRule="evenodd"
                      />
                    </g>
                  </svg>
                </div>
                <div>
                  <h6 className="md:text-xl font-medium text-blue-950 mb-3">
                    Create Your Seller Profile
                  </h6>
                  <p className="text-slate-600 text-xs md:text-sm">
                    Join our artisan community - Register, log in, and share
                    your unique brand story and details to create your seller
                    profile!
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.87"
                    height="28.405"
                    viewBox="0 0 25.833 31"
                  >
                    <g
                      id="vase_1_"
                      data-name="vase (1)"
                      transform="translate(-2)"
                    >
                      <path
                        id="Path_2351"
                        data-name="Path 2351"
                        d="M19.854,5.167H8.229A3.234,3.234,0,0,1,5,1.938V.646A.646.646,0,0,1,5.646,0H22.437a.646.646,0,0,1,.646.646V1.938A3.234,3.234,0,0,1,19.854,5.167ZM6.292,1.292v.646A1.94,1.94,0,0,0,8.229,3.875H19.854a1.94,1.94,0,0,0,1.938-1.937V1.292Z"
                        transform="translate(0.875)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2352"
                        data-name="Path 2352"
                        d="M19.868,30.125h-9.9a3.252,3.252,0,0,1-1.937-.646l-.9-.673A12.829,12.829,0,0,1,6.815,8.524,4.356,4.356,0,0,0,8.458,5.105V3.646a.646.646,0,1,1,1.292,0v1.46A5.647,5.647,0,0,1,7.623,9.533a11.538,11.538,0,0,0,.284,18.241l.9.672a1.955,1.955,0,0,0,1.162.387h9.9a1.94,1.94,0,0,0,1.161-.387l.9-.673a11.536,11.536,0,0,0,.284-18.238,5.649,5.649,0,0,1-2.127-4.429V3.646a.646.646,0,0,1,1.292,0v1.46a4.358,4.358,0,0,0,1.643,3.419A12.831,12.831,0,0,1,22.7,28.807l-.9.672A3.249,3.249,0,0,1,19.868,30.125Z"
                        transform="translate(0 0.875)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2353"
                        data-name="Path 2353"
                        d="M24.488,19.577a2.856,2.856,0,0,1-2.078-.842,1.74,1.74,0,0,0-2.3,0,3.058,3.058,0,0,1-4.157,0,1.74,1.74,0,0,0-2.3,0,3.058,3.058,0,0,1-4.157,0,1.74,1.74,0,0,0-2.3,0,3.058,3.058,0,0,1-4.157,0,.785.785,0,0,0-.258-.2.646.646,0,1,1,.539-1.174,2.075,2.075,0,0,1,.66.487,1.754,1.754,0,0,0,2.288-.014,3.058,3.058,0,0,1,4.157,0,1.74,1.74,0,0,0,2.3,0,3.058,3.058,0,0,1,4.157,0,1.74,1.74,0,0,0,2.3,0,3.058,3.058,0,0,1,4.157,0,1.74,1.74,0,0,0,2.3,0,2.061,2.061,0,0,1,.646-.473.646.646,0,1,1,.539,1.174.788.788,0,0,0-.244.183,2.858,2.858,0,0,1-2.09.856Z"
                        transform="translate(0.116 4.965)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2354"
                        data-name="Path 2354"
                        d="M24.572,15.577a2.856,2.856,0,0,1-2.078-.842,1.74,1.74,0,0,0-2.3,0,3.058,3.058,0,0,1-4.157,0,1.74,1.74,0,0,0-2.3,0,3.058,3.058,0,0,1-4.157,0,1.74,1.74,0,0,0-2.3,0,3.058,3.058,0,0,1-4.157,0,1.362,1.362,0,0,0-.567-.354.645.645,0,1,1,.408-1.224,2.625,2.625,0,0,1,1.091.685,1.745,1.745,0,0,0,2.3-.005,3.058,3.058,0,0,1,4.157,0,1.74,1.74,0,0,0,2.3,0,3.058,3.058,0,0,1,4.157,0,1.74,1.74,0,0,0,2.3,0,3.058,3.058,0,0,1,4.157,0,1.74,1.74,0,0,0,2.3,0,2.616,2.616,0,0,1,1.086-.679.645.645,0,1,1,.408,1.224,1.358,1.358,0,0,0-.563.349A2.855,2.855,0,0,1,24.572,15.577Z"
                        transform="translate(0.032 3.798)"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>
                </div>
                <div>
                  <h6 className="md:text-xl font-medium text-blue-950 mb-3">
                    Showcase Your Creations
                  </h6>
                  <p className="text-slate-600 text-xs md:text-sm">
                    Upload your stunning creations with high-quality images and
                    captivating product descriptions. Let your craft speak for
                    itself!
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.87"
                    height="28.405"
                    viewBox="0 0 31 31"
                  >
                    <defs>
                      <clipPath id="clipPath">
                        <path
                          id="path291"
                          d="M0-682.665H31v31H0Z"
                          transform="translate(0 682.665)"
                          fill="#1F628E"
                        />
                      </clipPath>
                    </defs>
                    <g id="g285" transform="translate(0 682.665)">
                      <g id="g287" transform="translate(0 -682.665)">
                        <g id="g289" clipPath="url(#clipPath)">
                          <g id="g295" transform="translate(6.458 6.439)">
                            <path
                              id="path297"
                              d="M-438.592,0a14.83,14.83,0,0,1,3.072,9.061,14.9,14.9,0,0,1-14.895,14.895,14.829,14.829,0,0,1-9.042-3.057"
                              transform="translate(459.456)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g299" transform="translate(6.921 0.605)">
                            <path
                              id="path301"
                              d="M0-57.121a14.826,14.826,0,0,1,8.579-2.717,14.829,14.829,0,0,1,9.064,3.075"
                              transform="translate(0 59.839)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g303" transform="translate(0.605 7.203)">
                            <path
                              id="path305"
                              d="M-64.165-364.341a14.829,14.829,0,0,1-3.052-9.035,14.825,14.825,0,0,1,2.523-8.3"
                              transform="translate(67.217 381.672)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g307" transform="translate(10.535 12.474)">
                            <path
                              id="path309"
                              d="M-196.877-208.711c-.83,4.751-2.489,7.992-4.4,7.992-2.742,0-4.965-6.669-4.965-14.895,0-1.037.035-2.049.1-3.026"
                              transform="translate(206.242 218.639)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g311" transform="translate(11.095 0.605)">
                            <path
                              id="path313"
                              d="M0-168.558c.828-4.765,2.49-8.018,4.405-8.018,2.742,0,4.965,6.669,4.965,14.895,0,1.037-.035,2.05-.1,3.027"
                              transform="translate(0 176.577)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g315" transform="translate(1.675 20.465)">
                            <path
                              id="path317"
                              d="M0,0H16.569"
                              transform="translate(0 0)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g319" transform="translate(12.977 10.535)">
                            <path
                              id="path321"
                              d="M0,0H16.348"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g323" transform="translate(1.675 10.535)">
                            <path
                              id="path325"
                              d="M0,0H7.164"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g327" transform="translate(18.245 18.527)">
                            <path
                              id="path329"
                              d="M-81.458-40.729A1.938,1.938,0,0,0-83.4-42.667a1.938,1.938,0,0,0-1.937,1.938A1.938,1.938,0,0,0-83.4-38.792,1.938,1.938,0,0,0-81.458-40.729Z"
                              transform="translate(85.333 42.667)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g331" transform="translate(8.84 8.598)">
                            <path
                              id="path333"
                              d="M-81.458-40.729A1.938,1.938,0,0,0-83.4-42.667a1.938,1.938,0,0,0-1.937,1.938A1.938,1.938,0,0,0-83.4-38.792,1.938,1.938,0,0,0-81.458-40.729Z"
                              transform="translate(85.333 42.667)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g335" transform="translate(24.098 3.027)">
                            <path
                              id="path337"
                              d="M-81.458-40.729A1.938,1.938,0,0,0-83.4-42.667a1.938,1.938,0,0,0-1.937,1.938A1.938,1.938,0,0,0-83.4-38.792,1.938,1.938,0,0,0-81.458-40.729Z"
                              transform="translate(85.333 42.667)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g339" transform="translate(3.027 24.098)">
                            <path
                              id="path341"
                              d="M-81.458-40.729A1.938,1.938,0,0,0-83.4-42.667a1.938,1.938,0,0,0-1.937,1.938A1.938,1.938,0,0,0-83.4-38.792,1.938,1.938,0,0,0-81.458-40.729Z"
                              transform="translate(85.333 42.667)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g343" transform="translate(22.12 20.465)">
                            <path
                              id="path345"
                              d="M0,0H7.205"
                              transform="translate(0 0)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g id="g347" transform="translate(4.848 5.09)">
                            <path
                              id="path349"
                              d="M0,0H0"
                              transform="translate(0 0)"
                              fill="none"
                              stroke="#1F628E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div>
                  <h6 className="md:text-xl font-medium text-blue-950 mb-3">
                    Connect with Global Audience
                  </h6>
                  <p className="text-slate-600 text-xs md:text-sm">
                    Share your artistry, inspire, and reach hearts across the
                    globe! Let the world fall in love with your creation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-[1035px] mx-auto px-4">
          <div className="pt-12 md:pt-20 lg:pt-32 mb-6 md:mb-12 xl:mb-32 ">
            {" "}
            <div className="flex flex-col md:flex-row gap-8 xl:gap-16 justify-center">
              {" "}
              <div className="shrink-0 md:w-[330px] xl:w-[456px]">
                {" "}
                <div>
                  {" "}
                  <p
                    className={`xl:text-start text-blue-950 text-center text-3xl lg:text-4xl mb-3  tracking-[-0.52px] xl:tracking-[-0.72px] noto-font`}
                  >
                    Unleash Your Earnings Potential!
                  </p>{" "}
                  <p className="xl:text-start text-center text-blue-950 text-sm md:text-base">
                    Unleash Your Earnings Potential!
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="shrink-0 flex items-center  gap-2.5 mb-4">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="shrink-0 "
                    viewBox="0 0 18.594 18.594"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>{" "}
                  <p className=" text-sm md:text-base text-blue-950">
                    No Shipping Label (Waybill) Fee
                  </p>{" "}
                </div>{" "}
                <div className="shrink-0 flex items-center  gap-2.5 mb-4">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="shrink-0"
                    viewBox="0 0 18.594 18.594"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>{" "}
                  <p className=" text-sm md:text-base text-blue-950">
                    No Payment Processing Fee{" "}
                  </p>{" "}
                </div>{" "}
                <div className="shrink-0 flex items-center  gap-2.5 mb-4">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="shrink-0"
                    viewBox="0 0 18.594 18.594"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>{" "}
                  <p className=" text-sm md:text-base text-blue-950">
                    No Listing Currency Fee{" "}
                  </p>{" "}
                </div>{" "}
                <div className="shrink-0 flex items-center  gap-2.5 mb-4">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="shrink-0"
                    viewBox="0 0 18.594 18.594"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>{" "}
                  <p className=" text-sm md:text-base text-blue-950">
                    Optional and Affordable Marketing and Advertising Fee{" "}
                  </p>{" "}
                </div>{" "}
                <div className="shrink-0 flex items-center  gap-2.5">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="shrink-0"
                    viewBox="0 0 18.594 18.594"
                  >
                    <g
                      id="Orange_checkbox_ticked"
                      data-name="Orange checkbox ticked"
                      transform="translate(-3 -3)"
                    >
                      <path
                        id="Path_2364"
                        data-name="Path 2364"
                        d="M11.63,18.583a.715.715,0,0,1-.5-.206l-2.9-2.861a.715.715,0,0,1,1-1.018l2.4,2.36,6.608-6.642a.715.715,0,1,1,1.014,1.008l-7.109,7.151A.715.715,0,0,1,11.63,18.583Z"
                        transform="translate(-1.436 -1.995)"
                        fill="#1F628E"
                      />
                      <path
                        id="Path_2365"
                        data-name="Path 2365"
                        d="M19.448,21.594H5.145A2.145,2.145,0,0,1,3,19.448V5.145A2.145,2.145,0,0,1,5.145,3h14.3a2.145,2.145,0,0,1,2.145,2.145v14.3A2.145,2.145,0,0,1,19.448,21.594ZM5.145,4.43a.715.715,0,0,0-.715.715v14.3a.715.715,0,0,0,.715.715h14.3a.715.715,0,0,0,.715-.715V5.145a.715.715,0,0,0-.715-.715Z"
                        fill="#1F628E"
                      />
                    </g>
                  </svg>{" "}
                  <p className=" text-sm md:text-base text-blue-950">
                    No Listing Fee (promotional offer){" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>
          <div className="max-w-[640px] mx-auto">
            <h2
              className={`text-3xl xl:text-4xl xl:leading-[40px] text-center xl:tracking-[-0.72px] text-blue-950 mb-5 noto-font `}
            >
              How We Compare to Other Sites
            </h2>
            <p className="text-slate-600 text-center mb-8 md:mb-12 xl:mb-16">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod et tempor invidunt ut labore et dolore magna
              aliquyam erat.
            </p>
          </div>
          <div className="border border-[#1F628E75] rounded-md bg-orange-100/30 shrink-0">
            <div className="flex border-b border-[#1F628E75]">
              <div className="p-6  border-r border-[#1F628E75] w-[311px] shrink-0">
                <h6 className="text-blue-950 text-xl font-medium">
                  Pricing plans
                </h6>
              </div>
              <div className=" p-5 bg-orange-100 border-r border-[#1F628E75] w-[180px] shrink-0">
                <h6 className="text-blue-950 text-xl text-center font-medium mb-6">
                  AFOMA Marketplace
                </h6>
                <div className="flex items-center justify-center">
                  <div className="h-px w-6 bg-gray-500 "></div>
                </div>
                <h4 className="mt-4  text-center text-primary font-medium  ">
                  $ <span className="text-3xl">0.10</span>{" "}
                  <span className="text-gray-600 text-sm"> /month</span>
                </h4>
              </div>
              <div className=" p-6  border-r border-[#1F628E75] w-[180px] shrink-0">
                <h6 className="text-blue-950 text-xl text-center font-medium mb-6">
                  Amazon Handmade
                </h6>
                <div className="flex items-center justify-center">
                  <div className="h-px w-6 bg-gray-500 "></div>
                </div>
                <h4 className="mt-4  text-center text-blue-950 font-medium  ">
                  $ <span className="text-3xl">0.10</span>{" "}
                  <span className="text-gray-600 text-sm"> /month</span>
                </h4>
              </div>
              <div className=" p-5  border-r border-[#1F628E75] w-[180px] shrink-0">
                <h6 className="text-blue-950 text-xl text-center font-medium mb-6">
                  ETSY
                </h6>
                <div className="flex items-center justify-center">
                  <div className="h-px w-6 bg-gray-500 "></div>
                </div>
                <h4 className="mt-4  text-center text-blue-950 font-medium  ">
                  $ <span className="text-3xl">8</span>{" "}
                  <span className="text-gray-600 text-sm"> /month</span>
                </h4>
              </div>
              <div className=" p-5  w-[180px] shrink-0">
                <h6 className="text-blue-950 text-xl text-center font-medium mb-6">
                  Afrikrea
                </h6>
                <div className="flex items-center justify-center">
                  <div className="h-px w-6 bg-gray-500 "></div>
                </div>
                <h4 className="mt-4  text-center text-blue-950 font-medium  ">
                  $ <span className="text-3xl">8</span>{" "}
                  <span className="text-gray-600 text-sm"> /month</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-[640px] mx-auto px-4 py-8">
          <h2
            className={`text-blue-950 xl:tracking-[-0.72px] mb-8 md:mb-9 text-2xl lg:text-4xl noto-font`}
          >
            FAQs
          </h2>
          <div>
            <div className="px-3 pb-3  border-b border-b-inputBorder  xl:pb-6">
              <div
                className="flex items-center justify-between cursor-pointer "
                onClick={() => {
                  setFaqOne(!faqOne);
                  setFaqTwo(false);
                  setFaqThree(false);
                  setFaqFour(false);
                }}
              >
                <p className="font-medium md:text-lg text-blue-950">
                  What payment methods are accepted on the SELLITIC marketplace?
                </p>
                <div className="shrink-0">
                  <svg
                    width="14.381"
                    height="8.152"
                    viewBox="0 0 14.381 8.152"
                    className={faqOne ? "-rotate-180" : "rotate-0"}
                  >
                    <path
                      id="FAQ_dropdown_icon"
                      data-name="FAQ dropdown icon"
                      d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                      transform="translate(-19.625 -39.625)"
                      fill="#172554"
                      stroke="#172554"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`${
                  faqOne ? "h-fit" : "h-0"
                }  overflow-hidden transition-all ease-in-out`}
              >
                <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                  Becoming a seller is easy! Click the &quot;Become a
                  Seller&quot; or &quot;Register as a Seller&quot; button on our
                  website, and follow the step-by-step registration process.
                  Once approved, you can showcase your unique handmade creations
                  to our global audience.
                </p>
              </div>
            </div>

            <div className="p-3  border-b border-b-inputBorder  xl:py-6">
              <div
                className="flex items-center justify-between cursor-pointer "
                onClick={() => {
                  setFaqOne(false);
                  setFaqTwo(!faqTwo);
                  setFaqThree(false);
                  setFaqFour(false);
                }}
              >
                <p className="font-medium md:text-lg text-slate-800">
                  Can I track the shipment of my order?
                </p>
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14.381"
                    height="8.152"
                    viewBox="0 0 14.381 8.152"
                    className={faqTwo ? "-rotate-180" : "rotate-0"}
                  >
                    <path
                      id="FAQ_dropdown_icon"
                      data-name="FAQ dropdown icon"
                      d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                      transform="translate(-19.625 -39.625)"
                      fill="#172554"
                      stroke="#172554"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`${
                  faqTwo ? "h-fit" : "h-0"
                }  overflow-hidden transition-all ease-in-out`}
              >
                <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                  We welcome a wide range of artisanal products, including
                  handmade crafts, unique artworks, jewelry, home decor, and
                  more. You can list them for sale as long as your creations are
                  authentic, handcrafted, and comply with our marketplace
                  policies.
                </p>
              </div>
            </div>

            <div className="p-3  border-b border-b-inputBorder  xl:py-6">
              <div
                className="flex items-center justify-between cursor-pointer "
                onClick={() => {
                  setFaqOne(false);
                  setFaqTwo(false);
                  setFaqThree(!faqThree);
                  setFaqFour(false);
                }}
              >
                <p className="font-medium md:text-lg text-slate-800">
                  How are transactions processed on the marketplace?
                </p>
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14.381"
                    height="8.152"
                    viewBox="0 0 14.381 8.152"
                    className={faqThree ? "-rotate-180" : "rotate-0"}
                  >
                    <path
                      id="FAQ_dropdown_icon"
                      data-name="FAQ dropdown icon"
                      d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                      transform="translate(-19.625 -39.625)"
                      fill="#172554"
                      stroke="#172554"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`${
                  faqThree ? "h-fit" : "h-0"
                }  overflow-hidden transition-all ease-in-out`}
              >
                <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                  Our marketplace leverages flexible payment options, including
                  cryptocurrency. When a customer purchases your product, the
                  payment is held in escrow until the order is successfully
                  delivered, providing peace of mind for both buyers and
                  sellers.
                </p>
              </div>
            </div>

            <div className="p-3   xl:py-6">
              <div
                className="flex items-center justify-between cursor-pointer "
                onClick={() => {
                  setFaqOne(false);
                  setFaqTwo(false);
                  setFaqThree(false);
                  setFaqFour(!faqFour);
                }}
              >
                <p className="font-medium md:text-lg text-slate-800">
                  What should I consider about shipping costs for international
                  purchases?
                </p>
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14.381"
                    height="8.152"
                    viewBox="0 0 14.381 8.152"
                    className={faqFour ? "-rotate-180" : "rotate-0"}
                  >
                    <path
                      id="FAQ_dropdown_icon"
                      data-name="FAQ dropdown icon"
                      d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                      transform="translate(-19.625 -39.625)"
                      fill="#172554"
                      stroke="#172554"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`${
                  faqFour ? "h-fit" : "h-0"
                }  overflow-hidden transition-all ease-in-out`}
              >
                <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                  Shipping costs for international purchases may vary based on
                  your location and the seller&apos;s location. Please be aware
                  that your country&apos;s regulations may incur customs duties
                  on the delivery of your product. Despite the potential of
                  incurring higher charges for international shipping, rest
                  assured that your chosen artisanal creations will be carefully
                  packaged and delivered with care.
                </p>
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

export default Pricing;
