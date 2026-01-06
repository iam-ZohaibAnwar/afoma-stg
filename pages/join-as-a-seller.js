import dynamic from "next/dynamic";

// Lazy load heavy components
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";

const JoinAsASeller = () => {
  const [faqOne, setFaqOne] = useState(false);
  const [faqTwo, setFaqTwo] = useState(false);
  const [faqThree, setFaqThree] = useState(false);
  const [faqFour, setFaqFour] = useState(false);
  const [faqFive, setFaqFive] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const items = [
    {
      title: "Global Reach",
      desc:
        "Sell handmade products online and connect with buyers worldwide. AFOMA makes your crafts visible across borders.",
      icon: (
        // your existing SVG here
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">{/* ... */}</svg>
      ),
    },
    {
      title: "Keep 90% of Sales",
      desc: "Unlike Etsy or Amazon Handmade, AFOMA lets artisans keep nearly all of their earnings with no hidden fees.",
      icon: <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">{/* ... */}</svg>,
    },
    {
      title: "Free Product Listings",
      desc: "We’re handmade-only. Built to empower small business owners.List your handmade jewelry, art, textiles, or décor for free — no setup costs, no complex pricing plans.",
      icon: <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">{/* ... */}</svg>,
    },
    {
      title: "Simple Shipping",
      desc: "Ship locally and internationally with free, pre-generated labels designed to make fulfillment easy.",
      icon: <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">{/* ... */}</svg>,
    },
  ];

  const rows = [
    {
      feature: "Listing Fees",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> Free product listings</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Cross /> Often charge per item or monthly subscription</span>
        </>
      ),
    },
    {
      feature: "Seller Earnings",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> Keep 90% of every sale</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Cross /> Sellers typically keep 60–70% after fees</span>
        </>
      ),
    },
    {
      feature: "Handmade-Only",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> 100% artisan-made</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Cross /> Many allow mass-produced products</span>
        </>
      ),
    },
    {
      feature: "Global Reach",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> International buyers</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Warn /> Some limit exposure or require extra costs</span>
        </>
      ),
    },
    {
      feature: "Shipping Support",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> Free, pre-generated labels</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Cross /> Sellers usually handle shipping alone</span>
        </>
      ),
    },
    {
      feature: "Ease of Setup",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> Quick & free shop setup</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Warn /> Can require complex steps or approvals</span>
        </>
      ),
    },
    {
      feature: "Community",
      afoma: (
        <>
          <span className="inline-flex items-center gap-2"><Check /> Artisan-first, fair-trade focused</span>
        </>
      ),
      other: (
        <>
          <span className="inline-flex items-center gap-2"><Cross /> Crowded or corporate-driven spaces</span>
        </>
      ),
    },
  ];

  const steps = [
    {
      title: "Create Your Free Shop",
      desc: "Open your AFOMA artisan store in minutes.",

    },
    {
      title: "Upload Your Handmade Products",
      desc: "Jewelry, art, fashion, or décor.",

    },
    {
      title: "Start Selling Worldwide",
      desc: "Reach buyers across Africa, North America, and beyond.",

    },
  ]

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Join AFOMA Marketplace – Empowering Artisans Globally",
    url: "https://afomamarketplace.com/join-as-a-seller",
    headline: "Join AFOMA Marketplace – Empowering Artisans Globally",
    description:
      "Join AFOMA Marketplace - a unique platform for artists and artisans to sell crafts globally. Be first for exclusive deals and promotions.",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          "name": "Where can I sell handmade crafts online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AFOMA is a global artisan marketplace where you can sell handmade products online, keep 90% of your sales, and list items for free."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best alternative to Etsy for artisans?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AFOMA Marketplace is a fair-trade Etsy alternative, offering free listings, global reach, and a handmade-only community where artisans keep more of their earnings."
          }
        },
        {
          "@type": "Question",
          "name": "Can I sell jewelry, art, and textiles on AFOMA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, AFOMA is built for artisans across categories including handmade jewelry, textiles, art, woodwork, and cultural crafts."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to pay to sell on AFOMA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. AFOMA offers free product listings for artisans and allows sellers to keep 90% of every sale."
          }
        },
        {
          "@type": "Question",
          "name": "Can artisans outside Africa sell on AFOMA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. While AFOMA was founded to empower African artisans, it is open to creators worldwide, including those in North America, Europe, and Asia."
          }
        }
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "AFOMA Marketplace",
      logo: {
        "@type": "ImageObject",
        url: "https://afomamarketplace.com/assets/logo.png",
      },
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
          name: "Join as Seller",
          item: "https://afomamarketplace.com/join-as-a-seller",
        },
      ],
    },
  };

  function Check() {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-green-600">
        <path d="M7.629 13.71 3.3 9.382l1.4-1.4 2.929 2.928L15.3 3.24l1.4 1.4-9.071 9.07Z" />
      </svg>
    );
  }
  function Cross() {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-rose-600">
        <path d="m5.05 4.343 10.607 10.607-1.414 1.414L3.636 5.757 5.05 4.343ZM3.636 14.95 14.243 4.343l1.414 1.414L5.05 16.364 3.636 14.95Z" />
      </svg>
    );
  }
  function Warn() {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-amber-500">
        <path d="M9.05 2.927a1 1 0 0 1 1.9 0l6.6 12.9A1 1 0 0 1 16.65 18H3.35a1 1 0 0 1-.9-2.173l6.6-12.9ZM9 7h2v5H9V7Zm0 6h2v2H9v-2Z" />
      </svg>
    );
  }

  const faqs = [
    {
      q: "Where can I sell handmade crafts online?",
      a: "AFOMA is a global artisan marketplace where you can sell handmade products online, keep 90% of your sales, and list items for free",
    },
    {
      q: "What is the best alternative to Etsy for artisans?",
      a: "AFOMA is a fair-trade Etsy alternative with free listings, global reach, and artisan-first support.",
    },
    {
      q: "Can I sell handmade jewelry, art, and textiles on AFOMA?",
      a: "Yes, AFOMA is built for jewelry, fashion, art, woodwork, and cultural crafts — as long as it’s handmade.",
    },
    {
      q: "Do I need to pay to sell on AFOMA?",
      a: "No. AFOMA offers free product listings and fair payouts for artisans everywhere.",
    },
    {
      q: "Can artisans outside Africa sell on AFOMA?",
      a: "Yes. AFOMA is global, open to artisans in Africa, North America, Europe, Asia, and beyond.",
    }
  ];

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://afomamarketplace.com/join-as-a-seller"
          data-next-head=""
        />
       <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <title>Sell Handmade Goods Online | Join AFOMA Artisan Marketplace</title>
        <meta
          property="og:title"
          content="Become a Seller on AFOMA Marketplace"
        />
        <meta
          property="og:description"
          content="Join AFOMA - handicraft marketplace where artisans keep 90%, pay no listing fees, and sell worldwide."
        />
        <meta property="og:image" content="https://afomamarketplace.com/assets/register-as-seller/1.jpeg" />
        <meta property="og:url" content="https://afomamarketplace.com/join-as-a-seller" />
        <meta
          property="title"
          content="Sell Handmade Goods Online | Join AFOMA Artisan Marketplace"
        />
        <meta
          name="description"
          content="Sell handmade crafts, jewelry, and art on AFOMA Marketplace. No listing fees. Free shipping labels. Keep 90% of sales. Open your free shop today."
        ></meta>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </Head>
      <section>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-4 px-4  md:py-6 flex items-center ">
            <Link href="/">
              <Image
                src={
                  "/assets/AFOMA New Logo (940 x 300 px).png"
                }
                width={259}
                height={42}
                className="w-[189px] lg:w-[259px]"
                alt="AFOMA Logo"
              />
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-screen-md xl:max-w-screen-xl mx-auto px-4 py-8 md:pb-16 xl:pb-16 relative">
        <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-8 lg:mt-6 lg:mb-10">
          <Link href="/" className="hover:text-primary">
            {" "}
            <span>Home</span>
          </Link>
          <FontAwesomeIcon icon={faAngleRight} size="sm" />
          <span className="text-primary ">Register as a Seller</span>
        </div>
        <div className="flex flex-col-reverse xl:flex-row xl:justify-between xl:items-start  xl:relative">
          <div className="">
            <div className="mb-8">
              {/* first */}
              <section className="w-full">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                    {/* Left: text */}
                    <div>
                      <h1
                        className={`text-4xl xl:text-6xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 mb-5 noto-font`}
                      >
                        Sell Your Handmade Products Online
                      </h1>

                      <p className="text-blue-950 mb-4 xl:mb-5">
                        Keep 90% of sales, list your crafts for free, and reach global buyers on AFOMA — the artisan-first marketplace.
                      </p>

                      <div className="flex justify-center sm:justify-start gap-3 sm:gap-4 mt-4">
                        {/* Start Selling Today */}
                        <Link href="/sign-in" className="flex-1 sm:flex-none min-w-[45%]">
                          <button
                            type="button"
                            className="buttonprimary w-full h-10 sm:h-auto rounded flex justify-center items-center gap-2 px-3 text-sm sm:text-base leading-tight text-center"
                          >
                            Start Selling
                          </button>
                        </Link>

                        {/* Book a Demo */}
                        <Link
                          href="https://calendly.com/eosuorah/60mins"
                          target="_blank"
                          className="flex-1 sm:flex-none min-w-[45%]"
                        >
                          <button
                            type="button"
                            className="buttonprimary w-full h-10 sm:h-auto rounded flex justify-center items-center gap-2 px-3 text-sm sm:text-base leading-tight text-center"
                          >
                            Book A Demo
                          </button>
                        </Link>
                      </div>

                    </div>

                    {/* Right: image */}
                    <div className="relative aspect-[1.6] w-full overflow-hidden rounded-2xl">
                      <Image
                        src="/assets/register-as-seller/1.jpeg"
                        alt="Handcrafted ceramics and textiles"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* second */}
              <section className="w-full">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                  <h2 className={`text-blue-950 tracking-tight mb-8 text-2xl md:text-3xl xl:text-4xl noto-font`}>
                    Why Choose AFOMA Marketplace
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => (
                      <article
                        key={item.title}
                        className="group relative overflow-hidden rounded-xl bg-orange-100 p-6
                        shadow-sm transition-all duration-300
                        hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex flex-col items-start h-full">

                          {/* Title */}
                          <h3 className="text-blue-950 text-lg font-semibold">
                            {item.title}
                          </h3>

                          {/* Description */}
                          <p className="mt-2 text-sm text-slate-700 leading-relaxed flex-grow">
                            {item.desc}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* third */}
              <section className="w-full">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                  {/* Heading + intro */}
                  <div className="max-w-3xl">
                    <h2 className={`text-blue-950 text-2xl md:text-3xl xl:text-4xl tracking-tight noto-font`}>
                      Why AFOMA Stands Out
                    </h2>
                    <p className="mt-4 text-slate-700">
                      Not all marketplaces are built the same. Here’s how AFOMA compares to typical platforms where artisans try to sell handmade products online.
                    </p>
                  </div>

                  {/* Table (md+) */}
                  <div className="mt-8 hidden md:block overflow-hidden rounded-2xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-orange-50">
                        <tr className="text-left text-sm text-blue-950/80">
                          <th className="px-6 py-4 font-semibold w-[30%]">Feature</th>
                          <th className="px-6 py-4 font-semibold w-[35%]">AFOMA Marketplace</th>
                          <th className="px-6 py-4 font-semibold w-[35%]">Other Marketplaces</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr
                            key={r.feature}
                            className={`align-top ${i % 2 === 0 ? "bg-orange-50" : "bg-orange-100"
                              }`}
                          >
                            <td
                              className="px-6 py-5 text-blue-950 text-sm md:text-base font-medium"
                            >
                              {r.feature}
                            </td>
                            <td className="px-6 py-5 text-sm text-slate-800">{r.afoma}</td>
                            <td className="px-6 py-5 text-sm text-slate-800">{r.other}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Cards (mobile) */}
                  <div className="mt-8 md:hidden space-y-4">
                    {rows.map((r) => (
                      <div key={r.feature} className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-orange-50 px-4 py-3">
                          <h3 className="text-blue-950 font-semibold">{r.feature}</h3>
                        </div>
                        <div className="bg-orange-50">
                          <div className="px-4 py-3 border-b border-slate-100">
                            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">AFOMA Marketplace</div>
                            <div className="text-sm text-slate-800">{r.afoma}</div>
                          </div>
                          <div className="px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Other Marketplaces</div>
                            <div className="text-sm text-slate-800">{r.other}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="w-full md:w-1/2 mt-8">
                    <div className="rounded-2xl bg-orange-50 px-6 py-6 flex flex-col">
                      <p className="text-blue-950 font-medium">
                        Ready for a better alternative? <span className="font-semibold">Join AFOMA today</span> and keep 90% of your sales.
                      </p>

                      <Link
                        href="/sign-in"
                        className="buttonprimary mt-4 inline-flex w-[150px] items-center justify-center self-start rounded-lg border border-blue-700 bg-blue-700 px-5 py-2.5 text-white font-medium shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Get started
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* fourth */}
              <section className="relative bg-orange-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 lg:py-12">
                  <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                    {/* Left: Image */}
                    <div className="lg:col-span-6">
                      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
                        <Image
                          src="/assets/register-as-seller/2.jpeg"
                          alt="AFOMA multi-currency card"
                          width={800}
                          height={600}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Right: Text */}
                    <div className="lg:col-span-6 space-y-6">
                      <div>
                        <h2 className={`text-blue-950 tracking-tight mb-8 text-2xl md:text-3xl xl:text-4xl noto-font`}>
                          Perfect for Every Artisan
                        </h2>

                        <p className="mt-3 text-slate-700 leading-relaxed">
                          Whether you create handmade jewelry, paint original artworks, design clothing, or craft cultural pieces, AFOMA is the marketplace where artisans sell their products online with global exposure.
                        </p>

                        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-slate-800 text-sm md:text-base">
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-orange-300" />
                            Handmade Jewelry
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-orange-300" />
                            Fashion &amp; Textiles
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-orange-300" />
                            Paintings &amp; Sculptures
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-orange-300" />
                            Woodwork &amp; Home Décor
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-orange-300" />
                            Cultural &amp; Traditional Crafts
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* fifth */}
              <section className="relative isolate overflow-hidden py-6 sm:py-24">
                {/* Soft background gradient */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b" />


                <div className="mx-auto max-w-7xl px-4">
                  {/* Heading */}
                  <h2 className={`text-blue-950 text-2xl md:text-3xl xl:text-4xl tracking-tight noto-font`}>
                    How to Start Selling in 3 Easy Steps
                  </h2>


                  {/* Cards */}
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((s, i) => (
                      <div
                        key={s.title}
                        className="group h-full rounded-2xl border border-slate-200 bg-orange-100 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full buttonprimary text-base font-semibold text-white">
                            {i + 1}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                            <p className="mt-2 text-slate-600">{s.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>


                  {/* CTA */}
                  <div className="mt-10 flex justify-center">
                    <Link
                     href="https://calendly.com/eosuorah/60mins"
                      target="_blank" // Opens the link in a new tab
                      className="buttonprimary inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                    >
                       Book A Demo
                    </Link>
                  </div>
                </div>
              </section>

              {/* sixth */}
              <section className="py-6">
                <div>
                  <h2
                    className={`text-blue-950 xl:tracking-[-0.72px] mb-8 md:mb-9 text-2xl lg:text-4xl noto-font`}
                  >
                    What Sellers Are Saying
                  </h2>
                </div>
                <div className="flex gap-4 flex-col md:flex-row  mb-7 md:mb-16 xl:gap-7">
                  <div className="shrink-0 flex items-center justify-center">
                    <img
                      src={
                        "/assets/register-as-seller/ksu_shade.png"
                      }
                      alt="Ksu Shade Art"
                      className="shrink-0 xl:w-[400px] xl:h-[380px] object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-blue-950 mb-4">
                      As a resin artist, I initially sold through Instagram, but as my audience grew - especially internationally - I needed a reliable online marketplace. After researching options, AFOMA Marketplace stood out as the best choice for self-starters like me.
                    </p>
                    <p className="text-sm text-blue-950 mb-4">
                      AFOMA makes it easy for creatives to launch and grow their online presence with a clear registration process, fair fees, and no product restrictions. They also offer valuable workshops to help sellers improve their shops.
                    </p>
                    <p className="text-sm text-blue-950 mb-4">
                      What truly sets AFOMA apart is their commitment to artisans—they listen, refine their platform based on our needs, and even use AI to simplify registration and product listing. Whether you're just starting or expanding your online reach, AFOMA is the place to be.
                    </p>
                    <strong>
                      Ksu Shade Art - Resin Artist
                    </strong>
                    <strong className="text-sm text-blue-950 mb-4">
                      Follow on Instagram: @ksushade_art
                    </strong>
                  </div>
                </div>
              </section>

              {/* seven */}
              <section className="bg-orange-50 py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <h2 className={`text-blue-950 tracking-tight mt-2 mb-8 text-2xl md:text-3xl xl:text-4xl noto-font`}>
                      Frequently Asked Questions
                    </h2>
                    {/* <p className="mt-3 text-slate-700">
                      Still have questions? <a href="/faq" className="text-[#1f628ea1] font-medium hover:underline">Read more</a>
                    </p> */}
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border transition 
                          ${openIndex === idx ? "bg-orange-100 border-[#1f628ea1]" : "bg-orange-100 border-slate-200"}`}
                      >
                        <button
                          className="w-full flex justify-between items-center px-5 py-4 text-left text-blue-950 font-medium"
                          onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                          {faq.q}
                          <span
                            className={`ml-2 text-lg font-bold transition-transform ${openIndex === idx ? "text-[#1f628ea1] rotate-45" : "text-slate-500"
                              }`}
                          >
                            +
                          </span>
                        </button>
                        {openIndex === idx && (
                          <div className="px-5 pb-4 text-slate-700 text-sm leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Eight */}
              <section aria-labelledby="seller-cta" className="mt-12">
                <div className="bg-blue-950">
                  <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-stretch">
                      {/* Images */}
                      {/* Images */}
                      <div className="w-full xl:w-3/5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {/* Always visible (mobile too) */}
                          <div className="relative aspect-[1/1] sm:aspect-[4/3] lg:aspect-[0.6] overflow-hidden rounded-2xl ring-1 ring-white/10">
                            <Image
                              src="/assets/register-as-seller/3.jpeg"
                              alt="Handmade craft display"
                              fill
                              className="object-cover"
                              priority
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>

                          {/* Show from sm (≥640px) */}
                          <div className="relative aspect-[0.6] overflow-hidden rounded-2xl ring-1 ring-white/10 hidden sm:block">
                            <Image
                              src="/assets/register-as-seller/4.jpeg"
                              alt="Handmade craft display"
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </div>

                          {/* Show from md (≥768px) */}
                          <div className="relative aspect-[0.6] overflow-hidden rounded-2xl ring-1 ring-white/10 hidden md:block">
                            <Image
                              src="/assets/register-as-seller/register_page_banner.jpg"
                              alt="Handmade craft display"
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="33vw"
                            />
                          </div>
                        </div>
                      </div>


                      {/* Text + CTA */}
                      <div className="w-full xl:w-2/5 text-center xl:text-left">
                        <span className="inline-flex items-center rounded-full bg-blue-900/60 px-3 py-1 text-xs font-medium text-orange-100 ring-1 ring-white/10">
                          Keep 90% of every sale
                        </span>

                        <h2
                          id="seller-cta"
                          className={`text-white tracking-tight mt-2 mb-8 text-2xl md:text-3xl xl:text-4xl noto-font`}
                        >
                          Start Selling on AFOMA Today
                        </h2>

                        <p className="text-orange-50/90 text-sm md:text-base leading-relaxed">
                          Join a global handmade marketplace where artisans keep 90% of their sales and reach buyers worldwide
                        </p>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center sm:justify-center">
                        <Link
                          href="/sign-in"
                          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-white font-medium shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-blue-950"
                          style={{ width: 250 }}
                        >
                          Create Your Shop Now
                        </Link>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer showDemoCall={true}/>
      </section>
    </>
  );
};
export default JoinAsASeller;
