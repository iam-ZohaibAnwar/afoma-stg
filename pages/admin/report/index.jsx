import Comingsoon from "@/components/Comingsoon";
import Layout from "@/components/Layout";
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
