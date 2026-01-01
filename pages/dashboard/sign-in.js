import { faEye } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { object, string } from "yup";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues = {
    emailId: "",
    password: "",
  };

  const validationSchema = object({
    emailId: string().email().required("Required"),
    password: string().required("Required"),
  });

  const onSubmit = (values) => {
    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
      data: { email: values?.emailId, password: values?.password },
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        //

        const afomaCred = {
          email: response?.data?.data?.email,
          userRole: response?.data?.data?.userRole,
          accessToken: response?.data?.data?.accessToken,
          refreshToken: response?.data?.data?.refreshToken,
        };
        window.localStorage.setItem("afomaCred", JSON.stringify(afomaCred));

        router.push("/dashboard");
        toast.success("Signed in successfully!");
      })
      .catch(function (error) {
        toast.error("Something went wrong!");
        console.error(error);
      });
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
          Sign In
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="st-form grid gap-4 lg:gap-6">
              <div className="relative">
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

              <div className="relative">
                <label htmlFor="password">Password</label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute right-4 bottom-3.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="invalid"
                />
              </div>

              <div className="-mt-3">
                <Link href="/dashboard/forgot-password">
                  <span className="text-slate-600 hover:text-slate-700 text-sm">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="px-7 py-3 rounded-sm bg-primary flex gap-2 items-center text-white font-medium"
                >
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

      <p className="text-slate-600 text-sm text-center">
        Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
      </p>
    </div>
  );
};

export default SignIn;
