import React, { useState, useEffect } from "react";
import Link from "next/link";

const Auth = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed w-full h-full bg-body z-50 inset-0 flex items-center justify-center">
          Loading...
        </div>
      )}

      {isLoggedIn ? (
        <div>{children}</div>
      ) : (
        <div className="flex flex-col items-center justify-center fixed w-full h-full gap-y-2 inset-0">
          <p className="mb-2 text-lg">You have to Sign in first</p>
          <Link href="/sign-in">
            <button className="buttonprimary">Sign In</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Auth;
