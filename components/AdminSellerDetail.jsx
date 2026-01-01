import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";

const AdminSellerDetail = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const router = useRouter();

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${id}`,
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
      },
    };
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        setEditData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  return (
    <div>
      {editData ? (
        <div>
          <div className="md:p-6 p-4 border border-[#D8D8D8] bg-orange-50 md:flex items-start gap-6">
            <div className="shrink-0 mb-3 md:mb-0">
              {editData?.userProfile ? (
                <Image
                  src={editData.userProfile}
                  alt="Fashion"
                  height={90}
                  width={90}
                  loading="lazy"
                  className="rounded-full shrink-0"
                />
              ) : (
                <Image
                  src="/assets/user.png"
                  alt="Fashion"
                  height={90}
                  width={90}
                  loading="lazy"
                  className="rounded-full shrink-0"
                />
              )}
            </div>
            <div>
              <h1 className={`text-2xl text-blue-950 font-medium`}>
                {`${editData?.firstName} ${editData?.lastName}`} |{" "}
                <span className="text-lg">{`${editData.uuid}`}</span>
              </h1>
              <div className="flex flex-wrap md:gap-9 gap-6 mt-6">
                <div>
                  <p className="text-sm text-blue-950">Phone No.</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2">
                    {editData?.phone ? editData.phone : "-"}
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Email Address</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2">
                    {`${editData.email}`}
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Country</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2">
                    {editData?.country ? editData?.country : "(Not Added)"}
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Seller Since</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2">
                    {editData?.createdAt
                      ? new Date(editData.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "(Not Added)"}
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Shop URL</p>
                  <p className="text-base font-medium md:text-center text-primary mt-2 cursor-default">
                    <Link href={`/shop/${editData?.storeSlug}`}>
                      {editData?.storeSlug
                        ? `${process.env.NEXT_PUBLIC_URL}/shop/${editData?.storeSlug}`
                        : "(Not Added)"}
                    </Link>
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Facebook Profile</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2 cursor-default">
                    {editData?.facebook ? editData.facebook : "(Not Added)"}
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Twitter Profile</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2 cursor-default">
                    {editData?.twitter ? editData.twitter : "(Not Added)"}
                  </p>
                </div>
                <div className="w-px bg-[#D8D8D8] md:block hidden"></div>
                <div>
                  <p className="text-sm text-blue-950">Instagram Profile</p>
                  <p className="text-base font-medium text-center text-blue-950 mt-2 cursor-default">
                    {editData?.instagram ? editData.instagram : "(Not Added)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminSellerDetail;
