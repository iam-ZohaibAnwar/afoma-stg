import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faFileContract, faImage } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { Noto_Serif } from "next/font/google";
import { useRouter } from "next/router";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Settings = () => {
  const router = useRouter();
  return (
    <Layout userType="admin">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl xl:text-2xl text-blue-950 noto-font`}>
          All Settings
        </h1>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        <div className="md:col-span-1">
          {/* Terms and Conditions Section */}
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/terms-conditions");
            }}
          >
            <FontAwesomeIcon icon={faFileContract} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Terms and Conditions</h3>
              <p className="text-[13px]">Set rules and policies for marketplace.</p>
            </div>
          </div>
        </div>

        {/* Upload Images Section */}
        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/upload-images"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Carousel Images</h3>
              <p className="text-[13px]">Upload and manage images for marketplace.</p>
            </div>
          </div>
        </div>

        {/* Upload Images Section */}
        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/upload-single-image"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Banner</h3>
              <p className="text-[13px]">Upload and manage banner image.</p>
            </div>
          </div>
        </div>

        {/* Upload Images Section */}
        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/shops?tab=advertise"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Shops</h3>
              <p className="text-[13px]">Select shops to advertise.</p>
            </div>
          </div>
        </div>
    
        {/* Upload Images Section */}
        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/csvs"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">CSVs</h3>
              <p className="text-[13px]">Download csv files.</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/reward-management"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Reward Management</h3>
              <p className="text-[13px]">Set The Rewards</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/shipping-config"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Shipping Matrix</h3>
              <p className="text-[13px]">Set The Surcharge For International Customers</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/seller-shipping-config"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Seller Shipping Config</h3>
              <p className="text-[13px]">View Seller Shipping Configuration</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/shops?tab=enable-disable"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Enable / Disable Seller Shop</h3>
              <p className="text-[13px]"></p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/affiliate-commission"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Affiliate Commission</h3>
              <p className="text-[13px]"></p>
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/seller-referral-commission"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Set Seller Referral Commission</h3>
              <p className="text-[13px]"></p>
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <div
            className="rounded-lg cursor-pointer bg-orange-100 px-5 py-5 shadow-md flex gap-4 items-center"
            onClick={() => {
              router.push("/admin/settings/buyer-referral-commission"); // Update this to the actual image upload page path
            }}
          >
            <FontAwesomeIcon icon={faImage} className="text-[60px]" />
            <div>
              <h3 className="text-[16px] font-semibold">Set Buyer Referral Commission</h3>
              <p className="text-[13px]"></p>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
