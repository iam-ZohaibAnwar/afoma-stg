import Comingsoon from "@/components/Comingsoon";
import Layout from "@/components/Layout";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const router = useRouter();
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
      .then((res) => {
        setPersons(res.data);
      });
  }, []);

  const initialValues = {
    parentCategory: selectedCategory,
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  };

  const onSubmit = (values, { resetForm }) => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
        enableProduct: false,
        parent: initialValues.parentCategory,
        name: values.name,
        slug: values.slug,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
      })
      .then(function (response) {
        //
        toast.success("Category added successfully!");
        resetForm(); // Reset the form fields
        setPersons((prevPersons) => [
          ...prevPersons,
          response.data, // Assuming the API returns the new sub-category
        ]);
      })
      .catch(function (error) {
        //
        toast.error("Error adding Category. Please try again.");
      });
  };

  // to show the data infetched array of table

  const [deletedPerson, setDeletedPerson] = useState(null);
  const handleDelete = (id) => {
    // Send a delete request to delete person by the using id
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`)
      .then(() => {
        // Update the state by filtering out the deleted person
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== id)
        );
        setDeletedPerson(id);
      })
      .catch((error) => {
        console.error("Error deleting person:", error);
      });
  };
  const onEditClick = (id) => {
    router.push(`/admin/categories/parent-category/${id}`);
  };
  //

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans"
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
        {/* <>
          <div className="flex justify-between items-center mb-9">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Add New Category
            </h1>
          </div>

          <div className="flex gap-16 items-start">
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ handleChange }) => (
                <Form>
                  <div className="st-form w-80">
                    <div className="grid gap-6">
                      <div className="relative">
                        {" "}
                        <label htmlFor="name">Name</label>
                        <div>
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter category name"
                          />
                          <ErrorMessage
                            name="name"
                            component="p"
                            className="invalid"
                          />
                        </div>
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

                    <th className=" pr-16 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {persons.map((admin, index) => (
                    <tr key={index}>
                      <td className="pl-7 py-5 text-blue-950">{admin.name}</td>

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
        </> */}
        <>
          <div className="mt-80">
            <Comingsoon />
          </div>
        </>
      </Layout>
    </>
  );
};

export default Index;
