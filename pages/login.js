import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { object, string } from "yup";

//const noto = Noto_Serif({ subsets: ["latin"] });

const LogIn = () => {
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = object({
    email: string().required("Required"),
    password: string().required("Required"),
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://afomamarketplace.com/login"
          data-next-head=""
        />
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
        <div className="max-w-full mx-auto bg-orange-50 flex flex-col xl:flex-row items-center px-4 xl:px-0 relative">
          <div className="xl:w-1/2 xl:mx-auto">
            <div className=" py-8  xl:py-16 xl:w-[570px] mx-auto">
              <div className="flex items-center justify-center mb-6 md:mb-14">
                <Image
                  src={
                    "/assets/AFOMA New Logo (940 x 300 px).png"
                  }
                  alt="AFOMA_Marketplace"
                  width={209}
                  height={42}
                />
              </div>
              <div className="bg-orange-100 p-4 md:p-8 mb-5 md:mb-7 rounded-md">
                <h3
                  className={`text-lg md:text-2xl xl:text-3xl text-blue-950 mb-6 md:mb-12 noto-font`}
                >
                  Sign In
                </h3>

                <div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                  >
                    {() => (
                      <Form className="st-form grid gap-5 lg:gap-3">
                        <div className="relative mb-3">
                          <label htmlFor="email">Email id</label>
                          <Field
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Eg. johndoe@gmail.com"
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="invalid"
                          />
                        </div>
                        <div className="relative ">
                          <label htmlFor="password">Password</label>
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            className="absolute right-4 bottom-3.5 "
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                              className="text-slate-600"
                            />
                          </button>
                          <ErrorMessage
                            name="password"
                            component="p"
                            className="invalid"
                          />
                        </div>
                        <div className="mb-3">
                          <Link
                            href="#"
                            className="text-slate-600 text-sm hover:text-primary"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="flex items-center justify-center mb-3">
                          <button type="submit" className="buttonprimary">
                            {" "}
                            Sign in
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
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
              <p className="text-slate-600 text-sm text-center">
                Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;
