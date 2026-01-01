import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MyAccountSidebar from "@/components/MyAccountSidebar";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";

//const noto = Noto_Serif({ subsets: ["latin"] });

const ResetPassword = ({ cart, addToCart }) => {
  const router = useRouter();

  const initialValues = {
    password: "",
    cpassword: "",
  };
  const validationSchema = object({
    password: string().required("Required"),
    cpassword: string().required("Required"),
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values) => {
    const { password, cpassword } = values;
    if (password !== cpassword) {
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/password/${userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, cpassword }),
      });
      if (response.ok) {
        toast.success("Password reset successful");
        router.push("/sign-in");
      } else {
        console.error("Password reset failed:", response.statusText);
        toast.error("Password reset failed");
      }
    } catch (error) {
      console.error("An error occurred", error);
      toast.error("An error occurred");
    }
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
        <Header cart={cart} addToCart={addToCart}/>
      </section>

      <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-4 lg:mt-6 lg:mb-6 max-w-screen-xl mx-auto px-4">
        <Link href="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} size="sm" />
        <Link href="/my-account/account-details" className="text-primary">
          My account
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 px-4 mb-10">
        <div className="col-span-2">
          <MyAccountSidebar />
        </div>
        <div className="col-span-4">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="p-4 xl:p-6 bg-orange-100 rounded">
                  <h1
                    className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font `}
                  >
                    Reset Password
                  </h1>
                  <div className="border border-b text-slate-600/30 mb-4"></div>
                  <div className="flex flex-col gap-5 xl:grid md:grid md:grid-cols-2 md:gap-12 xl:grid-cols-3 mb-6 lg:mb-12 view-form">
                    <div className="relative">
                      <label htmlFor="password">New Password</label>
                      <Field
                        type={showNewPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter New Password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 bottom-5 "
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showNewPassword ? faEyeSlash : faEye}
                          className="text-slate-600"
                        />
                      </button>
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="invalid"
                      />
                    </div>
                    <div className="relative  mb-2">
                      <label htmlFor="cpassword">Confirm Password</label>
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="cpassword"
                        id="cpassword"
                        placeholder="Enter Confirm Password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 bottom-3.5 "
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                          className="text-slate-600"
                        />
                      </button>
                      <ErrorMessage
                        name="cpassword"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-start col-span-3">
                    <button type="submit" className="buttonprimary">
                      {" "}
                      Reset password
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
      </div>

      <section className="overflow-hidden">
        <Footer />
      </section>
    </>
  );
};

export default ResetPassword;
