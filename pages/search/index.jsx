import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCardComponent from "@/components/ProductCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Index = ({ cart, addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const router = useRouter();
  const { q } = router.query;

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 12);
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts or when the query parameter changes
  }, [q]); // Re-fetch data when the product parameter changes

  const fetchData = async () => {
    try {
      setLoading(true);

      if (q) {
        // Construct the API endpoint URL with product parameters
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/products/global/search?name=${q}`,
          {
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          }
        );

        if (response.data) {
          pushEventViewSearchList(response.data?.matchedProducts || [])
          // Handle response data
          setProducts(response.data?.matchedProducts); // Assuming response.data is an array of products
          setSuggestedProducts(response.data?.suggestedProducts)
        } else {
          // Handle undefined response data
        }
      } else {
        // Handle case when query is not available
      }
    } catch (error) {
      // Handle errors
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const pushEventViewSearchList = (products) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    const items = products.map(product => {
      return {
        item_id: product._id,
        item_name: product.productName,
        item_brand: product?.seller?.storeSlug,
        item_category: product?.Category?.name,
        item_category2: product?.SubCategory?.name,
        price: product.totalAmount || product?.finalPrice,
        currency: "CAD",
        google_business_vertical: "retail"
      };
    });

    window.dataLayer.push({
      event: "view_search_list",
      search_term: q,
      result_count: products.length,
      ecommerce: {
        items: items
      },
    });
  }
  return (
    <>
      <section>
        <Header cart={cart} addToCart={addToCart}/>
      </section>
      <section id="products" className="bg-white ">
        <div className="max-w-screen-xl mx-auto px-4 2 py-8 md:py-10 lg:py-18">
          <div className="pb-5 mb-9 flex flex-col md:flex-row items-start md:justify-between gap-4 border-b border-[#D8D8D8]">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h2 className="text-blue-950 xl:tracking-[-0.72px] text-2xl lg:text-4xl">
                  Search results for &quot;{q}&quot;
                </h2>
                {products && (
                  <p className="text-blue-950">{products.length} results</p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col  ">
            {" "}
            <div>
              {!loading ? (
                <>
                  {/* {error && <p>Error - Something went wrong!</p>} */}
                  {products && products.length > 0 ? (
                    <div className="flex flex-wrap gap-8 mb-4 md:mb-9 xl:mb-12 justify-center">
                      {products.slice(0, visibleProducts).map((data) => (
                        <div key={data?._id}>
                          <ProductCardComponent data={data} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center justify-center flex items-center mb-5 md:mb-9">
                      <p>Product not found!</p>
                    </div>
                  )}

                {suggestedProducts?.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h2 className="text-blue-950 xl:tracking-[-0.72px] text-2xl lg:text-4xl pb-5 mb-9 gap-4 border-b border-[#D8D8D8]">
                        More Like This
                        </h2>
                        <div className="flex flex-wrap gap-8 justify-center">
                          {suggestedProducts.map((data) => (
                            <div key={data?._id}>
                              <ProductCardComponent data={data} />
                            </div>
                          ))}
                        </div>
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

export default Index;
