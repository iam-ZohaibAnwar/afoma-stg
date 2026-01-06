import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const MyAccountSidebar = dynamic(() => import("@/components/MyAccountSidebar"), { ssr: false });
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Reward_Points = ({ cart, addToCart }) => {
  const initialValues = {
    sample1: "",
  };

  const handleSubmit = (values) => {};

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
        <Header cart={cart} addToCart={addToCart} />
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
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <div className="p-4 xl:p-6 bg-orange-100 rounded">
                <h1
                  className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font `}
                >
                  Reward Points
                </h1>
                <div className="border border-b text-slate-600/30 mb-4"></div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      <section className="overflow-hidden">
        <Footer />
      </section>
    </>
  );
};

export default Reward_Points;
