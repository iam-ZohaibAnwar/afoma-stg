import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import axios from "axios";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });

//const noto = Noto_Serif({ subsets: ["latin"] });

const Terms_and_Conditions = ({ cart, addToCart }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AFOMA Marketplace Seller Terms & Conditions",
    url: "https://afomamarketplace.com/terms-conditions",
    headline: "AFOMA Marketplace Seller Terms & Conditions",
    description:
      "Discover the AFOMA Marketplace Seller Terms & Conditions. Join our community of artisans and start selling your unique products today.",
    mainEntity: {
      "@type": "Article",
      headline: "AFOMA Marketplace Seller Terms & Conditions",
      description:
        "Detailed seller terms and conditions for AFOMA Marketplace, including guidelines for product eligibility, packaging, fair practices, and compliance requirements.",
      author: {
        "@type": "Organization",
        name: "AFOMA Marketplace",
      },
      publisher: {
        "@type": "Organization",
        name: "AFOMA Marketplace",
        logo: {
          "@type": "ImageObject",
          url: "https://afomamarketplace.com/assets/logo.png",
        },
      },
      datePublished: "2024-11-18",
      dateModified: "2024-11-18",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://afomamarketplace.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Terms & Conditions",
          item: "https://afomamarketplace.com/terms-conditions",
        },
      ],
    },
  };
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/type/terms-conditions`,
      headers: {},
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        setLoading(false);
        if (
          response &&
          response.data &&
          response.data.settings &&
          response.data.settings.length
        ) {
          setContent(JSON.parse(response.data?.settings?.[0]?.content));
        }
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="AFOMA Marketplace Seller Terms & Conditions"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="Discover the AFOMA Marketplace Seller Terms & Conditions. Join our community of artisans and start selling your unique products today."
        ></meta>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>
      <section>
        <Header cart={cart} addToCart={addToCart} />
      </section>

      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-10 lg:py-20">
          <div>
            <h1
              className={`text-2xl xl:text-4xl text-blue-950 text-center mb-8 xl:mb-16 noto-font`}
            >
              Seller Terms and Conditions
            </h1>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: content || "Loading...",
            }}
          ></div>
        </div>
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
};

export default Terms_and_Conditions;
