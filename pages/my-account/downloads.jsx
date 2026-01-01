import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MyAccountSidebar from "@/components/MyAccountSidebar";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Downloads = ({ cart, addToCart }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [persons, setPersons] = useState([]);
  const [editData, setEditData] = useState({});
  const [selectedGender, setSelectedGender] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if(userData && userData.accessToken){
      try{
        const decoded = jwt.verify(userData.accessToken, process.env.NEXT_PUBLIC_ACCESS_KEY);
        userData.userRole = decoded.role
      }catch(err){
        clearThirdWebAuthTokens()
        window.location.href = "/sign-in"
      }

    }
    if (userData?.userRole === "customer") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/getOrders/ByUserId/${userData.userId}`
        )
        .then((res) => {
          setPersons(res.data);
        });
    } else {
      setLoading(false);
    }
  }, []);

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
          <div className="p-4 xl:p-6 rounded bg-orange-100 ">
            <h1
              className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font `}
            >
              Downloads
            </h1>
            <div className="border border-b text-slate-600/30 mb-9"></div>
            <div className="grid md:grid-cols-3 gap-6 xl:gap-9 mb-4 md:mb-9 xl:mb-12  justify-center ">
              <div>
                <div className="text-center justify-center flex items-center ">
                  <Image
                    src={"/assets/homepage/Bottle_02.png"}
                    alt="default"
                    width={280}
                    height={320}
                    className="h-[320px] w-[280px] lg:h-[280px] lg:w-[250px] md:h-[280px] md:w-[250px] xl:h-[320px] xl:w-[280px]"
                  />{" "}
                </div>
                <p className="mt-4 font-medium mb-3 text-blue-950 hover:text-primary items-start justify-start">
                  Product Name
                </p>
                <button className="buttonprimary ">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden">
        <Footer />
      </section>
    </>
  );
};

export default Downloads;
