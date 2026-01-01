import React from "react";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Artisions = () => {
  return (
    <>
      <section className="max-w-screen-xl mx-auto py-10 px-4">
        <div className="  mx-auto">
          <h2
            className={` text-white text-center text-3xl mb-8 md:mb-9 xl:mb-12 lg:text-4xl tracking-[-0.52px] xl:tracking-[-0.72px] noto-font`}
          >
            Testimonials
          </h2>
          <div className="grid  md:grid-cols-2 justify-center  gap-6 xl:gap-8">
            <div className="rounded bg-orange-50">
              <div className="flex items-center justify-center">
                <Image
                  src={"/artisians/afoma-testimonial-anne-marie-ridderhof.png"}
                  alt="Anne-marie Ridderhof"
                  height={340}
                  width={456}
                  quality={100}
                  loading="lazy"
                  className="w-full rounded-tl rounded-tr"
                />
              </div>
              <div className="px-5  pt-6 pb-[30px] xl:px-9 xl:pb-9 xl:pt-[30px]">
                <div className="mb-5">
                  <svg
                    id="quote"
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.919"
                    height="21.47"
                    viewBox="0 0 29.919 21.47"
                  >
                    <path
                      id="Path_2346"
                      data-name="Path 2346"
                      d="M.877,0H12.143a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877H7.386v7.573a.877.877,0,0,1-.877.877H3.693a.876.876,0,0,1-.831-.6L.045,12.42A.872.872,0,0,1,0,12.143V.877A.876.876,0,0,1,.877,0Zm0,0"
                      transform="translate(16.9)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2347"
                      data-name="Path 2347"
                      d="M290.075,0h11.267a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877h-4.757v7.573a.877.877,0,0,1-.877.877h-2.817a.877.877,0,0,1-.832-.6l-2.817-8.45a.88.88,0,0,1-.045-.277V.877A.876.876,0,0,1,290.075,0Zm0,0"
                      transform="translate(-289.199)"
                      fill="#1F628E"
                    />
                  </svg>
                </div>
                <h3 className="xl:text-xl font-semibold text-blue-950 mb-1.5 xl:mb-2">
                  Anne-marie Ridderhof
                </h3>
                <p className="text-blue-950 xl:text-base text-sm mb-4 xl:mb-6">
                  AI Artist
                </p>
                <p className="text-blue-950 xl:text-lg">
                  By freeing artists from the limitations of traditional media,
                  AI art can open up new possibilities for creativity. AFOMA
                  Marketplace is the perfect solution to catalyze this.
                </p>
              </div>
            </div>
            <div className="rounded bg-orange-50">
              <div className="flex items-center justify-center">
                {" "}
                <Image
                  src={"/artisians/afoma-testimonial-morin-adesola-fadare.png"}
                  alt=" Morin Adesola Fadara"
                  height={340}
                  width={456}
                  quality={100}
                  loading="lazy"
                  className="w-full rounded-tl rounded-tr"
                />
              </div>
              <div className="px-5  pt-6 pb-[30px] xl:px-9 xl:pb-9 xl:pt-[30px]">
                <div className="mb-5">
                  <svg
                    id="quote"
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.919"
                    height="21.47"
                    viewBox="0 0 29.919 21.47"
                  >
                    <path
                      id="Path_2346"
                      data-name="Path 2346"
                      d="M.877,0H12.143a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877H7.386v7.573a.877.877,0,0,1-.877.877H3.693a.876.876,0,0,1-.831-.6L.045,12.42A.872.872,0,0,1,0,12.143V.877A.876.876,0,0,1,.877,0Zm0,0"
                      transform="translate(16.9)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2347"
                      data-name="Path 2347"
                      d="M290.075,0h11.267a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877h-4.757v7.573a.877.877,0,0,1-.877.877h-2.817a.877.877,0,0,1-.832-.6l-2.817-8.45a.88.88,0,0,1-.045-.277V.877A.876.876,0,0,1,290.075,0Zm0,0"
                      transform="translate(-289.199)"
                      fill="#1F628E"
                    />
                  </svg>
                </div>
                <h3 className="xl:text-xl font-semibold text-blue-950 mb-1.5 xl:mb-2">
                  Morin Adesola Fadare
                </h3>
                <p className="text-blue-950 xl:text-base text-sm mb-4 xl:mb-6">
                  Fashion Designer
                </p>
                <p className="text-blue-950 xl:text-lg">
                  Making fashion affordable is not just a slogan but my desire.
                  Partnering with AFOMA Marketplace has helped achieve this.
                </p>
              </div>
            </div>
            <div className="rounded bg-orange-50">
              <div className="flex items-center justify-center">
                <Image
                  src={"/artisians/afoma-testimonial-dunmola-abiola.png"}
                  alt=" Dunmola Abiola"
                  height={340}
                  width={456}
                  quality={100}
                  loading="lazy"
                  className="w-full rounded-tl rounded-tr"
                />
              </div>
              <div className="px-5  pt-6 pb-[30px] xl:px-9 xl:pb-9 xl:pt-[30px]">
                <div className="mb-5">
                  <svg
                    id="quote"
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.919"
                    height="21.47"
                    viewBox="0 0 29.919 21.47"
                  >
                    <path
                      id="Path_2346"
                      data-name="Path 2346"
                      d="M.877,0H12.143a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877H7.386v7.573a.877.877,0,0,1-.877.877H3.693a.876.876,0,0,1-.831-.6L.045,12.42A.872.872,0,0,1,0,12.143V.877A.876.876,0,0,1,.877,0Zm0,0"
                      transform="translate(16.9)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2347"
                      data-name="Path 2347"
                      d="M290.075,0h11.267a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877h-4.757v7.573a.877.877,0,0,1-.877.877h-2.817a.877.877,0,0,1-.832-.6l-2.817-8.45a.88.88,0,0,1-.045-.277V.877A.876.876,0,0,1,290.075,0Zm0,0"
                      transform="translate(-289.199)"
                      fill="#1F628E"
                    />
                  </svg>
                </div>
                <h3 className="xl:text-xl font-semibold text-blue-950 mb-1.5 xl:mb-2">
                  Dunmola Abiola
                </h3>
                <p className="text-blue-950 text-sm xl:text-base mb-4 xl:mb-6">
                  Fashion Designer
                </p>
                <p className="text-blue-950 xl:text-lg">
                  My mission is to connect African kids in diaspora to their
                  culture through everyday clothing. AFOMA Marketplace gives me
                  the platform to attain this.
                </p>
              </div>
            </div>
            <div className="rounded bg-orange-50">
              <div className="flex items-center justify-center">
                <Image
                  src={"/artisians/afoma-testimonial-michelle-klieber.png"}
                  alt="Michelle Klieber"
                  height={340}
                  width={456}
                  quality={100}
                  loading="lazy"
                  className="w-full rounded-tl rounded-tr"
                />
              </div>
              <div className="px-5  pt-6 pb-[30px] xl:px-9 xl:pb-9 xl:pt-[30px]">
                <div className="mb-5">
                  <svg
                    id="quote"
                    xmlns="http://www.w3.org/2000/svg"
                    width="29.919"
                    height="21.47"
                    viewBox="0 0 29.919 21.47"
                  >
                    <path
                      id="Path_2346"
                      data-name="Path 2346"
                      d="M.877,0H12.143a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877H7.386v7.573a.877.877,0,0,1-.877.877H3.693a.876.876,0,0,1-.831-.6L.045,12.42A.872.872,0,0,1,0,12.143V.877A.876.876,0,0,1,.877,0Zm0,0"
                      transform="translate(16.9)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_2347"
                      data-name="Path 2347"
                      d="M290.075,0h11.267a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877h-4.757v7.573a.877.877,0,0,1-.877.877h-2.817a.877.877,0,0,1-.832-.6l-2.817-8.45a.88.88,0,0,1-.045-.277V.877A.876.876,0,0,1,290.075,0Zm0,0"
                      transform="translate(-289.199)"
                      fill="#1F628E"
                    />
                  </svg>
                </div>
                <h3 className="xl:text-xl font-semibold text-blue-950 mb-1.5 xl:mb-2">
                  Michelle Klieber
                </h3>
                <p className="text-blue-950 text-sm xl:text-base mb-4  xl:mb-6">
                  Greeting Card Maker
                </p>
                <p className="text-blue-950 xl:text-lg">
                  AFOMA Marketplace’s affordability is a game-changer! It&apos;s
                  like a treasure trove of opportunity, helping me maximize
                  profits effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Artisions;
