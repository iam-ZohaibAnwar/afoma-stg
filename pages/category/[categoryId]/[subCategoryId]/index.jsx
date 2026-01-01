import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCardComponent from "@/components/ProductCard";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  subCategoryMapIdStg,
  subCategoryMapIdPrd,
} from "../../../../lib/categoryMap";
import Head from "next/head";
const Shop = ({ cart, pageData, addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(9);
  const router = useRouter();
  const { query } = router;
  const [categoryName, setCategoryName] = useState("");
  const categoryID = query.categoryId;
  const subCategoryID = query.subCategoryId;
  let canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL == "https://development.afomamarketplace.com"
                      ? `https://staging.afomamarketplace.com/category/${categoryID}/${subCategoryID}`
                      : `https://afomamarketplace.com/category/${categoryID}/${subCategoryID}`
  const loadMore = () => {
    setVisibleProducts((prev) => prev + 30);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let id =
          process.env.NEXT_PUBLIC_BASE_URL ==
          "https://development.afomamarketplace.com"
            ? subCategoryMapIdStg[subCategoryID?.toLowerCase()]
            : subCategoryMapIdPrd[subCategoryID?.toLowerCase()];
        if (id) {
          // Make the API call using the categoryID
          const response = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/products/search/related/${id}`
            );

          if (response.data) {
            // Check if response.data is defined
            const approvedProducts = response.data.products
              ? response.data.products.filter(
                  (product) =>
                    product.productStatus === "Approved" && product.status == 1
                )
              : [];
            setCategoryName(response.data.category?.name);
            pushEventViewSearchList(products, id)
            setProducts(approvedProducts);
            setError(false);
          } else {
            // Handle the case when response.data is undefined
            setProducts([]);
            setError(true);
          }
        } else {
          // Handle the case when categoryID is not available
          setError(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 response
          setProducts([]); // Set an empty array or handle it as per your requirements
          setError(false);
        } else {
          console.error("Error:", error);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Fetch data on component mount or when categoryID changes
  }, [subCategoryID]);

  const pushEventViewSearchList = (products, id) => {
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
      item_list_name: subCategoryID,

      ecommerce: {
        items: items
      },
    });
  }

  return (
    <>
      <Head>            
        <link
          rel="canonical"
          href={canonicalUrl}
        />
        <title>{pageData?.title}</title>
        <meta property="title" content={pageData?.metaTitle} />
        <meta name="description" content={pageData?.description ? pageData?.description : pageData?.metaDescription} />
        <meta property="og:title" content={pageData?.metaTitle} />
        <meta property="og:description" content={pageData?.metaDescription} />
        <meta property="og:image" content={pageData?.ogImage} />
        <meta property="og:image:alt" content={pageData?.ogImageAlt} />
        <meta property="og:url" content={pageData?.ogImageUrl}/>
      </Head>
      <section>
        <Header cart={cart} addToCart={addToCart} />
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

          <div className="pb-5 mb-8 flex flex-col md:flex-row items-start md:justify-between gap-4 border-b border-[#D8D8D8] mt-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h2 className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left noto-font mt-8`}>
                {pageData?.h2 ? pageData?.h2 : categoryName}
                </h2>
                {/* {products && (
                  <p className="text-blue-950 mt-5">{products.length} results</p>
                )} */}
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
                      {products.slice(0, visibleProducts).map((data) => (
                        <div key={data._id}>
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

export const getServerSideProps = async (context) => {
  const queries = {
    fashion: ["for-men", "for-women", "for-kids", "for-unisex"],
    "jewelry-and-accessories": [
      "necklaces-and-pendants",
      "earrings",
      "bracelets-and-bangles",
      "rings",
      "handbags-and-purses",
      "hats-and-headpieces",
      "brooches-and-pins",
    ],
    "home-and-living": ["handcrafted-decor", "home-decor", "food-and-related"],
    "toys-and-games": ["toys"],
    "art-and-collectibles": ["digital-art", "keychains"],
    "stationery-and-paper-goods": [
      "notebooks-and-journals",
      "greeting-cards",
      "stickers-and-labels",
    ],
    "personal-care-and-bath-products": [
      "handmade-soap",
      "lotion-and-body-butter",
      "oils",
    ],
  };

  const pageDataMap = {
    fashion: {
      "for-men": {
        h1: "Where Craft Meets Confidence",
        p: "Explore handmade men’s fashion designed by artisans who blend culture, creativity, and confidence.",
        h2: "Explore Men’s Collections",
        title: "Handcrafted Men’s Fashion | Artisan Clothing & Accessories | AFOMA",
        description: "Shop handmade men’s clothing and accessories crafted by skilled artisans. Discover traditional and modern fashion that connects culture with contemporary style.",
        metaTitle: "Handcrafted Men’s Fashion | Authentic Artisan Styles",
        metaDescription: "Explore handmade men’s fashion crafted by artisans across Africa and the globe - featuring traditional attire, accessories, and modern designs that celebrate culture and craftsmanship.",
        ogImage: `${process.env.NEXT_PUBLIC_URL}/assets/ogImages/men.jpg`,
        ogImageAlt: "",
        ogImageUrl: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-men`,
      },
      "for-women": {
        h1: "Bold. Beautiful. Handmade.",
        p: "Discover handmade women’s fashion that celebrates culture, creativity, and individuality.",
        h2: "Explore Women’s Collections",
        title: "Handmade Women’s Fashion | Unique Artisan Styles | AFOMA",
        description: "Shop unique handmade women’s fashion on AFOMA Marketplace. Discover artisan-crafted dresses, bags, and accessories made with creativity and purpose.",
        metaTitle: "Handmade Women’s Fashion | AFOMA Marketplace",
        metaDescription: "Explore artisan-crafted dresses, bags, and accessories that celebrate women’s creativity, culture, and confidence.",
        ogImage: `${process.env.NEXT_PUBLIC_URL}/assets/ogImages/women.jpg`,
        ogImageAlt: "",
        ogImageUrl: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-women`,
      },
      "for-kids": {
        h1: "Tiny Threads, Big Stories",
        p: "Explore handmade kidswear crafted with creativity, comfort, and playful design.",
        h2: "Explore Kids’ Collections",
        title: "Handcrafted Kids’ Fashion | Cute & Cultural Styles | AFOMA Marketplace",
        description: "Discover handmade kids’ clothing and accessories crafted by artisans. Unique, colorful, and cultural designs made with care for comfort, play, and tradition.",
        metaTitle: "Handcrafted Kids’ Fashion | Playful Cultural Styles",
        metaDescription: "Shop artisan-made kids’ clothing and accessories that celebrate creativity and culture. Handmade with love, comfort, and a touch of heritage.",
        ogImage: `${process.env.NEXT_PUBLIC_URL}/assets/ogImages/kids.jpg`,
        ogImageAlt: "",
        ogImageUrl: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-kids`,
      },
      "for-unisex": {
        h1: "Style Without Labels",
        p: "Discover handmade unisex fashion crafted with creativity, inclusivity, and culture.",
        h2: " Explore Unisex Collections",
        title: "Handcrafted Unisex Fashion | Gender-Inclusive Styles | AFOMA Marketplace",
        description: "Shop handmade unisex clothing and accessories crafted by artisans. Versatile, cultural, and sustainable designs made for everyone who values comfort and creativity.",
        metaTitle: "Handcrafted Unisex Fashion | Artisan-Made for Everyone",
        metaDescription: "Explore artisan-made unisex fashion and accessories that celebrate individuality and culture. Handmade with purpose, comfort, and timeless design.",
        ogImage: `${process.env.NEXT_PUBLIC_URL}/assets/ogImages/unisex.jpg`,
        ogImageAlt: "",
        ogImageUrl: `${process.env.NEXT_PUBLIC_URL}/category/fashion/for-unisex`,
      },
    },
    "jewelry-and-accessories": {
      "necklaces-and-pendants": {
        title: "Handmade Necklaces & Pendants | Statement Jewelry",
        metaTitle: "Handmade Necklaces & Pendants | Statement Jewelry",
        metaDescription:
          "Shop handmade gemstone and African beaded necklaces. Discover ethical statement jewelry crafted by artisans from around the globe.",
      },
      earrings: {
        title: "Handmade Earrings | Elegant Fashion Designs – AFOMA",
        metaTitle: "Handmade Earrings | Elegant Fashion Designs – AFOMA",
        metaDescription:
          "Explore handmade earrings, including African hoop earrings and ethical stud jewelry. Unique styles crafted for conscious shoppers. Shop today!",
      },
      "bracelets-and-bangles": {
        title: "Bracelets & Bangles | Handcrafted Designs for Every Style",
        metaTitle: "Bracelets & Bangles | Handcrafted Designs for Every Style",
        metaDescription:
          "Discover bracelets and bangles, including handcrafted cuffs, charm bracelets, and timeless designs. Perfect for every style and occasion. Explore now!",
      },
      rings: {
        title: "Rings | Handcrafted Styles for Every Occasion – AFOMA",
        metaTitle: "Rings | Handcrafted Styles for Every Occasion – AFOMA",
        metaDescription:
          "Explore a stunning collection of rings, including handcrafted bands, statement pieces, and timeless designs. Perfect for every style and occasion. Shop now!",
      },
      "handbags-and-purses": {
        title: "Handbags & Purses | Stylish & Handcrafted Designs – AFOMA",
        metaTitle: "Handbags & Purses | Stylish & Handcrafted Designs – AFOMA",
        metaDescription:
          "Shop a unique collection of handbags and purses, featuring handcrafted totes, crossbody bags, and clutches. Stylish designs for every occasion. Explore now!",
      },
      "hats-and-headpieces": {
        title: "Hats & Headpieces | Stylish & Unique Accessories – AFOMA",
        metaTitle: "Hats & Headpieces | Stylish & Unique Accessories – AFOMA",
        metaDescription:
          "Discover unique, handcrafted hats and headpieces from independent makers. Shop a wide selection of custom beanies, fascinators, crowns, and more. Find your perfect piece today!",
      },
      "brooches-and-pins": {
        title:
          "Elegant Brooches & Pins | Unique Handcrafted Accessories – AFOMA",
        metaTitle:
          "Elegant Brooches & Pins | Handcrafted & Stylish Accessories – AFOMA",
        metaDescription:
          "Elevate your style with exquisite handcrafted brooches and pins. Explore a curated collection of unique designs, including custom beanies, fascinators, crowns, and more. Shop timeless accessories today!",
      },
    },
    "home-and-living": {
      "handcrafted-decor": {
        title: "Handcrafted Decor | Unique Home Accents – AFOMA",
        metaTitle: "Handcrafted Decor | Unique Home Accents – AFOMA",
        metaDescription:
          "Elevate your space with handcrafted decor, including unique wall art, tabletop accents, and handmade ornaments. Perfect for creating a warm, personalized home.",
      },
      "home-decor": {
        title: "Home Decor | Stylish & Handcrafted Designs – AFOMA",
        metaTitle: "Home Decor | Stylish & Handcrafted Designs – AFOMA",
        metaDescription:
          "Transform your home with unique decor, including handcrafted wall art, elegant accents, and timeless designs. Perfect for every room and personal style.",
      },
      "food-and-related": {
        title: "Food & Related | Explore a World of Flavors | AFOMA",
        metaTitle: "Food & Related | Explore a World of Flavors | AFOMA",
        metaDescription:
          "Discover a culinary journey with our diverse selection of food and related products. Find exotic spices, artisanal snacks, gourmet kitchenware, and more from around the world.",
      },
    },
    "toys-and-games": {
      toys: {
        title: "Unique & Handcrafted Toys | Shop AFOMA Marketplace",
        metaTitle: "Unique & Handcrafted Toys | Shop AFOMA Marketplace",
        metaDescription:
          "Discover one-of-a-kind, handcrafted toys. Shop for unique wooden toys, plushies, dolls, and more. Find the perfect gift today!",
      },
    },
    "art-and-collectibles": {
      "digital-art": {
        title: "Shop Digital Art at AFOMA | Own Unique Digital Creations",
        metaTitle: "Shop Digital Art at AFOMA | Own Unique Digital Creations",
        metaDescription:
          "Elevate your space with unique digital art. Browse and buy original digital art designs, illustrations, and more. Own a piece of digital art today!",
      },
      keychains: {
        title: "Handcrafted & Personalized Keychains | AFOMA Marketplace",
        metaTitle: "Handcrafted & Personalized Keychains | AFOMA Marketplace",
        metaDescription:
          "Find unique and personalized keychains at AFOMA. Shop leather keychains, resin keychains, engraved keychains, and more from talented artisans.",
      },
    },
    "stationery-and-paper-goods": {
      "notebooks-and-journals": {
        title: "Notebooks & Journals | Writing, Sketching & More | AFOMA",
        metaTitle: "Notebooks & Journals | Writing, Sketching & More | AFOMA",
        metaDescription:
          "Discover a selection of handmade or customized notebooks, journals, planners and diaries at AFOMA. Perfect for personal use or gifts.",
      },
      "greeting-cards": {
        title: "Handmade Greeting Cards | All Occasions | Shop AFOMA",
        metaTitle: "Handmade Greeting Cards | All Occasions | Shop AFOMA",
        metaDescription:
          "Find the perfect handcrafted greeting card for any occasion. Shop birthday cards, thank you cards, holiday cards, and more.",
      },
      "stickers-and-labels": {
        title: "Labels & Stickers | Custom Designs | AFOMA",
        metaTitle: "Labels & Stickers | Custom Designs | AFOMA",
        metaDescription:
          "Discover a wide variety of custom labels and stickers at AFOMA. Shop personalized decorative stickers, planner stickers, address labels, and more.",
      },
    },
    "personal-care-and-bath-products": {
      "handmade-soap": {
        title: "Handmade Soap | Natural & Organic Soaps | AFOMA",
        metaTitle: "Handmade Soap | Natural & Organic Soaps | AFOMA",
        metaDescription:
          "Browse a collection of moisturizing and exfoliating handmade soaps on AFOMA. Discover soaps for all skin types, made with natural ingredients.",
      },
      "lotion-and-body-butter": {
        title: "Lotion & Body Butter | Natural Skin Care | AFOMA",
        metaTitle: "Lotion & Body Butter | Natural Skin Care | AFOMA",
        metaDescription:
          "Browse a collection of shea butter body butters, natural lotions, and other moisturizing skincare. Discover products for dry skin, sensitive skin, and more.",
      },
      oils: {
        title: "Oils | Essential, Carrier & More | AFOMA",
        metaTitle: "Oils | Essential, Carrier & More | AFOMA",
        metaDescription:
          "Discover a variety of natural oils at AFOMA. Shop essential oils, carrier oils, massage oils, and more from independent artisans.",
      },
    },
    default: {
      title: "",
      metaTitle: "",
      metaDescription: "",
    },
  };

  if (
    !context.query?.categoryId ||
    !queries[context.query?.categoryId]
  ) {
    return { notFound: true };
  }

  if (
    !context.query?.subCategoryId ||
    !queries[context.query?.categoryId].includes(
      context.query?.subCategoryId.toLowerCase()
    )
  ) {
    return { notFound: true };
  }

  const pageData =
    pageDataMap[context.query?.categoryId][
      context.query?.subCategoryId.toLowerCase()
    ];

  return {
    props: { pageData },
  };
};

export default Shop;
