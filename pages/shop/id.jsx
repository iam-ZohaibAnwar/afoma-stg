import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCardComponent from "@/components/ProductCard";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Shop = ({ cart, addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(9);
  const router = useRouter();
  const { query } = router;
  const [categoryName, setCategoryName] = useState("");
  const categoryID = query.id;

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 30);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (categoryID) {
          // Make the API call using the categoryID
          const response = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/products/search/related/${categoryID}`
            );

          if (response.data) {
            // Check if response.data is defined
            const approvedProducts = response.data.products
              ? response.data.products.filter(
                  (product) => product.productStatus === "Approved"
                )
              : [];
            setCategoryName(response.data.category?.name);
            setProducts(approvedProducts);
            setError(false);
          } else {
            // Handle the case when response.data is undefined
            setProducts([]);
            setError(true);
          }
        } else {
          // Handle the case when categoryID is not available
          setError(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 response
          setProducts([]); // Set an empty array or handle it as per your requirements
          setError(false);
        } else {
          console.error("Error:", error);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Fetch data on component mount or when categoryID changes
  }, [categoryID]);

  return (
    <>
      <section>
        <Header cart={cart} addToCart={addToCart}/>
      </section>
      <section id="products" className="bg-white ">
        <div className="max-w-screen-xl mx-auto px-4 2 py-8 md:py-10 lg:py-18">
          <div className="pb-5 mb-8 flex flex-col md:flex-row items-start md:justify-between gap-4 border-b border-[#D8D8D8]">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h2 className="text-blue-950 xl:tracking-[-0.72px] text-2xl lg:text-4xl">
                  {categoryName}
                </h2>
                {products && (
                  <p className="text-blue-950">{products.length} results</p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col">
            {" "}
            <div>
              {!loading ? (
                <>
                  {error && <p>Error - Something went wrong!</p>}
                  {products && products.length > 0 ? (
                    <div className="flex flex-wrap gap-8 mb-4 md:mb-9 xl:mb-12 justify-center">
                      {products.slice(0, visibleProducts).map((data) => (
                        <div key={data._id}>
                          <ProductCardComponent data={data} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center justify-center flex items-center mb-5 md:mb-9">
                      <Image
                        src={"/Coming Soon - AFOMA Marketplace.png"}
                        alt="Coming Soon"
                        height={466}
                        width={976}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
              <div>
                <div className="flex justify-center">
                  {products && visibleProducts < products.length && (
                    <button className="buttonprimary" onClick={loadMore}>
                      Load more
                    </button>
                  )}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Shop;
