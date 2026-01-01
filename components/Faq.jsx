import React, { useState } from "react";
//import { Noto_Serif } from "next/font/google";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Faqs = () => {
  const [faqOne, setFaqOne] = useState(false);
  const [faqTwo, setFaqTwo] = useState(false);
  const [faqThree, setFaqThree] = useState(false);
  const [faqFour, setFaqFour] = useState(false);
  const [faqFive, setFaqFive] = useState(false);

  return (
    <section className="">
      <div className="max-w-[900px] mx-auto px-4 py-12 md:px-0 md:py-16 xl:py-20 ">
        <h2
          className={`text-blue-950 text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
        >
          FAQ
        </h2>
        <div>
          <div className="py-3 pr-2 border-b border-b-inputBorder xl:py-5">
            <div
              className="flex items-center justify-between cursor-pointer "
              onClick={() => {
                setFaqOne(!faqOne);
                setFaqTwo(false);
                setFaqThree(false);
                setFaqFour(false);
                setFaqFive(false)
              }}
            >
              <p className="font-medium xl:text-lg text-blue-950">
                Are all products on AFOMA handmade?
              </p>
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.381"
                  height="8.152"
                  viewBox="0 0 14.381 8.152"
                  className={faqOne ? "-rotate-180" : "rotate-0"}
                >
                  <path
                    id="FAQ_dropdown_icon"
                    data-name="FAQ dropdown icon"
                    d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                    transform="translate(-19.625 -39.625)"
                    fill="#172554"
                    stroke="#172554"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`${
                faqOne ? "h-fit" : "h-0"
              }  overflow-hidden transition-all ease-in-out`}
            >
              <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                Yes, every item is crafted by skilled artisans. We focus on authentic, handmade, and ethically sourced goods from around the world.
              </p>
            </div>
          </div>

          <div className="py-3 pr-2 border-b border-b-inputBorder  xl:py-5">
            <div
              className="flex items-center justify-between cursor-pointer "
              onClick={() => {
                setFaqOne(false);
                setFaqTwo(!faqTwo);
                setFaqThree(false);
                setFaqFour(false);
                setFaqFive(false)
              }}
            >
              <p className="font-medium xl:text-lg text-slate-800">
                Where do your products come from?
              </p>
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.381"
                  height="8.152"
                  viewBox="0 0 14.381 8.152"
                  className={faqTwo ? "-rotate-180" : "rotate-0"}
                >
                  <path
                    id="FAQ_dropdown_icon"
                    data-name="FAQ dropdown icon"
                    d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                    transform="translate(-19.625 -39.625)"
                    fill="#172554"
                    stroke="#172554"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`${
                faqTwo ? "h-fit" : "h-0"
              }  overflow-hidden transition-all ease-in-out`}
            >
              <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                Our products come from global artisans, including creators in Africa, South Asia, Latin America, and other emerging markets
              </p>
            </div>
          </div>

          <div className="py-3 pr-2 border-b border-b-inputBorder  xl:py-5">
            <div
              className="flex items-center justify-between cursor-pointer "
              onClick={() => {
                setFaqOne(false);
                setFaqTwo(false);
                setFaqThree(!faqThree);
                setFaqFour(false);
                setFaqFive(false)
              }}
            >
              <p className="font-medium xl:text-lg text-slate-800">
                Do you offer returns or refunds?
              </p>
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.381"
                  height="8.152"
                  viewBox="0 0 14.381 8.152"
                  className={faqThree ? "-rotate-180" : "rotate-0"}
                >
                  <path
                    id="FAQ_dropdown_icon"
                    data-name="FAQ dropdown icon"
                    d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                    transform="translate(-19.625 -39.625)"
                    fill="#172554"
                    stroke="#172554"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`${
                faqThree ? "h-fit" : "h-0"
              }  overflow-hidden transition-all ease-in-out`}
            >
              <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                Refunds may be issued if an item arrives damaged or defective. Returns are handled according to each seller’s individual return policy, which is listed on their shop page. If you’re unsure, contact the seller directly before purchasing.
              </p>
            </div>
          </div>

          <div className="py-3 pr-2  border-b border-b-inputBorder xl:py-5">
            <div
              className="flex items-center justify-between cursor-pointer "
              onClick={() => {
                setFaqOne(false);
                setFaqTwo(false);
                setFaqThree(false);
                setFaqFour(!faqFour);
                setFaqFive(false)
              }}
            >
              <p className="font-medium xl:text-lg text-slate-800">
                Why should I shop on AFOMA?
              </p>
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.381"
                  height="8.152"
                  viewBox="0 0 14.381 8.152"
                  className={faqFour ? "-rotate-180" : "rotate-0"}
                >
                  <path
                    id="FAQ_dropdown_icon"
                    data-name="FAQ dropdown icon"
                    d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                    transform="translate(-19.625 -39.625)"
                    fill="#172554"
                    stroke="#172554"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`${
                faqFour ? "h-fit" : "h-0"
              }  overflow-hidden transition-all ease-in-out`}
            >
              <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                Your purchase supports small businesses and artisans globally. It’s ethical shopping that empowers communities and celebrates culture.
              </p>
            </div>
          </div>

          <div className="py-3 pr-2 xl:py-5">
            <div
              className="flex items-center justify-between cursor-pointer "
              onClick={() => {
                setFaqOne(false);
                setFaqTwo(false);
                setFaqThree(false);
                setFaqFour(false);
                setFaqFive(!faqFive);
              }}
            >
              <p className="font-medium xl:text-lg text-slate-800">
                What should I consider about shipping costs for international purchases?
              </p>
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.381"
                  height="8.152"
                  viewBox="0 0 14.381 8.152"
                  className={faqFive ? "-rotate-180" : "rotate-0"}
                >
                  <path
                    id="FAQ_dropdown_icon"
                    data-name="FAQ dropdown icon"
                    d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                    transform="translate(-19.625 -39.625)"
                    fill="#172554"
                    stroke="#172554"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`${faqFive ? "h-fit" : "h-0"
                }  overflow-hidden transition-all ease-in-out`}
            >
              <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                Shipping costs for international purchases may vary based on your location and the seller's location. Please be aware that your country's regulations may incur customs duties on the delivery of your product. Despite the potential of incurring higher charges for international shipping, rest assured that your chosen artisanal creations will be carefully packaged and delivered with care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
