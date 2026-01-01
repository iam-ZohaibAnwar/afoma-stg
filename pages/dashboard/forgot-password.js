import React from "react";
import Image from "next/image";
//import { Noto_Serif } from "next/font/google";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";

//const noto = Noto_Serif({ subsets: ["latin"] });

const ForgotPassword = () => {
  const initialValues = {
    emailId: "",
  };

  const validationSchema = object({
    emailId: string().email().required("Required"),
  });

  const onSubmit = (values) => {
    //
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src="/assets/afomamarketplace-logo.svg"
        height={42}
        width={209}
        alt="AFOMA Marketplace Logo"
        className="mb-14"
      />

      <div className="bg-orange-100 rounded-md p-9 w-[560px] mb-9">
        <h3
          className={`noto-font text-3xl text-blue-950 leading-[30px] mb-12`}
        >
          Forgot Password?
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="st-form">
              <div className="relative mb-8">
                <label htmlFor="emailId">Email id</label>
                <Field
                  type="email"
                  name="emailId"
                  id="emailId"
                  placeholder="Eg. johndoe@gmail.com"
                />
                <ErrorMessage
                  name="emailId"
                  component="p"
                  className="invalid"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="px-7 py-3 rounded-sm bg-primary flex gap-2 items-center text-white font-medium"
                >
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

      <p className="text-slate-600 text-sm text-center">
        Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
      </p>
    </div>
  );
};

export default ForgotPassword;
