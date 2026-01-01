import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
const Footer = ({showDemoCall}) => {
  const [selectedValue, setSelectedValue] = useState("CAD");
  const [selectedImage, setSelectedImage] = useState("/assets/header/CA.png");
  const [isDisabled, setDisabled] = useState(/* your disabling logic here */);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState();
  const [showFailureMessage, setShowFailureMessage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();

    if (error) {
      setShowSuccessMessage(false);
      setShowFailureMessage(true);

      setEmail("");
      setLoading(false);
    }

    if (res.status === 200) {
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      // Reset form fields
      setEmail("");
      setLoading(false);
    }
  };

  const handleMenuItemClick = (value, image) => {
    setSelectedValue(value);
    setSelectedImage(image);
  };

  return (
    <section className="bg-orange-50">
      <div className="max-w-screen-xl mx-auto px-4 2 pb-6">
        <div className="flex flex-col md:flex-row flex-wrap gap-11 xl:gap-16 py-6 md:py-16 border-b border-[#D8D8D8] mb-5 justify-between">
          <div className="md:w-[256px]">
            <div className="mb-6">
            <Link href="/">
              <Image
                src={
                  "/assets/AFOMA New Logo (940 x 300 px).png"
                }
                alt="AFOMA_Marketplace"
                width={120}
                height={42}
                loading="lazy"
                className="w-[80px] lg:w-[120px]"
              />
            </Link>
            </div>
            <p className="text-sm font-medium mb-7 text-slate-600">
              To create sustainable and fair income for all artists and artisans
              in the handicraft sector.
            </p>
            <p className="text-sm font-medium mb-5 text-blue-950">
              Email: contact@afoma.io
            </p>
            <div className="flex flex-row gap-2.5">
              <Link
                href="https://www.facebook.com/afomamarketplace"
                target="_blank"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full hover:bg-primaryHover">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7.011"
                    height="13.09"
                    viewBox="0 0 7.011 13.09"
                    alt="facebook"
                  >
                    <path
                      d="M8.161,7.363l.364-2.369H6.251V3.457a1.185,1.185,0,0,1,1.336-1.28H8.62V.16A12.6,12.6,0,0,0,6.786,0a2.892,2.892,0,0,0-3.1,3.189V4.994H1.609V7.363H3.69V13.09H6.251V7.363Z"
                      transform="translate(-1.609)"
                      fill="#fff7ed"
                    />
                  </svg>
                </div>
              </Link>
              <Link href="https://twitter.com/afomamarket" target="_blank">
                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full hover:bg-primaryHover">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11.961"
                    height="11.101"
                    viewBox="0 0 8.961 8.101"
                    alt="twitter"
                  >
                    <path
                      d="M33.856,48h1.375l-3,3.431L35.761,56.1H33L30.829,53.27,28.352,56.1H26.975l3.213-3.672L26.8,48h2.835l1.957,2.588Zm-.483,7.278h.761l-4.914-6.5H28.4Z"
                      transform="translate(-26.8 -48)"
                      fill="#fff7ed"
                    />
                  </svg>
                </div>
              </Link>
              <Link
                href="https://www.linkedin.com/company/afomamarketplace/?viewAsMember=true"
                target="_blank"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full hover:bg-primaryHover">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10.339"
                    height="10.339"
                    viewBox="0 0 10.339 10.339"
                    alt="linkedin"
                  >
                    <path
                      d="M2.314,10.34H.171v-6.9H2.314ZM1.241,2.5A1.247,1.247,0,1,1,2.483,1.242,1.252,1.252,0,0,1,1.241,2.5Zm9.1,7.844H8.2V6.979c0-.8-.016-1.828-1.114-1.828-1.114,0-1.285.87-1.285,1.77V10.34H3.657v-6.9H5.713v.942h.03A2.252,2.252,0,0,1,7.771,3.264c2.169,0,2.568,1.429,2.568,3.284V10.34Z"
                      transform="translate(0 -0.001)"
                      fill="#fff7ed"
                    />
                  </svg>
                </div>
              </Link>
              <Link href="https://www.instagram.com/shopafoma/" target="_blank">
                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full hover:bg-primaryHover">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11.932"
                    height="11.932"
                    viewBox="0 0 11.932 11.932"
                    alt="instagram"
                  >
                    <path
                      d="M8.949,0H2.983A2.992,2.992,0,0,0,0,2.983V8.949a2.992,2.992,0,0,0,2.983,2.983H8.949a2.992,2.992,0,0,0,2.983-2.983V2.983A2.992,2.992,0,0,0,8.949,0ZM5.966,8.452A2.486,2.486,0,1,1,8.452,5.966,2.486,2.486,0,0,1,5.966,8.452ZM9.2,3.48a.746.746,0,1,1,.746-.746A.746.746,0,0,1,9.2,3.48Z"
                      fill="#fff7ed"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_BASE_URL ===
          "https://development.afomamarketplace.com" ? (
            <>
              <div>
                <h2 className="font-bold text-blue-950 mb-4">SHOP</h2>
                <Link href="/category/fashion">
                  {" "}
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Fashion
                  </p>
                </Link>
                <Link href="/category/jewelry-and-accessories">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Jewelry & Accessories
                  </p>
                </Link>
                <Link href="/category/home-and-living">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Home & Living
                  </p>
                </Link>
                <Link href="/category/toys-and-games">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Toys & Games
                  </p>
                </Link>
                <Link href="/category/art-and-collectibles">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Arts & Collectibles
                  </p>
                </Link>
                <Link href="/category/stationery-and-paper-goods">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Stationery & Paper Goods
                  </p>
                </Link>
                <Link href="/category/personal-care-and-bath-products">
                  <p className="text-blue-950 hover:text-primary">
                    Personal Care & Bath Products
                  </p>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-bold text-blue-950 mb-4">SHOP</h2>
                <Link href="/category/fashion">
                  {" "}
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Fashion
                  </p>
                </Link>
                <Link href="/category/jewelry-and-accessories">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Jewelry & Accessories
                  </p>
                </Link>
                <Link href="/category/home-and-living">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Home & Living
                  </p>
                </Link>
                <Link href="/category/toys-and-games">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Toys & Games
                  </p>
                </Link>
                <Link href="/category/art-and-collectibles">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Arts & Collectibles
                  </p>
                </Link>
                <Link href="/category/stationery-and-paper-goods">
                  <p className="text-blue-950 mb-2.5 hover:text-primary">
                    Stationery & Paper Goods
                  </p>
                </Link>
                <Link href="/category/personal-care-and-bath-products">
                  <p className="text-blue-950 hover:text-primary">
                    Personal Care & Bath Products
                  </p>
                </Link>
              </div>
            </>
          )}
          <div>
            <h2 className="font-bold text-blue-950 mb-4">QUICK LINKS</h2>
            <Link href="/">
              <p className="text-blue-950 mb-2.5 hover:text-primary">Home</p>
            </Link>
            <Link href="/blogs">
              <p className="text-blue-950 mb-2.5 hover:text-primary">Blog</p>
            </Link>

            <Link href="/join-as-a-seller">
              {" "}
              <p className="text-blue-950 mb-2.5 hover:text-primary">
                Become a Seller
              </p>
            </Link>
            <Link href="/terms-conditions">
              {" "}
              <p className="text-blue-950 mb-2.5 hover:text-primary">
                Seller Terms and Conditions
              </p>
            </Link>
            {showDemoCall ? (
            <Link href="https://calendly.com/eosuorah/60mins"
              target="_blank">
              {" "}
              <p className="text-blue-950 mb-2.5 hover:text-primary">
               Book a Demo
              </p>
            </Link>
            ): ""}
          </div>

          {/* <div>
            <form className="flex flex-row  gap-4 flex-wrap" method="POST">
              <input
                type="email"
                name="email"
                data-aos="fade-up"
                id="email"
                required
                placeholder="Enter email address"
                className="placeholder:text-slate-600 text-sm text-gray-700 border border-slate-200 rounded w-56 px-5 py-3.5"
              />
              <div className="flex">
                <button type="submit" className={`buttonprimary`}>
                  Subscribe
                </button>
              </div>
            </form>
          </div> */}
          {/* <div>
            <form
              className="flex flex-col w-full gap-4 xl:flex-row items-start justify-start"
              onSubmit={handleSubmit}
              method="POST"
            >
              <input
                type="email"
                name="email"
                value={email}
                data-aos="fade-up"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                required
                placeholder="Enter your email address"
                className="placeholder:text-slate-600 text-sm text-gray-700 border border-slate-200 rounded w-56 px-5 py-3.5"
              />
              <button
                type="submit"
                className={`py-4 px-10 text-sm bg-primary rounded text-white font-bold cursor-pointer text-center hover:bg-primaryHover transition-colors ease-in inline-flex items-center justify-center disabled:cursor-progress disabled:hover:bg-primary disabled:opacity-50`}
                disabled={loading}
              >
                Subscribe
                {loading && (
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-slate-200 animate-spin fill-white ml-2"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
              </button>
            </form>
            <div className="mx-auto">
              {showSuccessMessage ? (
                <p className="text-green-500 font-semibold text-sm my-5 text-center">
                  Thank You for Subscribing! Welcome to our community.
                </p>
              ) : (
                <p className="text-green-500 font-semibold text-sm my-5 text-center"></p>
              )}
              {showFailureMessage ? (
                <p className="text-red-500 font-semibold text-sm my-5 text-center">
                  Oops! Something went wrong, please try again.
                </p>
              ) : (
                <p className="text-red-500 font-semibold text-sm my-5 text-center"></p>
              )}
            </div>
          </div> */}
        </div>
        <div className="flex items-center md:justify-between flex-wrap gap-4 ">
          {/* <Menu as="div" className="relative inline-block text-left">
            <div className="w-[256px]">
              <Menu.Button className="flex items-center gap-2 text-blue-950 text-sm font-medium">
                <Image
                  src={selectedImage}
                  alt={selectedValue}
                  width={24}
                  height={24}
                />
                {selectedValue}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                  aria-hidden="true"
                />
              </Menu.Button>
              <Menu.Button
                className={`flex items-center gap-2 text-blue-950 text-sm font-medium opacity-50   ${
                  isDisabled ? "cursor-not-allowed " : ""
                }`}
                disabled={isDisabled}
                title={isDisabled ? "" : "Coming soon..."}
              >
                <Image
                  src={selectedImage}
                  alt={selectedValue}
                  width={24}
                  height={24}
                />
                {selectedValue}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            {!isDisabled ? null : (
              <Transition
                as={Fragment}
                // ... (rest of your Transition properties)
              >
                <Menu.Items className="absolute mt-2  w-40 origin-top-right bottom-8 divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("IND", "/assets/header/IN.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/IN.png"}
                            alt="India"
                            width={24}
                            height={24}
                          />
                          IND
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("US", "/assets/header/US.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/US.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          US
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("EUR", "/assets/header/EU.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/EU.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          EUR
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("GHS", "/assets/header/GH.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/GH.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          GHS
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("KES", "/assets/header/KE.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/KE.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          KES
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("NGN", "/assets/header/NG.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/NG.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          NGN
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("GBP", "/assets/header/GB.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/GB.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          GBP
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleMenuItemClick("CAD", "/assets/header/CA.png")
                          }
                          className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm`}
                        >
                          <Image
                            src={"/assets/header/CA.png"}
                            alt="US"
                            width={24}
                            height={24}
                          />
                          CAD
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            )}
          </Menu> */}
          <div>
          </div>
          <div>
            <p className="text-sky-950 text-sm">
              Copyright ©{new Date().getFullYear()} | AFOMA Marketplace
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
