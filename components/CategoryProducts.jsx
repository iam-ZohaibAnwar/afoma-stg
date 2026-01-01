import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCardComponent from "./ProductCard";

//const noto = Noto_Serif({ subsets: ["latin"] });

const CategoryProducts = ({ category, categoryID, title, description, linkText }) => {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(null);
  const [error, setError] = useState(false);

  const getAllProducts = () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/search/related/${categoryID}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        const responseData = Array.isArray(response.data)
          ? response.data
          : response.data.products;
        const approvedProducts = responseData.filter(
          (product) => product.productStatus === "Approved"
        );
        setAllProducts(approvedProducts);
        setError(false);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error:", error);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <div
        className="bg-orange-50 p-6 md:p-10 xl:p-12 mb-8 md:mb-12 xl:mb-14 xl:mt-14 mt-10"
        id="fashion"
      >
        <div className="max-w-[640px] mx-auto">
          <h2
            className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-2xl lg:text-4xl text-center noto-font`}
          >
            {title}
          </h2>
          <p className="text-blue-950 text-center mb-8 md:mb-12 xl:mb-16">
            {description}
          </p>
        </div>

        <div>
          {!loading ? (
            <>
              {error && <p>Error - Something went wrong!</p>}
              {allProducts && allProducts.length >= 1 ? (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-9 mb-4 md:mb-9">
                  {allProducts.slice(0, 3).map((data, index) => (
                    <div key={data._id + index}>
                      <ProductCardComponent data={data} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center justify-center flex items-center mb-5 md:mb-9">
                  <Image
                    src={"/Coming Soon - AFOMA Marketplace.png"}
                    alt="Coming Soon"
                    height={366}
                    width={876}
                    loading="lazy"
                  />
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {allProducts && allProducts.length > 0 && (
          <>
            <div className="flex items-center justify-center">
              <Link
                href={`/category/${category.slug}`}
                className="text-blue-950 font-medium hover:text-primary flex items-center gap-2"
              >
                {linkText}
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CategoryProducts;
