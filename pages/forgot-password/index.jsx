// import Image from "next/image";
// import React, { useState } from "react";
// //import { Noto_Serif } from "next/font/google";
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { object, string } from "yup";
// import Link from "next/link";
// import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
// import axios from "axios";
// import toast from "react-hot-toast";

// import { useRouter } from "next/router";

// const noto = Noto_Serif({
//   subsets: ['latin'],
//   display: 'swap',
//   preload: false, // 🔴 prevents downloading at build time
// });

// const Index = () => {
//   const [submittedEmail, setSubmittedEmail] = useState("");
//   const initialValues = {
//     email: "",
//   };
//   const validationSchema = object({
//     email: string().email("Invalid email address").required("Required"),
//   });

//   const onSubmit = (values, { resetForm }) => {
//     axios
//       .post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/forgot-password`, {
//         email: values.email,
//       })
//       .then(function (response) {
//         //

//         setSubmittedEmail(values.email);
//         resetForm();
//         toast.success("Password reset link sent to your email.");
//       })
//       .catch(function (error) {
//         //
//         const errorMessage =
//           error.response?.data?.message || "An unexpected error occurred";
//         toast.error(errorMessage);

//         resetForm();
//       });
//   };

//   return (
//     <>
//       <section>
//         <div className="max-w-full mx-auto bg-orange-50 flex flex-col xl:flex-row items-center   px-4 relative">
//           <div className="xl:w-1/2 xl:mx-auto">
//             <div className=" py-8  xl:py-16 xl:w-[570px] mx-auto">
//               <div className="flex items-center justify-center mb-6 md:mb-14">
//                 <Image
//                   src={
//                     "/assets/signin/AFOMA_Marketplace_logo - login-register.png"
//                   }
//                   alt="AFOMA_Marketplace"
//                   width={209}
//                   height={42}
//                 />
//               </div>
//               <div className="bg-orange-100 p-4 md:p-8 mb-5 md:mb-7 rounded-md">
//                 <h3
//                   className={`text-lg md:text-2xl xl:text-3xl text-blue-950 mb-6 md:mb-12 noto-font`}
//                 >
//                   Forgot Password?
//                 </h3>

//                 <div>
//                   <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={onSubmit}
//                   >
//                     {() => (
//                       <Form className="st-form grid gap-4 lg:gap-6">
//                         <div className="relative mb-3">
//                           <label htmlFor="email">Email id</label>
//                           <Field
//                             type="email"
//                             name="email"
//                             id="email"
//                             placeholder="Eg. johndoe@gmail.com"
//                           />
//                           <ErrorMessage
//                             name="email"
//                             component="p"
//                             className="invalid"
//                           />
//                         </div>

//                         <div className="flex items-center justify-center mb-3">
//                           <button type="submit" className="buttonprimary">
//                             {" "}
//                             Request password reset
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="7.477"
//                               height="13.14"
//                               viewBox="0 0 7.477 13.14"
//                             >
//                               <path
//                                 id="Down_Arrow_3_"
//                                 d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
//                                 transform="translate(-39.625 32.764) rotate(-90)"
//                                 fill="#fff"
//                                 stroke="#fff"
//                                 strokeWidth="0.75"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </Form>
//                     )}
//                   </Formik>
//                 </div>
//                 <div>
//                   <p className="text-blue-950 mb-3.5">
//                     A password reset email has successfully been sent to the
//                     email address mentioned below! Please check your mail.
//                   </p>

//                   <div className="st-form">
//                     <div className="passwordinput relative">
//                       <input
//                         type="text"
//                         name="globalAttributeName"
//                         id="globalAttributeName"
//                         readOnly
//                         placeholder="Eg. johndoe@gmail.com"
//                         value={submittedEmail}
//                       />
//                       <div className="absolute top-4 right-4">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="18.358"
//                           height="13.482"
//                           viewBox="0 0 18.358 13.482"
//                         >
//                           <g id="tick" transform="translate(0 -67.997)">
//                             <g
//                               id="Group_40781"
//                               data-name="Group 40781"
//                               transform="translate(0 67.997)"
//                             >
//                               <path
//                                 id="Path_3128"
//                                 data-name="Path 3128"
//                                 d="M18.088,68.266a.918.918,0,0,0-1.3,0l-11,11L1.566,75.036a.918.918,0,0,0-1.3,1.3L5.144,81.21a.918.918,0,0,0,1.3,0L18.088,69.564A.918.918,0,0,0,18.088,68.266Z"
//                                 transform="translate(0 -67.997)"
//                                 fill="#166534"
//                               />
//                             </g>
//                           </g>
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-slate-600 text-sm text-center">
//                 Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Index;

import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";

import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const initialValues = {
    email: "",
  };
  const validationSchema = object({
    email: string().email("Invalid email address").required("Required"),
  });

  const onSubmit = (values, { resetForm }) => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/forgot-password`, {
        email: values.email,
      })
      .then(function (response) {
        //

        setSubmittedEmail(values.email);
        resetForm();
        setIsFormSubmitted(true);
        toast.success("Password reset link sent to your email.");
      })
      .catch(function (error) {
        //
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);

        resetForm();
      });
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
        <div className="max-w-full mx-auto bg-orange-50 flex flex-col xl:flex-row items-center   px-4 relative">
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
                  Forgot Password?
                </h3>

                {isFormSubmitted ? (
                  <div>
                    <p className="text-blue-950 mb-3.5">
                      A password reset email has successfully been sent to the
                      email address mentioned below! Please check your mail.
                    </p>

                    <div className="st-form">
                      <div className="passwordinput relative">
                        <input
                          type="text"
                          name="globalAttributeName"
                          id="globalAttributeName"
                          readOnly
                          placeholder="Eg. johndoe@gmail.com"
                          value={submittedEmail}
                        />
                        <div className="absolute top-4 right-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18.358"
                            height="13.482"
                            viewBox="0 0 18.358 13.482"
                          >
                            <g id="tick" transform="translate(0 -67.997)">
                              <g
                                id="Group_40781"
                                data-name="Group 40781"
                                transform="translate(0 67.997)"
                              >
                                <path
                                  id="Path_3128"
                                  data-name="Path 3128"
                                  d="M18.088,68.266a.918.918,0,0,0-1.3,0l-11,11L1.566,75.036a.918.918,0,0,0-1.3,1.3L5.144,81.21a.918.918,0,0,0,1.3,0L18.088,69.564A.918.918,0,0,0,18.088,68.266Z"
                                  transform="translate(0 -67.997)"
                                  fill="#166534"
                                />
                              </g>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                      >
                        {() => (
                          <Form className="st-form grid gap-4 lg:gap-6">
                            <div className="relative mb-3">
                              <label htmlFor="email">Email id</label>
                              <Field
                                type="email"
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

                            <div className="flex items-center justify-center mb-3">
                              <button type="submit" className="buttonprimary">
                                {" "}
                                Request password reset
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
                )}
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

export default Index;
