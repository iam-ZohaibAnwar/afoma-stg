import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SellerReviewDetail = () => {
  const [doctorEnquiryData, setDoctorEnquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState();
  const [totalDataCount, setDataTotalCount] = useState();
  const [user, setUser] = useState({});

  const router = useRouter();

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

      <Layout userType="seller">
        <>
          <Formik>
            <Form>
              <div className="flex justify-between items-center mb-9">
                <h1
                  className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
                >
                  Review
                </h1>
              </div>

              <div className="mb-20">
                <div className="flex justify-between items-center mb-9 border-b">
                  <h2
                    className={`text-2xl text-blue-950 font-medium mb-[18px] noto-font `}
                  >
                    Clarissa Rebello
                  </h2>
                </div>

                <div>
                  <div className="grid gap-12 md:grid-cols-3 mb-9 ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="productName"
                          className="text-base text-blue-950"
                        >
                          Product Name
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          type="text"
                          name="productName"
                          id="productName"
                          placeholder="Banded Velvet Loafers"
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="productName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="relative col-span-2">
                      <div>
                        <label
                          htmlFor="Title"
                          className="text-base  text-blue-950 "
                        >
                          Title
                        </label>
                      </div>
                      <div className="mt-3">
                        {" "}
                        <Field
                          type="text"
                          name="Title"
                          id="Title"
                          placeholder="Elegant and unique"
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="Title"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-24 mb-9 ">
                    <div>
                      {" "}
                      <label
                        htmlFor="averageRating"
                        className="text-base text-blue-950"
                      >
                        Average Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="priceRating"
                        className="text-base text-blue-950"
                      >
                        Price Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="valueRating"
                        className="text-base text-blue-950"
                      >
                        Value Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="qualityRating"
                        className="text-base text-blue-950"
                      >
                        Quality Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className=" ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="review"
                          className="text-base text-blue-950"
                        >
                          Review
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          as="textarea"
                          rows="4"
                          name="review"
                          id="review"
                          placeholder="These loafers feature a sumptuous velvet upper material, which exudes elegance and sophistication. The unique cross-band design across the top of the foot is a standout feature that adds a touch of uniqueness to the design. The black velvetine material is enhanced by double-banded crossings, which create a stunning visual effect and give the loafers a distinctive look. The leather lining provides added comfort, ensuring a snug fit for your feet. Meanwhile, the durable leather sole guarantees long-lasting wear, making these loafers a perfect investment piece for any fashion-savvy individual."
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="review"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-20">
                <div className="flex justify-between items-center mb-9 border-b">
                  <h2
                    className={`text-2xl text-blue-950 font-medium mb-[18px] noto-font `}
                  >
                    Meetanshi Afolashade
                  </h2>
                </div>

                <div>
                  <div className="grid gap-12 md:grid-cols-3 mb-9 ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="productName"
                          className="text-base text-blue-950"
                        >
                          Product Name
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          type="text"
                          name="productName"
                          id="productName"
                          placeholder="The Flared Blouse - One Size Fits All"
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="productName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="relative col-span-2">
                      <div>
                        <label
                          htmlFor="Title"
                          className="text-base  text-blue-950 "
                        >
                          Title
                        </label>
                      </div>
                      <div className="mt-3">
                        {" "}
                        <Field
                          type="text"
                          name="Title"
                          id="Title"
                          placeholder="Elegant and unique"
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="Title"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-24 mb-9 ">
                    <div>
                      {" "}
                      <label
                        htmlFor="averageRating"
                        className="text-base text-blue-950"
                      >
                        Average Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="priceRating"
                        className="text-base text-blue-950"
                      >
                        Price Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="valueRating"
                        className="text-base text-blue-950"
                      >
                        Value Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="qualityRating"
                        className="text-base text-blue-950"
                      >
                        Quality Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className=" ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="review"
                          className="text-base text-blue-950"
                        >
                          Review
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          as="textarea"
                          rows="4"
                          name="review"
                          id="review"
                          placeholder="These loafers feature a sumptuous velvet upper material, which exudes elegance and sophistication. The unique cross-band design across the top of the foot is a standout feature that adds a touch of uniqueness to the design. The black velvetine material is enhanced by double-banded crossings, which create a stunning visual effect and give the loafers a distinctive look. The leather lining provides added comfort, ensuring a snug fit for your feet. Meanwhile, the durable leather sole guarantees long-lasting wear, making these loafers a perfect investment piece for any fashion-savvy individual."
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="review"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-20">
                <div className="flex justify-between items-center mb-9 border-b">
                  <h2
                    className={`text-2xl text-blue-950 font-medium mb-[18px] noto-font `}
                  >
                    Blessing Ehizoje
                  </h2>
                </div>

                <div>
                  <div className="grid gap-12 md:grid-cols-3 mb-9 ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="productName"
                          className="text-base text-blue-950"
                        >
                          Product Name
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          type="text"
                          name="productName"
                          id="productName"
                          placeholder="Happy Happy Shower Steamer"
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="productName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="relative col-span-2">
                      <div>
                        <label
                          htmlFor="Title"
                          className="text-base  text-blue-950 "
                        >
                          Title
                        </label>
                      </div>
                      <div className="mt-3">
                        {" "}
                        <Field
                          type="text"
                          name="Title"
                          id="Title"
                          placeholder="Elegant and unique"
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="Title"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-24 mb-9 ">
                    <div>
                      {" "}
                      <label
                        htmlFor="averageRating"
                        className="text-base text-blue-950"
                      >
                        Average Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="priceRating"
                        className="text-base text-blue-950"
                      >
                        Price Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="valueRating"
                        className="text-base text-blue-950"
                      >
                        Value Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="qualityRating"
                        className="text-base text-blue-950"
                      >
                        Quality Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className=" ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="review"
                          className="text-base text-blue-950"
                        >
                          Review
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          as="textarea"
                          rows="4"
                          name="review"
                          id="review"
                          placeholder="These loafers feature a sumptuous velvet upper material, which exudes elegance and sophistication. The unique cross-band design across the top of the foot is a standout feature that adds a touch of uniqueness to the design. The black velvetine material is enhanced by double-banded crossings, which create a stunning visual effect and give the loafers a distinctive look. The leather lining provides added comfort, ensuring a snug fit for your feet. Meanwhile, the durable leather sole guarantees long-lasting wear, making these loafers a perfect investment piece for any fashion-savvy individual."
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="review"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-9">
                <div className="flex justify-between items-center mb-9 border-b">
                  <h2
                    className={`text-2xl text-blue-950 font-medium mb-[18px] noto-font `}
                  >
                    Satish Patil
                  </h2>
                </div>

                <div>
                  <div className="grid gap-12 md:grid-cols-3 mb-9 ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="productName"
                          className="text-base text-blue-950"
                        >
                          Product Name
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          type="text"
                          name="productName"
                          id="productName"
                          placeholder="Happy Happy Shower Steamer"
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="productName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="relative col-span-2">
                      <div>
                        <label
                          htmlFor="Title"
                          className="text-base  text-blue-950 "
                        >
                          Title
                        </label>
                      </div>
                      <div className="mt-3">
                        {" "}
                        <Field
                          type="text"
                          name="Title"
                          id="Title"
                          placeholder="Elegant and unique"
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="Title"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-24 mb-9 ">
                    <div>
                      {" "}
                      <label
                        htmlFor="averageRating"
                        className="text-base text-blue-950"
                      >
                        Average Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="priceRating"
                        className="text-base text-blue-950"
                      >
                        Price Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.327"
                          height="21.233"
                          viewBox="0 0 22.327 21.233"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-17.881 1.071)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="valueRating"
                        className="text-base text-blue-950"
                      >
                        Value Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="qualityRating"
                        className="text-base text-blue-950"
                      >
                        Quality Rating
                      </label>
                      <div className="mt-5 flex gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20.288"
                          height="19.294"
                          viewBox="0 0 20.288 19.294"
                        >
                          <path
                            d="M29.044,0,32.3,6.18l6.885,1.191-4.872,5.008.995,6.915-6.267-3.083-6.27,3.083.995-6.915L18.9,7.371,25.781,6.18Z"
                            transform="translate(-18.9)"
                            fill="#fbbf24"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className=" ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="review"
                          className="text-base text-blue-950"
                        >
                          Review
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          as="textarea"
                          rows="4"
                          name="review"
                          id="review"
                          placeholder="These loafers feature a sumptuous velvet upper material, which exudes elegance and sophistication. The unique cross-band design across the top of the foot is a standout feature that adds a touch of uniqueness to the design. The black velvetine material is enhanced by double-banded crossings, which create a stunning visual effect and give the loafers a distinctive look. The leather lining provides added comfort, ensuring a snug fit for your feet. Meanwhile, the durable leather sole guarantees long-lasting wear, making these loafers a perfect investment piece for any fashion-savvy individual."
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="review"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
                <div className="flex gap-2 items-center">
                  <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />
                  <button className="text-gray-500"> Previous </button>
                </div>
                <div className="flex gap-2 items-center text-primary">
                  <button>Next</button>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className="h-[8px] text-primary"
                  />
                </div>
              </div>
            </Form>
          </Formik>
        </>
      </Layout>
    </>
  );
};

export default SellerReviewDetail;
