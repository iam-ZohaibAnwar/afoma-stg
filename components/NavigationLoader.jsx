import React from "react";
import { useRouter } from "next/router";

const LOADER_THRESHOLD = 250;

export default function NavigationLoader(props) {
  const { text = "Loading..." } = props;
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timer;

    const handleStart = () => {
      timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD);
    };

    const handleComplete = () => {
      if (timer) clearTimeout(timer);
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    router.events.on("hashChangeStart", handleStart);
    router.events.on("hashChangeComplete", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      router.events.off("hashChangeStart", handleStart);
      router.events.off("hashChangeComplete", handleComplete);

      if (timer) clearTimeout(timer);
    };
  }, [router.events]);

  React.useEffect(() => {
    setLoading(false); // Reset when the path changes
  }, [router.asPath]);

  if (!isLoading) return null;

  return <div className="navigation-loader">{text}</div>;
}
