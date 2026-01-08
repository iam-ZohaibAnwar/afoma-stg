import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import toast from "react-hot-toast";
//import { Noto_Serif } from "next/font/google";

//const noto = Noto_Serif({ subsets: ["latin"] });

const CouponDetail = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id && id !== "add") {
      getData(id);
    }
  }, [router?.query]);

  const getData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/coupon/${id}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      setEditData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData.userId) {
      setSubmitLoading(true);
      const { id } = router.query;
      const isAddMode = id === "add";
      const method = isAddMode ? "POST" : "PUT";
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/coupon${
        !isAddMode ? `/${id}` : ""
      }`;
      values.createdBy = userData.userId;
      try {
        await axios({
          method,
          url,
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
          data: values,
        });
        toast.success(
          `Coupon ${isAddMode ? "created" : "updated"} successfully!`
        );
        router.push("/affiliate/coupons");
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        toast.error("Something Went Wrong");
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const validationSchema = Yup.object({
    couponCode: Yup.string().required("Coupon Code is required"),
    couponType: Yup.string()
      .oneOf(["percentage"], "Invalid Coupon Type")
      .oneOf(["fixed"], "Invalid Coupon Type")
      .required("Coupon Type is required"),
    description: Yup.string(),
    discountAmount: Yup.number()
      .required("Discount is required")
      .min(1, "Must be at least 1"),
    minimumCartAmount: Yup.number()
      .required("Minimum Cart Amount is required")
      .min(10, "Must be at least 10"),
    expirationDate: Yup.date().required("Expiration Date is required"),
    usageLimitPerCoupon: Yup.number()
      .required("Usage Limit Per Coupon is required")
      .min(1, "Must be at least 1"),
    usageLimitPerCustomer: Yup.number()
      .required("Usage Limit Per Customer is required")
      .min(1, "Must be at least 1"),
  });

  const initialValues = {
    couponCode: editData.couponCode || "",
    couponType: "percentage",
    discountAmount: 1,
    description: editData.description || "",
    minimumCartAmount: editData.minimumCartAmount || 0,
    expirationDate: editData.expirationDate
      ? new Date(editData.expirationDate).toISOString().split("T")[0]
      : "",
    usageLimitPerCoupon: editData.usageLimitPerCoupon || 0,
    usageLimitPerCustomer: editData.usageLimitPerCustomer || 0,
    createdBy: "",
  };

  return (
    <>
      <Head>
        <title>{router.query.id === "add" ? "Add" : "Edit"} Coupon</title>
      </Head>
      <Layout userType="affiliate">
        <section>
          <div className="pb-24 viewOnly">
            <h3
              className={`text-2xl xl:tracking-[-0.48px] text-blue-950 mb-[10px] noto-font`}
            >
              {router.query.id === "add" ? "Add" : "Edit"} Coupon
            </h3>
            <h5 className="text-xs  font-medium text-red-700  mb-7">
              (Fields marked with &quot;*&quot; are mandatory to fill)
            </h5>
            {!loading ? (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form className="st-form">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {/* First Row */}
                      <div className="relative">
                        <label htmlFor="couponCode">
                          Coupon Code <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="text"
                          name="couponCode"
                          id="couponCode"
                          placeholder="Enter coupon code"
                        />
                        <ErrorMessage
                          name="couponCode"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="couponType">
                          Coupon Type <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          as="select"
                          name="couponType"
                          id="couponType"
                          className="input-field same-input"
                          value="percentage"
                          disabled
                        >
                          <option value="percentage">Percentage</option>
                        </Field>
                      </div>

                      <div className="relative">
                        <label htmlFor="discountAmount">
                          Discount <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="number"
                          name="discountAmount"
                          id="discountAmount"
                          value={1}
                          placeholder="Enter discount"
                          disabled
                        />
                      </div>

                      {/* Second Row - Description */}
                      <div className="relative md:col-span-2 lg:col-span-3">
                        <label htmlFor="description">Description</label>
                        <Field
                          as="textarea"
                          rows="4"
                          name="description"
                          id="description"
                          placeholder="Describe the coupon"
                        />
                        <ErrorMessage
                          name="description"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      {/* Other Fields */}
                      <div className="relative">
                        <label htmlFor="minimumCartAmount">
                          Minimum Cart Amount{" "}
                          <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="number"
                          name="minimumCartAmount"
                          id="minimumCartAmount"
                          placeholder="Enter minimum cart amount"
                        />
                        <ErrorMessage
                          name="minimumCartAmount"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="expirationDate">
                          Expiration Date{" "}
                          <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="date"
                          name="expirationDate"
                          id="expirationDate"
                        />
                        <ErrorMessage
                          name="expirationDate"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="usageLimitPerCoupon">
                          Usage Limit Per Coupon{" "}
                          <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="number"
                          name="usageLimitPerCoupon"
                          id="usageLimitPerCoupon"
                        />
                        <ErrorMessage
                          name="usageLimitPerCoupon"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="usageLimitPerCustomer">
                          Usage Limit Per Customer{" "}
                          <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="number"
                          name="usageLimitPerCustomer"
                          id="usageLimitPerCustomer"
                        />
                        <ErrorMessage
                          name="usageLimitPerCustomer"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-5">
                      <button
                        type="submit"
                        className="buttonprimary"
                        disabled={loading || submitLoading}
                      >
                        {router.query.id === "add" ? "Submit" : "Update"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => router.push("/affiliate/coupons")}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default CouponDetail;
