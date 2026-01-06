import dynamic from "next/dynamic";
import Head from "next/head";
import {
  getAllCategory,
  getAllPostsForCategory,
  getAllPostsWithCategorySlug,
} from "../../lib/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Waitlist = dynamic(() => import("@/components/Waitlist"), { ssr: false });
//import { Noto_Serif } from "next/font/google";

//const noto = Noto_Serif({ subsets: ["latin"] });

export default function Index({ allPosts, preview, allCategories, cart, pageData, addToCart }) {
  const router = useRouter();

  const categories = allCategories?.edges.slice(0, -1);
  const morePosts = allPosts?.edges;

  return (
    <>
      <Head>
        <title>Blogs | AFOMA Marketplace</title>
        <meta name="title" content={pageData?.metaTitle} />
        <meta
          name="description"
          content={pageData?.metaDescription}
        />
        <meta
          name="keywords"
          content="NFT, AFOMA, decentralized, marketplace, blockchain, ecommerce, artisans, handicraft"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageData?.jsonLd),
          }}
        />
      </Head>

      <section>
        <Header cart={cart} addToCart={addToCart} />
        <div className="flex flex-col items-center max-w-[52rem] mx-auto px-9  lg:max-w-7xl py-8 md:py-20 ">
        <div className="mb-6 md:mb-12">
          <h1
            className={`text-2xl md:text-3xl xl:text-4xl mb-4 text-slate-950 text-center noto-font `}
          >
            {pageData?.H1}
          </h1>
          <h2
            className={`text-sm md:text-lg xl:text-xl mb-4 text-slate-950 text-center noto-font`}
          >
            {pageData?.H2}
          </h2>
          <p className="text-slate-600 md:text-sm text-center mb-6 " 
          dangerouslySetInnerHTML={{ __html: pageData?.P }}
          >
          </p>

            <div className="flex items-center justify-center">
              <Waitlist />
            </div>
          </div>
          {/* <div className="w-full flex flex-col items-center gap-6"> */}

          <div className="mb-7 self-start">
            <Link href={"/"}>
              <button className="inline-flex items-center font-medium gap-2 text-blue-950 hover:text-primary transition-all ease-out group text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="5.854"
                  height="10.019"
                  viewBox="0 0 5.854 10.019"
                  className="text-blue-950 group-hover:text-primary transition-all ease-out -rotate-180"
                >
                  <path
                    id="Down_Arrow_3_"
                    d="M24.634,45.056a.42.42,0,0,1-.3-.123l-4.213-4.213a.421.421,0,1,1,.6-.6l3.915,3.915,3.915-3.915a.421.421,0,1,1,.6.6l-4.213,4.213a.42.42,0,0,1-.3.123Z"
                    transform="translate(-39.577 29.644) rotate(-90)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                  />
                </svg>
                Back to the homepage
              </button>
            </Link>
          </div>
          {/*{categories?.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-3 lg:gap-5 mb-7  text-sm font-medium text-gray-800">
              {categories.map(({ node }) => {
                return (
                  <li
                    key={node.categoryId}
                    className="rounded py-2 px-3 bg-orange-100 hover:bg-orange-200 transition-colors ease-in"
                  >
                    <Link href={`/category/${node.slug}`}>{node.name}</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div> */}
          <div className="grid gap-5 xl:grid-cols-12 xl:gap-10 xl:relative">
            <div className="xl:col-span-9 grid sm:grid-cols-2 xl:grid-cols-3 gap-9">
              {morePosts?.length > 0 ? (
                morePosts?.map(({ node, index }) => (
                  <div
                    className="border border-slate-200 rounded-sm cursor-pointer  hover:bg-orange-100 transition-colors ease-in"
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
                                <Image
                                  fill
                                  alt={`Cover Image for ${node.title}`}
                                  src={node?.featuredImage?.node.sourceUrl}
                                  className="object-cover"
                                />
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
                    <div div className="p-6">
                      <dl className="text-sm my-4 text-slate-600">
                        <dt className="sr-only">Date</dt>
                        <dd className="whitespace-nowrap leading-6">
                          <time dateTime={node.date}>
                            {format(parseISO(node.date), "LLLL	d, yyyy")}
                          </time>
                        </dd>
                      </dl>
                      <h3 className="text-base font-semibold tracking-tight text-gray-800 line-clamp-2">
                        <Link
                          href={`/blogs/${node.slug}`}
                          dangerouslySetInnerHTML={{ __html: node.title }}
                        ></Link>
                      </h3>
                      <div
                        className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: node.excerpt }}
                      />
                      <Link href={`/blogs/${node.slug}`} legacyBehavior>
                        <p
                          className="flex items-center text-sm text-gray-700 font-medium"
                          rel="noreferrer"
                        >
                          <span className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-2xl"></span>
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
                ))
              ) : (
                <p>No Blog Posts For this Category</p>
              )}
            </div>

            <div className="xl:col-span-3 relative">
              <h2 className="text-xl tracking-tight text-blue-950 font-semibold mb-4">
                Categories
              </h2>
              <div>
                {categories?.length > 0 && (
                  <ul className="font-medium text-blue-950 space-y-4">
                    {categories?.map(({ node }) => {
                      return (
                        <li key={node.categoryId}>
                          <Link href={`/blogs-category/${node.slug}`}>
                            <span className="hover:text-primary transition-all ease-out">
                              {node.name}
                            </span>
                          </Link>
                          <ul className="space-y-2 list-disc ml-8 mt-2">
                            {node?.children?.edges.map(({ node }) => (
                              <li key={node.categoryId}>
                                <Link href={`/blogs-category/${node.slug}`}>
                                  <span className="hover:text-primary transition-all ease-out">
                                    {node.name}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-blue-950 ">
        <div className="max-w-[640px] mx-auto py-6 md:py-20">
          <h2
            className={`text-orange-50 text-2xl md:text-4xl text-center mb-5 noto-font`}
          >
            Join the AFOMA Community Today!
          </h2>
          <p className="text-orange-50 mb-5 md:mb-10 text-center">
            Don&apos;t miss out on the opportunity to showcase your crafts to
            the world. Sign up for our waitlist and be the first to receive
            exclusive promotions and exciting deals. Become a part of the AFOMA
            family and let&apos;s celebrate the beauty of handmade crafts
            together.
          </p>
          <div className="flex items-center justify-center">
            <Waitlist />
          </div>
        </div>
      </section>
      <section>
        <div className="py-9">
          <Footer />
        </div>
      </section>
    </>
  );
}

export const getStaticProps = async ({ params, preview = false }) => {
  let allPosts = await getAllPostsForCategory(preview, params?.slug);
  const allCategories = await getAllCategory(preview);

  allPosts = allPosts?.edges?.length ? allPosts : []

  const pageDataMap = {
    "art-crafts-diy-projects": {
      metaTitle: "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
      metaDescription: "Dive into art, crafts & DIY projects with AFOMA Marketplace Blogs. Get inspired with tutorials, tips, and stories from the world of handmade goods",
      H1: "Creative Art and Craft DIY Projects to Inspire Your Imagination",
      H2: "Stay Ahead with the Latest Marketplace Trends, E-Commerce Guides, and Success Stories on AFOMA Marketplace",
      P: "Welcome to the AFOMA Marketplace Blog, your source for expert tips, e-commerce advice, and inspiring success stories.<br /> From marketing strategies to business growth tips, we provide valuable insights to help you succeed in the online marketplace.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
        "url": "https://afomamarketplace.com/blogs-category/art-crafts-diy-projects",
        "headline": "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
        "description": "Dive into art, crafts & DIY projects with AFOMA Marketplace Blogs. Get inspired with tutorials, tips, and stories from the world of handmade goods.",
        "mainEntity": {
          "@type": "Article",
          "headline": "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
          "description": "Dive into art, crafts & DIY projects with AFOMA Marketplace Blogs. Get inspired with tutorials, tips, and stories from the world of handmade goods.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-22",
          "dateModified": "2024-11-22"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Art, Crafts & DIY Projects",
              "item": "https://afomamarketplace.com/blogs-category/art-crafts-diy-projects"
            }
          ]
        }
      }
    },
    "artisans-tips-and-advice": {
      metaTitle: "Artisans Tips and Advice | AFOMA Marketplace",
      metaDescription: "Get the best Artisans Tips and Advice on AFOMA Marketplace. Find expert advice, trends, and resources tailored for artisans and their craft.",
      H1: "Expert Artisan Tips and Advice to Elevate Your Craft",
      H2: "Discover Step-by-Step Guides, Crafting Tips, and Unique Project Ideas for Every Skill Level",
      P: "Get creative with our DIY art and craft projects, perfect for all skill levels. Explore step-by-step guides, crafting tips, <br /> and unique ideas to inspire your next project—whether it’s home décor, gifts, or accessories.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Artisans Tips and Advice | AFOMA Marketplace",
        "url": "https://afomamarketplace.com/blogs-category/artisans-tips-and-advice",
        "headline": "Artisans Tips and Advice | AFOMA Marketplace",
        "description": "Get the best Artisans Tips and Advice on AFOMA Marketplace. Find expert advice, trends, and resources tailored for artisans and their craft.",
        "mainEntity": {
          "@type": "Article",
          "headline": "Artisans Tips and Advice | AFOMA Marketplace",
          "description": "Get the best Artisans Tips and Advice on AFOMA Marketplace. Find expert advice, trends, and resources tailored for artisans and their craft.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Artisans Tips and Advice",
              "item": "https://afomamarketplace.com/blogs-category/artisans-tips-and-advice"
            }
          ]
        }
      }
    },
    "crafted-creations": {
      metaTitle: "Crafted Creations Blogs | AFOMA Marketplace",
      metaDescription: "Dive into the world of crafted creations, from artisan traditions to DIY inspiration. Your guide to handmade beauty is here on AFOMA Marketplace.",
      H1: "Discover Exceptional Artisan Creations from AFOMA Marketplace",
      H2: "Explore Unique, Handcrafted Masterpieces and the Stories Behind Every Creation",
      P: "Discover exceptional artisan creations from skilled makers on the AFOMA Marketplace.<br />From intricate jewelry to stunning home décor, explore unique, handcrafted pieces and <br /> the stories behind them. Get inspired by the craftsmanship and creativity of our artisans.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Crafted Creations Blogs | AFOMA Marketplace",
        "url": "https://afomamarketplace.com/blogs-category/crafted-creations",
        "headline": "Crafted Creations Blogs | AFOMA Marketplace",
        "description": "Dive into the world of crafted creations, from artisan traditions to DIY inspiration. Your guide to handmade beauty is here on AFOMA Marketplace.",
        "mainEntity": {
          "@type": "Article",
          "headline": "Crafted Creations Blogs | AFOMA Marketplace",
          "description": "Dive into the world of crafted creations, from artisan traditions to DIY inspiration. Your guide to handmade beauty is here on AFOMA Marketplace.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Crafted Creations",
              "item": "https://afomamarketplace.com/blogs-category/crafted-creations"
            }
          ]
        }
      }
    },
    "how-to-guides": {
      metaTitle: "How-To Guides | AFOMA Marketplace for Artisans & Creatives",
      metaDescription: "Master the art of selling handmade crafts with AFOMA’s how to guides. Step-by-step tips for artisans and creatives to succeed.",
      H1: "Step-by-Step How-To Guides for Navigating AFOMA Marketplace",
      H2: "Learn to List Products, Optimize Your Store, and Maximize Your Success on AFOMA Marketplace",
      P: "Explore our detailed how-to guides designed to help you make the most of AFOMA Marketplace.<br /> From listing products to optimizing your store and leveraging platform features, our step-by-step <br />tutorials ensure you have the tools and knowledge to succeed.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "How-To Guides | AFOMA Marketplace for Artisans & Creatives",
        "url": "https://afomamarketplace.com/blogs-category/how-to-guides",
        "headline": "How-To Guides | AFOMA Marketplace for Artisans & Creatives",
        "description": "Master the art of selling handmade crafts with AFOMA’s how to guides. Step-by-step tips for artisans and creatives to succeed.",
        "mainEntity": {
          "@type": "Article",
          "headline": "How-To Guides | AFOMA Marketplace for Artisans & Creatives",
          "description": "Master the art of selling handmade crafts with AFOMA’s how to guides. Step-by-step tips for artisans and creatives to succeed.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "How-To Guides",
              "item": "https://afomamarketplace.com/blogs-category/how-to-guides"
            }
          ]
        }
      }
    },
    "handmade-product-buyers-guide": {
      metaTitle: "Handmade Buyer's Guides | AFOMA Marketplace",
      metaDescription: "Discover the ultimate handmade product buyer's guide on AFOMA Marketplace. Learn how to choose, gift, and enjoy handcrafted treasures",
      H1: "The Ultimate Homemade Product Buyer’s Guide: What to Look For",
      H2: "Make Informed Decisions with Expert Tips on Quality, Craftsmanship, and Sourcing",
      P: " Get expert tips on selecting high-quality homemade products. From craftsmanship to sourcing, <br /> our guide helps you make informed choices and support talented artisans.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Handmade Buyer's Guides | AFOMA Marketplace",
        "url": "https://afomamarketplace.com/blogs-category/handmade-product-buyers-guide",
        "headline": "Handmade Buyer's Guides | AFOMA Marketplace",
        "description": "Discover the ultimate handmade product buyer's guide on AFOMA Marketplace. Learn how to choose, gift, and enjoy handcrafted treasures.",
        "mainEntity": {
          "@type": "Article",
          "headline": "Handmade Buyer's Guides | AFOMA Marketplace",
          "description": "Discover the ultimate handmade product buyer's guide on AFOMA Marketplace. Learn how to choose, gift, and enjoy handcrafted treasures.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Handmade Buyer's Guides",
              "item": "https://afomamarketplace.com/blogs-category/handmade-product-buyers-guide"
            }
          ]
        }
      }
    },
    "gift-guides": {
      metaTitle: "AFOMA Gift Guides: Artisanal Picks for Every Occasion",
      metaDescription: "Looking for special gifts? AFOMA’s gift guides showcase artisanal finds, perfect for celebrating life’s big and small moments in style",
      H1: "Your Ultimate Gift Guides for Every Occasion and Budget",
      H2: "Your Ultimate Gift Guides for Every Occasion and Budget",
      P: "Explore our curated gift guides featuring thoughtful and unique ideas for every occasion. <br /> Whether you're shopping for birthdays, holidays, or special milestones, discover perfect gifts<br /> across various budgets and interests, all from talented artisans on AFOMA Marketplace.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "AFOMA Gift Guides: Artisanal Picks for Every Occasion",
        "url": "https://afomamarketplace.com/blogs-category/gift-guides",
        "headline": "AFOMA Gift Guides: Artisanal Picks for Every Occasion",
        "description": "Looking for special gifts? AFOMA’s gift guides showcase artisanal finds, perfect for celebrating life’s big and small moments in style.",
        "mainEntity": {
          "@type": "Article",
          "headline": "AFOMA Gift Guides: Artisanal Picks for Every Occasion",
          "description": "Looking for special gifts? AFOMA’s gift guides showcase artisanal finds, perfect for celebrating life’s big and small moments in style.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Gift Guides",
              "item": "https://afomamarketplace.com/blogs-category/gift-guides"
            }
          ]
        }
      }
    },
    "our-story": {
      metaTitle: "Our Story | AFOMA Marketplace: Empowering Makers Worldwide",
      metaDescription: "Our story at AFOMA Marketplace is about empowering global makers to bring their unique creations to a wider audience. Join us today!",
      H1: "Behind the Vision: AFOMA Stories",
      H2: "Personal journeys from our founder and team—sharing the passion, challenges, and purpose driving AFOMA Marketplace.",
      P: "",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Our Story | AFOMA Marketplace: Empowering Makers Worldwide",
        "url": "https://afomamarketplace.com/blogs-category/our-story",
        "headline": "Our Story | AFOMA Marketplace: Empowering Makers Worldwide",
        "description": "Our story at AFOMA Marketplace is about empowering global makers to bring their unique creations to a wider audience. Join us today!",
        "mainEntity": {
          "@type": "Article",
          "headline": "Our Story | AFOMA Marketplace: Empowering Makers Worldwide",
          "description": "Our story at AFOMA Marketplace is about empowering global makers to bring their unique creations to a wider audience. Join us today!",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Our Story",
              "item": "https://afomamarketplace.com/blogs-category/our-story"
            }
          ]
        }
      }
    },
    "marketplace-values": {
      metaTitle: "Marketplace Values and Ethics | AFOMA Marketplace Insights",
      metaDescription: "AFOMA Marketplace values highlight our commitment to fairness, transparency, and empowering artisans. Explore our ethical approach to global commerce.",
      H1: "Making a Difference with Every Purchase",
      H2: "Our mission, impact, and values—empowering creators, supporting communities, and redefining conscious shopping.",
      P: "",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Marketplace Values and Ethics | AFOMA Marketplace Insights",
        "url": "https://afomamarketplace.com/blogs-category/marketplace-values",
        "headline": "Marketplace Values and Ethics | AFOMA Marketplace Insights",
        "description": "AFOMA Marketplace values highlight our commitment to fairness, transparency, and empowering artisans. Explore our ethical approach to global commerce.",
        "mainEntity": {
          "@type": "Article",
          "headline": "Marketplace Values and Ethics | AFOMA Marketplace Insights",
          "description": "AFOMA Marketplace values highlight our commitment to fairness, transparency, and empowering artisans. Explore our ethical approach to global commerce.",
          "author": {
            "@type": "Organization",
            "name": "AFOMA Marketplace"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AFOMA Marketplace",
            "logo": {
              "@type": "ImageObject",
              "url": "https://afomamarketplace.com/assets/logo.png"
            }
          },
          "datePublished": "2024-11-23",
          "dateModified": "2024-11-23"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://afomamarketplace.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "https://afomamarketplace.com/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Marketplace Values and Ethics",
              "item": "https://afomamarketplace.com/blogs-category/marketplace-values"
            }
          ]
        }
      }

    },
    "our-marketplace": {
      metaTitle: "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
      metaDescription: "Dive into art, crafts & DIY projects with AFOMA Marketplace Blogs. Get inspired with tutorials, tips, and stories from the world of handmade goods",
      H1: "Discover the Vision, Values, and Growth Behind AFOMA Marketplace",
      H2: "Explore Founders’ Stories, Marketplace Insights, and the Journey of Building AFOMA",
      P: "Dive into the story behind AFOMA Marketplace, from the vision of our founders to the values driving our growth. <br /> Learn about the innovative strategies, challenges, and successes that shape our platform, <br />and gain insights into how we’re empowering sellers and connecting communities.",
      jsonLd: {}
    },
    "default": {
      metaTitle: "Explore Art, Crafts & DIY Projects | AFOMA Marketplace",
      metaDescription: "Dive into art, crafts & DIY projects with AFOMA Marketplace Blogs. Get inspired with tutorials, tips, and stories from the world of handmade goods",
      H1: "Dive into traditional beauty",
      H2: "Unveiling the World of Traditional Artistry",
      P: "Unravel the Threads of Creativity - Stories, Insights, and Inspirations from Global Artisans.",
      jsonLd: {}
    },
  }

  let pageData = {}
  if (allPosts?.edges?.length) {
    pageData = pageDataMap[params?.slug ? params.slug : "default"]
  } else {
    pageData = pageDataMap["default"]
  }

  return {
    props: { allPosts, allCategories, preview, pageData },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const allCategories = await getAllPostsWithCategorySlug();

  const paths = allCategories?.edges?.map(({ node }) => {
    return `/blogs-category/${node?.slug}`;
  });

  return {
    paths: paths || [],
    fallback: true,
  };
};
