import dynamic from "next/dynamic";
import Head from "next/head";
import { getAllPostsForHome, getAllCategory } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/router";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Waitlist = dynamic(() => import("@/components/Waitlist"), { ssr: false });
//import { Noto_Serif } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons";

//const noto = Noto_Serif({ subsets: ["latin"] });

export default function Index({
  allPosts: { edges },
  preview,
  categoryPosts,
  cart,
  addToCart
}) {
  const category = categoryPosts?.edges?.slice(0, -1);
  const morePosts = edges;
  const router = useRouter();


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AFOMA Marketplace Blog",
    "url": "https://afomamarketplace.com/blogs-cateogry",
    "headline": "Discover Artistry on the AFOMA Marketplace Blog",
    "description": "Explore the AFOMA Marketplace Blog for tips, insights, and stories about handmade crafts, artisanal products, and the global handicraft market.",
    "mainEntity": {
      "@type": "Blog",
      "name": "AFOMA Marketplace Blog",
      "blogPost": [
        {
          "@type": "BlogPosting",
          "headline": "10 Important Product Naming Tips to Boost Searchability and SEO on Marketplaces",
          "url": "https://afomamarketplace.com/blogs/product-naming-tips",
          "author": {
            "@type": "Person",
            "name": "AFOMA Editorial Team"
          },
          "datePublished": "2024-11-01",
          "dateModified": "2024-11-10",
          "description": "Learn how to optimize your product names for search engines and marketplaces with these 10 essential tips."
        },
        {
          "@type": "BlogPosting",
          "headline": "The Peel Makers Craft Fair: AFOMA Marketplace Empowering Makers Across Peel Region",
          "url": "https://afomamarketplace.com/blogs/peel-makers-craft-fair",
          "author": {
            "@type": "Person",
            "name": "AFOMA Editorial Team"
          },
          "datePublished": "2024-11-02",
          "dateModified": "2024-11-10",
          "description": "Discover how the Peel Makers Craft Fair showcases the creativity of artisans in the Peel Region with support from AFOMA Marketplace."
        },
        {
          "@type": "BlogPosting",
          "headline": "Does the Canada Digital Adoption Program (CDAP) Need a Revamp? A Desire for More Inclusion.",
          "url": "https://afomamarketplace.com/blogs/cdap-inclusion-revamp",
          "author": {
            "@type": "Person",
            "name": "AFOMA Editorial Team"
          },
          "datePublished": "2024-11-05",
          "dateModified": "2024-11-10",
          "description": "An analysis of the Canada Digital Adoption Program (CDAP) and its potential for increased inclusivity."
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "AFOMA Marketplace",
      "logo": {
        "@type": "ImageObject",
        "url": "https://afomamarketplace.com/_next/image?url=%2Fassets%2Fhomepage%2FAFOMA_Marketplace_logo%20-%20login-register.png&w=256&q=75"
      }
    },
    "author": {
      "@type": "Organization",
      "name": "AFOMA Editorial Team"
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
          "name": "Blog",
          "item": "https://afomamarketplace.com/blogs"
        }
      ]
    }
  }

  return (
    <>
      <Head>
        <title>Celebrating Craftsmanship & Local Artisans Worldwide</title>
        <meta
          name="title"
          content="Discover Artistry on the AFOMA Marketplace Blog"
        />
        <meta
          name="description"
          content="Dive into the AFOMA Marketplace Blog for creative insights, trends, and tips for artists and artisans in the handmade crafts community."
        />
        <meta
          name="keywords"
          content="NFT, AFOMA, decentralized, marketplace, blockchain, ecommerce, artisans, handicraft"
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
        <div className="flex flex-col items-center max-w-[52rem] mx-auto px-4 lg:max-w-7xl  md:pb-20 py-8  md:pt-20">
        <div className="mb-6 md:mb-12">
          <h1
            className={`text-2xl md:text-3xl xl:text-4xl mb-4 text-slate-950 text-center noto-font`}
          >
            Explore Expert Tips, Insights, and Ideas for Buying & Selling Online
          </h1>
          <h2
            className={`text-sm md:text-lg xl:text-xl mb-4 text-slate-950 text-center noto-font`}
          >
            Stay Ahead with the Latest Marketplace Trends, E-Commerce Guides, and Success Stories on AFOMA Marketplace
          </h2>
          <p className="text-slate-600 md:text-sm text-center mb-6">
            Welcome to the AFOMA Marketplace Blog, your source for expert tips, e-commerce advice, and inspiring success stories. From marketing strategies to business growth tips, we provide valuable insights to help you succeed in the online marketplace.
          </p>
        </div>



            {/* <div className="flex items-center justify-center">
              <Waitlist />
            </div> */}
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

          {/* {category.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-3 lg:gap-5 mb-7  text-sm font-medium text-gray-800">
              {category.map(({ node }) => {
                return (
                  <li
                    key={node.categoryId}
                    className="rounded py-2 px-3 bg-orange-100 hover:bg-orange-200 transition-colors ease-in"
                  >
                    {node?.children?.edges.length < 0 ? (
                      <Link href={`/category/${node.slug}`}>{node.name}</Link>
                    ) : (
                      <>
                        <li>{node.name}</li>
                        {node?.children?.edges.map(({ node }) => (
                          <Link href={`/category/${node.slug}`}>
                            {node.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div> */}

          <div className="grid gap-5 xl:grid-cols-12 xl:gap-10 xl:relative">
            <div className="xl:col-span-9 grid sm:grid-cols-2 xl:grid-cols-3 gap-9">
              {morePosts?.length > 0 &&
                morePosts?.map(({ node, index }) => (
                  <div
                    className="border border-slate-200 rounded-sm hover:bg-orange-100 transition-colors ease-in"
                    key={index}
                  >
                    <div className="relative">
                      {node.featuredImage && (
                        <div className="relative  overflow-hidden h-52 w-full">
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

                      <h3 className="text-base font-semibold tracking-tight text-blue-950 line-clamp-2 ">
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
                          className="flex items-center text-sm text-blue-950 font-medium"
                          rel="noreferrer"
                        >
                          <span className="absolute sm:rounded-2xl"></span>
                          <span className="relative cursor-pointer">
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

            <div className="xl:col-span-3 relative">
              <h2 className="text-xl tracking-tight text-blue-950 font-semibold mb-4">
                Categories
              </h2>
              <div>
                {category?.length > 0 && (
                  <ul className="font-medium text-blue-950 space-y-4">
                    {category.map(({ node }) => {
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
      <section className="py-9">
        <Footer />
      </section>
    </>
  );
}

export const getStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const categoryPosts = await getAllCategory(preview);
  return {
    props: { allPosts, categoryPosts, preview },
    revalidate: 60,
  };
};
