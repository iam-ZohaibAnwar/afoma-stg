import dynamic from "next/dynamic";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
//import { Noto_Serif } from "next/font/google";

const Miniheader = dynamic(() => import("@/components/Miniheader"), { ssr: false });
const Footer2 = dynamic(() => import("@/components/Footer2"), { ssr: false });
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Payment = () => {
  const initialValues = {
    paymentmethod: "",
  };
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
        <Miniheader />
      </section>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5  ">
            <div className="hover:text-primary flex items-center gap-1.5">
              <Link href="/">
                {" "}
                <span>Home</span>
              </Link>
              <FontAwesomeIcon icon={faAngleRight} size="sm" />
            </div>
            <span className="text-primary ">Checkout</span>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-screen-lg mx-auto px-4   pt-5 pb-8 md:pb-16 xl:pb-24 ">
          <div className="mb-6 xl:mb-16">
            <h1
              className={`text-4xl xl:text-5xl text-center text-blue-950 xl:tracking-[-0.9px] mb-6 noto-font`}
            >
              Checkout
            </h1>
            <div className="flex items-center justify-center gap-[90px] xl:gap-[107px] relative">
              <div className="absolute top-1/2 border border-blue-950/50 border-dashed w-[270px] xl:w-[299px] h-px z-0"></div>
              <div className="text-sm text-primary py-2.5 px-2 border border-primary rounded-full z-10 bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13.013"
                  height="9.063"
                  viewBox="0 0 13.013 9.063"
                >
                  <path
                    id="check-regular"
                    d="M12.758,96.155a.694.694,0,0,1,0,.984l-7.667,7.67a.694.694,0,0,1-.984,0L.155,100.859a.7.7,0,1,1,.984-.984l3.456,3.456,7.176-7.176a.694.694,0,0,1,.984,0Z"
                    transform="translate(0.05 -95.95)"
                    fill="#fff7ed"
                  />
                </svg>
              </div>
              <div className="text-sm text-primary py-1.5 px-3 border border-primary rounded-full z-10 bg-orange-50">
                2
              </div>
              <div className="text-sm text-slate-600 py-1.5 px-3 border border-slate-600 rounded-full z-10 bg-orange-50">
                3
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-10 xl:gap-16 items-start">
            <div className="lg:shrink-0 w-full lg:w-[547px]">
              <h2
                className={`text-blue-950 text-2xl xl:text-3xl mb-6 xl:mb-9 noto-font`}
              >
                Payment Method
              </h2>
              <h6 className="text-blue-950 text-lg mb-6 xl:mb-7">
                How would you like to pay?
              </h6>
              <Formik
                initialValues={initialValues}
                //   validationSchema={validationSchema}
              >
                {({ values }) => (
                  <Form>
                    <div className="grid gap-5 st-form">
                      <div>
                        <div className="bg-orange-100 rounded pl-5 pr-6 py-6">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2 ">
                              <label>
                                {" "}
                                <Field
                                  type="radio"
                                  value="paypal"
                                  name="paymentmethod"
                                />{" "}
                                PayPal
                              </label>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14.063"
                                height="14.063"
                                viewBox="0 0 14.063 14.063"
                                className="mt-2"
                              >
                                <g id="info" opacity="0.59">
                                  <g id="Group_40783" data-name="Group 40783">
                                    <g id="Group_40782" data-name="Group 40782">
                                      <path
                                        id="Path_3128"
                                        data-name="Path 3128"
                                        d="M7.031,0a7.031,7.031,0,1,0,7.031,7.031A7.027,7.027,0,0,0,7.031,0Zm0,13.081a6.05,6.05,0,1,1,6.05-6.05A6.057,6.057,0,0,1,7.031,13.081Z"
                                        fill="#475569"
                                      />
                                    </g>
                                  </g>
                                  <g
                                    id="Group_40785"
                                    data-name="Group 40785"
                                    transform="translate(6.319 5.861)"
                                  >
                                    <g id="Group_40784" data-name="Group 40784">
                                      <path
                                        id="Path_3129"
                                        data-name="Path 3129"
                                        d="M230.772,213.4c-.416,0-.713.176-.713.435v3.526c0,.222.3.444.713.444.4,0,.722-.222.722-.444v-3.526C231.494,213.573,231.17,213.4,230.772,213.4Z"
                                        transform="translate(-230.059 -213.397)"
                                        fill="#475569"
                                      />
                                    </g>
                                  </g>
                                  <g
                                    id="Group_40787"
                                    data-name="Group 40787"
                                    transform="translate(6.273 3.686)"
                                  >
                                    <g id="Group_40786" data-name="Group 40786">
                                      <path
                                        id="Path_3130"
                                        data-name="Path 3130"
                                        d="M229.134,134.208a.667.667,0,1,0,.75.657A.717.717,0,0,0,229.134,134.208Z"
                                        transform="translate(-228.375 -134.208)"
                                        fill="#475569"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </div>
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="95.19"
                                height="23.063"
                                viewBox="0 0 95.19 23.063"
                              >
                                <g
                                  id="PayPal_logo"
                                  data-name="PayPal logo"
                                  transform="translate(-0.002)"
                                >
                                  <path
                                    id="Path_3188"
                                    data-name="Path 3188"
                                    d="M174.835,386.87h6.5c3.493,0,4.807,1.768,4.6,4.366-.336,4.288-2.928,6.661-6.367,6.661H177.84c-.472,0-.789.312-.917,1.159l-.737,4.92c-.049.319-.217.5-.468.529h-4.087c-.385,0-.521-.294-.42-.93L173.7,387.8A.991.991,0,0,1,174.835,386.87Z"
                                    transform="translate(-166.527 -381.441)"
                                    fill="#009ee3"
                                    fillRule="evenodd"
                                  />
                                  <path
                                    id="Path_3189"
                                    data-name="Path 3189"
                                    d="M318.539,385.13c2.195,0,4.22,1.191,3.943,4.158-.336,3.526-2.225,5.477-5.205,5.486h-2.6c-.374,0-.556.306-.653.932l-.5,3.2c-.076.484-.324.722-.69.722H310.4c-.386,0-.521-.247-.435-.8l2-12.833c.1-.631.336-.866.767-.866h5.8ZM314.593,392h1.973c1.234-.047,2.054-.9,2.136-2.443a1.49,1.49,0,0,0-1.615-1.629l-1.857.008L314.593,392Zm14.476,6.646c.222-.2.447-.306.415-.057l-.079.594c-.04.311.082.475.371.475h2.153c.363,0,.539-.146.628-.707l1.327-8.325c.067-.418-.035-.623-.353-.623h-2.368c-.213,0-.317.119-.373.445l-.087.512c-.045.267-.168.314-.282.045-.4-.95-1.426-1.377-2.854-1.343a5.925,5.925,0,0,0-5.8,5.82,4,4,0,0,0,3.966,4.461,4.257,4.257,0,0,0,3.341-1.293h0Zm-1.8-1.281a2.163,2.163,0,0,1-2.218-2.537,3.09,3.09,0,0,1,2.972-2.537,2.163,2.163,0,0,1,2.218,2.537,3.089,3.089,0,0,1-2.972,2.537Zm10.83-7.388h-2.183c-.45,0-.633.336-.49.749l2.71,7.935-2.658,3.776c-.223.316-.05.6.264.6h2.453a.751.751,0,0,0,.729-.358l8.335-11.955c.257-.368.136-.754-.285-.754h-2.322c-.4,0-.557.158-.786.489l-3.476,5.037-1.553-5.049a.665.665,0,0,0-.735-.474Z"
                                    transform="translate(-281.99 -379.994)"
                                    fill="#113984"
                                    fillRule="evenodd"
                                  />
                                  <path
                                    id="Path_3190"
                                    data-name="Path 3190"
                                    d="M541.207,385.113c2.195,0,4.22,1.19,3.943,4.157-.336,3.526-2.225,5.477-5.205,5.486h-2.6c-.374,0-.556.306-.653.932l-.5,3.2c-.076.484-.324.722-.69.722h-2.423c-.386,0-.521-.247-.435-.8l2-12.837c.1-.631.336-.866.767-.866h5.8Zm-3.946,6.871h1.973c1.234-.047,2.053-.9,2.136-2.443a1.49,1.49,0,0,0-1.615-1.629l-1.857.008-.636,4.063Zm14.475,6.646c.222-.2.447-.306.415-.057l-.079.594c-.04.311.082.475.371.475H554.6c.363,0,.539-.146.628-.707l1.327-8.325c.067-.418-.035-.623-.353-.623h-2.364c-.213,0-.318.119-.373.445l-.087.512c-.045.267-.168.314-.282.045-.4-.95-1.426-1.377-2.855-1.343a5.925,5.925,0,0,0-5.8,5.82,4,4,0,0,0,3.966,4.461,4.257,4.257,0,0,0,3.341-1.293h0Zm-1.8-1.281a2.163,2.163,0,0,1-2.218-2.537,3.09,3.09,0,0,1,2.972-2.537,2.163,2.163,0,0,1,2.218,2.537,3.09,3.09,0,0,1-2.972,2.537Zm9.929,2.307h-2.485a.294.294,0,0,1-.3-.336l2.183-13.829a.428.428,0,0,1,.413-.336h2.485a.294.294,0,0,1,.3.336l-2.183,13.829a.428.428,0,0,1-.413.339Z"
                                    transform="translate(-467.272 -379.977)"
                                    fill="#009ee3"
                                    fillRule="evenodd"
                                  />
                                  <path
                                    id="Path_3191"
                                    data-name="Path 3191"
                                    d="M147.719,354.54h6.512c1.834,0,4.01.059,5.464,1.343a4.414,4.414,0,0,1,1.365,3.694c-.4,4.972-3.373,7.758-7.363,7.758h-3.21c-.547,0-.908.363-1.063,1.343l-.9,5.709c-.059.369-.218.588-.5.615h-4.018c-.445,0-.6-.336-.487-1.078l2.888-18.3A1.156,1.156,0,0,1,147.719,354.54Z"
                                    transform="translate(-143.48 -354.54)"
                                    fill="#113984"
                                    fillRule="evenodd"
                                  />
                                  <path
                                    id="Path_3192"
                                    data-name="Path 3192"
                                    d="M179.43,394.992l1.137-7.2a1,1,0,0,1,1.133-.934h6.5a6.344,6.344,0,0,1,2.629.479c-.653,4.426-3.516,6.884-7.264,6.884h-3.205A.947.947,0,0,0,179.43,394.992Z"
                                    transform="translate(-173.392 -381.433)"
                                    fill="#172c70"
                                    fillRule="evenodd"
                                  />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                        {values.paymentmethod === `paypal` && (
                          <>
                            <div className="mt-6 md:w-[336px] grid grid-cols-2 gap-6 xl:gap-9 st-form">
                              <div className=" col-span-2">
                                <label htmlFor="cardnumber">Card Number</label>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cardnumber"
                                    id="cardnumber"
                                    placeholder="0000 0000 0000 0000"
                                  />
                                  <div className="absolute bg-orange-100 px-2 py-[15px] right-px rounded-r  top-px bottom-px">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24.927"
                                      height="16.951"
                                      viewBox="0 0 24.927 16.951"
                                    >
                                      <g
                                        id="credit-card_icon"
                                        data-name="credit-card icon"
                                        transform="translate(0 -81.92)"
                                      >
                                        <g
                                          id="Group_41483"
                                          data-name="Group 41483"
                                          transform="translate(0 81.92)"
                                        >
                                          <g
                                            id="Group_41482"
                                            data-name="Group 41482"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3246"
                                              data-name="Path 3246"
                                              d="M23.432,81.92H1.5a1.5,1.5,0,0,0-1.5,1.5V97.375a1.5,1.5,0,0,0,1.5,1.5H23.432a1.5,1.5,0,0,0,1.5-1.5V83.416A1.5,1.5,0,0,0,23.432,81.92Zm.5,15.455a.5.5,0,0,1-.5.5H1.5a.5.5,0,0,1-.5-.5V83.416a.5.5,0,0,1,.5-.5H23.432a.5.5,0,0,1,.5.5Z"
                                              transform="translate(0 -81.92)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41485"
                                          data-name="Group 41485"
                                          transform="translate(0.499 86.407)"
                                        >
                                          <g
                                            id="Group_41484"
                                            data-name="Group 41484"
                                            transform="translate(0 0)"
                                          >
                                            <rect
                                              id="Rectangle_30296"
                                              data-name="Rectangle 30296"
                                              width="23.93"
                                              height="1.994"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41487"
                                          data-name="Group 41487"
                                          transform="translate(0 85.908)"
                                        >
                                          <g
                                            id="Group_41486"
                                            data-name="Group 41486"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3247"
                                              data-name="Path 3247"
                                              d="M24.429,163.84H.5a.5.5,0,0,0-.5.5v1.994a.5.5,0,0,0,.5.5h23.93a.5.5,0,0,0,.5-.5v-1.994A.5.5,0,0,0,24.429,163.84Zm-.5,1.994H1v-1H23.93v1Z"
                                              transform="translate(0 -163.84)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41489"
                                          data-name="Group 41489"
                                          transform="translate(3.988 91.891)"
                                        >
                                          <g
                                            id="Group_41488"
                                            data-name="Group 41488"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3248"
                                              data-name="Path 3248"
                                              d="M91.392,286.72H82.419a.5.5,0,0,0,0,1h8.974a.5.5,0,1,0,0-1Z"
                                              transform="translate(-81.92 -286.72)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41491"
                                          data-name="Group 41491"
                                          transform="translate(3.988 93.885)"
                                        >
                                          <g
                                            id="Group_41490"
                                            data-name="Group 41490"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3249"
                                              data-name="Path 3249"
                                              d="M87.4,327.68H82.419a.5.5,0,0,0,0,1H87.4a.5.5,0,0,0,0-1Z"
                                              transform="translate(-81.92 -327.68)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <label htmlFor="cardexpiary">Card Expiry</label>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cardexpiary"
                                    id="cardexpiary"
                                    placeholder="MM/YY"
                                  />
                                </div>
                              </div>
                              <div className="">
                                <div className="flex gap-2 items-start">
                                  <label htmlFor="cvv">CVV</label>
                                  <div className="mt-1.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14.063"
                                      height="14.063"
                                      viewBox="0 0 14.063 14.063"
                                    >
                                      <g id="info" opacity="0.59">
                                        <g
                                          id="Group_40783"
                                          data-name="Group 40783"
                                        >
                                          <g
                                            id="Group_40782"
                                            data-name="Group 40782"
                                          >
                                            <path
                                              id="Path_3128"
                                              data-name="Path 3128"
                                              d="M7.031,0a7.031,7.031,0,1,0,7.031,7.031A7.027,7.027,0,0,0,7.031,0Zm0,13.081a6.05,6.05,0,1,1,6.05-6.05A6.057,6.057,0,0,1,7.031,13.081Z"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_40785"
                                          data-name="Group 40785"
                                          transform="translate(6.319 5.861)"
                                        >
                                          <g
                                            id="Group_40784"
                                            data-name="Group 40784"
                                          >
                                            <path
                                              id="Path_3129"
                                              data-name="Path 3129"
                                              d="M230.772,213.4c-.416,0-.713.176-.713.435v3.526c0,.222.3.444.713.444.4,0,.722-.222.722-.444v-3.526C231.494,213.573,231.17,213.4,230.772,213.4Z"
                                              transform="translate(-230.059 -213.397)"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_40787"
                                          data-name="Group 40787"
                                          transform="translate(6.273 3.686)"
                                        >
                                          <g
                                            id="Group_40786"
                                            data-name="Group 40786"
                                          >
                                            <path
                                              id="Path_3130"
                                              data-name="Path 3130"
                                              d="M229.134,134.208a.667.667,0,1,0,.75.657A.717.717,0,0,0,229.134,134.208Z"
                                              transform="translate(-228.375 -134.208)"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cvv"
                                    id="cvv"
                                    placeholder="Enter CVV"
                                  />
                                </div>
                              </div>
                              <div>
                                <Link
                                  href="#"
                                  className="  buttonprimary mb-5 md:mb-7"
                                >
                                  Pay now
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <div className="bg-orange-100 rounded pl-5 pr-6 py-6">
                          <label>
                            <Field
                              type="radio"
                              value="paystack"
                              name="paymentmethod"
                            />{" "}
                            Paystack
                          </label>
                        </div>
                        {values.paymentmethod === `paystack` && (
                          <>
                            <div className="mt-6 md:w-[336px] grid grid-cols-2 gap-6 xl:gap-9 st-form">
                              <div className=" col-span-2">
                                <label htmlFor="cardnumber">Card Number</label>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cardnumber"
                                    id="cardnumber"
                                    placeholder="0000 0000 0000 0000"
                                  />
                                  <div className="absolute bg-orange-100 px-2 py-[15px] right-px rounded-r  top-px bottom-px">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24.927"
                                      height="16.951"
                                      viewBox="0 0 24.927 16.951"
                                    >
                                      <g
                                        id="credit-card_icon"
                                        data-name="credit-card icon"
                                        transform="translate(0 -81.92)"
                                      >
                                        <g
                                          id="Group_41483"
                                          data-name="Group 41483"
                                          transform="translate(0 81.92)"
                                        >
                                          <g
                                            id="Group_41482"
                                            data-name="Group 41482"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3246"
                                              data-name="Path 3246"
                                              d="M23.432,81.92H1.5a1.5,1.5,0,0,0-1.5,1.5V97.375a1.5,1.5,0,0,0,1.5,1.5H23.432a1.5,1.5,0,0,0,1.5-1.5V83.416A1.5,1.5,0,0,0,23.432,81.92Zm.5,15.455a.5.5,0,0,1-.5.5H1.5a.5.5,0,0,1-.5-.5V83.416a.5.5,0,0,1,.5-.5H23.432a.5.5,0,0,1,.5.5Z"
                                              transform="translate(0 -81.92)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41485"
                                          data-name="Group 41485"
                                          transform="translate(0.499 86.407)"
                                        >
                                          <g
                                            id="Group_41484"
                                            data-name="Group 41484"
                                            transform="translate(0 0)"
                                          >
                                            <rect
                                              id="Rectangle_30296"
                                              data-name="Rectangle 30296"
                                              width="23.93"
                                              height="1.994"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41487"
                                          data-name="Group 41487"
                                          transform="translate(0 85.908)"
                                        >
                                          <g
                                            id="Group_41486"
                                            data-name="Group 41486"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3247"
                                              data-name="Path 3247"
                                              d="M24.429,163.84H.5a.5.5,0,0,0-.5.5v1.994a.5.5,0,0,0,.5.5h23.93a.5.5,0,0,0,.5-.5v-1.994A.5.5,0,0,0,24.429,163.84Zm-.5,1.994H1v-1H23.93v1Z"
                                              transform="translate(0 -163.84)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41489"
                                          data-name="Group 41489"
                                          transform="translate(3.988 91.891)"
                                        >
                                          <g
                                            id="Group_41488"
                                            data-name="Group 41488"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3248"
                                              data-name="Path 3248"
                                              d="M91.392,286.72H82.419a.5.5,0,0,0,0,1h8.974a.5.5,0,1,0,0-1Z"
                                              transform="translate(-81.92 -286.72)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41491"
                                          data-name="Group 41491"
                                          transform="translate(3.988 93.885)"
                                        >
                                          <g
                                            id="Group_41490"
                                            data-name="Group 41490"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3249"
                                              data-name="Path 3249"
                                              d="M87.4,327.68H82.419a.5.5,0,0,0,0,1H87.4a.5.5,0,0,0,0-1Z"
                                              transform="translate(-81.92 -327.68)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <label htmlFor="cardexpiary">Card Expiry</label>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cardexpiary"
                                    id="cardexpiary"
                                    placeholder="MM/YY"
                                  />
                                </div>
                              </div>
                              <div className="">
                                <div className="flex gap-2 items-start">
                                  <label htmlFor="cvv">CVV</label>
                                  <div className="mt-1.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14.063"
                                      height="14.063"
                                      viewBox="0 0 14.063 14.063"
                                    >
                                      <g id="info" opacity="0.59">
                                        <g
                                          id="Group_40783"
                                          data-name="Group 40783"
                                        >
                                          <g
                                            id="Group_40782"
                                            data-name="Group 40782"
                                          >
                                            <path
                                              id="Path_3128"
                                              data-name="Path 3128"
                                              d="M7.031,0a7.031,7.031,0,1,0,7.031,7.031A7.027,7.027,0,0,0,7.031,0Zm0,13.081a6.05,6.05,0,1,1,6.05-6.05A6.057,6.057,0,0,1,7.031,13.081Z"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_40785"
                                          data-name="Group 40785"
                                          transform="translate(6.319 5.861)"
                                        >
                                          <g
                                            id="Group_40784"
                                            data-name="Group 40784"
                                          >
                                            <path
                                              id="Path_3129"
                                              data-name="Path 3129"
                                              d="M230.772,213.4c-.416,0-.713.176-.713.435v3.526c0,.222.3.444.713.444.4,0,.722-.222.722-.444v-3.526C231.494,213.573,231.17,213.4,230.772,213.4Z"
                                              transform="translate(-230.059 -213.397)"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_40787"
                                          data-name="Group 40787"
                                          transform="translate(6.273 3.686)"
                                        >
                                          <g
                                            id="Group_40786"
                                            data-name="Group 40786"
                                          >
                                            <path
                                              id="Path_3130"
                                              data-name="Path 3130"
                                              d="M229.134,134.208a.667.667,0,1,0,.75.657A.717.717,0,0,0,229.134,134.208Z"
                                              transform="translate(-228.375 -134.208)"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cvv"
                                    id="cvv"
                                    placeholder="Enter CVV"
                                  />
                                </div>
                              </div>
                              <div>
                                <Link
                                  href="#"
                                  className="  buttonprimary mb-5 md:mb-7"
                                >
                                  Pay now
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <div className="bg-orange-100 rounded pl-5 pr-6 py-6">
                          <div className="flex gap-2 ">
                            <label>
                              {" "}
                              <Field
                                type="radio"
                                value="crypto"
                                name="paymentmethod"
                              />{" "}
                              Crypto
                            </label>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14.063"
                              height="14.063"
                              viewBox="0 0 14.063 14.063"
                              className="mt-2"
                            >
                              <g id="info" opacity="0.59">
                                <g id="Group_40783" data-name="Group 40783">
                                  <g id="Group_40782" data-name="Group 40782">
                                    <path
                                      id="Path_3128"
                                      data-name="Path 3128"
                                      d="M7.031,0a7.031,7.031,0,1,0,7.031,7.031A7.027,7.027,0,0,0,7.031,0Zm0,13.081a6.05,6.05,0,1,1,6.05-6.05A6.057,6.057,0,0,1,7.031,13.081Z"
                                      fill="#475569"
                                    />
                                  </g>
                                </g>
                                <g
                                  id="Group_40785"
                                  data-name="Group 40785"
                                  transform="translate(6.319 5.861)"
                                >
                                  <g id="Group_40784" data-name="Group 40784">
                                    <path
                                      id="Path_3129"
                                      data-name="Path 3129"
                                      d="M230.772,213.4c-.416,0-.713.176-.713.435v3.526c0,.222.3.444.713.444.4,0,.722-.222.722-.444v-3.526C231.494,213.573,231.17,213.4,230.772,213.4Z"
                                      transform="translate(-230.059 -213.397)"
                                      fill="#475569"
                                    />
                                  </g>
                                </g>
                                <g
                                  id="Group_40787"
                                  data-name="Group 40787"
                                  transform="translate(6.273 3.686)"
                                >
                                  <g id="Group_40786" data-name="Group 40786">
                                    <path
                                      id="Path_3130"
                                      data-name="Path 3130"
                                      d="M229.134,134.208a.667.667,0,1,0,.75.657A.717.717,0,0,0,229.134,134.208Z"
                                      transform="translate(-228.375 -134.208)"
                                      fill="#475569"
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </div>
                        </div>
                        {values.paymentmethod === `crypto` && (
                          <>
                            <div className="mt-6 md:w-[336px] grid grid-cols-2 gap-6 xl:gap-9 st-form">
                              <div className=" col-span-2">
                                <label htmlFor="cardnumber">Card Number</label>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cardnumber"
                                    id="cardnumber"
                                    placeholder="0000 0000 0000 0000"
                                  />
                                  <div className="absolute bg-orange-100 px-2 py-[15px] right-px rounded-r  top-px bottom-px">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24.927"
                                      height="16.951"
                                      viewBox="0 0 24.927 16.951"
                                    >
                                      <g
                                        id="credit-card_icon"
                                        data-name="credit-card icon"
                                        transform="translate(0 -81.92)"
                                      >
                                        <g
                                          id="Group_41483"
                                          data-name="Group 41483"
                                          transform="translate(0 81.92)"
                                        >
                                          <g
                                            id="Group_41482"
                                            data-name="Group 41482"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3246"
                                              data-name="Path 3246"
                                              d="M23.432,81.92H1.5a1.5,1.5,0,0,0-1.5,1.5V97.375a1.5,1.5,0,0,0,1.5,1.5H23.432a1.5,1.5,0,0,0,1.5-1.5V83.416A1.5,1.5,0,0,0,23.432,81.92Zm.5,15.455a.5.5,0,0,1-.5.5H1.5a.5.5,0,0,1-.5-.5V83.416a.5.5,0,0,1,.5-.5H23.432a.5.5,0,0,1,.5.5Z"
                                              transform="translate(0 -81.92)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41485"
                                          data-name="Group 41485"
                                          transform="translate(0.499 86.407)"
                                        >
                                          <g
                                            id="Group_41484"
                                            data-name="Group 41484"
                                            transform="translate(0 0)"
                                          >
                                            <rect
                                              id="Rectangle_30296"
                                              data-name="Rectangle 30296"
                                              width="23.93"
                                              height="1.994"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41487"
                                          data-name="Group 41487"
                                          transform="translate(0 85.908)"
                                        >
                                          <g
                                            id="Group_41486"
                                            data-name="Group 41486"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3247"
                                              data-name="Path 3247"
                                              d="M24.429,163.84H.5a.5.5,0,0,0-.5.5v1.994a.5.5,0,0,0,.5.5h23.93a.5.5,0,0,0,.5-.5v-1.994A.5.5,0,0,0,24.429,163.84Zm-.5,1.994H1v-1H23.93v1Z"
                                              transform="translate(0 -163.84)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41489"
                                          data-name="Group 41489"
                                          transform="translate(3.988 91.891)"
                                        >
                                          <g
                                            id="Group_41488"
                                            data-name="Group 41488"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3248"
                                              data-name="Path 3248"
                                              d="M91.392,286.72H82.419a.5.5,0,0,0,0,1h8.974a.5.5,0,1,0,0-1Z"
                                              transform="translate(-81.92 -286.72)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_41491"
                                          data-name="Group 41491"
                                          transform="translate(3.988 93.885)"
                                        >
                                          <g
                                            id="Group_41490"
                                            data-name="Group 41490"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_3249"
                                              data-name="Path 3249"
                                              d="M87.4,327.68H82.419a.5.5,0,0,0,0,1H87.4a.5.5,0,0,0,0-1Z"
                                              transform="translate(-81.92 -327.68)"
                                              fill="#6b7280"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <label htmlFor="cardexpiary">Card Expiry</label>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cardexpiary"
                                    id="cardexpiary"
                                    placeholder="MM/YY"
                                  />
                                </div>
                              </div>
                              <div className="">
                                <div className="flex gap-2 items-start">
                                  <label htmlFor="cvv">CVV</label>
                                  <div className="mt-1.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14.063"
                                      height="14.063"
                                      viewBox="0 0 14.063 14.063"
                                    >
                                      <g id="info" opacity="0.59">
                                        <g
                                          id="Group_40783"
                                          data-name="Group 40783"
                                        >
                                          <g
                                            id="Group_40782"
                                            data-name="Group 40782"
                                          >
                                            <path
                                              id="Path_3128"
                                              data-name="Path 3128"
                                              d="M7.031,0a7.031,7.031,0,1,0,7.031,7.031A7.027,7.027,0,0,0,7.031,0Zm0,13.081a6.05,6.05,0,1,1,6.05-6.05A6.057,6.057,0,0,1,7.031,13.081Z"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_40785"
                                          data-name="Group 40785"
                                          transform="translate(6.319 5.861)"
                                        >
                                          <g
                                            id="Group_40784"
                                            data-name="Group 40784"
                                          >
                                            <path
                                              id="Path_3129"
                                              data-name="Path 3129"
                                              d="M230.772,213.4c-.416,0-.713.176-.713.435v3.526c0,.222.3.444.713.444.4,0,.722-.222.722-.444v-3.526C231.494,213.573,231.17,213.4,230.772,213.4Z"
                                              transform="translate(-230.059 -213.397)"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                        <g
                                          id="Group_40787"
                                          data-name="Group 40787"
                                          transform="translate(6.273 3.686)"
                                        >
                                          <g
                                            id="Group_40786"
                                            data-name="Group 40786"
                                          >
                                            <path
                                              id="Path_3130"
                                              data-name="Path 3130"
                                              d="M229.134,134.208a.667.667,0,1,0,.75.657A.717.717,0,0,0,229.134,134.208Z"
                                              transform="translate(-228.375 -134.208)"
                                              fill="#475569"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                                <div className="relative">
                                  <Field
                                    type="text"
                                    name="cvv"
                                    id="cvv"
                                    placeholder="Enter CVV"
                                  />
                                </div>
                              </div>
                              <div>
                                <Link href="#" className="  buttonprimary ">
                                  Pay now
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="flex flex-col gap-6 xl:gap-10 w-full">
              <div className="bg-orange-100 rounded p-6 xl:px-[30px] xl:py-[36px] ">
                <h2
                  className={`text-blue-950 text-2xl xl:text-3xl mb-[22px] noto-font`}
                >
                  Order Summary
                </h2>
                <h6 className="text-blue-950 font-semibold mb-6">
                  1 item in cart
                </h6>
                <div className="flex gap-5 mb-5 pb-7 flex-col md:flex-row border-b border-slate-600/30">
                  <div>
                    <div className="shrink-0 mb-3">
                      <Image
                        src="/assets/checkout/mask-group-407.png"
                        alt="Order Summary"
                        width="130"
                        height="130"
                      />
                    </div>
                  </div>
                  <div>
                    <h6 className="text-blue-950 xl:text-lg mb-2">
                      Banded Weave Loafers
                    </h6>
                    <p className="text-blue-950 text-xs mb-4">
                      by Clarissa Rebello
                    </p>
                    <div className="flex gap-2 items-center mb-3">
                      <p className="text-blue-950 text-sm">
                        Qty: <span className="text-base">1</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-950 text-sm">
                        Shoe size:{" "}
                        <span className="font-semibold">European 43</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mb-3.5">
                  <p className="text-base text-blue-950">Item total</p>
                  <p className="text-base text-blue-950">CA$87.00</p>
                </div>
                <div className="flex justify-between mb-5 pb-5 border-b border-slate-600/30">
                  <p className="text-base text-blue-950">Shipping charges </p>
                  <p className="text-base text-blue-950">CA$87.00</p>
                </div>
                <div className="flex justify-between ">
                  <p className="text-base text-blue-950">Total (1 item)</p>
                  <p className="text-lg font-medium text-blue-950">CA$90.00</p>
                </div>
              </div>
              <div className="bg-orange-100 rounded p-6 xl:px-[30px] xl:py-[36px] ">
                <div className="flex items-center flex-wrap gap-y-5 justify-between mb-6">
                  <h2
                    className={`text-blue-950 text-2xl xl:text-3xl noto-font`}
                  >
                    Shipping Details
                  </h2>
                  <Link href="#">
                    <div className="flex items-center gap-1 group text-slate-600 hover:text-primary">
                      <svg
                        id="Edit_icon"
                        data-name="Edit icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.047"
                        height="13.047"
                        viewBox="0 0 13.047 13.047"
                        className="fill-slate-600 group-hover:fill-primary"
                      >
                        <g
                          id="Group_40799"
                          data-name="Group 40799"
                          transform="translate(0 0)"
                        >
                          <path
                            id="Path_3134"
                            data-name="Path 3134"
                            d="M12.641,1.588,11.459.405A1.387,1.387,0,0,0,9.5.405L.7,9.2A.389.389,0,0,0,.6,9.4L.006,12.6a.382.382,0,0,0,.445.445l3.192-.591a.389.389,0,0,0,.2-.106l8.8-8.8A1.385,1.385,0,0,0,12.641,1.588ZM.859,12.188l.358-1.931L2.79,11.83Zm2.715-.655L1.514,9.473,9.037,1.949,11.1,4.01ZM12.1,3.007l-.463.463L9.577,1.409,10.04.946a.622.622,0,0,1,.878,0L12.1,2.128A.621.621,0,0,1,12.1,3.007Z"
                            transform="translate(0 0)"
                          />
                        </g>
                      </svg>

                      <span className=" text-xs">Edit details</span>
                    </div>
                  </Link>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-4 text-blue-950">
                    Ship To
                  </p>
                  <p className="text-blue-950 mb-2">Clarissa Rebello</p>
                  <p className="text-blue-950 mb-2">Street name</p>
                  <p className="text-blue-950 mb-2">
                    Tornonto, Ontario M5A 2V8
                  </p>
                  <p className="text-blue-950 mb-2">Canada</p>
                  <p className="text-blue-950 mb-5 pb-5 border-b border-slate-600/30">
                    7025907864
                  </p>
                  <p className="text-lg font-semibold mb-4 text-blue-950">
                    Shipping Method
                  </p>
                  <p className="text-blue-950 ">Shipping Method</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer2 />
      </section>
    </>
  );
};

export default Payment;
