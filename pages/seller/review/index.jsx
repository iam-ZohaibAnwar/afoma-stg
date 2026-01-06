import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SellerReview = () => {
  const [review, setReview] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData.sellerId) {
      axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/seller/${userData.sellerId}`
        )
        .then((res) => {
          if (res && res.data && res.data.data && res.data.data.length > 0) {
            setReview(res.data.data.reverse());
          }
        });
    }
  }, []);

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = review?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((review?.length || 0) / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const visibleReview = Array.isArray(review)
    ? review.slice(startIndex, endIndex)
    : [];

  const onEditClick = (id) => {
    router.push(`/seller/review/product-reviews/${id}`);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    // Update the URL with the current page query parameter
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    // Get the current page from the query parameters
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

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
          <div className="flex justify-between items-center mb-5">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              All Reviews
            </h1>
            {/* <div>
              <button className="dashboard-button-primary">
                <Link href="/admin/review/product-reviews">View all</Link>
              </button>
            </div> */}
          </div>

          <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-6">
            <table className="text-sm w-full table-auto border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className=" px-4 font-medium min-w-[50px]">Action</th>
                  <th className=" px-4 font-medium min-w-[200px]">
                    Product Name
                  </th>
                  <th className=" px-4 font-medium min-w-[150px]">
                    Average Rating
                  </th>
                  <th className=" px-4 font-medium min-w-[150px]">
                    Price Rating
                  </th>
                  <th className=" px-4 font-medium min-w-[150px]">
                    Value Rating
                  </th>
                  <th className=" px-4 font-medium min-w-[150px]">
                    Quality Rating
                  </th>
                </tr>
              </thead>
              <tbody className="parent">
                {visibleReview.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm "
                    >
                      No Reviews added.
                    </td>
                  </tr>
                ) : (
                  visibleReview.map((admin, index) => (
                    <tr key={index} className="child">
                      <td className="px-5 py-4">
                        <button
                          onClick={() => onEditClick(admin._id)}
                          className="underline text-blue-950 hover:text-primary "
                        >
                          View
                        </button>
                      </td>
                      <td className="text-blue-950 px-5 py-4">
                        {admin.productId && admin.productId.productName
                          ? admin.productId.productName
                          : "-"}
                      </td>
                      <td className="text-blue-950 px-5 py-4">
                        {admin?.avgRating !== undefined
                          ? admin.avgRating.toFixed(1)
                          : ""}
                      </td>
                      <td className="text-blue-950 px-5 py-4">
                        {admin?.price.toFixed(1)}
                      </td>
                      <td className="text-blue-950 px-5 py-4">
                        {admin?.value.toFixed(1)}
                      </td>
                      <td className="text-blue-950 pr-5 px-5 py-4">
                        {admin?.quality.toFixed(1)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {currentOrders && currentOrders.length > 0 && (
            <div className="bg-orange-50">
              <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9 ">
                <div className="">
                  <button
                    className={` flex gap-2 items-center text-gray-500  ${
                      currentPage === 1
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-primary"
                    }`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                    Previous{" "}
                  </button>
                </div>

                <div>
                  <div className="">
                    <button
                      className={` flex gap-2 items-center text-gray-500  ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-primary"
                      }`}
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="h-[8px] "
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </Layout>
    </>
  );
};

export default SellerReview;
