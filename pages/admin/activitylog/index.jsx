import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminActivityLog = () => {
  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans"
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
          <div className="flex justify-between items-center mb-12">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Activity Log
            </h1>

            <div className="flex items-center justify-end gap-20">
              <button className="dashboard-button-secondary ">
                {" "}
                Date
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="h-4 w-8 fill-blue-950 hover:fill-primary"
                />
              </button>
            </div>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-5">
            <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className="pl-7 py-5 pr-16">Event ID</th>
                  <th className=" pr-16">Date & Time</th>
                  <th className=" pr-16">Visitor Action</th>
                  <th className=" pr-16">Message</th>
                  <th className="xl:w-80 pr-16">Page Link</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pl-7 py-5 text-blue-950">12658952</td>
                  <td className="text-blue-950">Aug 8 2023, 8:00pm</td>
                  <td className="text-blue-950">Login</td>
                  <td className="text-blue-950"></td>
                  <td className="text-blue-950">
                    https://sellitic.com/customer/account/login/
                  </td>
                </tr>

                <tr className="bg-orange-100">
                  <td className="pl-7 py-6 text-blue-950">89563214</td>
                  <td className="text-blue-950">Aug 8 2023, 7:10pm</td>
                  <td className="text-blue-950">Logout</td>
                  <td className="text-blue-950"></td>
                  <td className="text-blue-950">
                    https://sellitic.com/customer/account/login/
                  </td>
                </tr>
                <tr>
                  <td className="pl-7 py-6 text-blue-950">96865245</td>
                  <td className="text-blue-950">Aug 8 2023, 7:00pm</td>
                  <td className="text-blue-950">Product Update</td>
                  <td className="text-blue-950">Banded Weave Loafers</td>
                  <td className="text-blue-950">
                    https://sellitic.com/banded-weave-loafers.html
                  </td>
                </tr>

                <tr className="bg-orange-100">
                  <td className="pl-7 py-6 text-blue-950">85236541</td>
                  <td className="text-blue-950">Aug 8 2023, 5:00pm</td>
                  <td className="text-blue-950">Product Create</td>
                  <td className="text-blue-950">Benny Bag</td>
                  <td className="text-blue-950">
                    https://sellitic.com/benny-bag-set.html
                  </td>
                </tr>

                <tr>
                  <td className="pl-7 py-6 text-blue-950">98563214</td>
                  <td className="text-blue-950">Aug 8 2023, 11:00am</td>
                  <td className="text-blue-950">Product Delete</td>
                  <td className="text-blue-950">Folarin Bag Set</td>
                  <td className="text-blue-950">
                    https://sellitic.com/folarin-bag-set.html
                  </td>
                </tr>

                <tr className="bg-orange-100">
                  <td className="pl-7 py-6 text-blue-950">78945612</td>
                  <td className="text-blue-950">Aug 8 2023, 10:54pm</td>
                  <td className="text-blue-950">Order update</td>
                  <td className="text-blue-950">Nadia Bag</td>
                  <td className="text-blue-950">
                    https://sellitic.com/nadia-bag-set.html
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      </Layout>
    </>
  );
};

export default AdminActivityLog;
