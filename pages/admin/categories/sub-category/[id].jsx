import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
//import { Noto_Serif } from "next/font/google";
import { faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import toast from "react-hot-toast";
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Sub_Category = () => {
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState([]);
  const [userData, setUserData] = useState();
  const [categories, setCategories] = useState([]); // Added state for categories
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      if (router?.isReady) {
        setLoading(true);

        try {
          // Fetch categories
          const responseCategories = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`);
          setCategories(responseCategories.data);
          //
        } catch (error) {
          console.error("Error fetching categories:", error);
        }

        try {
          // Fetch sub-categories by id
          if (id) {
            const responseSubCategories = await axios
              .create({
                headers: {
                  "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                },
              })
              .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-categories/${id}`);
            setUserData(responseSubCategories.data);
            // setCategories(responseSubCategories?.data?.parentCategory[""]);
            //
          }
        } catch (error) {
          console.error("Error fetching sub-category by id:", error);
        }

        try {
          // Fetch all sub-categories
          const responseSubCategoriesAll = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-categories`);
          setPersons(responseSubCategoriesAll.data);
        } catch (error) {
          console.error("Error fetching all sub-categories:", error);
        }

        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  const initialValues = {
    SubCategoryName: userData?.SubCategoryName,
    slug: userData?.slug,
    metaTitle: userData?.metaTitle,
    metaDescription: userData?.metaDescription,
    parentCategory: userData?.parentCategory,
  };

  const onSubmit = (values, { resetForm }) => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .put(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-categories/${id}`, {
        // enableProduct: false,
        parentCategory: values.parentCategory, // Make sure to provide the correct value here
        SubCategoryName: values.SubCategoryName,
        slug: values.slug,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
      })
      .then(function (response) {
        //
        toast.success("Sub-category updated successfully!");
        router.push(`/admin/categories/sub-category`);
      })
      .catch(function (error) {
        //
        toast.error("Error updating sub-category. Please try again.");
      });
  };

  const sellerNameList = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const onEditClick = (id) => {
    router.push(`/admin/categories/sub-category/${id}`);
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
      <Layout userType="admin">
        <>
          <div className="flex justify-between items-center mb-9">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Add New Category
            </h1>
          </div>

          {!loading ? (
            <div className="flex gap-16 items-start">
              <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleChange }) => (
                  <Form>
                    <div className="st-form w-80">
                      <div className="grid gap-6">
                        <div className="relative">
                          {" "}
                          <label htmlFor="SubCategoryName">Name</label>
                          <div>
                            <Field
                              type="text"
                              name="SubCategoryName"
                              id="SubCategoryName"
                              placeholder="Enter category name"
                            />
                            <ErrorMessage
                              name="SubCategoryName"
                              component="p"
                              className="invalid"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          {" "}
                          <label htmlFor="parentCategory">
                            Parent Category
                          </label>{" "}
                          <Select
                            name="parentCategory"
                            id="parentCategory"
                            options={sellerNameList}
                            defaultValue={() => {
                              if (
                                initialValues.parentCategory &&
                                initialValues.parentCategory.name
                              ) {
                                return {
                                  value: initialValues.parentCategory._id,
                                  label: initialValues.parentCategory.name,
                                };
                              } else {
                                return "";
                              }
                            }}
                            onChange={(selectedOption) => {
                              handleChange("parentCategory")(
                                selectedOption?.value
                              );
                            }}
                            placeholder="Select Parent Category"
                            className="st-react-select"
                            classNamePrefix="react-select"
                          />{" "}
                        </div>

                        <div className="relative">
                          <div>
                            {" "}
                            <label htmlFor="slug">
                              Slug{" "}
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                className="h-4 w-4 ml-3 fill-slate-600 cursor-pointer"
                              />
                            </label>
                          </div>
                          <div>
                            {" "}
                            <Field
                              type="text"
                              name="slug"
                              id="slug"
                              placeholder="Enter slug"
                            />
                            <ErrorMessage
                              name="slug"
                              component="p"
                              className="invalid"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <div>
                            {" "}
                            <label htmlFor="metaTitle">
                              Meta Title{" "}
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                className="h-4 w-4 ml-3 fill-slate-600 cursor-pointer"
                              />
                            </label>
                          </div>
                          <div>
                            {" "}
                            <Field
                              type="text"
                              name="metaTitle"
                              id="metaTitle"
                              placeholder="Enter meta title"
                            />
                            <ErrorMessage
                              name="metaTitle"
                              component="p"
                              className="invalid"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <div>
                            {" "}
                            <label htmlFor="metaDescription">
                              Meta Description
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                className="h-4 w-4 ml-3 fill-slate-600 cursor-pointer"
                              />
                            </label>
                          </div>
                          <div>
                            {" "}
                            <Field
                              as="textarea"
                              rows="2"
                              name="metaDescription"
                              id="metaDescription"
                              placeholder="Enter meta description"
                            />
                            <ErrorMessage
                              name="metaDescription"
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
                            Add category
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="w-[524px] overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-5">
                <table className="text-sm w-[524px] table-fixed border-separate border-spacing-0 bg-orange-50 ">
                  <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                    <tr>
                      <th className="pl-7 py-5 pr-16 font-medium">
                        Category Name
                      </th>
                      <th className=" pr-16 font-medium">Parent Category</th>
                      <th className=" pr-16 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {persons.map((admin, index) => (
                      <tr key={index}>
                        <td className="pl-7 py-5 text-blue-950">
                          {admin.SubCategoryName}
                        </td>
                        <td className="text-blue-950">
                          {" "}
                          {admin?.parentCategory?.name}
                        </td>
                        <td>
                          <button
                            className="underline text-blue-950 hover:text-primary"
                            onClick={() => onEditClick(admin._id)}
                          >
                            Edit
                          </button>
                          <br />

                          <button
                            className="underline text-blue-950 hover:text-primary"
                            onClick={() => handleDelete(admin._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </>
      </Layout>
    </>
  );
};

export default Sub_Category;
