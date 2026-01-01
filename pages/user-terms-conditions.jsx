import Footer2 from "@/components/Footer2";
import Header from "@/components/Header";
import React from "react";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Buyer_Terms_and_Conditions = ({ cart, addToCart }) => {
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
        <div className="max-w-screen-xl mx-auto px-4  py-10 md:py-10 lg:py-20 ">
          <div>
            <h1
              className={`text-2xl xl:text-4xl text-blue-950 text-center mb-8 xl:mb-16 noto-font `}
            >
              Buyer Terms and Conditions
            </h1>
          </div>
          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              1. Acceptance of Terms
            </h2>
            <p className="text-blue-950 text-base font-medium">
              As a buyer, you agree to comply with and be bound by these Terms
              and Conditions. If you disagree with these terms, please do not
              use the Platform.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              2. Account Registration
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. To make a purchase, you may be required to register for an
              account. You must provide accurate and complete information and
              update it as needed.
            </p>
            <p className="text-blue-950 text-base font-medium">
              b. You are responsible for maintaining the confidentiality of your
              account information.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              3. Buying Products
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. The AFOMA Marketplace is a platform where artisans sell their
              products. You agree to pay the listed product price and applicable
              taxes or fees.
            </p>
            <p className="text-blue-950 text-base font-medium">
              b. Each product may have its shipping policies and return/refund
              terms. You are responsible for reviewing and understanding these
              policies before purchasing.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              4. Payment and Fees
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. Payments will be processed through one of the Payment
              Processors. By making a purchase, you agree to comply with their
              terms of service.
            </p>
            <p className="text-blue-950 text-base font-medium">
              b. We may charge fees for using the platform, which will be
              outlined in a separate fee schedule.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              5. Product Descriptions and Representations
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. The sellers provide product descriptions. If you have any
              questions about a product, contact the seller directly before
              purchasing.
            </p>
            <p className="text-blue-950 text-base font-medium">
              b. Product images may vary slightly from the actual product due to
              factors such as screen resolution and lighting.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              6. Shipping and Delivery
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. AFOMA Marketplace is not responsible for any loss, damage, or
              delays in shipping. Disputes related to shipping should be
              resolved directly with the seller.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              7. Returns and Refunds
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. Each seller may have their own return and refund policies.
              Review these policies before making a purchase.
            </p>
            <p className="text-blue-950 text-base font-medium">
              b. AFOMA Marketplace is not responsible for facilitating returns
              or refunds but may assist in dispute resolution.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              8. Prohibited Activities
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. Buyers agree not to engage in activities that violate these
              terms or any applicable laws, including but not limited to fraud.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              9. Privacy Policy
            </h2>
            <p className="text-blue-950 text-base font-medium">
              a. AFOMA Marketplace’s Privacy Policy, available on the Platform,
              outlines how buyer data is collected, used, and shared. By using
              the Platform, you agree to the terms of the Privacy Policy.
            </p>
          </div>

          <div className="mb-8 xl:mb-16">
            <h2
              className={`text-blue-950 font-medium mb-5 text-xl xl:text-2xl text-left noto-font`}
            >
              10. Changes to Terms
            </h2>
            <p className="text-blue-950 text-base font-medium">
              AFOMA Marketplace reserves the right to update these Buyer Terms
              and Conditions anytime. Buyers will be notified of any material
              changes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <Footer2 />
      </section>
    </>
  );
};

export default Buyer_Terms_and_Conditions;
