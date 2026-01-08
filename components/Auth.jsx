import React, { useState, useEffect } from "react";
import Link from "next/link";

const Auth = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Non-blocking localStorage check
    const checkAuth = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        setIsLoggedIn(!!userData);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Use requestIdleCallback to avoid blocking initial render
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(checkAuth, { timeout: 50 });
      } else {
        setTimeout(checkAuth, 0);
      }
    } else {
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
