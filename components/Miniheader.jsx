import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Miniheader = () => {
  const [isDisabled, setDisabled] = useState(/* your disabling logic here */);
  return (
    <>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
          <Link href="/">
            <Image
              src={
                "/assets/AFOMA New Logo (940 x 300 px).png"
              }
              alt="AFOMA_Marketplace"
              width={150}
              height={42}
              className="w-[150px] lg:w-[250px]"
              loading="lazy"
            />
          </Link>
            </div>
            <div>
              <div>
                {/* <Link href="#" className="buttonprimarytwo">
                  Connect Wallet
                </Link> */}
                {/* <Link
                  href={isDisabled ? null : ""}
                  title={isDisabled ? "" : "Coming soon..."}
                  className={`text-primary ease-in transition-colors  disabled:cursor-progress rounded-sm  text-sm font-medium py-2.5 px-3 border border-primary opacity-50  ${isDisabled}`}
                >
                  Connect Wallet
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Miniheader;
