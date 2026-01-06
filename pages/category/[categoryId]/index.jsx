import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const ProductCardComponent = dynamic(() => import("@/components/ProductCard"), { ssr: false });
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categoryMapIdStg, categoryMapIdPrd } from "../../../lib/categoryMap";
import Head from "next/head";

const Shop = ({ cart, pageData, addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [productData, setProductData] = useState({});
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(9);
  const router = useRouter();
  const { query } = router;
  const [categoryName, setCategoryName] = useState("");
  const categoryID = query.categoryId;
  let canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL == "https://development.afomamarketplace.com"
                    ? `https://staging.afomamarketplace.com/category/${categoryID}`
                    : `https://afomamarketplace.com/category/${categoryID}`
  const loadMore = useCallback(() => {
    setVisibleProducts((prev) => prev + 30);
  }, []);

  const pushEventViewSearchList = useCallback((products, id) => {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    const items = products.map(product => {
      return {
        item_id: product._id,
        item_name: product.productName,
        item_brand: product?.seller?.storeSlug,
        item_category: product?.Category?.name,
        item_category2: product?.SubCategory?.name,
        price: product.totalAmount || product?.finalPrice,
        currency: "CAD",
        google_business_vertical: "retail"
      };
    });

    window.dataLayer.push({
      event: "view_item_list",
      item_list_id: id,
      item_list_name: categoryID,
      ecommerce: {
        items: items
      },
    });
  }, [categoryID]);

  // Memoize category ID lookup
  const categoryMapId = useMemo(() => {
    return process.env.NEXT_PUBLIC_BASE_URL === "https://development.afomamarketplace.com"
      ? categoryMapIdStg
      : categoryMapIdPrd;
  }, []);

  // Memoize visible products
  const displayedProducts = useMemo(() => 
    products.slice(0, visibleProducts),
    [products, visibleProducts]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryID) return;
      
      try {
        setLoading(true);
        const id = categoryMapId[categoryID.toLowerCase()];
        
        if (!id) {
          setError(true);
          setLoading(false);
          return;
        }

        // Make the API call using the categoryID
        const axiosInstance = axios.create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        });

        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/products/search/related/${id}`
        );

        if (response.data) {
          const approvedProducts = response.data.products
            ? response.data.products.filter(
                (product) =>
                  product.productStatus === "Approved" && product.status == 1
              )
            : [];
          setCategoryName(response.data.category?.name);
          setProducts(approvedProducts);
          pushEventViewSearchList(approvedProducts, id);
          setError(false);
        } else {
          setProducts([]);
          setError(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProducts([]);
          setError(false);
        } else {
          console.error("Error:", error);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryID, categoryMapId, pushEventViewSearchList]);

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={canonicalUrl}
        />
        <title>{pageData?.title}</title>
        <meta property="title" content={pageData?.metaTitle} />
        <meta property="description" content={pageData?.description}></meta>
        <meta property="og:title" content={pageData?.metaTitle} />
        <meta property="og:description" content={pageData?.metaDescription}/>
        <meta property="og:image" content={pageData?.ogImage} />
        <meta property="og:image:alt" content={pageData?.ogImageAlt} />
        <meta property="og:url" content={pageData?.ogImageUrl}/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageData?.jsonLd),
          }}
        />
      </Head>
      <section>
        <Header cart={cart} addToCart={addToCart}/>
      </section>
      <section id="products" className="bg-white ">
        <div className="max-w-screen-xl mx-auto px-4 2 py-8 md:py-10 lg:py-18">
          {pageData?.h1 ? (<div className="max-w-[920px] mx-auto ">
            <h1
              className={`text-2xl md:text-4xl xl:text-5xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-center mb-5 noto-font`}
            >
              {pageData?.h1}
            </h1>
            <div className="md:px-[70px] mb-6 md:mb-12">
              <p className="font-medium text-center text-blue-950">
                {pageData?.p}
              </p>
            </div>
          </div>) : ""}
          <div className="pb-5 mb-8 flex flex-col items-start gap-4 border-b border-[#D8D8D8]">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* Flex container for h2 and product count */}
                <div className="flex w-full justify-between items-center mt-8">
                  <h2 className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left noto-font`}>
                    {pageData?.h2 ? pageData?.h2 : categoryName}
                  </h2>

                  {/* Product count displayed next to h2, on the right */}
                  {/* {products && (
                    <p className="text-blue-950 mt-0 md:mt-0 text-lg">{products.length} results</p>
                  )} */}
                </div>

                {/* Carousel below the category name */}
                {pageData.subCategory && pageData.subCategory.length > 0 && (
                  <div className="w-full">
                    <div className="flex overflow-x-auto space-x-6 pb-2 max-w-full flex-nowrap">
                      {pageData.subCategory.map((subcategory, index) => (
                        <a
                          key={index}
                          href={subcategory.href} // assuming each subcategory object has an `href` property
                          className="text-sm lg:text-lg text-blue-950 hover:text-blue-700 font-medium text-md noto-font whitespace-nowrap"
                        >
                          {subcategory.name}  {/* assuming each subcategory object has a `name` property */}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </>
            )}
          </div>

          <div className="flex flex-col">
            {" "}
            <div>
              {!loading ? (
                <>
                  {error && <p>Error - Something went wrong!</p>}
                  {products && products.length > 0 ? (
                    <div className="flex flex-wrap gap-8 mb-4 md:mb-9 xl:mb-12 justify-center">
                      {displayedProducts.map((data) => (
                        <div
                          key={data._id}
                          onClick={() => {
                            setProductData(data);
                          }}
                        >
                          <ProductCardComponent data={data} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center justify-center flex items-center mb-5 md:mb-9">
                      <Image
                        src={"/Coming Soon - AFOMA Marketplace.png"}
                        alt="Coming Soon"
                        height={466}
                        width={976}
                        loading="lazy"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
              <div>
                <div className="flex justify-center">
                  {products && visibleProducts < products.length && (
                    <button className="buttonprimary" onClick={loadMore}>
                      Load more
                    </button>
                  )}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
};

const VALID_CATEGORIES = new Set([
  "art-and-collectibles",
  "fashion",
  "home-and-living",
  "jewelry-and-accessories",
  "personal-care-and-bath-products",
  "stationery-and-paper-goods",
  "toys-and-games",
]);

const PAGE_DATA_MAP = {
  "art-and-collectibles": {
    title: "Shop Arts & Collectibles | AFOMA Marketplace",
    metaTitle: "Shop Arts & Collectibles | AFOMA Marketplace",
    metaDescription:
      "Shop curated arts and collectibles online at AFOMA Marketplace. Discover one-of-a-kind pieces crafted to inspire and enhance your space.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Shop Arts & Collectibles | AFOMA Marketplace",
      url: "https://afomamarketplace.com/category/art-and-collectibles",
      headline: "Shop Arts & Collectibles | AFOMA Marketplace",
      description:
        "Shop curated arts and collectibles online at AFOMA Marketplace. Discover one-of-a-kind pieces crafted to inspire and enhance your space.",
      mainEntity: {
        "@type": "Article",
        headline: "Shop Arts & Collectibles | AFOMA Marketplace",
        description:
          "Discover curated arts and collectibles at AFOMA Marketplace. Explore unique pieces that inspire creativity and elevate your collection.",
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
        datePublished: "2024-11-22",
        dateModified: "2024-11-22",
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
            name: "Categories",
            item: "https://afomamarketplace.com/category",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Arts and Collectibles",
            item: "https://afomamarketplace.com/category/art-and-collectibles",
          },
        ],
      },
    },
  },
  fashion: {
    h1: "Made by Hand, Worn with Heart",
    p: "Explore artisan-made fashion, crafted with culture and care - from Ankara shirts to handwoven shawls",
    h2: "Shop by Category",
    title: "Shop Handmade Fashion Online | Ethical Apparel & Accessories – AFOMA",
    description: "Discover handmade clothing and accessories crafted by global artisans. Ethically sourced, beautifully made, and ready to ship. Shop fashion that empowers",
    metaTitle: "Handmade Fashion That Empowers | Shop Ethically on AFOMA",
    metaDescription: "Explore artisan-made clothing and accessories. Ethical, cultural, and crafted to stand out. Shop now on AFOMA Marketplace.",
    ogImage: `${process.env.NEXT_PUBLIC_URL}/assets/ogImages/fashion.jpg`,
    ogImageAlt: "Ethical artisan-made fashion and accessories on AFOMA Marketplace",
    ogUrl: `${process.env.NEXT_PUBLIC_URL}/category/fashion`,
    subCategory: [
      {
        href: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-men`,
        name: "For Men"
      },
      {
        href: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-women`,
        name: "For Women"
      },
      {
        href: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-kids`,
        name: "For Kids"
      },
      {
        href: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-unisex`,
        name: "For Unisex"
      }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Shop Handmade Fashion Online | Ethical Apparel & Accessories – AFOMA",
      url: "https://afomamarketplace.com/category/fashion",
      headline: "Shop Handmade Fashion Online | Ethical Apparel & Accessories – AFOMA",
      description:
        "Discover handmade clothing and accessories crafted by global artisans. Ethically sourced, beautifully made, and ready to ship. Shop fashion that empowers",
      mainEntity: {
        "@type": "Article",
        headline: "Unique Artisan Fashion | AFOMA Marketplace",
        description:
          "Explore handcrafted fashion at AFOMA Marketplace. Discover designs that celebrate cultural artistry and timeless beauty.",
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Fashion",
            item: "https://www.afomamarketplace.com/category/fashion",
          },
        ],
      },
    },
  },
  "home-and-living": {
    title: "Discover Home and Living Treasures | AFOMA Marketplace",
    metaTitle: "Discover Home and Living Treasures | AFOMA Marketplace",
    metaDescription:
      "Discover unique Home and Living treasures handcrafted by global artisans. Transform your space with one-of-a-kind decor and furniture at AFOMA Marketplace.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Discover Home and Living Treasures | AFOMA Marketplace",
      url: "https://www.afomamarketplace.com/category/home-and-living",
      headline: "Discover Home and Living Treasures | AFOMA Marketplace",
      description:
        "Discover unique Home and Living treasures handcrafted by global artisans. Transform your space with one-of-a-kind decor and furniture at AFOMA Marketplace.",
      mainEntity: {
        "@type": "Article",
        headline: "Discover Home and Living Treasures | AFOMA Marketplace",
        description:
          "Browse unique Home and Living treasures, including handcrafted decor and furniture from global artisans. Create a personalized, stylish living space.",
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Home and Living",
            item: "https://www.afomamarketplace.com/category/home-and-living",
          },
        ],
      },
    },
  },
  "jewelry-and-accessories": {
    title: "Shop Jewelry & Accessories | AFOMA Marketplace",
    metaTitle: "Shop Jewelry & Accessories | AFOMA Marketplace",
    metaDescription:
      "JExplore artisanal Jewelry and accessories at AFOMA Marketplace. From timeless classics to modern trends, find the perfect piece to match your style.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Shop Jewelry & Accessories | AFOMA Marketplace",
      url: "https://www.afomamarketplace.com/category/jewelry-and-accessories",
      headline: "Shop Jewelry & Accessories | AFOMA Marketplace",
      description:
        "Discover handcrafted Jewelry and accessories at AFOMA Marketplace. Shop unique, artisanal designs that elevate your style and reflect creativity.",
      mainEntity: {
        "@type": "Article",
        headline: "Shop Jewelry & Accessories | AFOMA Marketplace",
        description:
          "Explore a curated collection of handcrafted Jewelry and accessories at AFOMA Marketplace. Find timeless and trendy pieces that express your style.",
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
          {
            "@type": "ListItem",
            position: 3,
            name: "jewelry & Accessories",
            item: "https://www.afomamarketplace.com/category/jewelry-and-accessories",
          },
        ],
      },
    },
  },
  "personal-care-and-bath-products": {
    title: "Shop Personal Care and Bath Products | AFOMA Marketplace",
    metaTitle: "Shop Personal Care and Bath Products | AFOMA Marketplace",
    metaDescription:
      "Shop high-quality Personal Care and Bath Products at AFOMA Marketplace. Discover handmade soaps, bath essentials, and body care for every skin type.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Shop Personal Care and Bath Products | AFOMA Marketplace",
      url: "https://afomamarketplace.com/category/personal-care-and-bath-products",
      headline: "Shop Personal Care and Bath Products | AFOMA Marketplace",
      description:
        "Shop high-quality Personal Care and Bath Products at AFOMA Marketplace. Discover handmade soaps, bath essentials, and body care for every skin type.",
      mainEntity: {
        "@type": "Article",
        headline: "Shop Personal Care and Bath Products | AFOMA Marketplace",
        description:
          "Discover high-quality Personal Care and Bath Products at AFOMA Marketplace. Find handmade soaps, bath bombs, scrubs, and more for all your self-care needs.",
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
        datePublished: "2024-11-22",
        dateModified: "2024-11-22",
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
            name: "Categories",
            item: "https://afomamarketplace.com/category",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Personal Care and Bath Products",
            item: "https://afomamarketplace.com/category/personal-care-and-bath-products",
          },
        ],
      },
    },
  },
  "stationery-and-paper-goods": {
    title: "Curated Stationery & Art Goods | AFOMA Marketplace",
    metaTitle: "Curated Stationery & Art Goods | AFOMA Marketplace",
    metaDescription:
      "Discover premium stationery and paper goods at AFOMA Marketplace. Find everything from journals to labels for your creative and organizational needs.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Curated Stationery & Art Goods | AFOMA Marketplace",
      url: "https://afomamarketplace.com/category/stationery-and-paper-goods",
      headline: "Curated Stationery & Art Goods | AFOMA Marketplace",
      description:
        "Discover premium stationery and paper goods at AFOMA Marketplace. Find everything from journals to labels for your creative and organizational needs.",
      mainEntity: {
        "@type": "Article",
        headline: "Curated Stationery & Art Goods | AFOMA Marketplace",
        description:
          "Explore premium stationery and paper goods at AFOMA Marketplace. Find everything from journals to labels for your creative and organizational needs.",
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
        datePublished: "2024-11-22",
        dateModified: "2024-11-22",
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
            name: "Categories",
            item: "https://afomamarketplace.com/category",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Stationery and Paper Goods",
            item: "https://afomamarketplace.com/category/stationery-and-paper-goods",
          },
        ],
      },
    },
  },
  "toys-and-games": {
    title: "Unique Toys and Games for Kids & Pets | AFOMA Marketplace",
    metaTitle: "Unique Toys and Games for Kids & Pets | AFOMA Marketplace",
    metaDescription:
      "Shop unique Toys and Games for kids and pets at AFOMA Marketplace. Handcrafted treasures for endless joy, imagination, and shared moments.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Unique Toys and Games for Kids & Pets | AFOMA Marketplace",
      url: "https://afomamarketplace.com/category/toys-and-games",
      headline: "Unique Toys and Games for Kids & Pets | AFOMA Marketplace",
      description:
        "Shop unique Toys and Games for kids and pets at AFOMA Marketplace. Handcrafted treasures for endless joy, imagination, and shared moments.",
      mainEntity: {
        "@type": "Article",
        headline: "Unique Toys and Games for Kids & Pets | AFOMA Marketplace",
        description:
          "Discover unique Toys and Games for kids and pets at AFOMA Marketplace. Explore handcrafted toys for joyful play and shared family moments.",
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
        datePublished: "2024-11-22",
        dateModified: "2024-11-22",
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
            name: "Categories",
            item: "https://afomamarketplace.com/category",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Toys and Games",
            item: "https://afomamarketplace.com/category/toys-and-games",
          },
        ],
      },
    },
  },
  default: {
    title: "Arts and Collectibles | AFOMA Marketplace",
    metaTitle: "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
    metaDescription:
      "Dive into art, crafts & DIY projects with AFOMA Marketplace Blogs. Get inspired with tutorials, tips, and stories from the world of handmade goods",
    jsonLd: {},
  },
};

export const getServerSideProps = async (context) => {
  const rawCategoryId = context.query?.categoryId?.toLowerCase();

  // 1️⃣ Validate category
  if (!rawCategoryId || !VALID_CATEGORIES.has(rawCategoryId)) {
    return { notFound: true };
  }

  // 2️⃣ Enforce clean URL (only /category/:categoryId)
  if (Object.keys(context.query).length > 1) {
    return {
      redirect: {
        destination: `/category/${rawCategoryId}`,
        permanent: true,
      },
    };
  }

  // 3️⃣ Fetch SEO data only
  const pageData = PAGE_DATA_MAP[rawCategoryId] || PAGE_DATA_MAP.default;

  return {
    props: { pageData },
  };
};

export default Shop;
