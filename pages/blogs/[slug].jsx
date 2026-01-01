import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Waitlist from "@/components/Waitlist";
import { format, parseISO } from "date-fns";
import ErrorPage from "next/error";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAllPostsWithSlug, getPostAndMorePosts } from "../../lib/api";

//const noto = Noto_Serif({ subsets: ["latin"] });

export default function Post({ post, posts, preview, cart , addToCart}) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="AFOMA Marketplace Blog | Artisan Stories, Tips & E-Commerce Insights"
        />
        <meta
          property="og:description"
          content="Explore artisan stories, selling tips, and marketplace updates on the AFOMA Blog. Inspiring and supporting creative entrepreneurs worldwide."
        />
        <meta
          property="title"
          content="AFOMA Marketplace Blog | Artisan Stories, Tips & E-Commerce Insights"
        />
        <meta
          name="description"
          content="Join AFOMA Marketplace - a unique platform for artists and artisans to sell crafts globally. Be first for exclusive deals and promotions."
        ></meta>
      </Head>
      <div className="overflow-hidden pb-6 md:pb-12">
        <Header cart={cart} addToCart={addToCart} />
        <div className="max-w-3xl mx-auto px-4">
          <div className="mx-auto pt-4 md:pt-8">
            <div className="flex">
              <button
                className="inline-flex items-center font-medium gap-2 text-blue-950 hover:text-primary transition-all ease-out group text-sm"
                onClick={() => router.back()}
              >
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
                Go back
              </button>
            </div>
          </div>
          <div className="py-4 md:pb-20 md:pt-10">
            <div className="relative">
              {router.isFallback ? (
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl mb-2">
                  Loading…
                </h1>
              ) : (
                <>
                  <article>
                    <Head>
                      <title>{`${post.title.slice(0, 50)}...`}</title>
                      <meta name="title" content={post.title} />
                      <meta name="description" content={post.seo?.metaDesc} />
                      <meta name="keywords" content={post.seo?.metaKeywords} />
                      <meta
                        property="og:image"
                        content={post.featuredImage?.node.sourceUrl}
                      />
                    </Head>

                    <dl className="text-sm mb-4 text-slate-600">
                      <dt className="sr-only">Date</dt>
                      <dd className="whitespace-nowrap leading-6">
                        <time dateTime={post.date}>
                          {format(parseISO(post.date), "LLLL	d, yyyy")}
                        </time>
                      </dd>
                    </dl>

                    <h1
                      className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl mb-2"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />

                    <div className="mb-6">
                      <Link href={`/blogs-category`}>
                        {post.categories.edges.length > 0 ? (
                          post.categories.edges.map((category, index) => (
                            <span key={index} className="mr-3">
                              {category.node.name}
                            </span>
                          ))
                        ) : (
                          <span className="ml-1">
                            {post.categories.edges.node.name}
                          </span>
                        )}
                      </Link>
                    </div>

                    <div className="relative not-prose my-[2em] first:mt-0 last:mb-0 rounded-lg overflow-hidden h-52 md:h-80 lg:h-96 w-full">
                      <div className="sm:mx-0">
                        {post.slug ? (
                          <Link
                            href={`/blogs/${post.slug}`}
                            aria-label={post.title}
                          >
                            {
                              <Image
                                fill
                                alt={`Cover Image for ${post.title}`}
                                src={post?.featuredImage?.node.sourceUrl}
                                className="object-cover"
                              />
                            }
                          </Link>
                        ) : (
                          <Image
                            fill
                            alt={`Cover Image for ${post.title}`}
                            src={post?.featuredImage?.node.sourceUrl}
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>

                    <div
                      className="my-12 prose prose-gray prose-a:text-primary max-w-none prose-img:h-52 md:prose-img:h-80 lg:prose-img:h-96 prose-img:object-cover prose-img:w-full prose-img:rounded-lg"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <hr />

                    <div className="mt-6">
                      <div className="flex items-start gap-4 md:gap-6">
                        <div className="w-20 h-20 relative flex-shrink-0 md:w-24 md:h-24">
                          <Image
                            src={post.author.node.avatar.url}
                            fill
                            className="rounded-full"
                            alt={`${post.author.node.firstName} ${post.author.node.lastName}`}
                          />
                        </div>
                        <div className="text-gray-900 max-w-lg">
                          <div className="mb-2 flex items-center gap-3">
                            <p className="text-xl font-bold">
                              {post.author.node.firstName}{" "}
                              {post.author.node.lastName}
                            </p>

                            <a
                              href={post.author.node.seo.social.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  id="linkdin_orange"
                                  data-name="linkdin orange"
                                  transform="translate(-740 -8842)"
                                >
                                  <circle
                                    id="Ellipse_46"
                                    data-name="Ellipse 46"
                                    cx="12"
                                    cy="12"
                                    r="12"
                                    transform="translate(740 8842)"
                                    fill="#1F628E"
                                  />
                                  <path
                                    id="Icon_awesome-linkedin-in"
                                    data-name="Icon awesome-linkedin-in"
                                    d="M2.314,10.34H.171v-6.9H2.314ZM1.241,2.5A1.247,1.247,0,1,1,2.483,1.242,1.252,1.252,0,0,1,1.241,2.5Zm9.1,7.844H8.2V6.979c0-.8-.016-1.828-1.114-1.828-1.114,0-1.285.87-1.285,1.77V10.34H3.657v-6.9H5.713v.942h.03A2.252,2.252,0,0,1,7.771,3.264c2.169,0,2.568,1.429,2.568,3.284V10.34Z"
                                    transform="translate(746.316 8848.67)"
                                    fill="#fff7ed"
                                  />
                                </g>
                              </svg>
                            </a>
                          </div>
                          <p className="text-sm">
                            {post.author.node.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-blue-950 ">
        <div className="max-w-[840px] mx-auto py-6 md:py-20">
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

export const getStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const data = await getPostAndMorePosts(params?.slug, preview, previewData);

  return {
    props: {
      preview,
      post: data.post,
      posts: data.posts,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/blogs/${node.slug}`) || [],
    fallback: true,
  };
};
