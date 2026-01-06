import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const MyAccountSidebar = dynamic(() => import("@/components/MyAccountSidebar"), { ssr: false });
import { inventoryList } from "@/lib/select-option";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Select from "react-select";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Crypto = ({ cart, addToCart }) => {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    fname: "",
    lname: "",
    password: "",
  };

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
        <Header cart={cart} addToCart={addToCart}/>
      </section>

      <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-4 lg:mt-6 lg:mb-6 max-w-screen-xl mx-auto px-4">
        <Link href="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} size="sm" />
        <Link href="/my-account/account-details" className="text-primary">
          My account
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 px-4 mb-10">
        <div className="col-span-2">
          <MyAccountSidebar />
        </div>
        <div className="col-span-4">
          <Formik>
            <Form>
              <div className="p-4 xl:p-6 bg-orange-100 rounded">
                <h1
                  className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font `}
                >
                  My Crypto
                </h1>
                <div className="border border-b text-slate-600/30 mb-4"></div>
                <div className="flex flex-col gap-5 xl:grid md:grid md:grid-cols-3 md:gap-12 xl:grid-cols-3 mb-6 lg:mb-12 view-form">
                  <div className="relative selectform">
                    <label htmlFor="transactionType">Transaction Type</label>
                    <Select
                      name="title"
                      id="title"
                      options={inventoryList}
                      // placeholder="Binance Network"

                      className="st-react-select "
                      classNamePrefix="react-select"
                      defaultValue={() => {
                        if (initialValues.title && initialValues.title != "")
                          return {
                            value: initialValues.title,
                            label: initialValues.title,
                          };
                        else return "";
                      }}
                      // onChange={(selectedOption) => {
                      //   handleChange("title")(selectedOption?.value);
                      // }}
                    />
                  </div>

                  <div className="relative">
                    <div>
                      <label htmlFor="walletAddress">Wallet Address</label>
                    </div>
                    <div>
                      {" "}
                      <Field
                        type="text"
                        name="walletAddress"
                        id="walletAddress"
                        placeholder="Enter wallet address"
                      />
                      <ErrorMessage
                        name="walletAddress"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-start col-span-3">
                    <button
                      type="submit"
                      className="buttonprimary flex gap-2 items-center "
                    >
                      Save
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
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      <section className="overflow-hidden">
        <Footer />
      </section>
    </>
  );
};

export default Crypto;
