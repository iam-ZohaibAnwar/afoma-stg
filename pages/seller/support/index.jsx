import {
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, Fragment } from "react";
//import { Noto_Serif } from "next/font/google";
import { Menu, Transition } from "@headlessui/react";
import { faAngleDown, faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { titleNameList } from "@/lib/select-option";
import Select from "react-select";
import SellerProduct from "@/components/SellerProduct";
import Layout from "@/components/Layout";
import ComingSoonSeller from "@/components/ComingSoonSeller";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SupportTicket = () => {
  const [doctorEnquiryData, setDoctorEnquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState();
  const [totalDataCount, setDataTotalCount] = useState();
  const [user, setUser] = useState({});

  const router = useRouter();

  const initialValues = {
    parentCategory: "",
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

      <Layout userType="seller">
        {/* <>
          <div className="flex justify-between items-center mb-9">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Dashboard
            </h1>
          </div>

          <Formik>
            <Form>
              <div className="st-form">
                <div className="grid grid-cols-3 gap-6">
                  <div className="relative">
                    <div>
                      {" "}
                      <label htmlFor="name">Name</label>
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter name"
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>

                  <div className="relative col-span-3">
                    <div>
                      {" "}
                      <label htmlFor="subject">Subject </label>
                    </div>
                    <div>
                      {" "}
                      <Field
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Enter Subject"
                      />
                      <ErrorMessage
                        name="subject"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>

                  <div className="relative col-span-3">
                    <div>
                      {" "}
                      <label htmlFor="message">Message</label>
                    </div>
                    <div>
                      {" "}
                      <Field
                        as="textarea"
                        rows="2"
                        name="message"
                        id="message"
                        placeholder="Enter Message"
                      />
                      <ErrorMessage
                        name="message"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-start">
                    <button
                      type="submit"
                      className="buttonprimary flex gap-2 items-center "
                    >
                      Submit ticket
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </> */}
        <>
          <div className="mt-16 md:mt-40 lg:mt-80">
            <ComingSoonSeller />
          </div>
        </>
      </Layout>
    </>
  );
};

export default SupportTicket;
