import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const Comingsoon = dynamic(() => import("@/components/Comingsoon"), { ssr: false });
import React from "react";

const Index = () => {
  return (
    <>
      <Layout userType="admin">
        <>
          <div className="mt-80">
            <Comingsoon />
          </div>
        </>
      </Layout>
    </>
  );
};

export default Index;
