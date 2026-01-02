import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getAllCategory, getAllPostsForNewData } from "@/lib/api";

import {
  faAngleRight,
  faSquareCheck,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ✅ tree-shake date-fns
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import axios from "axios";

// ✅ lazy load heavy UI blocks
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"));
const Faq = dynamic(() => import("@/components/Faq"));
const Artisions = dynamic(() => import("@/components/Artisions"));

export default function Index({
  allPosts: { edges },
  preview,
  categoryPosts,
  cart,
  addToCart
}) {
  const category = categoryPosts?.edges?.slice(0, -1);
  const morePosts = edges;

  const [allCategories, setAllCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [categoryIds, setCategoryIds] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  },
});

const fetchCategories = () => api.get("/categories");
const fetchSubcategories = () => api.get("/sub-categories");
const fetchChildCategories = () => api.get("/child-category");

  const getAllCategories = () => {
    setLoading(true);

    fetchCategories()
      .then(function (response) {
        // //
        setError(false);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error fetching categories:", error);
        setError(true);
        setLoading(false);
      });
  };

  const getAllSubcategories = () => {
    setLoading(true);

    fetchSubcategories()
      .then(function (response) {
        // //
        setError(false);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error fetching subcategories:", error);
        setError(true);
        setLoading(false);
      });
  };

  const getAllChildCategories = () => {
    setLoading(true);

    fetchChildCategories()
      .then(function (response) {
        // //
        setError(false);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error fetching child categories:", error);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllCategories();
    getAllSubcategories();
    getAllChildCategories();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shop Diverse Artisanal Categories | AFOMA Marketplace",
    url: "https://www.afomamarketplace.com/category",
    headline: "Shop Diverse Artisanal Categories | AFOMA Marketplace",
    description:
      "AFOMA Marketplace offers diverse artisanal categories, from fashion to home decor. Explore unique, handcrafted treasures made by talented creators.",
    mainEntity: {
      "@type": "Article",
      headline: "Shop Diverse Artisanal Categories | AFOMA Marketplace",
      description:
        "Discover unique and handcrafted treasures across diverse categories on AFOMA Marketplace, from fashion and home decor to art and collectibles.",
      author: {
        "@type": "Organization",
        name: "AFOMA Marketplace",
      },
      publisher: {
        "@type": "Organization",
        name: "AFOMA Marketplace",
        logo: {
          "@type": "ImageObject",
          url: "https://www.afomamarketplace.com/assets/logo.png",
        },
      },
      datePublished: "2024-11-20",
      dateModified: "2024-11-20",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.afomamarketplace.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Categories",
          item: "https://www.afomamarketplace.com/category",
        },
      ],
    },
  };

  return (
    <>
      <Head>
        <title>Categories | AFOMA Marketplace</title>
        <meta
          property="og:title"
          content="Shop Diverse Artisanal Categories | AFOMA Marketplace"
        />
        <meta
          property="title"
          content="Shop Diverse Artisanal Categories | AFOMA Marketplace"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="AFOMA Marketplace offers diverse artisanal categories, from fashion to home decor. Explore unique, handcrafted treasures made by talented creators."
        ></meta>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>

      <section>
        <Header cart={cart} addToCart={addToCart}/>
      </section>
      <section className="">
        <div className="max-w-screen-xl mx-auto px-4 pb-12 pt-6 md:pb-16 xl:pb-20">
          <div className="flex gap-1.5 mb-6 md:mb-10">
            <p className="text-slate-600 font-medium text-xs flex items-center gap-1.5">
              <Link href="/">Home</Link>
              <FontAwesomeIcon icon={faAngleRight} />
            </p>
            <p className="text-primary font-medium text-xs flex items-center gap-1.5">
              Categories
            </p>
          </div>
          <div
            className="max-w-[698px] mx-auto
          "
          >
            <h1
              className={`text-4xl xl:text-5xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-center mb-5 noto-font `}
            >
              Unveil the Artisanal Splendor. A Kaleidoscope of Creative
              Categories!
            </h1>
          </div>
          <div className="max-w-[640px] mx-auto mb-6 md:mb-9">
            <p className="font-medium text-blue-950 text-center">
              Discover handcrafted delights, celebrate creativity, and elevate
              your style with unique artisanal pieces from talented creators
              worldwide.
            </p>
          </div>
          <div className="flex items-center justify-center ">
            <Link href="#category" className="buttonprimary">
              Browse categories
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
        </div>
      </section>
      <section className="bg-white ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:pt-24 xl:pb-32">
          <div className="flex flex-col md:flex-row  gap-6  md:gap-11 xl:gap-24">
            <div>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-2xl lg:text-4xl noto-font`}
              >
                Where Artistry Meets Awe-Inspiring Delights!
              </h2>
              <p className="text-blue-950 mb-4 md:mb-5">
                Explore AFOMA Marketplace&apos;s diverse categories, from
                elegant fashion and jewelry to uplifting home decor, joyful
                toys, and expressive arts.
              </p>
              <p className="text-blue-950 mb-4 md:mb-5">
                {" "}
                Immerse yourself in the captivating charm of handcrafted
                treasures and indulge in a shopping experience that celebrates
                the artistry of talented artisans worldwide.
              </p>
              <p className="text-blue-950">
                {" "}
                Explore our curated selection and find the perfect piece that
                resonates with your unique style and taste.
              </p>
            </div>

            <Image
              src={"/assets/categoriesoverview/Where_Artistry_Meets_(1).png"}
              alt="Fashion"
              height={428}
              width={477}
              className="shrink-0 md:w-[377px] lg:w-[477px]"
            />
          </div>
        </div>
      </section>
      <section className="bg-orange-50 " id="category">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-20 ">
          <div className="flex flex-col md:flex-row gap-6 items-start md:gap-11 xl:gap-20 mb-8 md:mb-14">
            <div>
              <p className="font-bold text-primary mb-3.5">FASHION</p>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-2xl lg:text-4xl noto-font`}
              >
                Embrace Timeless Elegance and Diversity
              </h2>
              <p className="text-blue-950 mb-4 md:mb-5">
                Explore a rich palette of colours, patterns, and textures,
                drawing inspiration from global cultures.
              </p>
              <p className="text-blue-950 mb-4 md:mb-5">
                Embrace the fusion of contemporary flair and traditional
                craftsmanship, as our collection honours heritage and modernity.
              </p>
              <p className="text-blue-950 mb-5 md:mb-12 xl:mb-16">
                Whether you seek tailored classics or bohemian chic, our diverse
                styles cater to all genders, making fashion a canvas for
                self-expression for everyone.
              </p>
              <div className="flex ">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_BASE_URL ===
                    "https://development.afomamarketplace.com"
                      ? "/category/fashion"
                      : "/category/fashion"
                  }
                  className="buttonprimary"
                >
                  Shop now
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
            </div>
            <Image
              src={
                "/assets/categoriesoverview/Embrace Timeless Elegance and Diversity.png"
              }
              alt="Fashion"
              height={428}
              width={477}
              className="shrink-0 w-[428px] md:w-[377px] lg:w-[477px]"
            />
          </div>
          <div className="grid gap-7 md:grid-cols-2 md:gap-9 lg:grid-cols-3  items-center justify-center">
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={
                    "/assets/categoriesoverview/Men_s_Fashion_Collection.png"
                  }
                  alt="Fashion"
                  height={477}
                  width={428}
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Men&apos;s Fashion Collection
              </p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a77c4bc28a2d5bf6e8b24"
                    : "/shop/658bb1fe2ed932502f53163b"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Men&apos;s clothing <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Women_s_Trendy_Picks.png"}
                  alt="Fashion"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Women&apos;s Trendy Picks
              </p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a77f0bc28a2d5bf6e8b28"
                    : "/shop/658bb21c2ed932502f53163d"
                }
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Women&apos;s clothing{" "}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={
                    "/assets/categoriesoverview/Kids__Fashion_Essentials.png"
                  }
                  alt="Fashion"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Kid&apos;s Fashion Essentials
              </p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a781dbc28a2d5bf6e8b46"
                    : "/shop/658bb2342ed932502f53163f"
                }
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Kid&lsquo;s clothing{" "}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-32 ">
          <div className="flex flex-col md:flex-row items-start gap-6  md:gap-11 xl:gap-24 mb-8 md:mb-14">
            <div>
              <p className="font-bold text-primary mb-3.5">HOME AND LIVING</p>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-2xl lg:text-4xl noto-font`}
              >
                Transform Your Space with Artisanal Elegance -Banner Header
              </h2>
              <p className="text-blue-950 mb-4 md:mb-5">
                Discover chic home decor, timeless accents, and functional
                essentials thoughtfully curated by skilled artisans worldwide.
                Create your sanctuary with artful pieces that reflect your
                unique taste, turning your house into a cherished home of
                enchantment and inspiration.
              </p>
              <p className="text-blue-950 mb-4 md:mb-5">
                Elevate living spaces with captivating handcrafted treasures
                from our Home and Living collection. Discover chic decor,
                timeless accents, and essentials curated by global artisans.
                Create a sanctuary reflecting your unique taste, turning your
                house into an enchanting home.
              </p>

              <div className="flex ">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_BASE_URL ===
                    "https://development.afomamarketplace.com"
                      ? "/category/home-and-living"
                      : "/category/home-and-living"
                  }
                  className="buttonprimary"
                >
                  Shop now
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
            </div>

            <Image
              src={"/assets/categoriesoverview/Group_42614.png"}
              alt="Fashion"
              height={428}
              width={477}
              className="shrink-0 w-[428px] md:w-[377px] lg:w-[477px]"
            />
          </div>

          <div className="grid gap-7 md:grid-cols-2 md:gap-9 lg:grid-cols-2  items-center justify-center">
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_728.png"}
                  alt="Mask_Group_162"
                  height={191}
                  width={494}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Handcrafted Decor</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7921bc28a2d5bf6e8bba"
                    : "/shop/658bb3292ed932502f53164f"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Handcrafted Decor <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_732.png"}
                  alt="Home and Living"
                  height={191}
                  width={494}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Home Decor</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7938bc28a2d5bf6e8bc0"
                    : "/shop/658bb33f2ed932502f531651"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Home Decor <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            {/* <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Fun-Filled-Adventures.png"}
                  alt="Mask_Group_162"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Fun-Filled Adventures
              </p>
              <Link
                href="#"
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop games <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div> */}
          </div>
        </div>
      </section>
      <section className="bg-orange-50 ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-32 ">
          <div className="max-w-[640px] mx-auto mb-6 md:mb-12">
            <p className="text-primary font-bold text-center mb-3.5">
              JEWELRY AND ACCESSORIES
            </p>
            <h2
              className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-center text-2xl lg:text-4xl noto-font`}
            >
              Adorn Yourself with Handcrafted Splendor
            </h2>
            <p className="text-blue-950 text-center mb-4 md:mb-6">
              Welcome to elegance and finesse, where curated jewelry complements
              your style.
            </p>{" "}
            <p className="text-blue-950 text-center mb-4">
              {" "}
              Delicate necklaces, statement earrings – our selection offers
              exquisite, passionate craftsmanship. Step into timeless beauty,
              elevate your look.
            </p>
          </div>
          <div className="grid gap-7 md:gap-9 xl:gap-y-12 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-12  items-center justify-center">
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_700.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Handbags & Purses</p>
              <Link
                href={"/category/jewelry-and-accessories/handbags-and-purses"}
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Handbags & Purses <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Statement_Necklaces.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Necklaces & Pendants</p>
              <Link
                href={
                  "/category/jewelry-and-accessories/necklaces-and-pendants"
                }
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Necklaces & Pendants{" "}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Dazzling_Earwear.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Earrings</p>
              <Link
                href={"/category/jewelry-and-accessories/earings"}
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Earrings <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Elegant_Bands.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Rings</p>
              <Link
                href={"/category/jewelry-and-accessories/rings"}
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Rings <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Wrist_Charms.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Bracelets & Bangles</p>
              <Link
                href={"/category/jewelry-and-accessories/bracelets-and-bangles"}
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-1.5 ease-in transition-colors"
              >
                Shop Bracelets & Bangles <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            {/* <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_699.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Hats & Headpieces</p>
              <Link
                href={ "/category/jewelry-and-accessories/hats-and-headpieces"}
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Hats & Headpieces <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div> */}

            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_699.png"}
                  alt="Jwellery and Accessories"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Brooches & Pins</p>
              <Link
                href={"/category/jewelry-and-accessories/brooches-and-pins"}
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Brooches & Pins <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <Link
              href={
                process.env.NEXT_PUBLIC_BASE_URL ===
                "https://development.afomamarketplace.com"
                  ? "/category/jewelry-and-accessories"
                  : "/category/jewelry-and-accessories"
              }
              className="buttonprimary"
            >
              Shop now
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
        </div>
      </section>

      <section className="bg-blue-950 ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-20 xl:gap-48 md:items-center justify-center">
            <div className="md:w-[414px] lg:w-[514px]">
              <h2 className="text-sm md:text-base text-primary font-bold mb-3.5">
                MAXIMIZE YOUR PROFIT
              </h2>
              <h3
                className={`text-orange-50  text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
              >
                Register as a Seller Today!
              </h3>
              <p className="text-orange-50 mb-6 md:mb-9">
                Share your handcrafted masterpieces with a worldwide community
                of art lovers, igniting a journey of creativity and recognition.
              </p>
              <div className="flex">
                <Link href="/register-as-a-seller" className="buttonprimary">
                  {" "}
                  Start selling
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
                {/* <button
                  className="buttonprimary"
                  disabled
                  title="Coming soon..."
                >
                  Start selling
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
                </button> */}
              </div>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl xl:text-3xl xl:tracking-[-0.6px] text-orange-50 mb-5 md:mb-7">
                Simple Pricing Plan
              </h3>
              <div className="flex gap-2.5 items-center mb-4 md:mb-5">
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className="text-white text-lg"
                />
                <p className="text-orange-50 font-light">
                  No overhead charges or hidden fees
                </p>
              </div>
              <div className="flex gap-2.5 items-center">
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className="text-white text-lg"
                />
                <p className="text-orange-50 font-light">
                  We choose simplicity and transparency
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-orange-50 ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-24 ">
          <div className="max-w-[640px] mx-auto mb-6 md:mb-12">
            <p className="text-primary font-bold text-center mb-3.5">
              STATIONERY AND PAPER GOODS
            </p>
            <h2
              className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-center text-2xl lg:text-4xl noto-font `}
            >
              Transform Your Living Spaces with Handcrafted Decor
            </h2>
            <p className="text-blue-950 text-center mb-4">
              Elevate living spaces with captivating handcrafted treasures from
              our Home and Living collection. Discover chic decor, timeless
              accents, and essentials, curated by global artisans.
            </p>{" "}
            <p className="text-blue-950 text-center mb-4">
              {" "}
              Create a sanctuary reflecting your unique taste, turning your
              house into an enchanting home.
            </p>
          </div>
          <div className="flex flex-wrap gap-7 md:gap-9 xl:gap-y-12 col-span-12 mb-6 md:mb-12  items-center justify-center">
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_701.png"}
                  alt="Stationary and Paper goods"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Notebooks & Journals</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7f46bc28a2d5bf6e8eb0"
                    : "/shop/658bb4232ed932502f531661"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Notebooks & Journals{" "}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Creative_Delights.png"}
                  alt="Stationary and Paper goods"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Greeting Cards</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7f5bbc28a2d5bf6e8eb2"
                    : "/shop/658bb43f2ed932502f531663"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Greeting Cards <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_703.png"}
                  alt="Stationary and Paper goods"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Stickers & Labels</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7f76bc28a2d5bf6e8ed6"
                    : "/shop/658bb4582ed932502f531665"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Stickers & Labels <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>

            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Group_42553.png"}
                  alt="Stationary and Paper goods"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Paper Art & Prints</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a804abc28a2d5bf6e8f55"
                    : "/shop/658bb4732ed932502f531667"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Paper Art & Prints <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_702.png"}
                  alt="Stationary and Paper goods"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Colouring Books</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a8062bc28a2d5bf6e8f58"
                    : "/shop/658bb48a2ed932502f531669"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Colouring Books <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center ">
            <Link
              href={
                process.env.NEXT_PUBLIC_BASE_URL ===
                "https://development.afomamarketplace.com"
                  ? "/category/stationery-and-paper-goods"
                  : "/category/stationery-and-paper-goods"
              }
              className="buttonprimary"
            >
              Shop now
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
        </div>
      </section>
      <section className="bg-white ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-32 ">
          <div className="flex flex-col md:flex-row items-start gap-6  md:gap-11 xl:gap-24 mb-8 md:mb-14">
            <div>
              <p className="font-bold text-primary mb-3.5">TOYS AND GAMES</p>
              <h2
                className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-2xl lg:text-4xl noto-font`}
              >
                Handcrafted Toys and Games for Every Child
              </h2>
              <p className="text-blue-950 mb-4 md:mb-5">
                Delight in a captivating collection of artisanal playthings,
                lovingly crafted to spark boundless imagination and laughter in
                children of all ages.
              </p>
              <p className="text-blue-950 mb-4 md:mb-5">
                From cuddly plush friends to intricately designed puzzles, each
                toy in our collection is a cherished keepsake that embodies the
                magic of childhood dreams.
              </p>

              <div className="flex ">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_BASE_URL ===
                    "https://development.afomamarketplace.com"
                      ? "/category/toys-and-games"
                      : "/category/toys-and-games"
                  }
                  className="buttonprimary"
                >
                  Shop now
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
            </div>

            <Image
              src={
                "/assets/categoriesoverview/Handcrafted_Toys_and_Games_for_Every_Child.png"
              }
              alt="Fashion"
              height={428}
              width={477}
              className="shrink-0 w-[428px] md:w-[377px] lg:w-[477px]"
            />
          </div>

          <div className="grid gap-7 md:grid-cols-2 md:gap-9 lg:grid-cols-2  items-center justify-center">
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_706.png"}
                  alt="Fashion"
                  height={191}
                  width={494}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Toys</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7958bc28a2d5bf6e8bca"
                    : "/shop/658a7958bc28a2d5bf6e8bca"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop toys <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_705.png"}
                  alt="Toys and Games"
                  height={191}
                  width={494}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Games & Puzzles</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a796cbc28a2d5bf6e8bcc"
                    : "/shop/658bb3752ed932502f531655"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Games & Puzzles <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            {/* <div>
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Fun-Filled-Adventures.png"}
                  alt="Mask_Group_162"
                  height={477}
                  width={428}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Fun-Filled Adventures
              </p>
              <Link
                href="#"
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop games <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div> */}
          </div>
        </div>
      </section>
      <section className="bg-blue-950 ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-24 flex flex-col md:flex-row justify-center xl:justify-between gap-6 lg:gap-32">
          <div className="md:w-[460px] lg:w-[514px]">
            <div className="mb-4 md:mb-9">
              <Image
                src={"/assets/homepage/wallet connet logo.png"}
                alt="wallet connet logo"
                height={32}
                width={203}
              />
            </div>
            <h2 className="text-orange-50 xl:tracking-[-0.72px] mb-5 text-4xl">
              Easy and Secure Transactions
            </h2>
            <p className="text-orange-50 font-light">
              Experience decentralized finance with our web3 wallet integration,
              making your transactions seamless.
            </p>
          </div>
          <div>
            <div className="flex items-center  gap-4 shrink-0">
              <div className="w-8 h-8 rounded-full border border-orange-50 flex items-center justify-center text-orange-50">
                1
              </div>
              <p className="text-lg font-light text-orange-50">
                Connect Wallet
              </p>
            </div>
            <div className="border-l h-10  ml-4 border-dashed border-orange-50 shrink-0"></div>
            <div className="flex items-center  gap-4 ">
              <div className="w-8 h-8 rounded-full border shrink-0 border-orange-50 flex items-center justify-center text-orange-50">
                2
              </div>
              <p className="text-lg font-light text-orange-50">
                Select Payment Method
              </p>
            </div>
            <div className="border-l h-10 ml-4 border-dashed border-orange-50"></div>
            <div className="flex items-center  gap-4">
              <div className="w-8 h-8 rounded-full border border-orange-50 flex items-center justify-center text-orange-50">
                3
              </div>
              <p className="text-lg font-light text-orange-50">
                Confirm and Pay
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-32 ">
          <div className="max-w-[640px] mx-auto mb-6 md:mb-12">
            <p className="text-primary font-bold text-center mb-3.5">
              ART AND COLLECTIBLES
            </p>
            <h2
              className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-center text-2xl lg:text-4xl noto-font`}
            >
              The Collector’s Enclave
            </h2>
            <p className="text-blue-950 text-center mb-4">
              Discover rare finds and timeless pieces that add elegance to your
              collection or space. Embrace the artistry and passion behind each
              item, reflecting human expression.
            </p>{" "}
            <p className="text-blue-950 text-center mb-4">
              {" "}
              Join us on an enchanting journey where art transcends boundaries,
              and collectibles embody cultural significance.
            </p>
          </div>
          <div className="flex flex-wrap gap-7 md:gap-9 xl:gap-y-12 col-span-12 mb-6 md:mb-12  items-center justify-center">
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Timeless_Frames.png"}
                  alt="Art and Collctibles"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Digital Art</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7ec8bc28a2d5bf6e8e9c"
                    : "/shop/658bb3c32ed932502f53165b"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Digital Art <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Brushstrokes_of_Emotion.png"}
                  alt="Art and Collectibles"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Paintings</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7989bc28a2d5bf6e8bce"
                    : "/shop/658bb3a22ed932502f531657"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop painting <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Ink_and_Imagination.png"}
                  alt="Art and Collectibles"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Drawings & Illustrations
              </p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7a2abc28a2d5bf6e8be8"
                    : "/shop/658bb3b02ed932502f531659"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Drawings & Illustrations{" "}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_707.png"}
                  alt="Mask_Group_162"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Photography</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7ee1bc28a2d5bf6e8eac"
                    : "/shop/658bb3de2ed932502f53165d"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Photography <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_708.png"}
                  alt="Mask_Group_162"
                  height={180}
                  width={317}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Textile & Fiber Art</p>
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL ===
                  "https://development.afomamarketplace.com"
                    ? "/shop/658a7f05bc28a2d5bf6e8eae"
                    : "/shop/658bb3ef2ed932502f53165f"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Textile & Fiber Art <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <Link
              href={"/category/art-and-collectibles"}
              className="buttonprimary"
            >
              Shop now
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
        </div>
      </section>
      <section className="bg-orange-50 ">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16 xl:py-24 ">
          <div className="max-w-[640px] mx-auto mb-6 md:mb-12">
            <p className="text-primary font-bold text-center mb-3.5">
              PERSONAL CARE AND BATH PRODUCTS
            </p>
            <h2
              className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-center text-2xl lg:text-4xl noto-font `}
            >
              Transform Your Living Spaces with Handcrafted Decor
            </h2>
            <p className="text-blue-950 text-center mb-4">
              Elevate living spaces with captivating handcrafted treasures from
              our Home and Living collection. Discover chic decor, timeless
              accents, and essentials, curated by global artisans.
            </p>{" "}
            <p className="text-blue-950 text-center mb-4">
              {" "}
              Create a sanctuary reflecting your unique taste, turning your
              house into an enchanting home.
            </p>
          </div>
          <div className="flex flex-wrap gap-7 md:gap-9 xl:gap-y-12 col-span-12 mb-6 md:mb-12  items-center justify-center">
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_713.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Bath Bombs</p>
              <Link
                href={"/category/personal-care-and-bath-products/bath-bombs"}
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Bath Bombs <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_712.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Handmade Soap</p>
              <Link
                href={"/category/personal-care-and-bath-products/handmade-soap"}
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Handmade Soap <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_714.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Body Scrubs</p>
              <Link
                href={"/category/personal-care-and-bath-products/body-scrubs"}
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Body Scrubs <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_711.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Bath Soaks & Salts</p>
              <Link
                href={
                  "/category/personal-care-and-bath-products/bath-soaks-and-salts"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Bath Soaks & Salts <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>

            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_710.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">
                Lotions & Body Butters
              </p>
              <Link
                href={
                  "/category/personal-care-and-bath-products/lotions-and-body-butters"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Lotions & Body Butters{" "}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_709.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Oil</p>
              <Link
                href={"/category/personal-care-and-bath-products/oils"}
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Oil <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
            <div className="col-span-3">
              <div className="mb-4 md:mb-5">
                <Image
                  src={"/assets/categoriesoverview/Mask_Group_715.png"}
                  alt="Mask_Group_162"
                  height={132}
                  width={229}
                  className="shrink-0"
                />
              </div>
              <p className="text-blue-950 text-xl mb-3">Baby Care</p>
              <Link
                href={
                  "/category/personal-care-and-bath-products/baby-and-child-care"
                }
                className="text-blue-950 font-medium  flex items-center gap-1.5 hover:text-primary ease-in transition-colors"
              >
                Shop Baby Care <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <Link
              href={"/category/personal-care-and-bath-products"}
              className="buttonprimary"
            >
              Shop now
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
        </div>
      </section>
      <section className="overflow-hidden bg-blue-950">
        {/* <Sliderslide /> */}
        <Artisions />
      </section>
      <section className="bg-orange-50">
        <div className="max-w-screen-lg mx-auto px-4  py-12  md:py-16 xl:py-24">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start lg:gap-24 mb-6 md:mb-12 xl:mb-2o">
            <Image
              src={
                "/assets/homepage/A_Marketplace_for_all_Artists_&_Artisans.png"
              }
              alt="Water_hyacinth_cowries"
              className="shrink-0 md:w-[347px] lg:w-[477px]"
              width={477}
              height={426}
            />
            <div>
              <p className="font-bold text-primary mb-3.5">
                ABOUT AFOMA MARKETPLACE{" "}
              </p>
              <h2
                className={`text-blue-950 text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
              >
                A Marketplace for all Artists & Artisans
              </h2>
              <p className="text-blue-950 mb-6">
                Welcome to our global artisanal marketplace, committed to
                inclusivity and empowering creators worldwide, especially in
                emerging markets. Decentralization guides us, building trust and
                transparency for all.
              </p>
              <p className="text-blue-950 mb-6">
                By leveraging Web3 technology and the AFOMA token, we redefine
                commerce, offering rewards and empowerment and letting artisans
                shape our ecosystem.
              </p>
              <p className="text-blue-950 ">
                Our core mission: sustainable and fair income for all creators
                regardless of background. By celebrating creativity, we uplift
                communities, fostering talent and diversity.
              </p>
            </div>
          </div>
          <div className="grid gap-4 lg:gap-9 md:grid-cols-2 lg:grid-cols-3 mb-4 md:mb-12">
            <div>
              <h3 className="text-lg lg:text-2xl text-blue-950 mb-4">
                The Problem
              </h3>
              <p className="text-blue-950">
                Marginalized artisans struggle to access the global market,
                while others lack fair income due to high fees from online
                marketplaces.
              </p>
            </div>
            <div>
              <h3 className="text-lg lg:text-2xl text-blue-950 mb-4">
                Our Solution
              </h3>
              <p className="text-blue-950">
                A marketplace devoid of barriers and high fees for artisans
                seeking to sell their goods directly to their local community
                and global market.
              </p>
            </div>
            <div>
              <h3 className="text-lg lg:text-2xl text-blue-950 mb-4">
                Our Promise
              </h3>
              <p className="text-blue-950">
                We will offer transparency, a sustainable and fair income to all
                creators. We will promote inclusion, equity and support
                communities in need.
              </p>
            </div>
          </div>
          {/* <div className="flex">
            <Link href="/category" className="buttonprimary">
              {" "}
              Find your favourites
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
          </div> */}
        </div>
      </section>

      <section className="bg-white overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-10 lg:py-18">
          <div className="max-w-[640px] mx-auto mb-8 md:mb-16">
            <h2
              className={`text-blue-950 text-center text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
            >
              Blogs
            </h2>
            <p className="text-blue-950 text-center">
              Dive into our captivating Blogs for curated insights, trends, and
              inspiration. Uncover expert advice, reviews, and behind-the-scenes
              stories to enhance your shopping journey. Explore now!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9 mb-6 md:mb-12 ">
            {morePosts?.length > 0 &&
              morePosts.slice(0, 3).map(({ node, index }) => (
                <div
                  className="border border-slate-200 rounded-sm hover:bg-orange-100 transition-colors ease-in"
                  key={index}
                >
                  <div className="relative">
                    {node.featuredImage && (
                      <div className="relative overflow-hidden h-52 w-full">
                        <div className="sm:mx-0">
                          {node.slug ? (
                            <Link
                              href={`/blogs/${node.slug}`}
                              aria-label={node.title}
                            >
                              {
                                <Image
                                  fill
                                  alt={`Cover Image for ${node.title}`}
                                  src={node?.featuredImage?.node.sourceUrl}
                                  className="object-cover"
                                />
                              }
                            </Link>
                          ) : (
                            <Image
                              fill
                              alt={`Cover Image for ${node.title}`}
                              src={node?.featuredImage?.node.sourceUrl}
                              className="object-cover"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <dl className="text-sm my-4 text-slate-600">
                      <dt className="sr-only">Date</dt>
                      <dd className="whitespace-nowrap leading-6">
                        <time dateTime={node.date}>
                          {format(parseISO(node.date), "LLLL	d, yyyy")}
                        </time>
                      </dd>
                    </dl>
                    <h3 className="text-xl font-bold tracking-tight text-blue-950 line-clamp-2">
                      <Link
                        href={`/blogs/${node.slug}`}
                        dangerouslySetInnerHTML={{ __html: node.title }}
                      ></Link>
                    </h3>
                    <div
                      className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 line-clamp-2 text-slate-600"
                      dangerouslySetInnerHTML={{ __html: node.excerpt }}
                    />
                    <Link href={`/blogs/${node.slug}`} legacyBehavior>
                      <p
                        className="text-sm font-bold text-blue-950 flex items-center gap-1"
                        rel="noreferrer"
                      >
                        <span className="absolute sm:rounded-2xl"></span>
                        <span className="relative">
                          Read more
                          <span className="sr-only">{node.title}</span>
                        </span>
                        <svg
                          className="relative mt-px overflow-visible ml-2.5 text-gray-700"
                          width="3"
                          height="6"
                          viewBox="0 0 3 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M0 0L3 3L0 6"></path>
                        </svg>
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center justify-center">
            <Link href="/blogs" className="buttonprimary">
              {" "}
              View all blogs
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
        </div>
      </section>
      <section className="bg-blue-950">
        <div className="max-w-screen-lg mx-auto px-4   py-12 md:py-16">
          <p className="font-bold text-white text-center mb-3.5">BENEFITS</p>
          <h2
            className={`text-orange-50 xl:tracking-[-0.72px] text-center mb-6 md:mb-12 lg:mb-16 text-2xl lg:text-4xl noto-font `}
          >
            Experience The Advantages
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6  md:gap-10 lg:gap-20">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31.208"
                height="31.2"
                viewBox="0 0 31.208 31.2"
              >
                <path
                  id="Supporting_Local_Economies"
                  data-name="Supporting Local Economies"
                  d="M30.949,22.537l-2.236-9.764a1.756,1.756,0,0,0-.785-1.1,1.81,1.81,0,0,0-.242-.127V5.449a.606.606,0,0,0-.177-.428L22.665.177A.606.606,0,0,0,22.237,0H3.556a.606.606,0,0,0-.605.605v11.14a1.753,1.753,0,0,0-.676,1.028L.038,22.537a1.772,1.772,0,0,0,1.329,2.119l1.8.412A1.773,1.773,0,0,0,5.2,24l6.456,6.383a2.11,2.11,0,0,0,1.5.621h0a2.121,2.121,0,0,0,2-1.413l.661.661a2.11,2.11,0,0,0,1.5.621h0a2.121,2.121,0,0,0,2.006-1.423,2.11,2.11,0,0,0,1.353.485h0a2.119,2.119,0,0,0,2.123-2.123q0-.105-.01-.209a2.121,2.121,0,0,0,1.917-2.638L26,24.393a1.765,1.765,0,0,0,1.818.675l1.8-.412a1.772,1.772,0,0,0,1.329-2.119ZM22.843,2.067l2.777,2.777H22.843Zm-1.211-.856V5.449a.606.606,0,0,0,.605.605h4.238v5.416l-1.679.384h0a1.771,1.771,0,0,0-1.329,2.119l.045.2-.694.3a1.834,1.834,0,0,1-1.68-.1c-.544-.3-1.027-.587-1.453-.837-1.992-1.169-3.089-1.812-4.751-1.191a4.4,4.4,0,0,0-1.407.966H7.544a1.771,1.771,0,0,0-1.353-1.458l-1.8-.412a1.774,1.774,0,0,0-.232-.037V1.211ZM18.579,18.4a3.135,3.135,0,0,0-4-.361c-1.909,1.322-3.171,1.821-4.38.738a30.5,30.5,0,0,0,2.426-2.651,9.917,9.917,0,0,1,2.737-2.641c1.071-.4,1.745-.054,3.714,1.1.431.253.92.54,1.475.85a3.044,3.044,0,0,0,2.753.15l.486-.212,1.8,7.88-1.5.661ZM3.855,23.815a.553.553,0,0,1-.42.072l-1.8-.412a.561.561,0,0,1-.419-.668l2.236-9.764A.563.563,0,0,1,4,12.61c.041,0,1.921.426,1.921.426a.558.558,0,0,1,.419.668L4.1,23.468A.553.553,0,0,1,3.855,23.815ZM23.3,26.126a.919.919,0,0,1-1.293,0l-4.3-4.3a.606.606,0,0,0-.856.856l4.479,4.479a.914.914,0,0,1-1.293,1.293l-4.626-4.626a.606.606,0,1,0-.856.856l3.432,3.432a.914.914,0,0,1-1.309,1.276l-3.756-3.757a.606.606,0,0,0-.856.856l1.751,1.751a.912.912,0,0,1-.659,1.546h0a.909.909,0,0,1-.649-.268l-6.974-6.9,1.855-8.1h5c-.227.261-.458.535-.7.817a24.212,24.212,0,0,1-2.76,2.93.606.606,0,0,0-.076.851,3.5,3.5,0,0,0,2.751,1.445,6.88,6.88,0,0,0,3.655-1.538,1.9,1.9,0,0,1,2.458.221L23.3,24.834a.915.915,0,0,1,0,1.293Zm6.392-2.9a.553.553,0,0,1-.347.248l-1.8.412a.561.561,0,0,1-.668-.419L24.648,13.7a.558.558,0,0,1,.419-.668l1.8-.412a.561.561,0,0,1,.668.419l2.236,9.764A.553.553,0,0,1,29.7,23.228ZM7.876,5.9A2.166,2.166,0,0,1,9.568,3.849l-.009-.394a.605.605,0,0,1,1.211-.029l.01.438a2.567,2.567,0,0,1,1.421.884.605.605,0,0,1-1.012.665,1.737,1.737,0,0,0-1-.43,1.02,1.02,0,0,0-1.1.915,1.02,1.02,0,0,0,1.1.915,2.225,2.225,0,0,1,2.308,2.126A2.166,2.166,0,0,1,10.8,10.988l.008.339a.605.605,0,0,1-.591.62H10.2a.605.605,0,0,1-.6-.591L9.591,11a2.662,2.662,0,0,1-1.247-.753.605.605,0,0,1,.831-.881,1.275,1.275,0,0,0,1.009.488,1.02,1.02,0,0,0,1.1-.915,1.02,1.02,0,0,0-1.1-.915A2.225,2.225,0,0,1,7.876,5.9Zm6.607,1.4a.606.606,0,0,1,.605-.605h4.45a.605.605,0,0,1,0,1.211h-4.45A.606.606,0,0,1,14.483,7.3Zm0,2.361a.606.606,0,0,1,.605-.605h4.45a.605.605,0,0,1,0,1.211h-4.45A.606.606,0,0,1,14.483,9.661Zm0-4.723a.606.606,0,0,1,.605-.605h4.45a.605.605,0,0,1,0,1.211h-4.45A.606.606,0,0,1,14.483,4.938Z"
                  transform="translate(0.11 0.1)"
                  fill="#1F628E"
                  stroke="#1F628E"
                  strokeWidth="0.2"
                />
              </svg>

              <h3 className="text-lg md:text-xl font-medium text-orange-50 mt-4 md:mt-6 mb-3">
                Cost savings
              </h3>
              <p className="text-sm font-light text-orange-50">
                On the SELLITIC marketplace, we are purpose-driven which
                translates to ensuring that our creators are able to maximize
                their profits.
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27.537"
                height="31.2"
                viewBox="0 0 27.537 31.2"
              >
                <g
                  id="Fair_Compensation"
                  data-name="Fair Compensation"
                  transform="translate(0.1 0.1)"
                >
                  <path
                    id="Path_2417"
                    data-name="Path 2417"
                    d="M188.252,154.575a.484.484,0,0,0-.174-.006,1.156,1.156,0,0,1-1.022-1.146.508.508,0,1,0-1.017,0,2.175,2.175,0,0,0,1.6,2.095v.508a.509.509,0,0,0,1.017,0v-.478a2.171,2.171,0,0,0-.445-4.3,1.155,1.155,0,1,1,1.155-1.155.508.508,0,0,0,1.017,0,2.175,2.175,0,0,0-1.727-2.126v-.463a.509.509,0,0,0-1.017,0V148a2.171,2.171,0,0,0,.572,4.266,1.154,1.154,0,0,1,.042,2.307Zm0,0"
                    transform="translate(-174.236 -137.657)"
                    fill="#1F628E"
                    stroke="#1F628E"
                    strokeWidth="0.2"
                  />
                  <path
                    id="Path_2418"
                    data-name="Path 2418"
                    d="M104.195,113.866a7.374,7.374,0,1,0,7.374-7.374A7.374,7.374,0,0,0,104.195,113.866Zm7.374-6.357a6.357,6.357,0,1,1-6.357,6.357A6.357,6.357,0,0,1,111.569,107.509Zm0,0"
                    transform="translate(-97.595 -99.723)"
                    fill="#1F628E"
                    stroke="#1F628E"
                    strokeWidth="0.2"
                  />
                  <path
                    id="Path_2419"
                    data-name="Path 2419"
                    d="M24.214,328.382l-3.983,1.882a3.244,3.244,0,0,0-2.766-1.707l-3.677-.1a3.883,3.883,0,0,1-1.671-.432l-.374-.194a6.6,6.6,0,0,0-6.113.006l.023-.848a.509.509,0,0,0-.494-.522l-4.032-.111a.508.508,0,0,0-.522.494L.36,335.7a.508.508,0,0,0,.494.522l4.032.111H4.9a.508.508,0,0,0,.508-.495l.012-.423,1.048-.561a1.8,1.8,0,0,1,1.341-.147l6.255,1.756.033.008a6.7,6.7,0,0,0,1.375.142,6.784,6.784,0,0,0,2.834-.618.471.471,0,0,0,.063-.035l9.07-5.867a.509.509,0,0,0,.167-.677,2.569,2.569,0,0,0-3.392-1.033ZM1.391,335.219l.216-7.832,3.015.083L4.406,335.3Zm16.458-.133a5.765,5.765,0,0,1-3.526.394l-6.239-1.751a2.812,2.812,0,0,0-2.1.229l-.535.287.143-5.207a5.59,5.59,0,0,1,5.678-.3l.374.194a4.911,4.911,0,0,0,2.111.545l3.677.1a2.23,2.23,0,0,1,2.12,1.777l-5.478-.151a.509.509,0,0,0-.028,1.017l6.045.166h.014a.509.509,0,0,0,.508-.495,3.227,3.227,0,0,0-.049-.66l4.086-1.93.012-.006a1.554,1.554,0,0,1,1.757.246Zm0,0"
                    transform="translate(-0.36 -305.612)"
                    fill="#1F628E"
                    stroke="#1F628E"
                    strokeWidth="0.2"
                  />
                  <path
                    id="Path_2420"
                    data-name="Path 2420"
                    d="M213.22,5.339V.508a.508.508,0,0,0-1.017,0V5.339a.508.508,0,0,0,1.017,0Zm0,0"
                    transform="translate(-198.738)"
                    fill="#1F628E"
                    stroke="#1F628E"
                    strokeWidth="0.2"
                  />
                  <path
                    id="Path_2421"
                    data-name="Path 2421"
                    d="M273.22,42.8V40.508a.508.508,0,1,0-1.017,0V42.8a.508.508,0,1,0,1.017,0Zm0,0"
                    transform="translate(-254.924 -37.458)"
                    fill="#1F628E"
                    stroke="#1F628E"
                    strokeWidth="0.2"
                  />
                  <path
                    id="Path_2422"
                    data-name="Path 2422"
                    d="M153.22,42.8V40.508a.508.508,0,1,0-1.017,0V42.8a.508.508,0,1,0,1.017,0Zm0,0"
                    transform="translate(-142.552 -37.458)"
                    fill="#1F628E"
                    stroke="#1F628E"
                    strokeWidth="0.2"
                  />
                </g>
              </svg>

              <h3 className="text-lg md:text-xl font-medium text-orange-50 mt-4 md:mt-6 mb-3">
                Loyalty Rewards
              </h3>
              <p className="text-sm font-light text-orange-50">
                We will offer a loyalty program for our customers and creators
                which will not only be monetized, but can be used to unlock
                other features available in the future.
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33.192"
                height="32.147"
                viewBox="0 0 33.192 32.147"
              >
                <g
                  id="Sustainability_and_Ethics"
                  data-name="Sustainability and Ethics"
                  transform="translate(-0.6 -1.6)"
                >
                  <path
                    id="Path_3303"
                    data-name="Path 3303"
                    d="M33.392,17.151A15.151,15.151,0,1,0,3.536,20.808H2.045A1.045,1.045,0,0,0,1,21.853v3.135a8.369,8.369,0,0,0,8.359,8.359h6.269a6.235,6.235,0,0,0,3.5-1.072A15.148,15.148,0,0,0,33.392,17.151Zm-5.966,9.284-2.3-3.214a.519.519,0,0,1-.1-.3V21.7a.526.526,0,0,1,.055-.234l.969-1.937a.519.519,0,0,1,.467-.289h1.121a1.045,1.045,0,0,0,.836-.418l1.1-1.463A.526.526,0,0,1,30,17.151H31.3a13.034,13.034,0,0,1-3.877,9.284ZM24.2,5.534l-2,2a1.045,1.045,0,0,0-.3.887l.372,2.6a.52.52,0,0,1-.258.528L19.29,13.109a1.045,1.045,0,0,0-.527.907v4.7a.523.523,0,0,1-.522.522h-1.79a.52.52,0,0,1-.517-.443l-.84-5.463a1.036,1.036,0,0,0-.1-.308l-1.109-2.218a.522.522,0,0,1,.066-.568l1.956-2.347A1.045,1.045,0,0,0,16,6.687L14.732,4.573a13.006,13.006,0,0,1,9.468.962ZM12.738,5.309l1.09,1.817L12.347,8.9a2.613,2.613,0,0,0-.33,2.841l1.035,2.071.816,5.3a2.6,2.6,0,0,0,2.582,2.215h1.79a2.615,2.615,0,0,0,2.612-2.612v-4.1l2.206-1.261a2.6,2.6,0,0,0,1.29-2.637l-.3-2.086,1.971-1.971a13.072,13.072,0,0,1,5.111,8.394H30a2.625,2.625,0,0,0-2.09,1.045l-.784,1.045h-.6a2.6,2.6,0,0,0-2.336,1.444l-.969,1.937a2.627,2.627,0,0,0-.276,1.168v1.218a2.6,2.6,0,0,0,.486,1.518l2.32,3.249a.984.984,0,0,0,.086.094,12.974,12.974,0,0,1-4.6,2.086,6.219,6.219,0,0,0,.662-2.787V23.943A1.045,1.045,0,0,0,20.853,22.9H17.718a6.259,6.259,0,0,0-5.053,2.573,8.36,8.36,0,0,0-6.949-4.636A13.027,13.027,0,0,1,12.738,5.309ZM3.09,24.988V22.9H5.18a6.276,6.276,0,0,1,6.269,6.269v.612L9.575,27.906A1.045,1.045,0,1,0,8.1,29.383l1.873,1.873H9.359A6.276,6.276,0,0,1,3.09,24.988Zm11.926,6.269,1.351-1.351a1.045,1.045,0,1,0-1.477-1.477l-1.351,1.351v-.612a4.184,4.184,0,0,1,4.18-4.18h2.09v2.09a4.184,4.184,0,0,1-4.18,4.18Z"
                    fill="#1F628E"
                    stroke="#172554"
                    strokeWidth="0.8"
                  />
                </g>
              </svg>

              <h3 className="text-lg md:text-xl font-medium text-orange-50 mt-4 md:mt-6 mb-3">
                Borderless Payments
              </h3>
              <p className="text-sm font-light text-orange-50">
                Our flexible, borderless payment options make it easy for
                creators around the world to get paid - whether or not they have
                access to traditional banking.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <Faq />
      </section>
      <section className="bg-blue-950">
        <div className="max-w-[740px] mx-auto px-4 py-8 md:py-20">
          <h2 className="text-orange-50 text-center text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5">
            Bringing Hidden Creatives to Light
          </h2>
          <p className="text-orange-50 text-center mb-6 md:mb-12">
            Illuminating the world of talented artisans, celebrating their
            unseen masterpieces, and providing a platform for their
            craftsmanship to shine bright and flourish on the global stage of
            artistry and innovation.
          </p>
          <div className="flex items-center justify-center">
            <Link href="/join-as-a-seller" className="buttonprimary">
              {" "}
              Showcase Your Talent
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
            {/* <button className="buttonprimary" disabled title="Coming soon...">
              Start selling
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
            </button> */}
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}

export const getStaticProps = async ({ preview = false }) => {
  try {
    const allPostsRaw = await getAllPostsForNewData(preview);
    const categoryPostsRaw = await getAllCategory(preview);

    // ✅ trim blogs (only fields you actually use)
    const allPosts = {
      edges: allPostsRaw.edges.map(({ node }) => ({
        node: {
          title: node.title,
          slug: node.slug,
          date: node.date,
          excerpt: node.excerpt,
          featuredImage: node.featuredImage
            ? {
                node: {
                  sourceUrl: node.featuredImage.node.sourceUrl,
                },
              }
            : null,
        },
      })),
    };

    // ✅ trim categories (edges only)
    const categoryPosts = {
      edges: categoryPostsRaw.edges,
    };

    return {
      props: {
        allPosts,
        categoryPosts,
        preview,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { props: { error: true } };
  }
};

